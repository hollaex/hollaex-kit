'use strict';

const { loggerEngine } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');

const getTopOrderbook = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getTopOrderbook',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getOrderbook(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getTopOrderbook',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTopOrderbooks = (req, res) => {
	toolsLib.getOrderbooks()
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getTopOrderbooks',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTrades = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getTopOrderbooks',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getPublicTrades(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getTrades',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTradesHistory = (req, res) => {
	const { symbol, side, limit, page, order_by, order, start_date, end_date } = req.swagger.params;

	if (symbol.value && !toolsLib.subscribedToPair(symbol.value)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getTopOrderbooks',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getTradesHistory(
		symbol.value,
		side.value,
		limit.value,
		page.value,
		order_by.value,
		order.value,
		start_date.value,
		end_date.value
	)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getTrades',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTicker = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (!toolsLib.subscribedToPair(symbol)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getTopOrderbooks',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getTicker(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getTicker',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAllTicker = (req, res) => {
	toolsLib.getTickers()
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getAllTicker',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getChart = (req, res) => {
	const { from, to, symbol, resolution } = req.swagger.params;

	if (!toolsLib.subscribedToPair(symbol.value)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getChart',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getChart(from.value, to.value, symbol.value, resolution.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getChart',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getCharts = (req, res) => {
	const { from, to, resolution } = req.swagger.params;

	toolsLib.getCharts(from.value, to.value, resolution.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getCharts',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getConfig = (req, res) => {
	toolsLib.getUdfConfig()
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getConfig',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getHistory = (req, res) => {
	const { symbol, from, to, resolution } = req.swagger.params;

	if (!toolsLib.subscribedToPair(symbol.value)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getHistory',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getUdfHistory(from.value, to.value, symbol.value, resolution.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getHistory',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getSymbols = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (!toolsLib.subscribedToPair(symbol)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getSymbols',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getUdfSymbols(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getSymbols',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAssetsPrices = (req, res) => {
	const { assets, quote, amount } = req.swagger.params;

	loggerEngine.info(req.uuid, 'controllers/engine/getAssetsPrices assets', assets.value, 'quote', quote.value, 'amount', amount.value);

	toolsLib.getAssetsPrices(assets.value, quote.value, amount.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getAssetsPrices',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getTopOrderbook,
	getTopOrderbooks,
	getTrades,
	getTicker,
	getAllTicker,
	getChart,
	getCharts,
	getConfig,
	getHistory,
	getSymbols,
	getAssetsPrices,
	getTradesHistory
};
