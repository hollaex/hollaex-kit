const HollaEx = require('../index');

var client = new HollaEx({accessToken:''});

client.getTicker('btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("Get Ticker", data)
	});


client.getUser()
	.then(res => {
		let data = JSON.parse(res)
		console.dir({'b':data}, {depth: null})
	})

client.getUserAdmin(67)
	.then(res => {
		let data = JSON.parse(res)
		console.dir({'b':data}, {depth: null})
	})
