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
	depth: parseInt(localStorage.getItem('orderbook_depth') || 1, 10),
	side: '',
	size: 0,
	sourceAmount: undefined,
	targetAmount: undefined,
};

export default function reducer(state = INITIAL_STATE, { payload, type }) {
	switch (type) {
		case 'CHANGE_QUICK_TRADE_SYMBOL':
			return {
				...state,
				symbol: payload.symbol,
			};
		case 'CHANGE_QUICK_TRADE_PAIR':
			return {
				...state,
				symbol: payload.pair,
				pair: payload.pair,
			};
		// getOrderbook
		case 'GET_QUICK_TRADE_ORDERBOOK_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'GET_QUICK_TRADE_ORDERBOOK_REJECTED':
			return { ...state, fetching: false, error: payload };
		case 'GET_QUICK_TRADE_ORDERBOOK_FULFILLED': {
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
		case 'SET_QUICK_TRADE_ORDERBOOK': {
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

		case 'SET_QUICK_TRADE_ORDERBOOKS_DATA': {
			const { action, ...rest } = payload;
			return {
				...state,
				pairsOrderbooks: {
					...state.pairsOrderbooks,
					...rest,
				},
			};
		}
		case 'SET_PRICE_ESSENTIALS': {
			return {
				...state,
				...payload,
			};
		}
		case 'LOGOUT':
			return INITIAL_STATE;
		default:
			return state;
	}
}
