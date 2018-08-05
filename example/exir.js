const EXIR = require('../index');

const accessToken = ''
const exir = new EXIR({apiURL: 'https://api.testnet.exir.tech', baseURL: '/v0', accessToken})

// const hollaex = new HollaEx({apiURL: 'https://api.hollaex.com', baseURL: '/v0'})

exir.getTicker('btc-tmn')
	.then(res => {
		let data = JSON.parse(res)
		console.log("Get Ticker", data)
	})


exir.getUser()
	.then(res => {
		let data = JSON.parse(res)
		console.log("The id is :",data.id )
	})

exir.getBalance()
	.then(res => {
		let data=JSON.parse(res)
		console.log("The btc balance is :", data.btc_balance)
	})	

exir.getOrderbook('btc-tmn')	
	.then(res => {
		let data = JSON.parse(res)
		console.log("Order book : ", data)
	})

// exir.createOrder('btc-tmn', 'buy', 0.01, 'limit', 50000000)
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log(data);
// 	})


// exir.getOrder("52e5b3d8-df62-4104-940c-588b1eba7363")
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log(data);
// 	})

// exir.getAllOrders()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log(data);
// 	})

// exir.cancelOrder('0d7490d2-8ff9-4698-bd9e-10ca552edc94')
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log(data);
// 	})

// exir.cancelAllOrders()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log(data);
// 	})

// exir.getTrades('btc-tmn')
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Trade :", data)
// 	})
	




	
