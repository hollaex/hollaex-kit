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
			var {id, email, balance, crypto_wallet, bank_account_number, bank_name} = action.payload.data
			return {...state, fetching: false, fetched: true, id, email, balance, crypto_wallet, bank_account_number, bank_name}
			break;
		}

		case 'SET_ME': {
			var {id, email, balance, crypto_wallet} = action.payload
			return {...state, fetching: false, fetched: true, id, email, balance, crypto_wallet}
			break;
		}
		// WITHDRAW
		case 'PROCESS_WITHDRAW_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'PROCESS_WITHDRAW_REJECTED': {
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'PROCESS_WITHDRAW_FULFILLED': {
			return {...state, fetching: false, fetched: true, data:action.payload.data}
			break;
		}
		// USER_IDENTITY
		case 'USER_IDENTITY_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'USER_IDENTITY_REJECTED': {
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'USER_IDENTITY_FULFILLED': {
			return {...state, fetching: false, fetched: true, userData:action.payload.data}
			break;
		}
		// UPLOAD_FILE
		case 'UPLOAD_FILE_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'UPLOAD_FILE_REJECTED': {
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'UPLOAD_FILE_FULFILLED': {
			return {...state, fetching: false, fetched: true, userData:action.payload.data}
			break;
		}

		// USER_ORDERS
		case 'USER_ORDERS_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'USER_ORDERS_REJECTED': {
			return {...state, fetching: false, error: action.payload.response}
			break;
		}
		case 'USER_ORDERS_FULFILLED': {
		return {...state, fetching: false, orders: action.payload.response}
			break;
		}
		// USER_TRADES
		case 'USER_TRADES_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'USER_TRADES_REJECTED': {
			return {...state, fetching: false,error: action.payload.response}
			break;
		}
		case 'USER_TRADES_FULFILLED': {
			return {...state, fetching: false,trades:action.payload.data}
			break;
		}
		// USER_DEPOSITS
		case 'USER_DEPOSITS_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'USER_DEPOSITS_REJECTED': {
			return {...state, fetching: false,error: action.payload.response}
			break;
		}
		case 'USER_DEPOSITS_FULFILLED': {
			return {...state, fetching: false,deposits: action.payload.data}
			break;
		}
		// USER_WITHDRAWALS
		case 'USER_WITHDRAWALS_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'USER_WITHDRAWALS_REJECTED': {
			return {...state, fetching: false,error: action.payload.response}
			break;
		}
		case 'USER_WITHDRAWALS_FULFILLED': {
			return {...state, fetching: false,  withdrawals: action.payload.data}
			break;
		}

	}
	return state;
}