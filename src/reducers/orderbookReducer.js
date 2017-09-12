export default function reducer(state={
	fetched: false,
	fetching: false,
	trades: [],
	error: null,
	symbol: 'btc',
}, action) {
	switch(action.type) {

		// getOrderbook
		case 'GET_ORDERBOOK_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'GET_ORDERBOOK_REJECTED': {
			alert('Error: ' + action.payload)
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'GET_ORDERBOOK_FULFILLED': {
			let bids = action.payload.data.bids
			let asks = action.payload.data.asks
			let allBids = 0 // accumulative bids amounts
			let allAsks = 0 // accumulative asks amounts
			for(let i=0; i<bids.length; i++) {
				if(bids[i]){
					allBids += bids[i][1]
					bids[i][2] = allBids
				}
				if(asks[i]){
					allAsks += asks[i][1]
					asks[i][2] = allAsks
				}
			}
			return {...state, fetching: false, fetched: true, bids, asks}
		}

		// setOrderbook
		case 'SET_ORDERBOOK': {
			let bids = action.payload.bids
			let asks = action.payload.asks
			// let allBids = 0 // accumulative bids amounts
			// let allAsks = 0 // accumulative asks amounts
			// for(let i=0; i<bids.length; i++) {
			// 	if(bids[i]){
			// 		allBids += bids[i][1]
			// 		bids[i][2] = allBids
			// 	}
			// 	if(asks[i]){
			// 		allAsks += asks[i][1]
			// 		asks[i][2] = allAsks
			// 	}
			// }
			return {...state, fetching: false, fetched: true, bids, asks}
		}

		// getTrades
		case 'GET_TRADES_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'GET_TRADES_REJECTED': {
			alert('Error: ' + action.payload)
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'GET_TRADES_FULFILLED': {
			return {...state, fetching: false, fetched: true, trades: action.payload.data}
			break;
		}

		// setTrades
		case 'SET_TRADES': {
			return {...state, fetching: false, fetched: true, trades: action.payload}
			break;
		}

		// addTrades
		case 'ADD_TRADES': {
			const updatedTrades = [...action.payload.newTrades, ...action.payload.trades]
			return {...state, fetching: false, fetched: true, trades: updatedTrades}
			break;
		}
	}
	return state;
}
