# hollaex-node-lib

HollaEx crypto exchange nodejs library

## Usage

```javascript
const { Kit } = require('hollaex-node-lib');

const client = new HollaEx();
```

You can pass the `apiURL` and `baseURL` of the HollaEx-Enabled exchange to connect to. You can also pass your `apiKey` and `apiSecret` generated from the HollaEx-Enabled exchange.

```javascript
const client = new HollaEx({
	apiURL: '<EXCHANGE_API_URL>',
	baseURL: '<EXCHANGE_BASE_URL>',
	apiKey: '<MY_API_KEY>',
	apiSecret: '<MY_API_SECRET>'
});
```

You can also pass the field `apiExpiresAfter` which is the length of time in seconds each request is valid for. The default value is `60`.

### Example:

```javascript
const client = new HollaEx({
	apiURL: '<EXCHANGE_API_URL>',
	baseURL: '<EXCHANGE_BASE_URL>',
	apiKey: '<MY_API_KEY>',
	apiSecret: '<MY_API_SECRET>'
});

client
	.getTicker('xht-usdt')
	.then((res) => {
		console.log('The volume is', data.volume);
	})
	.catch((err) => {
		console.log(err);
	});
```

### Available functions:

| Command             | Parameters                                                                                                                                                                         | Description                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getKit`       |                                                                                                                                                                                    | Get exchange information e.g. name, valid languages, description, etc.|
| `getConstants`       |                                                                                                                                                                                    | Tick size, min price, max price, min size and max size of each symbol pair and coin                                                                                            |
| `getTicker`         | **symbol** e.g. `xht-usdt`                                                                                                                                                          | Last, high, low, open and close price and volume within the last 24 hours                                                                                              |
| `getTickers`         |                                                                                                                                                          | Last, high, low, open and close price and volume within the last 24 hours for all symbols                                                                                              |
| `getOrderbook`      | **symbol** e.g. `xht-usdt`                                                                                                                                             | Orderbook containing list of bids and asks                                                                                                                             |
| `getOrderbooks`      |                                                                                                                                              | Orderbook containing list of bids and asks for all symbols                                                                                                                             |
| `getTrades`          | **symbol** (_optional_) e.g. `xht-usdt`                                                                                                                                             | List of last trades                                                                                                                                                    |
| `getUser`           |                                                                                                                                                                                    | User's personal information                                                                                                                                            |
| `getBalance`        |                                                                                                                                                                                    | User's wallet balance                                                                                                                                                  |
| `getDeposits`        | **currency** (_optional_), **limit** (_default_=`50`, _max_=`100`), **page** (_default_=`1`), **orderBy** (_optional_) e.g. `amount`, **order** (_asc_ or _desc_, _default_=`asc`) | User's list of all deposits                                                                                                                                            |
| `getWithdrawals`     | **currency** (_optional_), **limit** (_default_=`50`, _max_=`100`), **page** (_default_=`1`), **orderBy** (_optional_) e.g. `amount`, **order** (_asc_ or _desc_, _default_=`asc`) | User's list of all withdrawals                                                                                                                                         |
| `requestWithdrawal` | **currency**, **amount**, **address** (_receipient's_)                                                                                                                             | Create a new withdrawal request. **Disable Two-Factor Authentication to be able to use this function. Must confirm within 5 minutes via email to complete withdrawal** |
| `getUserTrades`      | **symbol** (_optional_), **limit** (_default_=`50`, _max_=`100`), **page** (_default_=`1`)                                                                                         | User's list of all trades                                                                                                                                              |
| `getOrder`          | **orderId**                                                                                                                                                                        | Get specific information about a certain order                                                                                                                         |
| `getOrders`       | **symbol** (_optional_), **limit** (_default_=`50`, _max_=`100`), **page** (_default_=`1`), **orderBy** (_optional_) e.g. `amount`, **order** (_asc_ or _desc_, _default_=`asc`) | Get the list of all user orders. It can be filter by passing the symbol                                                                                                |
| `createOrder`       | **symbol**, **side** (_buy_ or _sell_), **size** (amount), **type** (_market_ or _limit_), **price**                                                                               | Create a new order                                                                                                                                                     |
| `cancelOrder`       | **orderId**                                                                                                                                                                        | Cancel a specific order with its ID                                                                                                                                    |
| `cancelAllOrders`    | **symbol** (_optional_) e.g. `xht-usdt`                                                                                                                                             | Cancel all open order. It can be filter by passing the symbol                                                                                                          |

### Websocket

#### Connecting

You can connect and subscribe to different websocket channels for realtime updates.

To connect, use the `connect` function with the channels you want to subscribe to in an array as the parameter.

```javascript
client.connect(['orderbook', 'trade']);
```

To disconnect the websocket, call `disconnect`.

```javascript
client.disconnect();
```

#### Channels

Here is the list of channels you can subscribe to:

- `orderbook`
- `trades`
- `order` (Only available with authentication. Receive order updates)
- `wallet` (Only available with authentication. Receive balance updates)

For public channels (`orderbook`, `trade`), you can subscribe to specific symbols as follows:
`orderbook:xht-usdt`, `trade:xht-usdt`. Not passing a symbol will subscribe to all symbols.

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
## Example

You can run the example by going to example folder and running:

```bash
node example/hollaex.js
```

## Documentation

For adding additional functionalities simply go to index.js and add more features.
You can read more about api documentation at https://apidocs.hollaex.com
You should create your token on the platform in setting->api keys
