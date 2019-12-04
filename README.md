# hollaex-node-lib

HollaEx crypto exchange nodejs library

## Usage

```node
const HollaEx = require('hollaex-node-lib');

var client = new HollaEx();
```

You can pass your `apiKey` and `apiSecret` generated from the site as follows:

```node
var client = new HollaEx({ apiKey: <MY_API_KEY>, apiSecret: <MY_API_SECRET> });
```

You can also pass the field `apiExpiresAfter` which is the length of time in seconds each request is valid for. The default value is `60`.

There is a list of functions you can call which will be added later and they are not at this point implemented yet.

### Example:

```node
var client = new HollaEx({ apiKey: <MY_API_KEY>, apiSecret: <MY_API_SECRET> });
client
	.getTicker('hex-usdt')
	.then((res) => {
		let data = JSON.parse(res);
		console.log('The volume is', data.volume);
	})
	.catch((err) => {
		console.log(err);
	});
```

### Available functions:

| Command             | Parameters                                                                                                                                                                         | Description                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getTicker`         | **symbol** e.g. `hex-usdt`                                                                                                                                                          | Last, high, low, open and close price and volume within the last 24 hours                                                                                              |
| `getOrderbook`      | **symbol** (_optional_) e.g. `hex-usdt`                                                                                                                                             | Orderbook containing list of bids and asks                                                                                                                             |
| `getTrade`          | **symbol** (_optional_) e.g. `hex-usdt`                                                                                                                                             | List of last trades                                                                                                                                                    |
| `getConstant`       |                                                                                                                                                                                    | Tick size, min price, max price, min size and max size of each symbol pair                                                                                             |
| `getUser`           |                                                                                                                                                                                    | User's personal information                                                                                                                                            |
| `getBalance`        |                                                                                                                                                                                    | User's wallet balance                                                                                                                                                  |
| `getDeposit`        | **currency** (_optional_), **limit** (_default_=`50`, _max_=`100`), **page** (_default_=`1`), **orderBy** (_optional_) e.g. `amount`, **order** (_asc_ or _desc_, _default_=`asc`) | User's list of all deposits                                                                                                                                            |
| `getWithdrawal`     | **currency** (_optional_), **limit** (_default_=`50`, _max_=`100`), **page** (_default_=`1`), **orderBy** (_optional_) e.g. `amount`, **order** (_asc_ or _desc_, _default_=`asc`) | User's list of all withdrawals                                                                                                                                         |
| `requestWithdrawal` | **currency**, **amount**, **address** (_receipient's_)                                                                                                                             | Create a new withdrawal request. **Disable Two-Factor Authentication to be able to use this function. Must confirm within 5 minutes via email to complete withdrawal** |
| `getUserTrade`      | **symbol** (_optional_), **limit** (_default_=`50`, _max_=`100`), **page** (_default_=`1`)                                                                                         | User's list of all trades                                                                                                                                              |
| `getOrder`          | **orderId**                                                                                                                                                                        | Get specific information about a certain order                                                                                                                         |
| `getAllOrder`       | **symbol** (_optional_) e.g. `hex-usdt`                                                                                                                                             | Get the list of all user orders. It can be filter by passing the symbol                                                                                                |
| `createOrder`       | **symbol**, **side** (_buy_ or _sell_), **size** (amount), **type** (_market_ or _limit_), **price**                                                                               | Create a new order                                                                                                                                                     |
| `cancelOrder`       | **orderId**                                                                                                                                                                        | Cancel a specific order with its ID                                                                                                                                    |
| `cancelAllOrder`    | **symbol** (_optional_) e.g. `hex-usdt`                                                                                                                                             | Cancel all open order. It can be filter by passing the symbol                                                                                                          |

### Websocket

You can connect and subscribe to different websocket channels for realtime updates.

```node
const socket = client.connect('orderbook');
socket.on('orderbook', (data) => {
	console.log(data);
});
```

You can only subscribe to specific symbols as follows:
`orderbook:hex-usdt`
Here is the list of events you can subscribe:

- orderbook
- trades
- user (Private updates for the user such as balance, user orders etc as explained below)
- all (It subscribes to all events)

When you subscribe to private updates on user you should listen for the events as follows:

```node
const socket = client.connect('user');

