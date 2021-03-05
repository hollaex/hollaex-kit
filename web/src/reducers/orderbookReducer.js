import { BASE_CURRENCY } from '../config/constants';
import {
	ORDERBOOK_CONSTANTS,
	PAIRS_TRADES_FETCHED,
} from '../actions/orderbookAction';

const INITIAL_QUICK_TRADE = {
	fetching: false,
	data: {
		symbol: '',
		price: 0,
		side: '',
		size: 0,
		filled: false,
	},
	error: '',
};

const INITIAL_QUOTE = {
	fetching: false,
	data: {
		iat: 0,
		exp: 0,
		symbol: '',
		price: 0,
		side: '',
		size: 0,
	},
	token: '',
	error: '',
	order: {
		fetching: false,
		completed: false,
		error: '',
		data: {},
	},
};

const INITIAL_STATE = {
	fetched: false,
	fetching: false,
	trades: [],
	error: null,
	pair: '',
	symbol: '',
	price: 0,
	prices: {},
	asks: [],
	bids: [],
	orderbookReady: false,
	quickTrade: INITIAL_QUICK_TRADE,
	quoteData: INITIAL_QUOTE,
	pairsOrderbooks: {},
	pairsTrades: {},
	pairsTradesFetched: false,
	pairs: {},
	depth: parseInt(localStorage.getItem('orderbook_depth') || 1, 10),
};

