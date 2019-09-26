const PRODUCTION_ENDPOINT =
	process.env.REACT_APP_SERVER_ENDPOINT || "https://api.hollaex.com";

const LOCALHOST_ENDPOINT =
	process.env.REACT_APP_LOCALHOST_ENDPOINT || "http://localhost";

const API_PATH = '/v1';

const generateEndpoint = (endpoint, path) => ({
	API_URL: `${endpoint}${path}`,
	WS_URL: endpoint
});

const VARIABLES = {
	mainnet: generateEndpoint(PRODUCTION_ENDPOINT, API_PATH),
	testnet: generateEndpoint(LOCALHOST_ENDPOINT, API_PATH)
};

export default VARIABLES;