socket.on('userInfo', (data) => {
	console.log(data);
});
socket.on('userOrder', (data) => {
	console.log(data);
});
socket.on('userTrade', (data) => {
	console.log(data);
});
socket.on('userWallet', (data) => {
	console.log(data);
});
socket.on('userUpdate', (data) => {
	console.log(data);
});
```

`userInfo`, `userOrder`, and `userTrade` are only `partial` and send data once. These sockets are similar to GET requests and you should not expect any updates after you receive the first set of data.

`userWallet` gives updates on changes in the user's wallet

`userUpdate` is what is used for all updates on user's private data.

These are list of `userUpdate` client gets after subscription.

- **userUpdate**: Updates related to the user's private information are as follows:

  - _order_queued_: When a user order is added to the queue.

  ```json
  {
  	"action": "update",
  	"type": "order_queued",
  	"data": {
  		"side": "sell",
  		"type": "limit",
  		"price": .2,
  		"size": 2,
  		"symbol": "hex-usdt",
  		"id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
  		"created_by": 79,
  		"filled": 0
  	}
  }
  ```

  - _order_processed_: When a user order has been processed in the queue.

  ```json
  {
  	"action": "update",
  	"type": "order_processed",
  	"data": { "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd" }
  }
  ```

  - _order_canceled_: When a user order has been canceled in the queue, so it has not been added to the orderbook.

  ```json
  {
  	"action": "update",
  	"type": "order_canceled",
  	"data": {
  		"id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
  		"message": "Insufficient balance to perform the order."
  	}
  }
  ```

  - _order_added_: When a user order is added to the orderbook.

  ```json
  {
  	"action": "update",
  	"type": "order_added",
  	"data": {
  		"side": "sell",
  		"type": "limit",
  		"price": .2,
  		"size": 2,
  		"symbol": "hex-usdt",
  		"id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
  		"created_by": 79,
  		"filled": 0
  	}
  }
  ```

  - _order_partialy_filled_: When a user order is update because it was taken some part by another order.

  ```json
  {
  	"action": "update",
  	"type": "order_partialy_filled",
  	"data": {
  		"id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
  		"filled": 0.1,
  		"created_by": 79,
  		"side": "sell",
  		"type": "limit",
  		"size": 2,
  		"price": .2,
  		"symbol": "hex-usdt"
  	}
  }
  ```

  - _order_filled_: When a user order is taken by another other in a trade.

  ```json
  {
    "action": "update",
    "type": "order_filled",
    "data": [
      {
        "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd"
      },
      {
        "id": "bc7717d4-04e9-4430-a21b-08d32b2c34cd"
      },
      ...
    ]
  }
  ```

  - _order_updated_: When a user updates the order.

  ```json
  {
  	"type": "order_updated",
  	"data": {
  		"id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
  		"created_by": 79,
  		"price": .2,
  		"side": "sell",
  		"size": 2,
  		"type": "limit"
  	}
  }
  ```

  - _order_removed_: When a user order is taken or the user cancel the orders/orders.

  ```json
  {
    "action": "update",
    "type": "order_removed",
    "data": [
      {
        "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd"
      },
      {
        "id": "bc7717d4-04e9-4430-a21b-08d32b2c34cd"
      },
      ...
    ]
  }
  ```

  - _trade_: When a trade happens in the orderbook.

  ```json
  {
    "action": "update",
    "type": "trade",
    "data": [
      {
        "id": "1efd30b6-fcb5-44da-82c1-82d9def2ddbd",
        "side": "sell",
        "symbol": "hex-usdt",
        "size": 2,
        "price": .2,
        "timestamp": "2017-07-26T13:20:40.464Z",
        "fee": 0,
      },
      ...
    ]
  }
  ```

  - _deposit_: When a user get a deposit in his account. Status = pending or completed

  ```json
  {
  	"action": "update",
  	"type": "deposit",
  	"data": {
  		"amount": 3000,
  		"currency": "usdt",
  		"status": false
  	},
  	"balance": {
  		"usdt_balance": 0,
  		"hex_balance": 300000,
  		"updated_at": "2017-07-26T13:20:40.464Z"
  	}
  }
  ```

  - _withdrawal_: When a user performs a withdrawal in his account. Status = pending or completed

  ```json
  {
  	"action": "update",
  	"type": "withdrawal",
  	"data": {
  		"amount": 5000,
  		"currency": "hex",
  		"status": true
  	},
  	"balance": {
  		"usdt_balance": 0,
  		"hex_balance": 300000,
  		"updated_at": "2017-07-26T13:20:40.464Z"
  	}
  }
  ```

## Example

You can run the example by going to example folder and running:

```node
node example/hollaex.js
```

## Documentation

For adding additional functionalities simply go to index.js and add more features.
You can read more about api documentation at https://apidocs.hollaex.com
You should create your token on the platform in setting->api keys
