const PRODUCTION_ENDPOINT =
	process.env.REACT_APP_SERVER_ENDPOINT || 'https://api.hollaex.com';

const LOCALHOST_ENDPOINT = process.env.REACT_APP_LOCALHOST_ENDPOINT || 'https://api.demo.hollaex.com';

const API_PATH_V0 = '/v0';

const generateEndpoint = (endpoint, path) => ({
	API_URL: `${endpoint}${path}`,
	WS_URL: endpoint
});
const VARIABLES = {
	production: {
		mainnet: generateEndpoint(PRODUCTION_ENDPOINT, API_PATH_V0),
		testnet: generateEndpoint(PRODUCTION_ENDPOINT, API_PATH_V0)
	},
	development: {
		mainnet: generateEndpoint(PRODUCTION_ENDPOINT, API_PATH_V0),
		testnet: generateEndpoint(LOCALHOST_ENDPOINT, API_PATH_V0)
	}
};

export default VARIABLES;
