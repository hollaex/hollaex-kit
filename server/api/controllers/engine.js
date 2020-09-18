'use strict';

const { loggerOrderbook } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { getNodeLib } = require('../../init');

const getTopOrderbooks = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerOrderbook.error(
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
			loggerOrderbook.error(
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
		loggerOrderbook.error(
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
			loggerOrderbook.error(
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
		loggerOrderbook.error(
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
			loggerOrderbook.error(
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
			loggerOrderbook.error(
				req.uuid,
				'controller/engine/getAllTicker',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getTopOrderbooks,
	getTrades,
	getTicker,
	getAllTicker
};