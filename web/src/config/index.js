// const PRODUCTION_ENDPOINT =
// 	process.env.REACT_APP_SERVER_ENDPOINT || 'https://api.hollaex.com';

const PRODUCTION_ENDPOINT = 'https://api.sandbox.hollaex.com';
// const PRODUCTION_ENDPOINT = "https://next.hollaex.cloud/api"
// const PRODUCTION_ENDPOINT = "https://next.hollaex.cloud/api"

const DEVELOPMENT_ENDPOINT =
	process.env.REACT_APP_DEVELOPMENT_ENDPOINT ||
	// 'https://zbexchange.ddns.net/api'
	// 'https://api.sandbox.hollaex.com';

	// 'https://api.bitcoinrd.do'
	'http://localhost';

// 'https://api.bitcoinrd.do'

// 'https://api.hollaex.com'

// "https://next.hollaex.cloud/api"

// const PRODUCTION_NETWORK_ENDPOINT =
// 	process.env.REACT_APP_SERVER_NETWORK_ENDPOINT ||
// 	'https://api.hollaex.network';

const PRODUCTION_NETWORK_ENDPOINT = 'https://api.testnet.hollaex.network';
// const PRODUCTION_NETWORK_ENDPOINT ='https:/next.hollaex.cloud.network'

const DEVELOPMENT_NETWORK_ENDPOINT =
	process.env.REACT_APP_DEVELOPMENT_NETWORK_ENDPOINT ||
	'https://api.testnet.hollaex.network';

const API_PATH = '/v2';

export const HOLLAEX_NETWORK_API_URL = `${PRODUCTION_NETWORK_ENDPOINT}${API_PATH}`;

const generateEndpoint = (endpoint, path, networkEndpoint) => ({
	API_URL: `${endpoint}${path}`,
	WS_URL:
		// process.env.REACT_APP_STREAM_ENDPOINT ||
		endpoint.split('://')[0] === 'https'
			? `wss://${endpoint.split('://')[1]}` // websocket with ssl
			: // ? `wss://next.hollaex.cloud/stream` // websocket with ssl
			  `ws://${endpoint.split('://')[1]}`, // without ssl used for localhost
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
