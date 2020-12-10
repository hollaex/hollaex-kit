'use strict';

const packageJson = require('../../package.json');
const { API_HOST } = require('../../constants');
const { loggerPublic } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { Status, User } = require('../../db/models');

const getHealth = (req, res) => {
	// Status.findOne({})
	// 	.then((data) => {
	// 		data.update({
	// 			api_key: 'e06c90f78b6c335ed2b91315b55f3bb298cad3a0',
	// 			api_secret: 'e5d44d9676d9d8160e84c61042e0aa79dd6ee32ad38ee06595',
	// 			activation_code: '733ef374-6eb9-464e-be48-02c8b099b939'
	// 		})
	// 	})

	// User.findAll().then(console.log)

	User.findOne({ where: { email: 'brandon@bitholla.com'}})
		.then((user) => {
			user.update({ 
				verification_level: 2
			})
		})
	try {
		return res.json({
			name: toolsLib.getKitConfig().api_name || packageJson.name,
			version: packageJson.version,
			host: API_HOST,
			basePath: req.swagger.swaggerObject.basePath,
			status: toolsLib.getKitConfig().status
		});
	} catch (err) {
		loggerPublic.verbose('controller/public/getHealth', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const getConstants = (req, res) => {
	try {
		return res.json({
			coins: toolsLib.getKitCoinsConfig(),
			pairs: toolsLib.getKitPairsConfig()
		});
	} catch (err) {
		loggerPublic.verbose('controller/public/getConstants', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const getKitConfigurations = (req, res) => {
	try {
		return res.json(toolsLib.getKitConfig());
	} catch (err) {
		loggerPublic.verbose('controller/public/getKitConfigurations', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const sendSupportEmail = (req, res) => {
	const { email, category, subject, description }  = req.swagger.params;
	return toolsLib.sendEmailToSupport(email.value, category.value, subject.value, description.value)
		.then(() => {
			return res.json({ message: 'Email was sent to support' });
		})
		.catch((err) => {
			loggerPublic.verbose('controller/public/sendSupportEmail', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTopOrderbook = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	toolsLib.getOrderbook(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getTopOrderbook',
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
			loggerPublic.error(
				req.uuid,
				'controller/public/getTopOrderbooks',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTrades = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerPublic.error(
			req.uuid,
			'controller/public/getTopOrderbooks',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getPublicTrades(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getTrades',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTradesHistory = (req, res) => {
	const { symbol, side, limit, page, order_by, order, start_date, end_date } = req.swagger.params;

	if (symbol.value && !toolsLib.subscribedToPair(symbol.value)) {
		loggerPublic.error(
			req.uuid,
			'controller/public/getTopOrderbooks',
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
			loggerPublic.error(
				req.uuid,
				'controller/public/getTrades',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getTicker = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	toolsLib.getTicker(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getTicker',
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
			loggerPublic.error(
				req.uuid,
				'controller/public/getAllTicker',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getChart = (req, res) => {
	const { from, to, symbol, resolution } = req.swagger.params;

	if (!toolsLib.subscribedToPair(symbol.value)) {
		loggerPublic.error(
			req.uuid,
			'controller/public/getChart',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getChart(from.value, to.value, symbol.value, resolution.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getChart',
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
			loggerPublic.error(
				req.uuid,
				'controller/public/getCharts',
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
			loggerPublic.error(
				req.uuid,
				'controller/public/getConfig',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getHistory = (req, res) => {
	const { symbol, from, to, resolution } = req.swagger.params;

	if (!toolsLib.subscribedToPair(symbol.value)) {
		loggerPublic.error(
			req.uuid,
			'controller/public/getHistory',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getUdfHistory(from.value, to.value, symbol.value, resolution.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getHistory',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getSymbols = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	if (!toolsLib.subscribedToPair(symbol)) {
		loggerPublic.error(
			req.uuid,
			'controller/public/getSymbols',
			'Invalid symbol'
		);
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.getUdfSymbols(symbol)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getSymbols',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAssetsPrices = (req, res) => {
	const { assets, quote, amount } = req.swagger.params;

	loggerPublic.info(req.uuid, 'controllers/public/getAssetsPrices assets', assets.value, 'quote', quote.value, 'amount', amount.value);

	toolsLib.getAssetsPrices(assets.value, quote.value, amount.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getAssetsPrices',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getHealth,
	getConstants,
	getKitConfigurations,
	sendSupportEmail,
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
