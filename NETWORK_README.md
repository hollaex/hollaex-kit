# hollaex-node-lib

Nodejs library for operators of HollaEx Kit enabled exchanges to connect to the HollaEx Network.

## Usage

```javascript
const { Network } = require('hollaex-node-lib');

const client = new Network({
	apiKey: '<MY_API_KEY>',
	apiSecret: '<MY_API_SECRET>'
	activation_code: '<MY_ACTIVATION_CODE>'
});
```
You must pass your `apiKey`, `apiSecret`, and `activation_code` generated for your HollaEx-Enabled exchange. If you know your exchange's ID, pass the field `exchange_id`.

You can also pass the field `apiExpiresAfter` which is the length of time in seconds each request is valid for. The default value is `60`.

### Example:

```javascript
const client = new Network({
	apiKey: '<MY_API_KEY>',
	apiSecret: '<MY_API_SECRET>'
	activation_code: '<MY_ACTIVATION_CODE>'
});

client
	.init()
	.then((res) => {
		console.log('Exchange info: ', res);
	})
	.catch((err) => {
		console.log(err);
	});

client
	.getPublicTrades({ symbol: 'xht-usdt' })
	.then((res) => {
		console.log('Public trades: ', res);
	})
	.catch((err) => {
		console.log(err);
	});
```

### Available functions:

- **Optional parameters are all contained within an object parameter called `opts`**

