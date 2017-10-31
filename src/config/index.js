const variables  = {
	production: {
		mainnet: {
			API_URL: 'https://api.testnet.exir.tech/v0',
			WS_URL: 'https://api.testnet.exir.tech'
		},
		testnet: {
			API_URL: 'https://api.testnet.exir.tech/v0',
			WS_URL: 'https://api.testnet.exir.tech'
		}
	},
	development: {
		mainnet: {
			API_URL: 'http://localhost/v0',
			WS_URL: 'http://localhost'
		},
		testnet: {
			API_URL: 'http://localhost/v0',
			WS_URL: 'http://localhost'
		}
	}
}

export default variables
