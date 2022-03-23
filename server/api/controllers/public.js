'use strict';

const packageJson = require('../../package.json');
const { API_HOST, HOLLAEX_NETWORK_ENDPOINT } = require('../../constants');
const { loggerPublic } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const getHealth = (req, res) => {
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
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
	}
};

const getConstants = (req, res) => {
	try {
		return res.json({
			coins: toolsLib.getKitCoinsConfig(),
			pairs: toolsLib.getKitPairsConfig(),
			broker: toolsLib.getBrokerDeals(),
			network: HOLLAEX_NETWORK_ENDPOINT
		});
	} catch (err) {
		loggerPublic.verbose('controller/public/getConstants', err.message);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
	}
};

const getNetworkConstants = (req, res) => {
	toolsLib.getNetworkConstants({
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.verbose('controller/public/getNetworkConstants', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getKitConfigurations = (req, res) => {
	try {
		return res.json(toolsLib.getKitConfig());
	} catch (err) {
		loggerPublic.verbose('controller/public/getKitConfigurations', err.message);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
	}
};

const sendSupportEmail = (req, res) => {
	const { email, category, subject, description }  = req.swagger.params;
	toolsLib.sendEmailToSupport(email.value, category.value, subject.value, description.value)
		.then(() => {
			return res.json({ message: 'Email was sent to support' });
		})
		.catch((err) => {
			loggerPublic.verbose('controller/public/sendSupportEmail', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getTopOrderbook = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	toolsLib.getOrderbook(symbol, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getTopOrderbook',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getTopOrderbooks = (req, res) => {
	toolsLib.getOrderbooks({
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getTopOrderbooks',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.getPublicTrades(symbol, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getTrades',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
		end_date.value,
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
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
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getTicker = (req, res) => {
	const symbol = req.swagger.params.symbol.value;

	toolsLib.getTicker(symbol, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getTicker',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAllTicker = (req, res) => {
	toolsLib.getTickers({
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getAllTicker',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.getChart(from.value, to.value, symbol.value, resolution.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getChart',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getCharts = (req, res) => {
	const { from, to, resolution } = req.swagger.params;

	toolsLib.getCharts(from.value, to.value, resolution.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getCharts',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getConfig = (req, res) => {
	toolsLib.getUdfConfig({
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getConfig',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.getUdfHistory(from.value, to.value, symbol.value, resolution.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getHistory',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.getUdfSymbols(symbol, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getSymbols',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAssetsPrices = (req, res) => {
	const { assets, quote, amount } = req.swagger.params;

	if(quote.value && typeof quote.value !== 'string'){
		loggerPublic.error(
			req.uuid,
			'controllers/public/getAssetsPrices invalid quote',
			quote.value
		);
		return res.status(400).json({ message: 'Invalid quote' });
	}

	loggerPublic.info(req.uuid, 'controllers/public/getAssetsPrices assets', assets.value, 'quote', quote.value, 'amount', amount.value);

	toolsLib.getAssetsPrices(assets.value, quote.value, amount.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPublic.error(
				req.uuid,
				'controller/public/getAssetsPrices',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
	getTradesHistory,
	getNetworkConstants
};
