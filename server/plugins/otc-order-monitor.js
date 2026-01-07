'use strict';

const toolsLib = require('hollaex-tools-lib');
const { loggerPlugin } = require('../config/logger');
const redisClient = require('../db/redis');
const { PRICE_HASH_KEY } = require('../constants');

// Keep a local cache of relevant open OTC orders by symbol
// Structure: { 'btc-usdt': [ { id, side, price, size, created_by, meta, ... }, ... ] }
let otcOpenOrdersBySymbol = {};
let initialized = false;

// Find full OTC broker pair (from DB) for a given symbol, attempting reversed pair as fallback
const findBrokerPairForSymbol = async (symbol) => {
	try {
		if (!symbol) return null;
		let deal = await toolsLib.broker.fetchBrokerPair(symbol);
		if (deal) return { deal, reversed: false };
		if (typeof symbol === 'string' && symbol.includes('-')) {
			const [base, quote] = symbol.split('-');
			const reversedSymbol = `${quote}-${base}`;
			const reversed = await toolsLib.broker.fetchBrokerPair(reversedSymbol);
			if (reversed) return { deal: reversed, reversed: true };
		}
		return null;
	} catch (err) {
		loggerPlugin.error('plugins/otc-order-monitor findBrokerPairForSymbol error', symbol, err.message);
		return null;
	}
};

// Match the active OTC order against the OTC broker (by broker user_id) and optionally hedge
const matchOtcOrder = async (order) => {
	if (!order || !order.symbol) return;
	const { symbol, side } = order;
	const price = Number(order.price);
	const size = Number(order.size);

	if (!Number.isFinite(price) || !Number.isFinite(size)) {
		loggerPlugin.error('plugins/otc-order-monitor matchOtcOrder invalid order fields', { id: order.id, symbol, side, price, size });
		return;
	}

	const found = await findBrokerPairForSymbol(symbol);
	if (!found || !found.deal) {
		loggerPlugin.verbose('plugins/otc-order-monitor matchOtcOrder skip - no OTC broker pair', { id: order.id, symbol });
		return;
	}

	const makerId = found.deal.user_id;
	if (!makerId) {
		loggerPlugin.error('plugins/otc-order-monitor matchOtcOrder broker user missing', { id: order.id, symbol });
		return;
	}

	const userId = makerId;

	try {
		loggerPlugin.verbose('plugins/otc-order-monitor matching OTC order', { id: order.id, symbol, side, price, size });
		const matchResponse = await toolsLib.order.matchUserOrderByKitId(userId, order.id, symbol, size);
		loggerPlugin.info('plugins/otc-order-monitor order match response', { id: order.id, symbol, response: matchResponse });
	} catch (err) {
		loggerPlugin.error('plugins/otc-order-monitor order match failed', { id: order.id, symbol, error: err.message });
		return;
	}

	// Trigger hedge if configured (reverseTransaction internally verifies requirements)
	try {
		const hedgeResponse = await toolsLib.broker.reverseTransaction({ symbol, side, price, size });
		loggerPlugin.info('plugins/otc-order-monitor hedge response', { id: order.id, symbol, response: hedgeResponse });
		loggerPlugin.verbose('plugins/otc-order-monitor hedge triggered', { id: order.id, symbol });
	} catch (err) {
		loggerPlugin.error('plugins/otc-order-monitor hedge trigger failed', { id: order.id, symbol, error: err.message });
	}
};

const getUsdtPriceForCoin = async (coin) => {
	const coinKey = String(coin || '').toLowerCase();
	if (coinKey === 'usdt') return 1;
	try {
		const value = await redisClient.hgetAsync(PRICE_HASH_KEY, coinKey);
		if (value == null) return null;
		const n = Number(value);
		return Number.isFinite(n) ? n : null;
	} catch (err) {
		return null;
	}
};

const getCurrentPriceForSymbol = async (marketSymbol) => {
	// Market symbol is base-quote (e.g., btc-usdt, ton-btc)
	// Price feed is per-coin in USDT; compute market price as base_usdt / quote_usdt
	if (!marketSymbol || typeof marketSymbol !== 'string' || !marketSymbol.includes('-')) return null;
	const [baseRaw, quoteRaw] = marketSymbol.split('-');
	const base = String(baseRaw).toLowerCase();
	const quote = String(quoteRaw).toLowerCase();
	const baseUsdt = await getUsdtPriceForCoin(base);
	const quoteUsdt = await getUsdtPriceForCoin(quote);
	if (baseUsdt == null || quoteUsdt == null || !Number.isFinite(baseUsdt) || !Number.isFinite(quoteUsdt) || quoteUsdt === 0) {
		return null;
	}
	return baseUsdt / quoteUsdt;
};

