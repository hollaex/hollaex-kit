const PRODUCTION_ENDPOINT = 'https://api.exir.tech';
const TESTNET_ENDPOINT = 'https://api.testnet.exir.tech';
const DEVELOPMENT_ENDPOINT = 'http://35.158.234.195';
const LOCALHOST_ENDPOINT = 'http://localhost';

const API_PATH_V0 = '/v0';

const generateEndpoint = (endpoint, path) => ({
	API_URL: `${endpoint}${path}`,
	WS_URL: endpoint
});
const VARIABLES = {
	production: {
		mainnet: generateEndpoint(PRODUCTION_ENDPOINT, API_PATH_V0),
		testnet: generateEndpoint(TESTNET_ENDPOINT, API_PATH_V0)
	},
	development: {
		mainnet: generateEndpoint(DEVELOPMENT_ENDPOINT, API_PATH_V0),
		testnet: generateEndpoint(LOCALHOST_ENDPOINT, API_PATH_V0)
	}
};

export default VARIABLES;
