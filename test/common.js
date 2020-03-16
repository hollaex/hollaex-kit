const expect = require('chai').expect;
const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const client = new HollaEx({ accessToken: ACCESS_TOKEN });
const symbolPair = 'xht-usdt';

module.exports = {
	expect,
	client,
	symbolPair
};
