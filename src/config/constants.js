import config from './index'

const ENV = process.env.NODE_ENV || 'development'
const NETWORK = process.env.REACT_APP_NETWORK || 'testnet'
const { API_URL, WS_URL } = config[ENV][NETWORK]

export default {ENV, NETWORK, API_URL, WS_URL}