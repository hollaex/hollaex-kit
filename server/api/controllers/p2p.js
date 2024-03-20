'use strict';

const { loggerStake } = require('../../config/logger');
const { INIT_CHANNEL } = require('../../constants');
const { publisher } = require('../../db/pubsub');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const createP2PDeal = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/createP2PDeal/auth', req.auth);

	const {  
        price_type,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_buy_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
        payment_methods,
	 } = req.swagger.params.data.value;

	loggerStake.verbose(
		req.uuid,
		'controllers/stake/createP2PDeal data',
        price_type,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_buy_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
	);

	toolsLib.p2p.createP2PDeal({
        merchant_id: req.auth.sub.id,
        side: 'sell',
        price_type,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_buy_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
        payment_methods,
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/stake/createP2PDeal err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}
module.exports = {
	createP2PDeal,
};