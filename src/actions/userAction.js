import axios from 'axios';
import _ from 'lodash'

export function getMe() {
	return {
		type: 'GET_ME',
		payload: axios.get('/user'),
	}
}

export function getWallet(wallet) {
	return {
		type: 'GET_WALLET',
		payload: wallet
	}
}