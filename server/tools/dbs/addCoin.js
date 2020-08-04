const { Coin, sequelize } = require('../../db/models');

let {
	COIN_FULLNAME,
	COIN_SYMBOL,
	COIN_ALLOW_DEPOSIT,
	COIN_ALLOW_WITHDRAWAL,
	COIN_WITHDRAWAL_FEE,
	COIN_MIN,
	COIN_MAX,
	COIN_INCREMENT_UNIT,
	COIN_DEPOSIT_LIMITS,
	COIN_WITHDRAWAL_LIMITS,
	COIN_ACTIVE
} = process.env;

if (
	COIN_FULLNAME &&
	COIN_SYMBOL &&
	COIN_ALLOW_DEPOSIT &&
	COIN_ALLOW_WITHDRAWAL &&
	COIN_WITHDRAWAL_FEE &&
	COIN_MIN &&
	COIN_MAX &&
	COIN_INCREMENT_UNIT &&
	COIN_DEPOSIT_LIMITS &&
	COIN_WITHDRAWAL_LIMITS
) {
	let deposit_limits = JSON.parse(COIN_DEPOSIT_LIMITS);
	let withdrawal_limits =  JSON.parse(COIN_WITHDRAWAL_LIMITS);

	Object.keys(deposit_limits).forEach((data) => {
		deposit_limits[data] = Number(deposit_limits[data]);
	});
	Object.keys(withdrawal_limits).forEach((data) => {
		withdrawal_limits[data] = Number(withdrawal_limits[data]);
	});

	Coin.create({
		fullname: COIN_FULLNAME,
		symbol: COIN_SYMBOL.toLowerCase(),
		allow_deposit: COIN_ALLOW_DEPOSIT,
		allow_withdrawal: COIN_ALLOW_WITHDRAWAL,
		withdrawal_fee: COIN_WITHDRAWAL_FEE,
		min: COIN_MIN,
		max: COIN_MAX,
		increment_unit: COIN_INCREMENT_UNIT,
		deposit_limits,
		withdrawal_limits,
		active: COIN_ACTIVE
	})
		.then(() => {
			return sequelize.query(`
				ALTER TABLE "Balances"
				ADD ${COIN_SYMBOL}_balance float8 NOT NULL DEFAULT (0),
				ADD ${COIN_SYMBOL}_available float8 NOT NULL DEFAULT (0),
				ADD ${COIN_SYMBOL}_pending float8 NOT NULL DEFAULT (0);

			`);
		})
		.then(() => {
			console.log(`Coin ${COIN_SYMBOL} successfully created`);
			process.exit(0);
		})
		.catch((err) => {
			console.error('Error', err);
			process.exit(1);
		});
} else {
	console.error('Error', 'Attributes are not initialized properly');
	process.exit(1);
}