| Command | Parameters | Description |
| - | - | - |
| `init`| | Initialize your Kit for HollaEx Network. Must have passed activation_code in constructor |
| `getTicker` | <ul><li>**symbol**: HollaEx trading symbol e.g. `xht-usdt`</li></ul> | Last, high, low, open and close price and volume within the last 24 hours |
| `getTickers` | | Last, high, low, open and close price and volume within the last 24 hours for all symbols |
| `getOrderbook` | <ul><li>**symbol**: HollaEx trading symbol e.g. `xht-usdt`</li></ul> | Orderbook containing list of bids and asks |
| `getOrderbooks` | | Orderbook containing list of bids and asks for all symbols |
| `getPublicTrades` | <ul><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li></ul> | List of last trades |
| `getTradesHistory` | <ul><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li><li>**opts.side**: (_optional_)</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`asc`, `asc` or `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li></ul> | List of trades in paginated form |
| `getGeneratedFees` | <ul><li>**opts**: Object with additional params</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li></ul> | List of generated fees for the exchange |
| `settleFees` | | Settle exchange's fees |
| `getUser` | <ul><li>**userId**: User HollaEx Network ID</li></ul> | User's personal information |
| `getUsers` | | Get all user's for your exchange |
| `createUser` | <ul><li>**email**: User email</li></ul> | Create a user on the Network |
| `getBalance` | | Exchange's wallet balance |
| `getUserBalance` | <ul><li>**userId**: User HollaEx Network ID</li></ul> | User's wallet balance |
| `createUserCryptoAddress` | <ul><li>**userId**: User HollaEx Network ID</li><li>**crypto**</li><li>**opts**: Object with additional params</li><li>**opts.network**: (_optional_)</li></ul> | Create a crypto address for a user |
| `mintAsset` | <ul><li>**userId**: User HollaEx Network ID</li><li>**currency**: Currency code e.g. `xht`</li><li>**amount**</li><li>**opts**: Object with additional params</li><li>**opts.description**: (_optional_)</li><li>**opts.transactionId**: (_optional_)</li><li>**opts.status**: (_optional_, _default_=`true`)</li><li>**opts.email**: (_optional_, _default_=`true`)</li></ul> | Mint an asset that is created by the operator for a user |
| `updatePendingMint` | <ul><li>**transactionId**</li><li>**opts**: Object with additional params</li><li>**opts.status**: (_optional_)</li><li>**opts.dismissed**: (_optional_)</li><li>**opts.rejected**: (_optional_)</li><li>**opts.processing**: (_optional_)</li><li>**opts.waiting**: (_optional_)</li><li>**opts.updatedTransactionId**: (_optional_)</li><li>**opts.email**: (_optional_, _default_=`true`)</li><li>**opts.updatedDescription**: (_optional_)</li></ul> | Update a pending mint |
| `burnAsset` | <ul><li>**userId**: User HollaEx Network ID</li><li>**currency**: Currency code e.g. `xht`</li><li>**amount**</li><li>**opts**: Object with additional params</li><li>**opts.description**: (_optional_)</li><li>**opts.transactionId**: (_optional_)</li><li>**opts.status**: (_optional_, _default_=`true`)</li><li>**opts.email**: (_optional_, _default_=`true`)</li></ul> | Burn an asset that is created by the operator from a user |
| `updatePendingBurn` | <ul><li>**transactionId**</li><li>**opts**: Object with additional params</li><li>**opts.status**: (_optional_)</li><li>**opts.dismissed**: (_optional_)</li><li>**opts.rejected**: (_optional_)</li><li>**opts.processing**: (_optional_)</li><li>**opts.waiting**: (_optional_)</li><li>**opts.updatedTransactionId**: (_optional_)</li><li>**opts.email**: (_optional_, _default_=`true`)</li><li>**opts.updatedDescription**: (_optional_)</li></ul> | Update a pending burn |
| `getDeposits` | <ul><li>**opts**: Object with additional params</li><li>**opts.currency**: (_optional_)</li><li>**opts.status**: (_optional_)</li><li>**opts.dismissed**: (_optional_)</li><li>**opts.rejected**: (_optional_)</li><li>**opts.processing**: (_optional_)</li><li>**opts.waiting**: (_optional_)</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`asc`, `asc` or `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li><li>**opts.transactionId**: (_optional_)</li><li>**opts.address**: (_optional_)</li> | Exchanges's list of all deposits |
| `getUserDeposits` | <ul><li>**userId**: User HollaEx Network ID</li><li>**opts**: Object with additional params</li><li>**opts.currency**: (_optional_)</li><li>**opts.status**: (_optional_)</li><li>**opts.dismissed**: (_optional_)</li><li>**opts.rejected**: (_optional_)</li><li>**opts.processing**: (_optional_)</li><li>**opts.waiting**: (_optional_)</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`asc`, `asc` or `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li><li>**opts.transactionId**: (_optional_)</li><li>**opts.address**: (_optional_)</li></ul> | User's list of all deposits |
| `getWithdrawals` | <ul><li>**opts**: Object with additional params</li><li>**opts.currency**: (_optional_)</li><li>**opts.status**: (_optional_)</li><li>**opts.dismissed**: (_optional_)</li><li>**opts.rejected**: (_optional_)</li><li>**opts.processing**: (_optional_)</li><li>**opts.waiting**: (_optional_)</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`asc`, `asc` or `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li><li>**opts.transactionId**: (_optional_)</li><li>**opts.address**: (_optional_)</li></ul> | Exchange's list of all withdrawals |
| `getUserWithdrawals` | <ul><li>**userId**: User HollaEx Network ID</li><li>**opts**: Object with additional params</li><li>**opts.currency**: (_optional_)</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`asc`, `asc` or `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li><li>**opts.transactionId**: (_optional_)</li><li>**opts.address**: (_optional_)</li></ul> | User's list of all withdrawals |
| `performWithdrawal` | <ul><li>**userId**: User HollaEx Network ID</li><li>**address**</li><li>**currency**: Currency code e.g. `xht`</li><li>**amount**</li><li>**opts**: Object with additional params</li><li>**opts.network**: (_optional_)</li></ul> | Create a withdrawal for an exchange's user on the network |
| `cancelWithdrawal` | <ul><li>**userId**: User HollaEx Network ID</li><li>**withdrawalId**</li></ul> | Cancel a pending withdrawal |
| `checkTransaction` | <ul><li>**userId**: User HollaEx Network ID</li><li>**transactionId**</li><li>**address**</li><li>**opts**: Object with additional params</li><li>**opts.isTestnet**: (_optional_)</li></ul> | Check transaction in network. Will update transaction status on Kit accordingly |
| `transferAsset` | <ul><li>**senderId**</li><li>**receiverId**</li><li>**currency**: Currency code e.g. `xht`</li><li>**amount**</li><li>**opts**: Object with additional params</li><li>**opts.description**: (_optional_)</li><li>**opts.email**: (_optional_, _default_=`true`)</li></ul> | Transfer funds between two users |
| `getTrades` | <ul><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`desc`, `asc` or `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li></ul> | Exchange's list of all trades |
| `getUserTrades` | <ul><li>**userId**: User HollaEx Network ID</li><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`desc`, `asc` or `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li></ul> | User's list of all trades |
| `getUserStats` | <ul><li>**userId**: User HollaEx Network ID</li></ul> | Get sum of user trades and its stats |
| `getOrder` | <ul><li>**userId**: User HollaEx Network ID</li><li>**orderId**</li></ul> | Get specific information about a certain order |
| `getOrders` | <ul><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li><li>**opts.side**: (_optional_)</li><li>**opts.status**: (_optional_)</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`desc`, _enum_=`asc`, `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li></ul> | Get the list of all orders for the exchange |
| `getUserOrders` | <ul><li>**userId**: User HollaEx Network ID</li><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li><li>**opts.side**: (_optional_)</li><li>**opts.status**: (_optional_)</li><li>**opts.limit**: (_optional_, _default_=`50`, _max_=`100`)</li><li>**opts.page**: (_optional_, _default_=`1`)</li><li>**opts.orderBy**: (_optional_, _default_=`id`)</li><li>**opts.order**: (_optional_, _default_=`desc`, _enum_=`asc`, `desc`)</li><li>**opts.startDate**: (_optional_, _default_=`0`, _format_=`ISO8601`)</li><li>**opts.endDate**: (_optional_, _default_=`NOW`, _format_=`ISO8601`)</li></ul> | Get the list of all orders for a user |
| `createOrder` | <ul><li>**userId**: User HollaEx Network ID</li><li>**symbol**: HollaEx trading symbol e.g. `xht-usdt`</li><li>**side**: (`buy` or `sell`)</li><li>**size**</li><li>**type**: (`market` or `limit`)</li><li>**price**</li><li>**feeData**: (object with `fee_structure` and `fee_coin`, `fee_structure` is an object with `maker` and `taker` fee percentages and is required)</li><li>**opts**: Object with additional params</li><li>**opts.stop**: (_optional_)</li><li>**opts.meta**: (_optional_, object with optional properties e.g. `post_only`)</li><li>**opts.meta.post_only**: (_optional_, Whether or not the order should only be made if market maker)</li><li>**opts.meta.note**: (_optional_, Additional note to add to order data.)</li></ul> | Create a new order |
| `cancelOrder` | <ul><li>**userId**: User HollaEx Network ID</li><li>**orderId**</li></ul> | Cancel a specific order with its ID |
| `cancelAllOrders` | <ul><li>**userId**: User HollaEx Network ID</li><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li></ul> | Cancel all open order. It can be filtered by passing the symbol |
| `getPublicTrades` | <ul><li>**opts**: Object with additional params</li><li>**opts.symbol**: (_optional_) HollaEx trading symbol e.g. `xht-usdt`</li></ul> | Get public trades on Network |
| `getChart` | <ul><li>**from**</li><li>**to**</li><li>**symbol**: HollaEx trading symbol e.g. `xht-usdt`</li><li>**resolution**</li></ul> | Get TradingView trade history HOLCV |
| `getCharts` | <ul><li>**from**</li><li>**to**</li><li>**resolution**</li></ul> | Get TradingView trade history HOLCV for all pairs |
| `getUdfConfig` | | Get TradingView udf config |
| `getUdfHistory` | <ul><li>**from**</li><li>**to**</li><li>**symbol**: HollaEx trading symbol e.g. `xht-usdt`</li><li>**resolution**</li></ul> | Get TradingView udf history HOLCV |
| `getUdfSymbols` | <ul><li>**symbol**: HollaEx trading symbol e.g. `xht-usdt`</li></ul> | Get TradingView udf symbols |
| `getOraclePrices` | <ul><li>**assets**: (an array of assets to get converted prices)</li><li>**opts**: Object with additional params</li><li>**opts.quote**: (_optional_, _default_=`usdt`)</li><li>**opts.amount**: (_optional_, _default_=`1`)</li></ul> | Get converted quote amount for an asset |

