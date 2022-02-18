const Network = require('./index');

const network = new Network({
	apiUrl: 'https://api.hollaex.network',
	apiKey: '',
	apiSecret: '',
	activation_code: '',
	exchange_id: 1
});

(async () => {
	try {
		const init = await network.init();
		console.log(init);
		console.log(network.exchange_id)

		console.log('connecting to websocket')
		network.connect(['orderbook:xht-usdt']);
		network.ws.on('message', (data) => {
			console.log(data)
		})

	} catch (err) {
		console.log(err)
	}
	
	

}) ();