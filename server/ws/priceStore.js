'use strict';

const redisClient = require('../db/redis');
const { PRICE_HASH_KEY } = require('../constants');

const extractNumericPrice = (value) => {
	if (value == null) return null;
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const n = Number(value);
		return Number.isFinite(n) ? n : null;
	}
	if (typeof value === 'object') {
		if (value.price != null) return Number(value.price);
		if (value.last != null) return Number(value.last);
		if (value.close != null) return Number(value.close);
	}
	return null;
};

// Batch updates to reduce Redis write frequency
const FLUSH_INTERVAL_MS = 1000;
let pendingPrices = {};
let flushTimer = null;

const scheduleFlush = () => {
	if (flushTimer) return;
	flushTimer = setTimeout(() => {
		const entries = Object.entries(pendingPrices);
		pendingPrices = {};
		flushTimer = null;
		if (entries.length === 0) return;
		const multi = redisClient.multi();
		for (const [coin, price] of entries) {
			multi.hset(PRICE_HASH_KEY, coin, String(price));
		}
		multi.exec();
	}, FLUSH_INTERVAL_MS);
};

const writePriceToRedis = async (data) => {
	try {
		if (!data || !data.action) return;
		if (data.action === 'partial' && data.data && typeof data.data === 'object') {
			for (const [coin, payload] of Object.entries(data.data)) {
				const price = extractNumericPrice(payload);
				if (price != null && Number.isFinite(price)) {
					pendingPrices[String(coin).toLowerCase()] = price;
				}
			}
			scheduleFlush();
		} else if (data.action === 'update' && data.symbol && data.data != null) {
			const symbol = String(data.symbol).toLowerCase();
			const price = extractNumericPrice(data.data);
			if (price != null && Number.isFinite(price)) {
				pendingPrices[symbol] = price;
				scheduleFlush();
			}
		}
	} catch (err) {
		// Swallow errors; logging handled by callers if needed
	}
};

module.exports = {
	writePriceToRedis,
	PRICE_HASH_KEY
};