### Websocket

#### Functions

You can connect and subscribe to different websocket channels for realtime updates.

To connect, use the `connect` function with the channels you want to subscribe to in an array as the parameter. The connection will reconnect on it's own unless you call `disconnect`.

```javascript
client.connect(['orderbook', 'trade']);
```

To disconnect the websocket, call `disconnect`.

```javascript
client.disconnect();
```

To subscribe to more channels after connection, use `subscribe`.

```javascript
client.subscribe(['order:1', 'wallet:1']);
```

To unsubscribe from channels after connection, use `unsubscribe`.

```javascript
client.unsubscribe(['orderbook']);
```

#### Channels

Here is the list of channels you can subscribe to:

- `orderbook`
- `trades`
- `order` (Only available with authentication. Receive order updates for a user of your exchange)
- `wallet` (Only available with authentication. Receive balance updates for a user of your exchange)

For public channels (`orderbook`, `trade`), you can subscribe to specific symbols as follows:
`orderbook:xht-usdt`, `trade:xht-usdt`. Not passing a symbol will subscribe to all symbols.

For private channels (`order`, `trade`), you must also pass the user's ID on the HollaEx Network as follows:
`order:1`, `wallet:23`. Not passing an ID will give an error.

#### Events

After connecting to the websocket, you can listen for events coming from the server by using the `on` function for the `ws` property of the client.
The events available are default websocket events e.g. `message`, `open`, `close`, `error`, `unexpected-response`, etc.

