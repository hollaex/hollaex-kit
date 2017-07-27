import axios from 'axios';
import _ from 'lodash'
import qs from 'qs'
import store from '../store'

export function getMe() {
	let token = store.getState().auth.token

	var config = {
		headers: {'Authorization': token}
	}
	return ((dispatch) => {
		dispatch({
		    type: 'GET_ME_PENDING'
		})
	})
}

export function getWallet(wallet) {
	return {
		type: 'GET_WALLET',
		payload: wallet
	}
}