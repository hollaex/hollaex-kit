'use strict';

const { loggerEngine } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { getNodeLib } = require('../../init');

const getTopOrderbooks = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerEngine.error(
			req.uuid,
			'controller/engine/getTopOrderbooks',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	getNodeLib().getOrderbooksEngine(symbol)
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

	getNodeLib().getTradesEngine(symbol)
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

	getNodeLib().getTickerEngine(symbol)
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
	getNodeLib().getAllTickersEngine()
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

	getNodeLib().getChartEngine(from.value, to.value, symbol.value, resolution.value)
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

	getNodeLib().getAllChartsEngine(from.value, to.value, resolution.value)
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
	getNodeLib().getUdfConfigEngine()
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

	getNodeLib().getUdfHistoryEngine(from.value, to.value, symbol.value, resolution.value)
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

	getNodeLib().getUdfSymbolsEngine(symbol)
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

const getAssetPrice = (req, res) => {
	const { asset, quote, amount } = req.swagger.params;

	loggerEngine.info(req.uuid, 'controllers/engine/getAssetPrice asset', asset.value, 'quote', quote.value, 'amount', amount.value);

	toolsLib.getAssetPrice(asset.value, quote.value, amount.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerEngine.error(
				req.uuid,
				'controller/engine/getAssetPrice',
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
	getTopOrderbooks,
	getTrades,
	getTicker,
	getAllTicker,
	getChart,
	getCharts,
	getConfig,
	getHistory,
	getSymbols,
	getAssetPrice,
	getAssetsPrices
};