```javascript
client.ws.on('message', (data) => {
	data = JSON.parse(data);
	console.log(data);
});
```

These are exapmles of data responses from the server.

- **orderbook**: Updates related to the user's private information are as follows:

	```json
	{
		"topic": "orderbook",
		"action": "partial",
		"symbol": "xht-usdt",
		"data": {
			"bids": [
				[0.1, 0.1],
				...
			],
			"asks": [
				[1, 1],
				...
			],
			"timestamp": "2020-12-15T06:45:27.766Z"
		},
		"time": 1608015328
	}
	```

- **trade**: Updates related to the user's private information are as follows:

	```json
	{
		"topic": "trade",
		"action": "partial",
		"symbol": "xht-usdt",
		"data": [
			{
				"size": 0.012,
				"price": 300,
				"side": "buy",
				"timestamp": "2020-12-15T07:25:28.887Z"
			},
			...
		],
		"time": 1608015328
	}
	```

- **wallet**: Updates related to the user's private information are as follows:

	```json
	{
		"topic": "wallet",
		"action": "partial",
		"user_id": 1,
		"data": {
			"usdt_balance": 1,
			"usdt_available": 1,
			"xht_balance": 1,
			"xht_available": 1,
			"xmr_balance": 1,
			"xmr_available": 1,
			"btc_balance": 1,
			"btc_available": 1,
			"eth_balance": 1,
			"eth_available": 1,
			...,
			"updated_at": "2020-12-15T08:41:24.048Z"
		},
		"time": 1608021684
	}
	```

- **order**: Websocket messages relating the the user's orders.
    - The `status` of the order can be `new`, `pfilled`, `filled`, and `canceled`.
    - The `action` of the data determines what caused it to happen. All three are explained below:

  - `partial`: All previous and current orders. Is the first order data received when connecting. Max: 50. Descending order.

	```json
	{
		"topic": "order",
		"action": "partial",
		"user_id": 1,
		"data": [
			{
				"id": "7d3d9545-b7e6-4e7f-84a0-a39efa4cb173",
				"side": "buy",
				"symbol": "xht-usdt",
				"type": "limit",
				"size": 0.1,
				"filled": 0,
				"price": 1,
				"stop": null,
				"status": "new",
				"fee": 0,
				"fee_coin": "xht",
				"meta": {},
				"fee_structure": {
					"maker": 0.1,
					"taker": 0.1
				},
				"created_at": "2020-11-30T07:45:43.819Z",
				"created_by": 1
			},
			...
		],
		"time": 1608022610
	}
	```

  - `insert`: When user's order is added. The status of the order can be either `new`, `pfilled`, or `filled`.

	```json
  	{
		"topic": "order",
		"action": "insert",
		"user_id": 1,
		"symbol": "xht-usdt",
		"data": [
			{
				"id": "7d3d9545-b7e6-4e7f-84a0-a39efa4cb173",
				"side": "buy",
				"symbol": "xht-usdt",
				"type": "limit",
				"size": 0.1,
				"filled": 0,
				"price": 1,
				"stop": null,
				"status": "new",
				"fee": 0,
				"fee_coin": "xht",
				"meta": {},
				"fee_structure": {
					"maker": 0.1,
					"taker": 0.1
				},
				"created_at": "2020-11-30T07:45:43.819Z",
				"updated_at": "2020-12-15T08:56:45.066Z",
				"created_by": 1
			},
			...
		],
		"time": 1608022610
	}
	```

  - `update`: When user's order status is updated. Status can be `pfilled`, `filled`, and `canceled`.

	```json
  	{
		"topic": "order",
		"action": "insert",
		"user_id": 1,
		"symbol": "xht-usdt",
		"data": [
			{
				"id": "7d3d9545-b7e6-4e7f-84a0-a39efa4cb173",
				"side": "buy",
				"symbol": "xht-usdt",
				"type": "limit",
				"size": 0.1,
				"filled": 0,
				"price": 1,
				"stop": null,
				"status": "new",
				"fee": 0,
				"fee_coin": "xht",
				"meta": {},
				"fee_structure": {
					"maker": 0.1,
					"taker": 0.1
				},
				"created_at": "2020-11-30T07:45:43.819Z",
				"updated_at": "2020-12-15T08:56:45.066Z",
				"created_by": 1
			},
			...
		],
		"time": 1608022610
	}
	```

## Documentation

For adding additional functionalities simply go to index.js and add more features.
You can read more about api documentation at https://apidocs.hollaex.com
You should create your token on the platform in setting->api keys
