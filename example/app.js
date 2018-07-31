const HollaEx = require('../index');

const hollaex = new HollaEx({apiURL: 'https://api.hollaex.com', baseURL: '/v0'})

hollaex.getTicker('btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("The volume is", data.volume)
	})