const checkOtcOpenOrders = async () => {
	try {
		// Fetch exchange orders: status=open or open=true to get only open ones
		// We cap page size to a reasonable limit per call; if needed, iterate pages later
		const res = await toolsLib.order.getAllExchangeOrders(null, null, null, true, null, null, 'created_at', 'desc', null, null, 'all', {});
		const orders = (res && res.data) || [];
		loggerPlugin.verbose('plugins/otc-order-monitor checkOtcOpenOrders length', orders.length);

		const grouped = {};
		for (const order of orders) {
			const meta = order.meta || {};
			if (meta.broker === 'otc') {
				if (!grouped[order.symbol]) grouped[order.symbol] = [];
				grouped[order.symbol].push(order);
			}
		}
		otcOpenOrdersBySymbol = grouped;
		loggerPlugin.verbose('plugins/otc-order-monitor checkOtcOpenOrders', Object.keys(otcOpenOrdersBySymbol));

		// Immediately check prices for refreshed symbols
		for (const symbol of Object.keys(otcOpenOrdersBySymbol)) {
			try {
				await checkAndTriggerOtcOrdersForSymbol(symbol);
			} catch (err) {
				loggerPlugin.error('plugins/otc-order-monitor refresh check error', symbol, err.message);
			}
		}
	} catch (err) {
		loggerPlugin.error('plugins/otc-order-monitor checkOtcOpenOrders error', err.message);
	}
};

const checkAndTriggerOtcOrdersForSymbol = async (symbol) => {
	const currentPrice = await getCurrentPriceForSymbol(symbol);
	if (currentPrice == null) return;
	const orders = otcOpenOrdersBySymbol[symbol] || [];
	for (const order of orders) {
		// Only consider limit orders that are still open
		if (order.status !== 'new' && order.status !== 'pfilled') continue;
		if (order.type && order.type !== 'limit') continue;

		const orderPrice = Number(order.price);
		if (!Number.isFinite(orderPrice)) continue;

		if (order.side === 'buy') {
			loggerPlugin.verbose('plugins/otc-order-monitor checkAndTriggerOtcOrdersForSymbol buy', { id: order.id, symbol, orderPrice, currentPrice });
			// Execute when market price <= order price
			if (currentPrice <= orderPrice) {
				loggerPlugin.verbose('plugins/otc-order-monitor match BUY', { id: order.id, symbol, orderPrice, currentPrice });
				try {
					await matchOtcOrder(order);
					// Best-effort: prevent duplicate triggering locally until next refresh
					otcOpenOrdersBySymbol[symbol] = (otcOpenOrdersBySymbol[symbol] || []).filter((o) => o.id !== order.id);
				} catch (err) {
					loggerPlugin.error('plugins/otc-order-monitor match BUY execution error', { id: order.id, symbol, error: err.message });
				}
			}
		} else if (order.side === 'sell') {
			loggerPlugin.verbose('plugins/otc-order-monitor checkAndTriggerOtcOrdersForSymbol sell', { id: order.id, symbol, orderPrice, currentPrice });
			// Execute when market price >= order price
			if (currentPrice >= orderPrice) {
				loggerPlugin.verbose('plugins/otc-order-monitor match SELL', { id: order.id, symbol, orderPrice, currentPrice });
				try {
					await matchOtcOrder(order);
					// Best-effort: prevent duplicate triggering locally until next refresh
					otcOpenOrdersBySymbol[symbol] = (otcOpenOrdersBySymbol[symbol] || []).filter((o) => o.id !== order.id);
				} catch (err) {
					loggerPlugin.error('plugins/otc-order-monitor match SELL execution error', { id: order.id, symbol, error: err.message });
				}
			}
		}
	}
};

const start = async () => {
	if (initialized) return;
	initialized = true;
	loggerPlugin.info('plugins/otc-order-monitor started');
	await checkOtcOpenOrders();

	// Periodically refresh the open OTC orders list
	setInterval(checkOtcOpenOrders, 2 * 60 * 1000);
};

start();

module.exports = { start };


