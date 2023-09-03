'use strict';

const { getModel } = require('./database/model');
const math = require('mathjs');
const randomString = require('random-string');
const { SERVER_PATH } = require('../constants');
const { EXCHANGE_PLAN_INTERVAL_TIME, EXCHANGE_PLAN_PRICE_SOURCE } = require(`${SERVER_PATH}/constants`)
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { client } = require('./database/redis');
const { getUserByKitId } = require('./user');
const { validatePair, getKitTier, getKitConfig, getAssetsPrices, getQuickTrades, getKitCoin } = require('./common');
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');
const { verifyBearerTokenPromise } = require('./security');
const { Op } = require('sequelize');
const { loggerBroker } = require('../../../config/logger');
const { isArray } = require('lodash');
const BigNumber = require('bignumber.js');

const {
	TOKEN_EXPIRED,
} = require(`${SERVER_PATH}/messages`);

const getExchangeStakes = (req, res) => {

};


module.exports = {
	getExchangeStakes
};