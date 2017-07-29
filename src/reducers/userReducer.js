import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
	id: null,
	email: null,
	balance: {},
	crypto_wallet: {}
}, action) {
	switch(action.type) {
		// GETME user profile
		case 'GET_ME_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'GET_ME_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'GET_ME_FULFILLED': {
			var {id, email, balance, crypto_wallet} = action.payload.data
			return {...state, fetching: false, fetched: true, id, email, balance, crypto_wallet}
			break;
		}

		case 'SET_ME': {
			var {id, email, balance, crypto_wallet} = action.payload
			return {...state, fetching: false, fetched: true, id, email, balance, crypto_wallet}
			break;
		}

	}
	return state;
}