const PRODUCTION_ENDPOINT =
	process.env.REACT_APP_SERVER_ENDPOINT || 'https://api.hollaex.com';

const DEVELOPMENT_ENDPOINT =
	process.env.REACT_APP_DEVELOPMENT_ENDPOINT ||
	'https://api.sandbox.hollaex.com';

const PRODUCTION_NETWORK_ENDPOINT =
	process.env.REACT_APP_SERVER_NETWORK_ENDPOINT ||
	'https://api.hollaex.network';

const DEVELOPMENT_NETWORK_ENDPOINT =
	process.env.REACT_APP_DEVELOPMENT_NETWORK_ENDPOINT ||
	'https://api.testnet.hollaex.network';

const API_PATH = '/v2';

const generateEndpoint = (endpoint, path, networkEndpoint) => ({
	API_URL: `${endpoint}${path}`,
	WS_URL:
		endpoint.split('://')[0] === 'https'
			? `wss://${endpoint.split('://')[1]}` // websocket with ssl
			: `ws://${endpoint.split('://')[1]}`, // without ssl used for localhost
	PLUGIN_URL: endpoint,
	NETWORK_API_URL: `${networkEndpoint}${path}`,
});

const VARIABLES = {
	production: generateEndpoint(
		PRODUCTION_ENDPOINT,
		API_PATH,
		PRODUCTION_NETWORK_ENDPOINT
	),
	development: generateEndpoint(
		DEVELOPMENT_ENDPOINT,
		API_PATH,
		DEVELOPMENT_NETWORK_ENDPOINT
	),
};

export default VARIABLES;
