import config from './index'

export const ENV = process.env.NODE_ENV || 'development'
export const NETWORK = process.env.REACT_APP_NETWORK || 'testnet'

export const SESSION_TIME = 60 * 60 * 1000; // 1 hour
export const API_URL = config[ENV][NETWORK].API_URL;
export const WS_URL = config[ENV][NETWORK].WS_URL;
