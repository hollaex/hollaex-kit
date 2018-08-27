const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var client = new HollaEx({accessToken : ACCESS_TOKEN});


const formatAPI = (nestArr) => {
	const dataArr = nestArr.map((datum) =>{
		if(typeof datum==='string'){
			const data = JSON.parse(datum);
			return data
		} else {
			return formatAPI(datum);
		}
	});
	return dataArr;
}

//get all API

client.getAPI(['ticker:btc-eur', 'trades:eth-btc', 'privateUser', 'privateBalance'])
	.then(res => {
			const data = formatAPI(res);
			// console.log(data);
			console.log(JSON.stringify(data, null, 4));
	});

// client.getPrivateAPI(['user', 'balance'])
// 	.then(res => {
// 		res.map(datum=>{
// 			const data=JSON.parse(datum);
// 			console.log(data);
// 		})
// 	});


// client.orderAction(getAllOrders, cancelAllOrders)
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Ticker: ", data)
// 	});



// const data = client.allRequest([['publicAPI', 'ticker:btc-eur', 'trades:eth-btc', 'orderbooks:btc-eur'], ['privateAPI','user','balance']])
// 	.then(res => {
// 		res.map(array=>{
// 			array.map(datum => {
// 				const data=JSON.parse(datum);
// 				console.log(data);
// 			})
// 		})
// 	});
//
// 	data.on('trades', (data) => {
// 		console.log(data)
// 	})


// client.getTickers('btc-eur')
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Ticker: ", data)
// 	});
//
// //Private rest API
// client.getUser()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get User: ", data)
// 	});

// client.getDeposits()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Deposit: ", data)
// 	});
// client.getWithdrawals()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Withdrawal: ", data)
// 	});
// client.getUserTrades()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get User Trades: ", data)
// 	});
// client.createOrder('btc-eur', 'buy', 1, 'market', 1);
// client.createOrder('btc-eur', 'buy', 1, 'market', 1);
// client.createOrder('btc-eur', 'sell', 1, 'market', 1);
// client.getAllOrders ()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Orders: ", data)
// 	});


// connect to websocket
/*
	events : trades, orderbook, ticker,chartData, chartTicker,privateUser, privateWallet, privateOrders

	symbols : btc-eur, eth-btc, eth-eur
*/

// const socket = client.connectSocket(['trades:btc-eur', 'chartData:eth-btc', 'privateUser']);
// client.checkConnection();
// socket.on('trades', (data) => {
// 	console.log(data)
// })
// socket.on('user', (data) => {
// 	console.log(data)
// })
// socket.on('data', (data) => {
// 	console.log(data)
// })
