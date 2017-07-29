import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
	fetched: false,
	fetching: false,
	trades: [],
	error: null
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
				allBids += bids[i][1]
				bids[i][2] = allBids
				allAsks += asks[i][1]
				asks[i][2] = allAsks

			}
			return {...state, fetching: false, fetched: true, bids, asks}
			break;
		}

		// setOrderbook
		case 'SET_ORDERBOOK': {
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
			return {...state, fetching: false, fetched: true, bids, asks}
			break;
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
	}
	return state;
}