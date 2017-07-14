import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
	fetched: false,
	fetching: false,
	error: null,
	bids: [],
	asks: [],
	trades: [],
	largestTrade: 0 // all trade sizes in time and sell
}, action) {
	switch(action.type) {

		// getOrders
		case 'GET_ORDERBOOK': {
			let bids = action.payload.bids
			let asks = action.payload.asks
			let allBids = 0 // accumulative bids amounts
			let allAsks = 0 // accumulative asks amounts
			for(let i=0; i<bids.length; i++) {
				allBids += bids[i][1]
				bids[i][2] = allBids
				allAsks += asks[i][1]
				asks[i][2] = allAsks

			}
			return {...state, bids, asks}
			break;
		}

		case 'ADD_TRADE': {
			return {...state, trades: action.payload, largestTrade: action.largestTrade}
			break
		}
	}
	return state;
}