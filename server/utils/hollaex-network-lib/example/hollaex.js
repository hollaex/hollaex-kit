const Network = require('../index');

const network = new Network({
	apiUrl: 'http://localhost',
	apiKey: '60ea79a5edf1aa07145b4e32a5ee1b52627aa730',
	apiSecret: 'abc035d6591aa806a0b773335ba194afe867c0118f73a017e8',
	activation_code: 'b6ad0ed3-2c9d-491a-8ad8-1cab90ca1f8e',
	exchange_id: 106
});

(async () => {
	try {
		const init = await network.init();
		console.log(init);
		console.log(network.exchange_id)

		const order = await network.createOrder(
			88,
			'btc-usdt',
			'sell',
			0.0001,
			'limit',
			100000,
			{
				fee_structure: {
					maker: 0.1,
					taker: 0.2
				},
				fee_coin: null
			}
			// {
			// 	stop: null,
			// 	meta: null,
			// 	additionalHeaders: null
			// }
		);
		console.log(order)

		// const totalBalance = await network.getBalance();
		// console.log(totalBalance)

		// const balance = await network.getUserBalance(88);
		// console.log(balance)
		console.log('connecting')
		network.connect(['wallet:88']);
		network.ws.on('message', (data) => {
			console.log(data)
		})

	} catch (err) {
		console.log(err)
	}
	
	

}) ();