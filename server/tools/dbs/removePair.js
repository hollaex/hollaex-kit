const { Pair } = require('../../db/models');

if (!process.env.PAIR_NAME) {
	console.error('You should set PAIR_NAME');
	throw new Error('Error in removing pair');
}

Pair.destroy({
	where: {
		name: process.env.PAIR_NAME 
	}
}).then(() => {
	console.log(`Pair ${process.env.PAIR_NAME} successfully deleted`);
	process.exit(0);
}).catch((err) => {
	console.err('Error', err);
	process.exit(1);
});