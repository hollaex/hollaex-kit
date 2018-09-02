# hollaex-node-lib
HollaEx crypto exchange nodejs library

## Usage
```node
const HollaEx = require('hollaex-node-lib');

var client = new HollaEx();
```
You can pass your Access_Token generated from the site as follows:
```node
var client = new HollaEx({accessToken: MY_ACCESS_TOKEN});
```
There is a list of functions you can call which will be added later and they are not at this point implemented yet.

### getTicker

```node
var client = new HollaEx({accessToken: MY_ACCESS_TOKEN});
client.getTicker('btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("The volume is", data.volume)
	})
	.catch(err => {
		console.log(err);
	});
```

### Websocket
You can connect and subscribe to different websocket channels for realtime updates.
```node
const socket = client.connectSocket('orderbook');
socket.on('orderbook', (data) => {
	console.log(data)
})
```
You can only subscribe to specific symbols as follows:
`orderbook:btc-eur`
Here is the list of events you can subscribe:
- orderbook
- ticker
- trades
- chart
- user (Private updates for the user such as balance, user orders etc as explained below)
- all (It subsribes to all events)

When you subscribe to private updates on user you should listen for the events as follows:

```node
const socket = client.connectSocket('user');

socket.on('userInfo', (data) => {
	console.log(data)
})
socket.on('userOrder', (data) => {
	console.log(data)
})
socket.on('userTrade', (data) => {
	console.log(data)
})
socket.on('userWallet', (data) => {
	console.log(data)
})
socket.on('userUpdate', (data) => {
	console.log(data)
})
```
`userInfo`, `userOrder`, `userTrade`, `userWallet` are only `partial` and send data once. These sockets are similar to GET requests and you should not expect any updates after you receive the first set of data. 
However `userUpdate` is what is used for all updates on user's private data.

These are list of `userUpdate` client gets after subscribtion.

  - **userUpdate**: Updates related to the user's pivate information are as follows:
    - *order_queued*: When a user order is added to the queue.
    ```json
    {
      "type": "order_queued",
      "data": {
        "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
        "created_by": 79,
        "price": 1001,
        "side": "sell",
        "size": 2,
        "type": "limit"
      }
    }
    ```
    - *order_processed*: When a user order has been processed in the queue.
    ```json
    {
      "type": "order_queued",
      "data": { "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd" },
    }
    ```
    - *order_canceled*: When a user order has been canceled in the queue, so it has not been added to the orderbook.
    ```json
    {
      "type": "order_canceled",
      "data": {
        "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
        "message": "Insufficent balance to perform the order."
      }
    }
    ```
    - *order_added*: When a user order is added to the orderbook.
    ```json
    {
      "type": "order_added",
      "data": {
        "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
        "created_by": 79,
        "price": 1001,
        "side": "sell",
        "size": 2,
        "type": "limit"
      }
    }
    ```
    - *order_partialy_filled*: When a user order is update because it was taken some part by another order.
    ```json
    {
      "type": "order_partialy_filled",
      "data": {
        "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
        "created_by": 79,
        "price": 1001,
        "side": "sell",
        "size": 2,
        "type": "limit"
      }
    }
    ```
    - *order_filled*: When a user order is taken by another other in a trade.
    ```json
    {
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
    - *order_updated*: When a user updates the order.
    ```json
    {
      "type": "order_updated",
      "data": {
        "id": "ac7717d4-04e9-4430-a21b-08d32b2c34cd",
        "created_by": 79,
        "price": 1001,
        "side": "sell",
        "size": 2,
        "type": "limit"
      }
    }
    ```
    - *order_removed*: When a user order is taken or the user cancel the orders/orders.
    ```json
    {
      "type": "order_remove",
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
    - *trade*: When a trade happens in the orderbook.
    ```json
    {
      "type": "trade",
      "data": [
        {
          "order": { "id": "1efd30b6-fcb5-44da-82c1-82d9def2ddbd", "size": 0.2 },
          "price": 999,
          "side": "sell",
          "size": 0.1,
          "fee": 0,
          "timestamp": "2017-07-26T13:20:40.464Z"          
        },
        ...
      ]
    }
    ```
    - *deposit*: When a user get a deposit in his account. Status = pending or completed
    ```json
    {
      "type": "deposit",
      "data": {
        "amount": 3000,
        "currency": "fiat",
        "status": false
      },
      "balance": {
        "fiat_balance": 0,
        "btc_balance": 300000,
        "updated_at": "2017-07-26T13:20:40.464Z"          
      }
    }
    ```
    - *withdrawal*: When a user performs a withdrawal in his account. Status = pending or completed
    ```json
    {
      "type": "withdrawal",
      "data": {
        "amount": 5000,
        "currency": "btc",
        "status": true
      },
      "balance": {
        "fiat_balance": 0,
        "btc_balance": 300000,
        "updated_at": "2017-07-26T13:20:40.464Z"          
      }
    }
    ```


## Example
You can run the example by going to example folder and running:
```node
node app.js
```

## Documentation
For adding additional functionalities simply go to index.js and add more features.
You can read more about api documentation at https://apidocs.hollaex.com
You should create your token on the platform in setting->api keys
