import axios from 'axios';
import _ from 'lodash'

export function getMe() {
	return {
		type: 'GET_ME',
		payload: axios.get('/user'),
	}
}

export function setMe(user) {
	return {
		type: 'SET_ME',
		payload: user
	}
}
export function processWithdraw(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'PROCESS_WITHDRAW_PENDING'
		});
		axios.post('/withdraw',data)
		.then(res => {
			dispatch({
			    type: 'PROCESS_WITHDRAW_FULFILLED',
			    payload:res
			});
		})
		.catch(err => {
			dispatch({
			    type: 'PROCESS_WITHDRAW_REJECTED',
			    payload:err.response
			});
		})	
	})
}
export function userIdentity(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'USER_IDENTITY_PENDING'
		});
		axios.put('/user',data)
		.then(res => {
			dispatch({
			    type: 'USER_IDENTITY_FULFILLED',
			    payload:res
			});
		})
		.catch(err => {
			dispatch({
			    type: 'USER_IDENTITY_REJECTED',
			    payload:err.response
			});
		})	
	})
}
