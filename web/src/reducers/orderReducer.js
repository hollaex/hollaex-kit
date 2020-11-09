import _ from 'lodash';

const INITIAL_STATE = {
	fetched: false,
	fetching: false,
	error: null,
	activeOrders: [],
};

export default function reducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		//Webscoket redux manipulations on orders
		case 'SET_USER_ORDERS':
			return { ...state, activeOrders: action.payload.reverse() };
		case 'ADD_ORDER':
			const newOrder = { ...action.payload.order };
			if (!newOrder.created_at) {
				newOrder.created_at = new Date();
			}
			return {
				...state,
				activeOrders: [newOrder].concat(state.activeOrders),
			};

		case 'UPDATE_ORDER': {
			let { order } = action.payload;
			const indexOfOrder = state.activeOrders.findIndex(
				(activeOrder) => activeOrder.id === order.id
			);
			if (indexOfOrder > -1) {
				let activeOrders = [].concat(...state.activeOrders);
				activeOrders[indexOfOrder] = {
					...activeOrders[indexOfOrder],
					...order,
				};
				return { ...state, activeOrders };
			} else {
				if (!order.created_at) {
					order.created_at = new Date();
				}
				return {
					...state,
					activeOrders: [order].concat(state.activeOrders),
				};
			}
		}

		case 'REMOVE_ORDER': {
			let { ids } = action.payload;
			const activeOrders = state.activeOrders.filter(
				(order) => ids.indexOf(order.id) === -1
			);
			return { ...state, activeOrders };
		}

		// CANCEL_ORDER
		case 'CANCEL_ORDER_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'CANCEL_ORDER_REJECTED':
			return { ...state, fetching: false, error: action.payload.data };
		case 'CANCEL_ORDER_FULFILLED': {
			const id = action.payload.data.id;
			const data = _.filter(state.activeOrders, (order) => {
				if (order.id !== id) {
					return order;
				}
			});
			return {
				...state,
				fetching: false,
				activeOrders: data,
			};
		}
		// CANCEL_ALL_ORDERS
		case 'CANCEL_ALL_ORDERS_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'CANCEL_ALL_ORDERS_REJECTED':
			return { ...state, fetching: false, error: action.payload.data };
		case 'CANCEL_ALL_ORDERS_FULFILLED': {
			const deletedOrders = action.payload.data.map(({ id }) => id);
			const activeOrders = state.activeOrders.filter(({ id }) => {
				return deletedOrders.indexOf(id) === -1;
			});
			return { ...state, fetching: false, activeOrders };
		}
		case 'LOGOUT':
			return INITIAL_STATE;
		default:
			return state;
	}
}
