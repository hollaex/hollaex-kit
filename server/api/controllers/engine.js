'use strict';

const { loggerOrderbook } = require('../../config/logger');
const { getNodeLib } = require('../../init');

const getTopOrderbooks = (req, res) => {
	const symbol = req.swagger.params.symbol.value;
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

module.exports = {
	getTopOrderbooks
};