export default function reducer(state = INITIAL_STATE, { payload, type }) {
	switch (type) {
		case PAIRS_TRADES_FETCHED:
			return {
				...state,
				pairsTradesFetched: payload,
			};
		case 'CHANGE_SYMBOL':
			return {
				...state,
				symbol: payload.symbol,
			};
		case 'CHANGE_PAIR':
			return {
				...state,
				symbol: payload.pair,
				pair: payload.pair,
			};
		// getOrderbook
		case 'GET_ORDERBOOK_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'GET_ORDERBOOK_REJECTED':
			return { ...state, fetching: false, error: payload };
		case 'GET_ORDERBOOK_FULFILLED': {
			let bids = payload.data.bids;
			let asks = payload.data.asks;
			let allBids = 0; // accumulative bids amounts
			let allAsks = 0; // accumulative asks amounts
			for (let i = 0; i < bids.length; i++) {
				if (bids[i]) {
					allBids += bids[i][1];
					bids[i][2] = allBids;
				}
				if (asks[i]) {
					allAsks += asks[i][1];
					asks[i][2] = allAsks;
				}
			}
			return { ...state, fetching: false, fetched: true, bids, asks };
		}

		// setOrderbook
		case 'SET_ORDERBOOK': {
			const { bids, asks } = payload;
			return {
				...state,
				fetching: false,
				fetched: true,
				bids,
				asks,
				orderbookReady: true,
			};
		}

		// getTrades
		case 'GET_TRADES_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'GET_TRADES_REJECTED':
			return { ...state, fetching: false, error: payload };
		case 'GET_TRADES_FULFILLED':
			return { ...state, fetching: false, fetched: true, trades: payload.data };
		// addTrades
		case 'ADD_TRADES': {
			const { trades, symbol } = payload;
			const price = trades[0].price;
			const prices = { ...state.prices };
			prices[symbol] = price;

			return {
				...state,
				fetching: false,
				fetched: true,
				trades: trades.concat(state.trades), // TODO store trades by currency
				price,
				prices,
			};
		}

		case ORDERBOOK_CONSTANTS.QUICK_TRADE_CANCEL:
			return {
				...state,
				quickTrade: INITIAL_QUICK_TRADE,
			};
		case ORDERBOOK_CONSTANTS.QUICK_TRADE_PENDING:
			return {
				...state,
				quickTrade: {
					...INITIAL_QUICK_TRADE,
					fetching: true,
					data: {
						price: state.quickTrade.data.price,
					},
				},
			};
		case ORDERBOOK_CONSTANTS.QUICK_TRADE_FULFILLED:
			return {
				...state,
				quickTrade: {
					...INITIAL_QUICK_TRADE,
					fetching: false,
					data: payload,
					error: payload.filled ? '' : 'Order is not filled',
				},
			};
		case ORDERBOOK_CONSTANTS.QUICK_TRADE_REJECTED:
			return {
				...state,
				quickTrade: {
					...INITIAL_QUICK_TRADE,
					fetching: false,
					error: payload,
				},
			};

		case ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_PENDING:
			return {
				...state,
				quoteData: {
					...INITIAL_QUOTE,
					fetching: true,
					data: {
						...INITIAL_QUOTE.data,
						price: state.quoteData.data.price,
					},
				},
			};
		case ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_FULFILLED:
			return {
				...state,
				quoteData: {
					...INITIAL_QUOTE,
					fetching: false,
					data: payload.data,
					token: payload.token,
				},
			};
		case ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_REJECTED:
			return {
				...state,
				quoteData: {
					...INITIAL_QUOTE,
					fetching: false,
					...payload,
					data: {
						...INITIAL_QUOTE.data,
						...payload.data,
					},
					error: payload.message,
				},
			};

		case ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_CANCEL:
			return {
				...state,
				quoteData: INITIAL_QUOTE,
			};
		case ORDERBOOK_CONSTANTS.TRADE_QUOTE_PERFORM_PENDING:
			return {
				...state,
				quoteData: {
					...state.quoteData,
					order: {
						fetching: true,
						completed: false,
						error: '',
						data: {},
					},
				},
			};
		case ORDERBOOK_CONSTANTS.TRADE_QUOTE_PERFORM_FULFILLED:
			return {
				...state,
				quoteData: {
					...state.quoteData,
					order: {
						fetching: false,
						completed: true,
						data: payload,
					},
				},
			};
		case ORDERBOOK_CONSTANTS.TRADE_QUOTE_PERFORM_REJECTED:
			return {
				...state,
				quoteData: {
					...state.quoteData,
					order: {
						fetching: false,
						completed: true,
						error: payload,
					},
				},
			};

		case 'SET_ORDERBOOKS_DATA': {
			const { action, ...rest } = payload;
			return {
				...state,
				pairsOrderbooks: {
					...state.pairsOrderbooks,
					...rest,
				},
			};
		}

		case 'SET_TRADES_DATA': {
			const { action, symbol, ...rest } = payload;
			const { pairs } = state;
			const prices = { ...state.prices };
			let pairsTrades = {};
			if (action === 'partial') {
				pairsTrades = {
					...state.pairsTrades,
					...rest,
				};
				Object.keys(rest).forEach((key) => {
					if (rest[key].length > 0) {
						let keyPrice = '';
						if (pairs[key] && pairs[key].pair_2 === BASE_CURRENCY) {
							keyPrice = pairs[key].pair_base;
						}
						prices[keyPrice] = rest[key][0].price;
					}
				});
			} else if (action === 'update' || 'insert') {
				pairsTrades = {
					...state.pairsTrades,
				};
				pairsTrades[symbol] = rest[symbol].concat(pairsTrades[symbol]);

				let keyPrice = '';
				if (pairs[symbol] && pairs[symbol].pair_2 === BASE_CURRENCY) {
					keyPrice = pairs[symbol].pair_base;
				}

				if (keyPrice && rest[symbol][0]) {
					prices[keyPrice] = rest[symbol][0].price;
				}
			}

			return {
				...state,
				pairsTrades,
				prices,
			};
		}
		case 'SET_PAIRS_DATA':
			return {
				...state,
				pairs: payload.pairs,
			};
		case ORDERBOOK_CONSTANTS.SET_ORDERBOOK_DEPTH:
			return {
				...state,
				depth: payload,
			};
		case 'LOGOUT':
			return INITIAL_STATE;
		default:
			return state;
	}
}
