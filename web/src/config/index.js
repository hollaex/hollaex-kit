const PRODUCTION_ENDPOINT =
	process.env.REACT_APP_SERVER_ENDPOINT || 'https://api.hollaex.com';

const DEVELOPMENT_ENDPOINT = 'https://api.sandbox.hollaex.com';

const API_PATH = '/v2';

const generateEndpoint = (endpoint, path) => ({
	API_URL: `${endpoint}${path}`,
	WS_URL: `wss://${endpoint.split('//')[1]}`
});

const VARIABLES = {
	production: generateEndpoint(PRODUCTION_ENDPOINT, API_PATH),
	development: generateEndpoint(DEVELOPMENT_ENDPOINT, API_PATH)
};

export default VARIABLES;
