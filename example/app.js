const HollaEx = require('../index');

const hollaex = new HollaEx({apiURL: 'https://api.hollaex.com', baseURL: '/v0'})

exir.getTicker('btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("The volume is", data.volume)
	})


exir.getUser()
	.then(res => {
		let data = JSON.parse(res)
		console.log("The id is :",data.id )
	})

exir.getBalance ()
	.then(res => {
		let data=JSON.parse(res)
		console.log("The btc balance is :", data.btc_balance)
	})	

exir.getOrderbook ('btc-eur')	
	.then(res => {
		let data = JSON.parse(res)
		console.log("Order book : ", data)
	})

exir.getTrade('btc-eur')
	{
		.then(res => {
		let data = JSON.parse(res)
		console.log("Trade :", data)
	})
	}	




	
