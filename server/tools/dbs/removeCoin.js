const { Coin } = require('../../db/models');

if (!process.env.COIN_SYMBOL) {
	console.error('You should set COIN_SYMBOL');
	throw new Error('Error in removing coin');
}

Coin.destroy({
	where: {
		symbol: process.env.COIN_SYMBOL 
	}
}).then(() => {
	console.log(`Coin ${process.env.COIN_SYMBOL} successfully deleted`);
	process.exit(0);
}).catch((err) => {
	console.err('Error', err);
	process.exit(1);
});