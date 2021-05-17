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
| `getTicker` | **symbol** | Last, high, low, open and close price and volume within the last 24 hours |
| `getTickers` | | Last, high, low, open and close price and volume within the last 24 hours for all symbols |
| `getOrderbook` | **symbol** | Orderbook containing list of bids and asks |
| `getOrderbooks` | | Orderbook containing list of bids and asks for all symbols |
| `getPublicTrades` | **symbol** (_optional_) | List of last trades |
| `getTradesHistory` | **symbol** (_optional_), **side** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`asc`, `asc` or `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`) | List of trades in paginated form |
| `getGeneratedFees` | **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`) | List of generated fees for the exchange |
| `settleFees` | | Settle exchange's fees |
| `getUser` | **userId** (_optional_) | User's personal information |
| `getUsers` | | Get all user's for your exchange |
| `createUser` | **email** (_optional_) | Create a user on the Network |
| `getBalance` | | Exchange's wallet balance |
| `getUserBalance` | **userId** | User's wallet balance |
| `createUserCryptoAddress` | **userId**, **crypto**, **network** (_optional_) | Create a crypto address for a user |
| `mintAsset` | **userId**, **currency**, **amount**, **description** (_optional_), **transactionId** (_optional_), **status** (_optional_, _default_=`true`), **email** (_optional_, _default_=`true`) | Mint an asset that is created by the operator for a user |
| `updatePendingMint` | **transactionId**, **status** (_optional_), **dismissed** (_optional_), **rejected** (_optional_), **processing** (_optional_), **waiting** (_optional_), **updatedTransactionId** (_optional_), **email** (_optional_, _default_=`true`), **updatedDescription** (_optional_) | Update a pending mint |
| `burnAsset` | **userId**, **currency**, **amount**, **description** (_optional_), **transactionId** (_optional_), **status** (_optional_, _default_=`true`), **email** (_optional_, _default_=`true`) | Burn an asset that is created by the operator from a user |
| `updatePendingBurn` | **transactionId**, **status** (_optional_), **dismissed** (_optional_), **rejected** (_optional_), **processing** (_optional_), **waiting** (_optional_), **updatedTransactionId** (_optional_), **email** (_optional_, _default_=`true`), **updatedDescription** (_optional_) | Update a pending burn |
| `getDeposits` | **currency** (_optional_), **status** (_optional_), **dismissed** (_optional_), **rejected** (_optional_), **processing** (_optional_), **waiting** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`asc`, `asc` or `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`), **transactionId** (_optional_), **address** (_optional_) | Exchanges's list of all deposits |
| `getUserDeposits` | **userId**, **currency** (_optional_), **status** (_optional_), **dismissed** (_optional_), **rejected** (_optional_), **processing** (_optional_), **waiting** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`asc`, `asc` or `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`), **transactionId** (_optional_), **address** (_optional_) | User's list of all deposits |
| `getWithdrawals` | **currency** (_optional_), **status** (_optional_), **dismissed** (_optional_), **rejected** (_optional_), **processing** (_optional_), **waiting** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`asc`, `asc` or `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`), **transactionId** (_optional_), **address** (_optional_) | Exchange's list of all withdrawals |
| `getUserWithdrawals` | **userId**, **currency** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`asc`, `asc` or `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`), **transactionId** (_optional_), **address** (_optional_) | User's list of all withdrawals |
| `performWithdrawal` | **userId**, **address**, **currency**, **amount**, **network** (_optional_) | Create a withdrawal for an exchange's user on the network |
| `cancelWithdrawal` | **userId**, **withdrawalId** | Cancel a pending withdrawal |
| `checkTransaction` | **userId**, **transactionId**, **address**, **isTestnet** (_optional_) | Check transaction in network. Will update transaction status on Kit accordingly |
| `transferAsset` | **senderId**, **receiverId**, **currency**, **amount**, **description** (_optional_), **email** (_optional_, _default_=`true`) | Transfer funds between two users |
| `getTrades` | **symbol** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`desc`, `asc` or `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`) | Exchange's list of all trades |
| `getUserTrades` | **userId**, **symbol** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`desc`, `asc` or `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`) | User's list of all trades |
| `getUserStats` | **userId** | Get sum of user trades and its stats |
| `getOrder` | **userId**, **orderId** | Get specific information about a certain order |
| `getOrders` | **symbol** (_optional_), **side** (_optional_),  **status** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`desc`, _enum_=`asc`, `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`) | Get the list of all orders for the exchange |
| `getUserOrders` | **userId**, **symbol** (_optional_), **side** (_optional_),  **status** (_optional_), **limit** (_optional_, _default_=`50`, _max_=`100`), **page** (_optional_, _default_=`1`), **orderBy** (_optional_, _default_=`id`), **order** (_optional_, _default_=`desc`, _enum_=`asc`, `desc`), **startDate** (_optional_, _default_=`0`, _format_=`ISO8601`), **endDate** (_optional_, _default_=`NOW`, _format_=`ISO8601`) | Get the list of all orders for a user |
| `createOrder` | **userId**, **symbol**, **side** (`buy` or `sell`), **size**, **type** (`market` or `limit`), **price**, **feeData** (object with `fee_structure` and `fee_coin`, `fee_structure` is an object with `maker` and `taker` fee percentages and is required), **stop** (_optional_), **meta** (_optional_, object with optional properties e.g. `post_only`) | Create a new order |
| `cancelOrder` | **userId**, **orderId** | Cancel a specific order with its ID |
| `cancelAllOrders` | **userId**, **symbol** (_optional_) | Cancel all open order. It can be filtered by passing the symbol |
| `getPublicTrades` | **symbol** (_optional_) | Get public trades on Network |
| `getChart` | **from**, **to**, **symbol**, **resolution** | Get TradingView trade history HOLCV |
| `getCharts` | **from**, **to**, **resolution** | Get TradingView trade history HOLCV for all pairs |
| `getUdfConfig` | | Get TradingView udf config |
| `getUdfHistory` | **from**, **to**, **symbol**, **resolution** | Get TradingView udf history HOLCV |
| `getUdfSymbols` | **symbol** | Get TradingView udf symbols |
| `getOraclePrices` | **assets** (an array of assets to get converted prices), **quote** (_optional_, _default_=`usdt`), **amount** (_optional_, _default_=`1`) | Get converted quote amount for an asset |

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
