import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
	email: '',
	wallet: {},
	isEmailVerified: false,
	objectId: null,
	assets: {},
	trades: {},
	activeTrades: {},
	exchangeProfiles: [], //exchange profile
	fetching: false,
	fetched: false,
	error: null,
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
			return {...state, fetching: false, fetched: true, 
				email: action.payload.data.email,
				isEmailVerified: action.payload.data.isEmailVerified,
				objectId: action.payload.data.objectId,
				exchangeProfiles: action.payload.data.exchangeProfiles}
			break;
		}

		// getWallet
		case 'GET_WALLET': {
			return {...state, wallet: action.payload}
			break;
		}

		// addExchangeProfile
		case 'ADD_EXCHANGE_PROFILE_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'ADD_EXCHANGE_PROFILE_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data}
			break;
		}
		case 'ADD_EXCHANGE_PROFILE_FULFILLED': {
			action.exchangeProfiles.push(action.payload);
			return {...state, fetching: false, fetched: true, exchangeProfiles: action.exchangeProfiles}
			break;
		}

		// updateExchangeProfile
		case 'UPDATE_EXCHANGE_PROFILE_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'UPDATE_EXCHANGE_PROFILE_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data}
			break;
		}
		case 'UPDATE_EXCHANGE_PROFILE_FULFILLED': {
			// action.exchangeProfiles.push(action.payload);
			alert('Keys added')
			return {...state, fetching: false, fetched: true}
			break;
		}

		// GET user profile in an exchange with exchange Id
		case 'FETCH_USER_EXCHANGE_PROFILE_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'FETCH_USER_EXCHANGE_PROFILE_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'FETCH_USER_EXCHANGE_PROFILE_FULFILLED': {
			return {...state, fetching: false, fetched: true, exchangeProfiles: action.payload }
			break;
		}

		// Adding access token to the db
		case 'ADD_EXCHANGE_KEYS_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'ADD_EXCHANGE_KEYS_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'ADD_EXCHANGE_KEYS_FULFILLED': {
			return {...state, fetching: false, fetched: true}
			break;
		}

		// Cash out to bank account
		case 'CASHOUT_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'CASHOUT_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'CASHOUT_FULFILLED': {
			return {...state, fetching: false, fetched: true}
			break;
		}

		// getAssets
		case 'GET_ASSETS_PENDING': {
			return {...state, fetching: true, error: null}
		}
		case 'GET_ASSETS_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
		}
		case 'GET_ASSETS_FULFILLED': {
			let assets = action.additionalData.assets
			assets[action.additionalData.exchangeId] = action.payload.data
			return {...state, fetching: false, fetched: true, error: null, assets: assets}
		}
	}
	return state;
}