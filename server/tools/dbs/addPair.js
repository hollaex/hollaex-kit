const { Pair } = require('../../db/models');

const {
	PAIR_NAME,
	PAIR_BASE,
	PAIR_2,
	TAKER_FEES,
	MAKER_FEES,
	MIN_SIZE,
	MAX_SIZE,
	MIN_PRICE,
	MAX_PRICE,
	INCREMENT_SIZE,
	INCREMENT_PRICE,
	PAIR_ACTIVE
} = process.env;

if (
	PAIR_NAME &&
	PAIR_BASE &&
	PAIR_2 &&
	TAKER_FEES &&
	MAKER_FEES &&
	MIN_SIZE &&
	MAX_SIZE &&
	MIN_PRICE &&
	MAX_PRICE &&
	INCREMENT_SIZE &&
	INCREMENT_PRICE
) {
	let maker_fees = JSON.parse(MAKER_FEES);
	let taker_fees =  JSON.parse(TAKER_FEES);

	Object.keys(maker_fees).forEach((data) => {
		maker_fees[data] = Number(maker_fees[data]);
	});
	Object.keys(taker_fees).forEach((data) => {
		taker_fees[data] = Number(taker_fees[data]);
	});
	Pair.create({
		name: PAIR_NAME.toLowerCase(),
		pair_base: PAIR_BASE.toLowerCase(),
		pair_2: PAIR_2.toLowerCase(),
		taker_fees,
		maker_fees,
		min_size: Number(MIN_SIZE),
		max_size: Number(MAX_SIZE),
		min_price: Number(MIN_PRICE),
		max_price: Number(MAX_PRICE),
		increment_size: Number(INCREMENT_SIZE),
		increment_price: Number(INCREMENT_PRICE),
		active: PAIR_ACTIVE
	}).then(() => {
		console.log(`Pair ${PAIR_NAME} successfully created`);
		process.exit(0);
	}).catch((err) => {
		console.error('Error', err);
		process.exit(1);
	});
} else {
	console.error('Error', 'Attributes are not initialized properly');
	process.exit(1);
}