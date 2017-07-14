import _ from 'lodash'
import store from '../store'
export function getOrderbook(orderbook) {
	return {
		type: 'GET_ORDERBOOK',
		payload: orderbook
	}
}

export function addTrades(allTrades, trade) {
	let largestTrade = store.getState().orderbook.largestTrade
	_.each(trade, t => {
		if(t.size > largestTrade) {
			largestTrade = t.size
		}
	})
	allTrades.unshift(...trade.reverse())
	return {
		type: 'ADD_TRADE',
		payload: allTrades,
		largestTrade
	}
}