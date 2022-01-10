
<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">HollaEx Tools Library</h3>

  <p align="center">
    Tools Library for developing HollaEx Kit enabled Exchanges
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
  </p>
</p>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This Tools Library will only work with the [HollaEx Kit](https://github.com/bitholla/hollaex-kit).

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/bitholla/hollaex-tools-lib.git
   ```
2. Install NPM packages
   ```sh
   npm install hollaex-tools-lib
   ```



<!-- USAGE EXAMPLES -->
## Usage

### Importing Library

```javascript
const tools = require('hollaex-tools-lib');
```

### Common Functions

- getUserByEmail(email, [rawData = true], [networkData = false])
- getUserByKitId(kit_id, [rawData = true], [networkData = false])
- getUserByNetworkId(network_id, [rawData = true], [networkData = false])
- getUserTier(user_id);
- createUser(email, password, [opts = { role: 'user', id: null }])
- getKitConfig()
- getKitSecrets()
- getKitCoins()
- getKitCoinsConfig()
- getKitPairs()
- getKitPairsConfig()
- createUserOrderByKitId()


### Full list of functions

<!-- TABLE OF CONTENTS -->
- [Common Functions](####-common-functions)
- [User Functions](####-user-functions)
- [Order Functions](####-order-functions)
- [Wallet Functions](####-wallet-functions)
- [Security Functions](####-security-functions)
- [Tier Functions](####-tier-functions)
- [Database Functions](####-database-functions)

#### Common functions

- `subscribedToCoin(coin)`
  - Checks to see if the exchange is subscribed to a specific coin
  - Returns boolean value
	```javascript
	tools.subscribedToCoin('xht');
	```
- `subscribedToPair(pair)`
  - Checks to see if the exchange is subscribed to a specific pair
  - Returns boolean value
	```javascript
	tools.subscribedToPair('xht-usdt');
	```
- `getKitCoin(coin)`
  - Gets data for a specific coin
  - Returns coin object
	```javascript
	tools.getKitCoin('xht');

	/*
		{
			id: 1,
			fullname: "HollaEx",
			symbol: "xht",
			active: true,
			verified: true,
			allow_deposit: true,
			allow_withdrawal: true,
			withdrawal_fee: 0,
			min: 0.0001,
			max: 100000,
			increment_unit: 0.0001,
			created_at: "2020-02-03T10:19:10.857Z",
			updated_at: "2020-02-03T10:19:10.857Z",
			logo: null,
			code: "xht",
			is_public: true,
			meta: { },
			estimated_price: null,
			description: null,
			type: "blockchain",
			network: null,
			standard: null
		}
	*/
	```
- `getKitCoins()`
  - Gets all coins for the exchange
  - Returns array with all coins
	```javascript
	tools.getKitCoins();

	/*
		[
			'xht',
			'btc',
			'eth',
			...
		]
	*/
	```
- `getKitCoinsConfig(coin)`
  - Gets all coins and their configurations
  - Returns object with coins as keys
	```javascript
	tools.getKitCoinsConfig('xht');

	/*
		{
			usdt: {...},
			xht: {...},
			...
		}
	*/
	```
- `getKitPair(pair)`
  - Gets data for a specific pair
  - Returns pair object
	```javascript
	tools.getKitPair('xht-usdt');

	/*
		{
			id: 1,
			name: "xht-usdt",
			pair_base: "xht",
			pair_2: "usdt",
			min_size: 0.1,
			max_size: 100000,
			min_price: 0.001,
			max_price: 1000000,
			increment_size: 0.001,
			increment_price: 0.01,
			active: true,
			verified: true,
			code: "xht-usdt",
			is_public: true,
			estimated_price: null,
			created_at: "2020-02-03T10:19:10.846Z",
			updated_at: "2020-02-03T10:19:10.846Z"
		}
	*/
	```
- `getKitPairs()`
  - Gets all pairs for the exchange
  - Returns array with all pairs
	```javascript
	tools.getKitPairs();

	/*
		[
			'xht-usdt',
			'btc-usdt',
			'eth-usdt',
			...
		]
	*/
	```
- `getKitPairsConfig(pair)`
  - Gets all pairs and their configurations
  - Returns object with pairs as keys
	```javascript
	tools.getKitPairsConfig('xht-usdt');

	/*
		{
			'xht-usdt': {...},
			'btc-usdt': {...},
			...
		}
	*/
	```
- `isValidTierLevel(level)`
  - Checks to see if the exchange includes a specific tier level
  - Returns boolean value
	```javascript
	tools.isValidTierLevel(1);
	```
- `getKitTier(tier)`
  - Gets tier configurations
  - Returns object tier configurations
	```javascript
	tools.getKitTier(1);

	/*
		{
			id: 1,
			name: "basic",
			icon: "",
			description: "basic tier",
			deposit_limit: 0.1,
			withdrawal_limit: 0.1,
			fees: {
				maker: {
					xht-usdt: 1.4,
					xmr-usdt: 0.2,
					eth-usdt: 0.2,
					btc-usdt: 0.2
				},
				taker: {
					xht-usdt: 2.7,
					xmr-usdt: 0.2,
					eth-usdt: 0.2,
					btc-usdt: 0.2
				}
			},
			note: "<ul> <li>email verification</li> </ul> ",
			created_at: "2020-10-28T02:00:57.128Z",
			updated_at: "2020-11-28T05:31:30.599Z"
		}
	*/
	```
- `getKitTiers()`
  - Gets all tiers and their configurations
  - Returns object with tiers as keys
	```javascript
	tools.getKitTiers();

	/*
		{
			1: {...},
			2: {...},
			...
		}
	*/
	```
- `getKitConfig()`
  - Gets exchange configurations
  - Returns object
	```javascript
	tools.getKitConfig();

	/*
		{
		"meta": {...},
		"color": {...},
		"icons": {...},
		"links": {...},
		"title": "string",
		"captcha": {
			"site_key": ""
		},
		"strings": {...},
		"api_name": "string",
		"defaults": {
			"theme": "string",
			"language": "string"
		},
		"interface": {
			"type": "string"
		},
		"logo_image": "string",
		"description": "string",
		"native_currency": "string",
		"setup_completed": boolean,
		"valid_languages": "string",
		"new_user_is_activated": boolean,
		"info": {
			"name": "string",
			"active": boolean,
			"url": "string",
			"is_trial": boolean,
			"created_at": "string",
			"expiry": "string",
			"status": boolean,
			"initialized": boolean
		}
	}
	*/
	```
- `getKitSecrets()`
  - Gets exchange configuration secrets
  - Returns object
	```javascript
	tools.getKitSecrets();

	/*
		{
			"smtp": {...},
			"emails": {...},
			"captcha": {...},
			"security": {...},
			"admin_whitelist": [],
			"allowed_domains": []
		}
	*/
	```
- `getFrozenUsers()`
  - Gets exchange's frozen users
  - Returns object with user IDs as keys
	```javascript
	tools.getFrozenUsers();

	/*
		{
			'4': true,
			'7': true,
			...
		}
	*/
	```
- `updateKitConfigSecrets(data = {}, scopes = [])`
  - Updates exchange configurations and secrets
  - Scopes is the scope of the user making this action in an array
  - Returns promise with newly update kit and secrets
	```javascript
	tools.updateKitConfigSecrets(
		{
			kit: {
				defaults: {
					theme: 'dark',
					language: 'en'
				}
			},
			secrets: {
				allowed_domains: [
					'https://google.com'
				]
			}
		},
		['admin']
	)
		.then((data) => {
			/*
				{
					"kit": {
						"meta": {...},
						"color": {...},
						"icons": {...},
						"links": {...},
						"title": "",
						"captcha": {...},
						"strings": {...},
						"api_name": "hollaex-kit",
						"defaults": {
							"theme": "dark",
							"language": "en"
						},
						"interface": {...},
						"description": "",
						"valid_languages": "",
						"new_user_is_activated": true
					},
					"secrets": {
						"smtp": {...},
						"broker": {...},
						"emails": {...},
						"captcha": {...},
						"security": {...},
						"admin_whitelist": [],
						"allowed_domains": ['https://google.com'],
						"setup_completed": false,
						"exchange_credentials_set": true
					}
				}
			*/
		});
	```
- `sendEmailToSupport(email, category, subject, description)`
  - Send an email to support account of exchange
  - Returns promise
	```javascript
	tools.sendEmailToSupport(
		'person@bitholla.com',
		'support',
		'Support Requested',
		'Need support'
	)
		.then((data) => {
			///continue
		});
	```
- `getNetworkKeySecret()`
  - Get network key and secret for exchange
  - Returns promise with apiKey and apiSecret
	```javascript
	tools.getNetworkKeySecret()
		.then((data) => {
			/*
				{
					apiKey: "",
					apiSecret: ""
				}
			*/
		});
	```
- `getAssetsPrices(assets = [] [,quote, amount])`
  - Get converted asset prices
  - Returns promise with converted asset prices
	```javascript
	tools.getAssetsPrices(['xht', 'btc'], 'usdt', 1)
		.then((data) => {
			/*
				{
					btc: 20000,
					xht: 0.10
				}
			*/
		});
	```
- `sendEmail(type, receiver, data, userSettings = {}, domain)`
  - Sends an email
  - Returns resolved promise after sending the email
	```javascript
	tools.sendEmail(
		'login',
		'person@bitholla.com',
		{
			date: '',
			time: '',
			device: ''
		}
		{ language: 'en' },
		'https://bitholla.com'
	)
		.then((data) => {
			//continue
		});
	```
- `getTicker(symbol)`
  - Get ticker data for a symbol
  - Returns promise with ticker info
	```javascript
	tools.getTicker('xht-usdt')
		.then((data) => {
			/*
				{
					"open": 0,
					"close": 0,
					"high": 0,
					"low": 0,
					"last": 0,
					"volume": 0
				}
			*/
		});
	```
- `getTickers()`
  - Get ticker data for all symbols
  - Returns promise with tickers info
	```javascript
	tools.getTicker('xht-usdt')
		.then((data) => {
			/*
				{
					"xht-usdt": {...},
					"btc-usdt": {...},
					...
				}
			*/
		});
	```
- `getOrderbook(symbol)`
  - Get top orderbook data for a symbol
  - Returns promise with orderbook info
	```javascript
	tools.getOrderbook('xht-usdt')
		.then((data) => {
			/*
				{
					"xht-usdt": {
						"bids": [...],
						"asks": [...],
						"timestamp": "2020-12-18T01:48:06.559Z"
					}
				}
			*/
		});
	```
- `getOrderbooks()`
  - Get top orderbook data for all symbols
  - Returns promise with orderbook info
	```javascript
	tools.getOrderbook()
		.then((data) => {
			/*
				{
					"xht-usdt": {...},
					"btc-usdt": {...},
					...
				}
			*/
		});
	```
- `getPublicTrades([symbol])`
  - Get public trades data
  - Pass symbol to get all trades data
  - Returns promise with trades info
	```javascript
	tools.getPublicTrades()
		.then((data) => {
			/*
				{
					"xht-usdt": [
						{
							"size": 0.1,
							"price": 20,
							"timestamp": "2020-12-15T06:45:27.450Z",
							"side": "buy"
						},
						...
					],
					"btc-usdt": [
						{
							"size": 0.1,
							"price": 20000,
							"timestamp": "2020-12-15T06:45:27.450Z",
							"side": "buy"
						},
						...
					],
					...
				}
			*/
		});
	```
- `getChart(from, to, symbol, resolution)`
  - Get chart data from network
  - Returns promise with chart data
	```javascript
	tools.getEngineChart(1605668071, 1608260132, 'btc-usdt', 'D')
		.then((data) => {
			/*
				[
					{
						time: "2020-11-19T00:00:00.000Z",
						close: 17811.9,
						high: 18130.15,
						low: 17349.75,
						open: 17776.75,
						symbol: "btc-usdt",
						volume: 116.2818
					},
					...
				]
			*/
		});
	```
- `getCharts(from, to, resolution)`
  - Get chart data from network for all symbols
  - Returns promise with chart data
	```javascript
	tools.getEngineCharts(1605668071, 1608260132, 'D')
		.then((data) => {
			/*
				{
					'xht-usdt': [...],
					'btc-usdt': [...],
					...
				}
			*/
		});
	```
- `getUdfConfig()`
  - Get udf configuration for chart on network
  - Returns promise with config data
	```javascript
	tools.getUdfConfig()
		.then((data) => {
			/*
				{
					"supported_resolutions": [
						"60",
						"1D"
					],
					"supports_group_request": false,
					"supports_marks": false,
					"supports_search": true,
					"supports_timescale_marks": false
				}
			*/
		});
	```
- `getUdfHistory()`
  - Get udf configuration for chart on network
  - Returns promise with data
	```javascript
	tools.getUdfConfig()
		.then((data) => {
			/*
				{
					c: [..],
					h: [...],
					l: [...],
					o: [...],
					t: [...],
					v: [...],
					s: "ok"
				}
			*/
		});
	```
- `getUdfSymbols('xht-usdt')`
  - Get udf symbol chart data
  - Returns promise with data
	```javascript
	tools.getUdfSymbols('xht-usdt')
		.then((data) => {
			/*
				{
					"name": "HollaEx:XHT-USDT",
					"ticker": "xht-usdt",
					"exchange": "HollaEx",
					"has_intraday": true,
					"has_daily": true,
					"has_weekly_and_monthly": true,
					"session": "24x7",
					"regular_session": "24x7",
					"pricescale": 1,
					"volume_precision": 2,
					"has_empty_bars": true
				}
			*/
		});
	```

#### User functions

- `signUpUser(email, password, [opts = { referral: null }])`
  - Signup new user using bitHolla's signup flow
  - Will send email to user asking for verification
  - Returns promise with sequelize object of user data
	```javascript
	tools.user.signUpUser('newuser@bitholla.com', 'password', { referral: 'code' })
		.then((data) => {
			/*
				data = User Data
			*/
		});
	```
- `verifyUser(email, code)`
  - Verify new user to allow access to exchange
  - Code is the verification code sent via email to user after signup
  - Will create the verified user on HollaEx Network
  - Returns promise with sequelize object of user data
	```javascript
	tools.user.verifyUser('newuser@bitholla.com', 'code')
		.then((data) => {
			/*
				data = User Data
			*/
		});
	```
- `getVerificationCodeByUserEmail(email)`
  - Get verification code for a user by email
  - Returns promise with sequelize object of verification code
	```javascript
	tools.user.getVerificationCodeByUserEmail('newuser@bitholla.com')
		.then((data) => {
			/*
				{
					id: 1,
					code: 'code',
					verified: false',
					user_id: 99
				}
			*/
		});
	```
- `getVerificationCodeByUserId(user_id)`
  - Get verification code for a user by id
  - Returns promise with sequelize object of verification code
	```javascript
	tools.user.getVerificationCodeByUserId(99)
		.then((data) => {
			/*
				{
					id: 1,
					code: 'code',
					verified: false',
					user_id: 99
				}
			*/
		});
	```
- `getUserEmailByVerificationCode(code)`
  - Get user email by verification code
  - Returns promise with user email
	```javascript
	tools.user.getUserEmailByVerificationCode('code')
		.then((data) => {
			// data = User email
		});
	```
- `createUser(email, password, [opts = { role: 'user', id: null }])`
  - Create a new user on both your exchange and the HollaEx Network
  - All in one function that both signs up a new user, verifies the user, and creates the user on the Network
  - `role` is the role you want to assign the user, `id` is the id of the user
  - Returns promise resolve
	```javascript
	tools.user.createUser('newuser@bitholla.com', 'password', { role: 'admin', id: 99 })
		.then((data) => {
			// continue
		});
	```
- `createUserOnNetwork(email)`
  - Create a new user on the HollaEx Network
  - Returns promise with new user
	```javascript
	tools.user.createUserOnNetwork('newuser@bitholla.com')
		.then((data) => {
			/*
				data = User Network Data
			*/
		});
	```
- `loginUser(email, password, otp_code, captcha, [ip, device, domain, origin, referer])`
  - Login user using bitHolla's login flow
  - Returns promise with user data
	```javascript
	tools.user.loginUser('newuser@bitholla.com', 'password', 'otp_code', 'captcha')
		.then((data) => {
			/*
				data = User Data
			*/
		});
	```
- `registerUserLogin(userId, ip, [otps = { device: null, domain: null, origin: null, referer: null }])`
  - Register a user's login
  - Returns promise with login data
	```javascript
	tools.user.registerUserLogin(
		99,
		'192.168.1.1',
		{
			device: 'PostmanRuntime/7.26.8',
			domain: 'http://localhost:3000',
			origin: 'origin',
			referer: 'referer'
		}
	)
		.then((data) => {
			/*
				{
					"ip": "192.168.1.1",
					"device": "PostmanRuntime/7.26.8",
					"domain": "http://localhost:3000",
					"timestamp": "2020-12-18T02:00:18.153Z",
					"user_id": 99
				}
			*/
		});
	```
- `checkAffiliation(affilicationCode, user_id)`
  - Checks validity of affilication code
  - Returns promise sequelize object of user data that used affiliation code
	```javascript
	tools.user.checkAffiliation('code', 99)
		.then((data) => {
			/*
				data = User data
			*/
		});
	```
- `getAffiliationCount(userId)`
  - Get number of affiliations user has
  - Returns promise with count
	```javascript
	tools.user.getAffiliationCount(99)
		.then((data) => {
			/*
				{
					count: 1
				}
			*/
		});
	```
- `getAllUsers()`
  - Gets all user in exchange
  - Returns promise with users data
	```javascript
	tools.user.getAllUsers()
		.then((data) => {
			/*
				[
					{...},
					...
				]
			*/
		});
	```
- `getAllUsersAdmin([opts = { id, search, pending, limit, page, order_by, order, start_date, end_date, format}])`
  - Gets paginated list of user data in exchange
  - `id` = id of user to get
  - `search` = gets user with email or username or full_name that matches this value
  - `pending` = gets users with pending verification values
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - `format` = pass `csv` to get csv file
  - Returns promise with users data
	```javascript
	tools.user.getAllUsersAdmin()
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getUserByEmail(email, rawData = true, networkData = false)`
  - Gets a user's data by email
  - `rawData` = Only get raw data (not sequelize object)
  - `networkData` = Include network data (balance, etc.)
  - Returns promise with user data
	```javascript
	tools.user.getUserByEmail('person@bitholla.com', true, true)
		.then((data) => {
			/*
				{
					"id": 1,
					"email": "person@bitholla.com",
					"full_name": "",
					"gender": false,
					"nationality": "",
					"dob": null,
					"phone_number": "",
					"address": {...},
					"id_data": {...},
					"bank_account": [...],
					"crypto_wallet": {...},
					"verification_level": 1,
					"otp_enabled": false,
					"activated": false,
					"note": "",
					"username": "person",
					"affiliation_code": "code",
					"settings": {
						"chat": {
							"set_username": false
						},
						"risk": {
							"order_portfolio_percentage": 90
						},
						"audio": {
							"public_trade": false,
							"order_completed": true,
							"order_partially_completed": true
						},
						"language": "en",
						"interface": {
							"theme": "dark",
							"order_book_levels": 10
						},
						"notification": {
							"popup_order_completed": true,
							"popup_order_confirmation": true,
							"popup_order_partially_filled": true
						}
					},
					"flagged": false,
					"affiliation_rate": 0,
					"network_id": 1,
					"created_at": "2020-12-18T02:00:06.998Z",
					"updated_at": "2020-12-18T02:00:37.715Z"
				}
			*/
		});
	```
- `getUserByKitId(kit_id, rawData = true, networkData = false)`
  - Gets a user's data by kit (exchange) id
  - `rawData` = Only get raw data (not sequelize object)
  - `networkData` = Include network data (balance, etc.)
  - Returns promise with user data
	```javascript
	tools.user.getUserByKitId(1)
		.then((data) => {
			/*
				{
					"id": 1,
					"email": "person@bitholla.com",
					"full_name": "",
					"gender": false,
					"nationality": "",
			getUserEmailByVerificationCode		"dob": null,
					"phone_number": "",
					"address": {...},
					"id_data": {...},
					"bank_account": [...],
					"crypto_wallet": {...},
					"verification_level": 1,
					"otp_enabled": false,
					"activated": false,
					"note": "",
					"username": "person",
					"affiliation_code": "code",
					"settings": {
						"chat": {
							"set_username": false
						},
						"risk": {
							"order_portfolio_percentage": 90
						},
						"audio": {
							"public_trade": false,
							"order_completed": true,
							"order_partially_completed": true
						},
						"language": "en",
						"interface": {
							"theme": "dark",
							"order_book_levels": 10
						},
						"notification": {
							"popup_order_completed": true,
							"popup_order_confirmation": true,
							"popup_order_partially_filled": true
						}
					},
					"flagged": false,
					"affiliation_rate": 0,
					"network_id": 1,
					"created_at": "2020-12-18T02:00:06.998Z",
					"updated_at": "2020-12-18T02:00:37.715Z"
				}
			*/
		});
	```
- `getUserByNetworkId(network_id, rawData = true, networkData = false)`
  - Gets a user's data by HollaEx Network Id
  - `rawData` = Only get raw data (not sequelize object)
  - `networkData` = Include network data (balance, etc.)
  - Returns promise with user data
	```javascript
	tools.user.getUserByNetworkId(1)
		.then((data) => {
			/*
				{
					"id": 1,
					"email": "person@bitholla.com",
					"full_name": "",
					"gender": false,
					"nationality": "",
					"dob": null,
					"phone_number": "",
					"address": {...},
					"id_data": {...},
					"bank_account": [...],
					"crypto_wallet": {...},
					"verification_level": 1,
					"otp_enabled": false,
					"activated": false,
					"note": "",
					"username": "person",
					"affiliation_code": "code",
					"settings": {
						"chat": {
							"set_username": false
						},
						"risk": {
							"order_portfolio_percentage": 90
						},
						"audio": {
							"public_trade": false,
							"order_completed": true,
							"order_partially_completed": true
						},
						"language": "en",
						"interface": {
							"theme": "dark",
							"order_book_levels": 10
						},
						"notification": {
							"popup_order_completed": true,
							"popup_order_confirmation": true,
							"popup_order_partially_filled": true
						}
					},
					"flagged": false,
					"affiliation_rate": 0,
					"network_id": 1,
					"created_at": "2020-12-18T02:00:06.998Z",
					"updated_at": "2020-12-18T02:00:37.715Z"
				}
			*/
		});
	```
- `getUserNetwork(network_id)`
  - Gets user's Network data
  - Returns promise with user data
	```javascript
	tools.user.getUserByNetworkId(1)
		.then((data) => {
			/*
				{
					id: 1,
					email: 'person@bitholla.com',
					crypto_wallet: {...}
				}
			*/
		});
	```
- `getUsersNetwork()`
  - Gets network data for all of your exchange's users
  - Returns promise with user data
	```javascript
	tools.user.getUserByNetworkId(1)
		.then((data) => {
			/*
				{
					count: 6,
					data: [
						{...},
						...
					]
				}
			*/
		});
	```
- `getUserTier(user_id)`
  - Gets tier info for a user's tier
  - Returns promise with tier data
	```javascript
	tools.user.getUserTier(1)
		.then((data) => {
			/*
				{
					"id": 1,
					"name": "tester",
					"icon": "",
					"description": "tester level",
					"deposit_limit": 0,
					"withdrawal_limit": 0,
					"fees": {
						"maker": {
							"xht-usdt": 0.2
						},
						"taker": {
							"xht-usdt": 0.2
						}
					},
					"note": "",
					"created_at": "2020-12-10T05:18:19.931Z",
					"updated_at": "2020-12-10T06:06:02.358Z"
				}
			*/
		});
	```
- `freezeUserById(user_id)`
  - Freeze a user's account by kit id
  - Returns promise with sequelize object of user data
	```javascript
	tools.user.freezeUserById(1)
		.then((data) => {
			// data = User data
		});
	```
- `freezeUserByEmail(email)`
  - Freeze a user's account by email
  - Returns promise with sequelize object of user data
	```javascript
	tools.user.freezeUserByEmail('person@bitholla.com')
		.then((data) => {
			// data = User data
		});
	```
- `unfreezeUserById(user_id)`
  - Unfreeze a user's account by kit id
  - Returns promise with sequelize object of user data
	```javascript
	tools.user.unfreezeUserById(1)
		.then((data) => {
			// data = User data
		});
	```
- `unfreezeUserByEmail(email)`
  - Unfreeze a user's account by email
  - Returns promise with sequelize object of user data
	```javascript
	tools.user.unfreezeUserByEmail('person@bitholla.com')
		.then((data) => {
			// data = User data
		});
	```
- `getUserRole(userOpts = {})`
  - Get user role
  - `userOpts`= Pass either kit_id, network_id, or email
  - Returns promise with user's role
	```javascript
	tools.user.getUserRole({ email: 'person@bitholla.com' })
		.then((data) => {
			// data = User role ('admin', 'user', etc.)
		});
	```
- `updateUserRole(user_id, role)`
  - Update a user's role by id
  - Returns promise with user data
	```javascript
	tools.user.updateUserRole(99, 'user')
		.then((data) => {
			/*
				{
					"id": 99,
					"email": 'person@bitholla.com'
					"is_admin": false,
					"is_support": false,
					"is_kyc": false,
					"is_supervisor": false,
					"is_communicator": false
				}
			*/
		});
	```
- `updateUserSettings(userOpts = {}, settings = {})`
  - Update a user's settings
  - `userOpts`= Pass either kit_id, network_id, or email
  - `settings` = New settings data
  - Returns promise with user's role
	```javascript
	tools.user.updateUserSettings(
		{
			email: 'person@bitholla.com'
		},
		{
			language: 'ko'
		}
	)
		.then((data) => {
			// data = User data
		});
	```
- `updateUserNote(userId, note)`
  - Update a user's note
  - Returns promise with user data
	```javascript
	tools.user.updateUserSettings(99, 'id is 99')
		.then((data) => {
			// data = User data
		});
	```
- `changeUserVerificationLevelById(userId, newLevel)`
  - Update a user's verification level (tier level)
  - Returns promise resolve
	```javascript
	tools.user.changeUserVerificationLevelById(99, 3)
		.then((data) => {
			//continue
		});
	```
- `deactivateUserOtpById(userId)`
  - Deactivate user otp by kit id
  - Returns promise with user data
	```javascript
	tools.user.deactivateUserOtpById(99)
		.then((data) => {
			// data = User data
		});
	```
- `toggleFlaggedUserById(userId)`
  - Toggle flag value for user
  - Returns promise with user data
	```javascript
	tools.user.toggleFlaggedUserById(99)
		.then((data) => {
			// data = User data
		});
	```
- `getUserLogins([opts = { userid, limit, page, order_by, order, start_date, end_date, format}])`
  - Gets paginated list of user logins in exchange
  - `userid` = id of user to get
  - `search` = gets user with email or username or full_name that matches this value
  - `pending` = gets users with pending verification values
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - `format` = pass `csv` to get csv file
  - Returns promise with users data
	```javascript
	tools.user.getUserLogins()
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `createAudit(adminId, event, ip, [opts = { userId, prevUserData, newUserData, domain }])`
  - Create audit for a user
  - Returns promise with audit data
	```javascript
	tools.user.createAudit(1, 'bank update', 127.0.0.1, {
		userId: 99,
		prevUserData: {
			// bank data before
		},
		newUserData: {
			// bank data before
		},
		domain: 'https://google.com'
	})
		.then((data) => {
			/*
				{
					admin_id: 1
					description: {
						note: "0.4 eth",
						old: {...},
						new: {...}
					}
					note: "0.4 eth"
					user_id: 99
					domain: "https://google.com"
					event: "bank update"
					id: 1
					ip: "127.0.0.1"
					timestamp: "2020-06-30T06:07:08.328Z"
				}
			*/
		});
	```
- `getUserAudits([opts = { userid, limit, page, order_by, order, start_date, end_date, format}])`
  - Gets paginated list of user audits in exchange
  - `userid` = id of user to get
  - `search` = gets user with email or username or full_name that matches this value
  - `pending` = gets users with pending verification values
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - `format` = pass `csv` to get csv file
  - Returns promise with users data
	```javascript
	tools.user.getUserAudits()
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `setUsernameById(userId, username)`
  - Set username for a user
  - Returns promise with sequelize object of user data
	```javascript
	tools.user.setUsernameById(99, 'myUsername')
		.then((data) => {
			// data = User data
		});
	```
- `createUserCryptoAddressByNetworkId(networkId, crypto)`
  - Create user crypto address by network id
  - Returns promise with new address
	```javascript
	tools.user.createUserCryptoAddressByNetworkId(1, 'xht')
		.then((data) => {
			/*
				{
					message: 'Address created successfully',
					address: 'address',
					crypto: 'xht'
				}
			*/
		});
	```
- `createUserCryptoAddressByKitId(kitId, crypto)`
  - Create user crypto address by kit id
  - Returns promise with new address
	```javascript
	tools.user.createUserCryptoAddressByKitId(99, 'xht')
		.then((data) => {
			/*
				{
					message: 'Address created successfully',
					address: 'address',
					crypto: 'xht'
				}
			*/
		});
	```
- `getUserStatsByKitId(userId)`
  - Create user stats by kit id
  - Returns promise with user stats
	```javascript
	tools.user.getUserStatsByKitId(99)
		.then((data) => {
			/*
				{
					data: {
						'1': {
							month: '1',
							symbol: 'xht-usdt',
							volume: 0
						},
						...
					},
					updatedAt: '2020-12-18T04:33:52.370Z'
				}
			*/
		});
	```
- `getUserStatsByNetworkId(networkId)`
  - Create user stats by network id
  - Returns promise with user stats
	```javascript
	tools.user.getUserStatsByNetworkId(1)
		.then((data) => {
			/*
				{
					data: {
						'1': {
							month: '1',
							symbol: 'xht-usdt',
							volume: 0
						},
						...
					},
					updatedAt: '2020-12-18T04:33:52.370Z'
				}
			*/
		});
	``
- `getExchangeOperators([opts = {limit, page, order_by, order}])`
  - Gets paginated list of exchange operators (admin, supervisor, support, communicator, kyc)
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - Returns promise with users data
	```javascript
	tools.user.getExchangeOperators()
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `inviteExchangeOperator(invitingEmail, email, role)`
  - Invite a user to your exchange as an operator
  - Will create a new user if there is no user with `email`
  - Sends email to invited user
  - `invitingEmail` = user inviting operator
  - `email` = user being invited
  - `role` = Role to invlue user as
  - Returns promise resolve
	```javascript
	tools.user.inviteExchangeOperator('person@bitholla.com', 'newop@bitholla.com', 'admin')
		.then((data) => {
			//continue
		});
	```

#### Order functions

- `createUserOrderByKitId(userId, symbol, side, size, type, price)`
  - Create an order for a user by kit id
  - Returns promise with new order
	```javascript
	tools.order.createUserOrderByKitId(
		99,
		'xht-usdt',
		'buy',
		1,
		'limit',
		0.1
	)
		.then((data) => {
			/*
				{
					meta: {},
					symbol: 'xht-usdt',
					side: 'buy',
					size: 1,
					type: 'limit',
					price: 0.1,
					fee_structure: { maker: 0, taker: 0 },
					fee_coin: 'xht',
					id: 'orderid',
					created_by: 1,
					filled: 0,
					status: 'new',
					fee: 0,
					updated_at: '2020-12-18T04:52:56.780Z',
					created_at: '2020-12-18T04:52:56.780Z',
					stop: null
				}
			*/
		});
	```
- `createUserOrderByEmail(email, symbol, side, size, type, price)`
  - Create an order for a user by email
  - Returns promise with new order
	```javascript
	tools.order.createUserOrderByKitId(
		'person@bitholla.com',
		'xht-usdt',
		'buy',
		1,
		'limit',
		0.1
	)
		.then((data) => {
			/*
				{
					meta: {},
					symbol: 'xht-usdt',
					side: 'buy',
					size: 1,
					type: 'limit',
					price: 0.1,
					fee_structure: { maker: 0, taker: 0 },
					fee_coin: 'xht',
					id: 'orderid',
					created_by: 1,
					filled: 0,
					status: 'new',
					fee: 0,
					updated_at: '2020-12-18T04:52:56.780Z',
					created_at: '2020-12-18T04:52:56.780Z',
					stop: null
				}
			*/
		});
	```
- `createUserOrderByNetworkId(networkId, symbol, side, size, type, price)`
  - Create an order for a user by network id
  - Returns promise with new order
	```javascript
	tools.order.createUserOrderByNetworkId(
		1,
		'xht-usdt',
		'buy',
		1,
		'limit',
		0.1
	)
		.then((data) => {
			/*
				{
					meta: {},
					symbol: 'xht-usdt',
					side: 'buy',
					size: 1,
					type: 'limit',
					price: 0.1,
					fee_structure: { maker: 0, taker: 0 },
					fee_coin: 'xht',
					id: 'orderid',
					created_by: 1,
					filled: 0,
					status: 'new',
					fee: 0,
					updated_at: '2020-12-18T04:52:56.780Z',
					created_at: '2020-12-18T04:52:56.780Z',
					stop: null
				}
			*/
		});
	```
- `cancelUserOrderByKitId(userId, orderId)`
  - Cancel an order for a user by kit id
  - Returns promise with canceled order
	```javascript
	tools.order.cancelUserOrderByKitId(99, 'id')
		.then((data) => {
			/*
				{
					meta: {},
					symbol: 'xht-usdt',
					side: 'buy',
					size: 1,
					type: 'limit',
					price: 0.1,
					fee_structure: { maker: 0, taker: 0 },
					fee_coin: 'xht',
					id: 'orderid',
					created_by: 1,
					filled: 0,
					status: 'canceled',
					fee: 0,
					updated_at: '2020-12-18T04:52:56.780Z',
					created_at: '2020-12-18T04:52:56.780Z',
					stop: null
				}
			*/
		});
	```
- `cancelUserOrderByEmail(email, orderId)`
  - Cancel an order for a user by email
  - Returns promise with canceled order
	```javascript
	tools.order.cancelUserOrderByEmail('person@bitholla.com', 'id')
		.then((data) => {
			/*
				{
					meta: {},
					symbol: 'xht-usdt',
					side: 'buy',
					size: 1,
					type: 'limit',
					price: 0.1,
					fee_structure: { maker: 0, taker: 0 },
					fee_coin: 'xht',
					id: 'orderid',
					created_by: 1,
					filled: 0,
					status: 'canceled',
					fee: 0,
					updated_at: '2020-12-18T04:52:56.780Z',
					created_at: '2020-12-18T04:52:56.780Z',
					stop: null
				}
			*/
		});
	```
- `cancelUserOrderByNetworkId(networkId, orderId)`
  - Cancel an order for a user by network id
  - Returns promise with canceled order
	```javascript
	tools.order.cancelUserOrderByNetworkId(1, 'id')
		.then((data) => {
			/*
				{
					meta: {},
					symbol: 'xht-usdt',
					side: 'buy',
					size: 1,
					type: 'limit',
					price: 0.1,
					fee_structure: { maker: 0, taker: 0 },
					fee_coin: 'xht',
					id: 'orderid',
					created_by: 1,
					filled: 0,
					status: 'canceled',
					fee: 0,
					updated_at: '2020-12-18T04:52:56.780Z',
					created_at: '2020-12-18T04:52:56.780Z',
					stop: null
				}
			*/
		});
	```
- `cancelAllUserOrdersByKitId(userId, [symbol])`
  - Cancel all orders for a user by kit id
  - Returns promise with array of canceled orders
	```javascript
	tools.order.cancelAllUserOrdersByKitId(99, 'xht-usdt')
		.then((data) => {
			/*
				[
					{...},
					{...},
					...
				]
			*/
		});
	```
- `cancelAllUserOrdersByEmail(email, [symbol])`
  - Cancel all orders for a user by email
  - Returns promise with array of canceled orders
	```javascript
	tools.order.cancelAllUserOrdersByEmail('person@bitholla.com', 'xht-usdt')
		.then((data) => {
			/*
				[
					{...},
					{...},
					...
				]
			*/
		});
	```
- `cancelAllUserOrdersByNetworkId(networkId, [symbol])`
  - Cancel all orders for a user by network id
  - Returns promise with array of canceled orders
	```javascript
	tools.order.cancelAllUserOrdersByNetworkId(1, 'xht-usdt')
		.then((data) => {
			/*
				[
					{...},
					{...},
					...
				]
			*/
		});
	```
- `getUserOrderByKitId(userId, orderid)`
  - Get an order for a user by kit id
  - Returns promise with order data
	```javascript
	tools.order.getUserOrderByKitId(99, 'orderId')
		.then((data) => {
			// data = Order data
		});
	```
- `getUserOrderByEmail(email, orderid)`
  - Get an order for a user by email
  - Returns promise with order data
	```javascript
	tools.order.getUserOrderByEmail('person@bitholla.com', 'orderId')
		.then((data) => {
			// data = Order data
		});
	```
- `getUserOrderByNetworkId(networkId, orderid)`
  - Get an order for a user by network id
  - Returns promise with order data
	```javascript
	tools.order.getUserOrderByNetworkId(1, 'orderId')
		.then((data) => {
			// data = Order data
		});
	```
- `getAllExchangeOrders([symbol, side, status, open, limit, page, order_by, order, start_date, end_date])`
  - Gets paginated list of all orders on exchange
  - `symbol` = Filter orders by symbol
  - `side` = Filter orders by side
  - `status` = Filter orders by status
  - `open` = Filter orders by open/close
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - Returns promise with orders data
	```javascript
	tools.order.getAllExchangeOrders()
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getAllUserOrdersByKitId(userId [, symbol, side, status, open, limit, page, order_by, order, start_date, end_date])`
  - Gets paginated list of all orders for a user by kit id
  - `symbol` = Filter orders by symbol
  - `side` = Filter orders by side
  - `status` = Filter orders by status
  - `open` = Filter orders by open/close
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - Returns promise with orders data
	```javascript
	tools.order.getAllUserOrdersByKitId(99)
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getAllUserOrdersByEmail(email [, symbol, side, status, open, limit, page, order_by, order, start_date, end_date])`
  - Gets paginated list of all orders for a user by email
  - `symbol` = Filter orders by symbol
  - `side` = Filter orders by side
  - `status` = Filter orders by status
  - `open` = Filter orders by open/close
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - Returns promise with orders data
	```javascript
	tools.order.getAllUserOrdersByEmail('person@bitholla.com')
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getAllUserOrdersByNetworkId(networkId [, symbol, side, status, open, limit, page, order_by, order, start_date, end_date])`
  - Gets paginated list of all orders for a user by network id
  - `symbol` = Filter orders by symbol
  - `side` = Filter orders by side
  - `status` = Filter orders by status
  - `open` = Filter orders by open/close
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - Returns promise with orders data
	```javascript
	tools.order.getAllUserOrdersByNetworkId(1)
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getAllTradesNetwork([symbol, limit, page, order_by, order, start_date, end_date, format])`
  - Gets paginated list of all trades on exchange
  - `symbol` = Filter orders by symbol
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - `format` = pass `csv` to get csv file
  - Returns promise with trades data
	```javascript
	tools.order.getAllTradesNetwork()
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getAllUserTradesByKitId(userId [, symbol, limit, page, order_by, order, start_date, end_date, format])`
  - Gets paginated list of user's trades on exchange by kit id
  - `symbol` = Filter orders by symbol
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - `format` = pass `csv` to get csv file
  - Returns promise with trades data
	```javascript
	tools.order.getAllUserTradesByKitId(99)
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getAllUserTradesByEmail(email [, symbol, limit, page, order_by, order, start_date, end_date, format])`
  - Gets paginated list of user's trades on exchange by email
  - `symbol` = Filter orders by symbol
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - `format` = pass `csv` to get csv file
  - Returns promise with trades data
	```javascript
	tools.order.getAllUserTradesByEmail('person@bitholla.com')
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getAllUserTradesByNetwork(networkId [, symbol, limit, page, order_by, order, start_date, end_date, format])`
  - Gets paginated list of user's trades on exchange by network id
  - `symbol` = Filter orders by symbol
  - `limit` = limit of page
  - `page` = page number`
  - `order_by` = value to order list by
  - `order` = asc or desc
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - `format` = pass `csv` to get csv file
  - Returns promise with trades data
	```javascript
	tools.order.getAllUserTradesByNetwork(1)
		.then((data) => {
			/*
				{
					"count": 2,
					"data": [
						{...},
						{...}
					]
				}
			*/
		});
	```
- `getGeneratedFees([limit, page, start_date, end_date])`
  - Gets paginated list of exchange's generated fees
  - `limit` = limit of page
  - `page` = page number`
  - `start_date` = get users created after this date
  - `end_date` = get users created before this date
  - Returns promise with fees data
	```javascript
	tools.order.getGeneratedFees()
		.then((data) => {
			/*
				{
					"count": 2,
					"data": {
						...
					}
				}
			*/
		});
	```

#### Wallet functions

- `getUserBalanceByKitId(userid)`
  - Gets user balance by kit id
  - Returns promise with user balance
	```javascript
	tools.wallet.getUserBalanceByKitId(99)
		.then((data) => {
			/*
				{
					updated_at: '2020-12-18T05:00:30.306Z',
					xht_balance: 1,
					xht_available: 1,
					usdt_balance: 1,
					usdt_available: 1,
					btc_balance: 1,
					btc_available: 1,
					...
				}
			*/
		});
	```
- `getUserBalanceByNetworkId(networkId)`
  - Gets user balance by networkd id
  - Returns promise with user balance
	```javascript
	tools.wallet.getUserBalanceByNetworkId(1)
		.then((data) => {
			/*
				{
					updated_at: '2020-12-18T05:00:30.306Z',
					xht_balance: 1,
					xht_available: 1,
					usdt_balance: 1,
					usdt_available: 1,
					btc_balance: 1,
					btc_available: 1,
					...
				}
			*/
		});
	```
- `getKitBalance()`
  - Gets exchange's total balance
  - Returns promise with balance
	```javascript
	tools.wallet.getKitBalance()
		.then((data) => {
			/*
				{
					updated_at: '2020-12-18T05:00:30.306Z',
					xht_balance: 1,
					xht_available: 1,
					usdt_balance: 1,
					usdt_available: 1,
					btc_balance: 1,
					btc_available: 1,
					...
				}
			*/
		});
	```
- `sendRequestWithdrawalEmail(userId, address, amount, currency [, otpCode, ip, domain])`
  - Send a user a withdrawal confirmation email
  - Returns promise resolve after sending email
	```javascript
	tools.wallet.sendRequestWithdrawalEmail(99, 'crypto_address', 0.1, 'xht')
		.then((data) => {
			//continue
		});
	```
- `validateWithdrawalToken(token)`
  - Validate withdrawal token
  - Returns promise with withdrawal data
	```javascript
	tools.wallet.validateWithdrawalToken('token')
		.then((data) => {
			/*
				{
					"id": 1,
					"txid": "string",
					"currency": "xht",
					"amount": 0.0001,
					"type": "withdrawal",
					"is_confirmed": true,
					"fee": 0.000001,
					"status": "pending"
					"user_id": 1
					"updated_at": "2019-10-07T01:44:57.968Z",
					"created_at": "2019-10-07T01:44:57.968Z"
				}
			*/
		});
	```
- `performWithdrawal(userId, address, currency, amount, fee)`
  - Perform a withdrawal on the network
  - Will check tier level for withdrawal limit
  - Returns promise with withdrawal data
	```javascript
	tools.wallet.performWithdrawal(99, 'address', 'xht', 1, 0.1)
		.then((data) => {
			// data = Withdrawal data
		});
	```
- `cancelUserWithdrawalByKitId(userId, withdrawalId)`
  - Cancel a withdrawal for a user by kit id
  - Returns promise with canceled withdrawal data
	```javascript
	tools.wallet.cancelUserWithdrawalByKitId(99, 'txid')
		.then((data) => {
			// data = Withdrawal data
		});
	```
- `cancelUserWithdrawalByNetworkId(userId, withdrawalId)`
  - Cancel a withdrawal for a user by network id
  - Returns promise with canceled withdrawal data
	```javascript
	tools.wallet.cancelUserWithdrawalByNetworkId(1, 'txid')
		.then((data) => {
			// data = Withdrawal data
		});
	```
- `checkTransaction(currency, txid, address [, isTestnet = false])`
  - Checks status of a transaction and updates on network
  - Returns promise with transaction
	```javascript
	tools.wallet.checkTransaction('xht', 'txid', 'address')
		.then((data) => {
			// data = Transaction data
		});
	```
- `transferAssetByKitIds(senderId, receiverId, currency, amount [, description = 'Admin Transfer'])`
  - Transfers an asset between users by their kit ids
  - Returns promise resolve after transfer
	```javascript
	tools.wallet.transferAssetByKitIds(99, 12, 'xht', 1)
		.then((data) => {
			//continue
		});
	```
- `transferAssetByNetworkIds(senderNetworkId, receiverNetworkId, currency, amount [, description = 'Admin Transfer])`
  - Transfers an asset between users by their network ids
  - Returns promise resolve after transfer
	```javascript
	tools.wallet.transferAssetByNetworkIds(1, 2, 'xht', 1)
		.then((data) => {
			//continue
		});
	```
- `mintAssetByKitId(kitId, currency, amount [, description])`
  - Mint a fiat asset you own to a user of your exchange by kit id
  - Returns promise with deposit data
	```javascript
	tools.wallet.mintAssetByKitId(1, 'fiat', 1, 'new mint')
		.then((data) => {
			// data = Deposit data
		});
	```
- `mintAssetByNetworkId(networkId, currency, amount [, description])`
  - Mint a fiat asset you own to a user of your exchange by kit id
  - Returns promise with deposit data
	```javascript
	tools.wallet.mintAssetByNetworkId(1, 'fiat', 1, 'new mint')
		.then((data) => {
			// data = Deposit data
		});
	```
- `burnAssetByKitId(kitId, currency, amount [, description])`
  - Burn a fiat asset you own to a user of your exchange by kit id
  - Returns promise with withdrawal data
	```javascript
	tools.wallet.burnAssetByKitId(1, 'fiat', 1, 'new mint')
		.then((data) => {
			// data = Withdrawal data
		});
	```
- `burnAssetByNetworkId(networkId, currency, amount [, description])`
  - Burn a fiat asset you own to a user of your exchange by network id
  - Returns promise with withdrawal data
	```javascript
	tools.wallet.burnAssetByNetworkId(1, 'fiat', 1, 'new mint')
		.then((data) => {
			// data = Withdrawal data
		});
	```

#### Security functions

- `issueToken(kitId, networkId, email, ip [, isAdmin = false, isSupport = false, isSupervisor = false, isKYC = false, isCommunicator = false])`
  - Creates a JWT token that expires in one day for a user
  - `isAdmin` = Set to true if user is an admin
  - `isSupport` = Set to true if user is support
  - `isSupervisor` = Set to true if user is a supervisor
  - `isKYC` = Set to true if user is kyc
  - `isCommunicator` = Set to true if user is a communicator
  - Returns created token
	```javascript
	tools.security.verifyNetworkHmacToken(req);
	/*
		{
			sub: {
				id: 99,
				email: 'person@bitholla.com',
				networkId: 1
			},
			scopes: [ 'user', 'hmac', 'admin' ],
			ip: '172.0.0.1',
			iss: 'bitholla',
			iat: 1608272965,
			exp: 1608359365
		}
	*/
	```
- `verifyBearerTokenMiddleware(req, authOrSecDef, token, cb [, isSocket = false])`
  - Middleware function used to verify a bearer token and the user's role
  - Used for swagger and websocket authentication
  - `req` = request object
  - `authOrSecDef` = not used in this function, pass `null`
  - `token` = Bearer token being passed
  - `cb` = Callback function called after authentication
  - `isSocket` = Set to true if verifying for a websocket connection
  - Sets `req.auth` as user values
	```javascript
	tools.security.verifyBearerTokenMiddleware(info.req, null, bearerToken, (err) => {
		if (err) {
			return next(false, 403, err.message);
		} else {
			return next(true);
		}
	}, false);

	/*
		req.auth = {
			sub: {
				id: 99,
				email: 'person@bitholla.com',
				networkId: 1
			},
			scopes: [ 'user', 'hmac', 'admin' ],
			ip: '172.0.0.1',
			iss: 'bitholla',
			iat: 1608272965,
			exp: 1608359365
		}
	*/
	```
- `verifyBearerTokenPromise(token, ip, scopes = ['user'])`
  - Validates bearer token
  - `token` = Bearer token
  - `ip` = Ip address of origin
  - `scopes` = User role scopes that are valid in an array
  - Returns promise with decoded token if successful
	```javascript
	tools.security.verifyBearerTokenPromise('Bearer TOKEN', '127.0.0.1', ['user', 'admin'])
		.then((data) => {
			/*
				{
					sub: {
						id: 99,
						email: 'person@bitholla.com',
						networkId: 1
					},
					scopes: [ 'user', 'hmac', 'admin' ],
					ip: '172.0.0.1',
					iss: 'bitholla',
					iat: 1608272965,
					exp: 1608359365
				}
			*/
		})
	```
- `verifyBearerTokenExpressMiddleware(scopes = ['user'])`
  - Validates bearer token for express endpoints as a middleware function
  - `scopes` = User role scopes that are valid in an array
  - Sets `req.auth` as user values and continues on
	```javascript
	app.post('/', [tools.security.verifyBearerTokenExpressMiddleware(['admin'])], (req, res) => {
		/*
			req.auth = {
				sub: {
					id: 99,
					email: 'person@bitholla.com',
					networkId: 1
				}
			}
		*/
	});
	```
- `verifyHmacTokenMiddleware(req, definition, apiKey, cb [, isSocket = false])`
  - Middleware function used to verify hmac values and the user's role
  - Used for swagger and websocket authentication
  - `req` = request object
  - `definition` = not used in this function, pass `null`
  - `apiKey` = HMAC token being passed
  - `cb` = Callback function called after authentication
  - `isSocket` = Set to true if verifying for a websocket connection
  - Sets `req.auth` as user values
	```javascript
	tools.security.verifyHmacTokenMiddleware(info.req, null, hmacKey, (err) => {
		if (err) {
			return next(false, 403, err.message);
		} else {
			return next(true);
		}
	}, false);

	/*
		req.auth = {
			sub: {
				id: 99,
				email: 'person@bitholla.com',
				networkId: 1
			}
		}
	*/
	```
- `verifyHmacTokenPromise(apiKey, apiSignature, apiExpires, method, originalUrl, body, scopes = ['user'])`
  - Validates hmac authentication
  - `apiKey` = HMAC API key given in request
  - `apiSignature` = Generated HMAC signature given in request
  - `apiExpires` = Expiration time for signature given in request
  - `method` = Endpoint method
  - `originalUrl` = URL path
  - `body` = Body given in request
  - Returns promise with decoded user values
	```javascript
	tools.security.verifyHmacTokenPromise(
		'apiKey',
		'apiSignature',
		'apiExpires',
		'POST',
		'/v2/order',
		{
			symbol: 'xht-usdt',
			side: 'buy',
			size: 1,
			type: 'limit',
			price: 1
		}
	)
		.then((data) => {
			/*
				{
					sub: {
						id: 99,
						email: 'person@bitholla.com',
						networkId: 1
					}
				}
			*/
		})
	```
- `getUserKitHmacTokens(userid)`
  - Gets user's hmac tokens (secrets are masked)
  - `req` = request object
  - Returns promise with tokens on success
	```javascript
	tools.security.getUserKitHmacTokens(99)
		.then((data) => {
			/*
				{
					count: 1,
					data: [
						{
							id: 1,
							user_id: 99
							name: ''
							apiKey: '',
							apiSecret: '*********'
						}
					]
				}
			*/
		})
	```
- `createUserKitHmacToken(userId, otpCode, ip, name)`
  - Creates an hmac token for a user. Requires OTP to be enabled
  - Returns promise with token
	```javascript
	tools.security.createUserKitHmacToken(99, 'otpCode', '127.0.0.1', 'testToken')
		.then((data) => {
			/*
				{
					id: 1,
					name: 'testToken'
					user_id: 99,
					apiKey: '',
					apiSecret: '*********'
				}
			*/
		})
	```
- `deleteUserKitHmacToken(userId, otpCode, tokenId)`
  - Delete a user's hmac token. Requres otp to be enabled
  - Returns promise with deleted token
	```javascript
	tools.security.deleteUserKitHmacToken(99, 'otpCode', 1)
		.then((data) => {
			/*
				{
					id: 1,
					name: 'testToken'
					user_id: 99,
					apiKey: '',
					apiSecret: '*********'
				}
			*/
		})
	```
- `verifyNetworkHmacToken(req)`
  - Validates requests coming from the network
  - `req` = request object
  - Returns promise resolve on success
	```javascript
	tools.security.verifyNetworkHmacToken(req)
		.then((data) => {
			// continue
		})
	```
- `validatePassword(userPassword, inputPassword)`
  - Validates a password using bcrypt
  - `userPassword` = User's encrypted password
  - `inputPassword` = Given password
  - Returns boolean value
	```javascript
	tools.security.validatePassword('encryptedPassword', 'password');
	```
- `resetUserPassword(resetPasswordCode, newPassword)`
  - Resets a user's password in case they forgot
  - Returns promise with user data
	```javascript
	tools.security.resetUserPassword('code', 'newPassword')
		.then((data) => {
			// data = User data
		});
	```
- `changeUserPassword(email, oldPassword, newPassword)`
  - Change a user's password
  - Returns promise with user data
	```javascript
	tools.security.changeUserPassword('person@bitholla.com', 'oldPassword', 'newPassword')
		.then((data) => {
			// data = User data
		});
	```
- `sendResetPasswordCode(email, captcha, ip, domain)`
  - Send a reset password code to a user's email
  - Returns promise resolve on success
	```javascript
	tools.security.sendResetPasswordCode('person@bitholla.com', 'captchaCode', '127.0.0.1', 'https://google.com')
		.then((data) => {
			// continue
		});
	```
- `checkCaptcha(captcha, remoteip)`
  - Checks captcha given. If captcha is disabled, will resolve
  - Returns promise resolve on success
	```javascript
	tools.security.checkCaptcha('captchaCode', '127.0.0.1')
		.then((data) => {
			// continue
		});
	```
- `checkOtp(userId)`
  - Checks if user has otp enabled. If so, throws an error.
  - Returns promise with either sequelize object with otp code if it already exists or nothing if it doesn't
	```javascript
	tools.security.checkOtp(99)
		.then((data) => {
			/*
				If OTP code for user that is not use exists
				{
					id: 1,
					secret: 'otpSecret'
				}

				Else nothing
			*/
		});
	```
- `createOtp(userId)`
  - Creates an otp secret for a user
  - Returns promise with secret
	```javascript
	tools.security.checkOtp(99)
		.then((data) => {
			// data = OTP secret for user
		});
	```
- `verifyOtpBeforeAction(userId, otpCode)`
  - Verifies an otp code for a user
  - Returns promise with true value if otp is valid. Throws error if not.
	```javascript
	tools.security.verifyOtpBeforeAction(99, 'otpCode')
		.then((data) => {
			// data = true
		});
	```
- `setActiveUserOtp(userId)`
  - Set user OTP enabled and set OTP code as used
  - Returns promise with user values
	```javascript
	tools.security.setActiveUserOtp(99)
		.then((data) => {
			// data = User data
		});
	```
- `userHasOtpEnabled(userId)`
  - Check to see if user otp is enabled
  - Returns promise with boolean value
	```javascript
	tools.security.userHasOtpEnabled(99)
		.then((data) => {
			// data = true / false
		});
	```
- `checkUserOtpActive(userId, otpCode)`
  - Check to see if user otp is enabled and if otp code is valid
  - Used for functionalities where otp code must be enabled
  - Returns promise resolve on success
	```javascript
	tools.security.checkUserOtpActive(99, 'otpCode')
		.then((data) => {
			// continue
		});
	```
- `userIsDeactivated(deactivatedUsers = {}, userid)`
  - Check to see if user is deactivated (frozen)
  - Returns boolean value
	```javascript
	tools.security.userIsDeactivated(frozenUsers, 99);
	```
- `checkAdminIp(whiteListedIps = [], ip)`
  - Check to see if admin's ip is valid
  - Returns boolean value
	```javascript
	tools.security.checkAdminIp(adminWhitelistIps, '127.0.0.1');
	```

#### Tier functions

- `findTier(level)`
  - Get tier data for a level
  - Returns promise with tier data
	```javascript
	tools.tier.findTier(1)
		.then((data) => {
			/*
				{
					"id": 1,
					"name": "tester",
					"icon": "",
					"description": "tester level",
					"deposit_limit": 0,
					"withdrawal_limit": 0,
					"fees": {
						"maker": {
							"xht-usdt": 0.2
						},
						"taker": {
							"xht-usdt": 0.2
						}
					},
					"note": "",
					"created_at": "2020-12-10T05:18:19.931Z",
					"updated_at": "2020-12-10T06:06:02.358Z"
				}
			*/
		});
	```
- `createTier(level, name, icon, description, deposit_limit, withdrawal_limit, fees = {} [, note = ''])`
  - Create a new tier level
  - `level` = new level
  - `name` = name of new tier
  - `icon` = url of tier icon
  - `description` = description of tier
  - `deposit_limit` = deposit limit for tier level in native currency, `-1` for disabled, `0` for unlimited
  - `withdrawal_limit` = withdrawal limit for tier level in native currency, `-1` for disabled, `0` for unlimited
  - `fees` = Maker and Taker fees associated with trading for tier level. `default` will be applied for all symbols. You can also pass a symbol as a key to specify a fee
  - `note` = note for tier
  - Returns promise with tier data
	```javascript
	tools.tier.createTier(
		4,
		'fourth tier',
		'url',
		'tier that is fourth',
		0,
		0,
		{
			maker: {
				default: 0.1,
				'xht-usdt': 0
			},
			taker: {
				default: 0.1,
				'xht-usdt': 0
			}
		},
		'note'
	)
		.then((data) => {
			/*
				{
					"id": 4,
					"name": "fourth tier",
					"icon": "url",
					"description": "tier that is fourth",
					"deposit_limit": 0,
					"withdrawal_limit": 0,
					"fees": {
						"maker": {
							"default": 0.1
							"xht-usdt": 0
						},
						"taker": {
							"default": 0.1
							"xht-usdt": 0
						}
					},
					"note": "note",
					"created_at": "2020-12-10T05:18:19.931Z",
					"updated_at": "2020-12-10T06:06:02.358Z"
				}
			*/
		});
	```
- `updateTier(level, updateData = { name, icon, note, description })`
  - Update a tier level
  - `level` = level to update
  - `name` = name of new tier
  - `icon` = url of tier icon
  - `description` = description of tier
  - `note` = Note for tier
  - Returns promise with tier data
	```javascript
	tools.tier.updateTier(
		4,
		{
			name: 'hi'
		}
	)
		.then((data) => {
			/*
				{
					"id": 4,
					"name": "hi",
					"icon": "url",
					"description": "tier that is fourth",
					"deposit_limit": 0,
					"withdrawal_limit": 0,
					"fees": {
						"maker": {
							"default": 0.1
							"xht-usdt": 0
						},
						"taker": {
							"default": 0.1
							"xht-usdt": 0
						}
					},
					"note": "note",
					"created_at": "2020-12-10T05:18:19.931Z",
					"updated_at": "2020-12-10T06:06:02.358Z"
				}
			*/
		});
	```
- `updatePairFees(pair, fees = { level: {} })`
  - Update pair fees
  - `pair` = Pair to update
  - `fees` = an object with tier levels as keys and fee objects as values
  - Returns promise with array of all updated tiers
	```javascript
	tools.tier.updatePairFees(
		'xht-usdt',
		{
			'1': {
				maker: 0,
				taker: 0
			},
			'3': {
				maker: 0.1,
				taker: 0.1
			}
		}
	)
		.then((data) => {
			/*
				{
					[
						{...},
						{...}
					]
				}
			*/
		});
	```
- `updateTiersLimits(limits = { level: {} })`
  - Update tiers deposit and withdrawal limits
  - `limits` = an object with the levels to update as keys and new limits as objects
  - Returns promise with array of all updated tiers
	```javascript
	tools.tier.updateTiersLimits(
		{
			'1': {
				deposit_limit: 0,
				withdrawal_limit: 0
			},
			'3': {
				deposit_limit: 0.1,
				withdrawal_limit: 0.1
			}
		}
	)
		.then((data) => {
			/*
				{
					[
						{...},
						{...}
					]
				}
			*/
		});
	```

#### Database functions

- These functions are basically Sequelize functionalities

- `getModel(table)`
  - Get sequelize db model
  - Returns sequelize DB model
	```javascript
	tools.database.getModel('user')
		.then((data) => {
			// User model
		});
	```
- `create(table, query = {}, options = {})`
  - Create instance of model
  - Returns promise with sequelize db model
	```javascript
	tools.database.create('user', { id: 1, email: 'hello', password: 'password' })
		.then((data) => {
			// data
		});
	```
- `destroy(table, query = {}, options = {})`
  - Destroy instance of model
  - Returns promise with sequelize object
	```javascript
	tools.database.destroy('user', { where: { id: 1 }})
		.then((data) => {
			// data
		});
	```
- `update(table, query = {}, options = {})`
  - Update instance of model
  - Returns promise with sequelize object
	```javascript
	tools.database.update('user', { where: { id: 1 } })
		.then((data) => {
			// data
		});
	```
- `findOne(table, query = {})`
  - Get an instance of model
  - Returns promise with sequelize object
	```javascript
	tools.database.findOne('user', { where: { id: 1 } })
		.then((data) => {
			// data
		});
	```
- `findAll(table, query = {})`
  - Get all instance of model
  - Returns promise with sequelize object
	```javascript
	tools.database.findAll('user', { where: { otp_enabled: true } })
		.then((data) => {
			// data
		});
	```
- `findAndCountAll(table, query = {})`
  - Get all instance of model with count
  - Returns promise with sequelize object
	```javascript
	tools.database.findAndCountAll('user', { where: { otp_enabled: true } })
		.then((data) => {
			// data
		});
	```
- `findAndCountAllWithRows(table, query = {})`
  - Get all instance of model with count and data
  - Returns promise with sequelize object
	```javascript
	tools.database.findAndCountAllWithRows('user', { where: { otp_enabled: true } })
		.then((data) => {
			/*
				{
					count: 1,
					data: []
				}
			*/
		});
	```
- `Redis`
  - The tools library also includes a redis client, publisher, and subscriber. They can be accessed like below.
  - Client - A promsified redis client.
  	```javascript
	tools.database.client;
	tools.database.client.set(...);
	tools.database.client.get(...);
	tools.database.client.hsetAsync(...);
	tools.database.client.hgetAsync(...);
	```
  - Publisher
  	```javascript
	tools.database.publisher;
	tools.database.publisher.publish(...);
	```
  - Subscriber
  	```javascript
	tools.database.subscriber;
	tools.database.subscriber.subscribe(...);
	```
