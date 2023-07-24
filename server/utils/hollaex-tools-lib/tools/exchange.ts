'use strict';

import { getNodeLib } from '../../../init';
import { publisher } from './database/redis';
import { INIT_CHANNEL } from '../../../constants';

const getExchangeConfig = async (
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().getExchange(opts);
};

const updateExchangeConfig = async (
	fields = {
		info: null,
		isPublic: null,
		type: null,
		name: null,
		displayName: null,
		url: null,
		businessInfo: null,
		pairs: null,
		coins: null
	},
	opts = {
		additionalHeaders: null,
		skip_refresh: null
	}
) => {
	const { additionalHeaders, skip_refresh } = opts;
	const result = await getNodeLib().updateExchange(fields, { additionalHeaders });

	if (!skip_refresh) {
		publisher.publish(
			INIT_CHANNEL,
			JSON.stringify({ type: 'refreshInit' })
		);
	}

	return result;
};

export {
	getExchangeConfig,
	updateExchangeConfig
};
