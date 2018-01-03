import _ from 'lodash';

const INITIAL_STATE = {
	fetched: false,
	fetching: false,
	error: null,
	activeOrders: []
};

export default function reducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		// createOrder
		case 'CREATE_ORDER_PENDING': {
			return { ...state, fetching: true, fetched: false, error: null };
		}
		case 'CREATE_ORDER_REJECTED': {
			// alert('Error: ' + action.payload.response.data.error)
			return { ...state, fetching: false, error: action.payload };
		}
		case 'CREATE_ORDER_FULFILLED': {
			// alert('Order created successfully')
			return { ...state, fetching: false, fetched: true };
		}
		// getOrders
		case 'GET_ORDERS_PENDING': {
			return { ...state, fetching: true, fetched: false, error: null };
		}
		case 'GET_ORDERS_REJECTED': {
			return { ...state, fetching: false, error: action.payload };
		}
		case 'GET_ORDERS_FULFILLED': {
			return { ...state, fetching: false, activeOrders: action.payload.data };
		}

		//Webscoket redux manipulations on orders
		case 'SET_USER_ORDERS': {
			return { ...state, activeOrders: action.payload };
		}

		case 'ADD_ORDER':
			const newOrder = { ...action.payload.order };
			if (!newOrder.created_at) {
				newOrder.created_at = new Date();
			}
			return { ...state, activeOrders: state.activeOrders.concat(newOrder) };

		case 'UPDATE_ORDER': {
			let { order } = action.payload;
			const indexOfOrder = state.activeOrders.findIndex(
				(activeOrder) => activeOrder.id === order.id
			);
			if (indexOfOrder > -1) {
				let activeOrders = [].concat(...state.activeOrders);
				activeOrders[indexOfOrder] = {
					...activeOrders[indexOfOrder],
					...order
				};
				return { ...state, activeOrders };
			}
			// do nothing
			break;
		}

		case 'REMOVE_ORDER': {
			let { ids } = action.payload;
			const activeOrders = state.activeOrders.filter(
				(order) => ids.indexOf(order.id) === -1
			);
			return { ...state, activeOrders };
		}

		// CANCEL_ORDER
		case 'CANCEL_ORDER_PENDING': {
			return { ...state, fetching: true, fetched: false, error: null };
		}
		case 'CANCEL_ORDER_REJECTED': {
			return { ...state, fetching: false, error: action.payload.data };
		}
		case 'CANCEL_ORDER_FULFILLED': {
			const id = action.payload.data.id;
			const data = _.filter(state.activeOrders, (user) => {
				if (user.id != id) {
					return user;
				}
			});
			return {
				...state,
				fetching: false,
				activeOrders: data
			};
		}
		// CANCEL_ALL_ORDERS
		case 'CANCEL_ALL_ORDERS_PENDING': {
			return { ...state, fetching: true, fetched: false, error: null };
		}
		case 'CANCEL_ALL_ORDERS_REJECTED': {
			return { ...state, fetching: false, error: action.payload.data };
		}
		case 'CANCEL_ALL_ORDERS_FULFILLED': {
			return { ...state, fetching: false, activeOrders: [] };
		}

		case 'LOGOUT':
			return INITIAL_STATE;

		default:
			return state;
	}
	return state;
}
