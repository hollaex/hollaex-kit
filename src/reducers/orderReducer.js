import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
	fetched: false,
	fetching: false,
	error: null,
	activeOrders: []
}, action) {
	switch(action.type) {
		// createOrder
		case 'CREATE_ORDER_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'CREATE_ORDER_REJECTED': {
			alert('Error: ' + action.payload.response.data.error)
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'CREATE_ORDER_FULFILLED': {
			// alert('Order created successfully')
			return {...state, fetching: false, fetched: true}
			break;
		}

		// getOrders
		case 'GET_ORDERS_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'GET_ORDERS_REJECTED': {
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'GET_ORDERS_FULFILLED': {
		return {...state, fetching: false, activeOrders: action.payload.data}
			break;
		}

		//Webscoket redux manipulations on orders
		case 'SET_USER_ORDERS': {
			return {...state, activeOrders: action.payload}
			break;
		}
		case 'ADD_ORDER': {
			let { activeOrders, order } = action.payload
			activeOrders.push(order)
			return {...state, activeOrders}
			break;
		}
		// CANCEL_ORDER
		case 'CANCEL_ORDER_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'CANCEL_ORDER_REJECTED': {
			return {...state, fetching: false,error: action.payload.data}
			break;
		}
		case 'CANCEL_ORDER_FULFILLED': {
			const id = action.payload.data.id;
			const data = _.filter(state.activeOrders, user => {if(user.id!=id){return user;}})
			return {
				...state,
				fetching: false,
				activeOrders:data ,
			}
			break;
		}
		// CANCEL_ALL_ORDERS
		case 'CANCEL_ALL_ORDERS_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'CANCEL_ALL_ORDERS_REJECTED': {
			return {...state, fetching: false,error: action.payload.data}
			break;
		}
		case 'CANCEL_ALL_ORDERS_FULFILLED': {
			return {...state, fetching: false,activeOrders:[]}
			break;
		}

	}
	return state;
}