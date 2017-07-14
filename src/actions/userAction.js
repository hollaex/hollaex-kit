import axios from 'axios';
import _ from 'lodash'
import qs from 'qs'
import store from '../store'
const baseURL = "http://holla-jan4-dev.ap-northeast-2.elasticbeanstalk.com/v0"

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