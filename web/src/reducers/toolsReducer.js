import {
	TOGGLE_TOOL,
	INITIALIZE_TOOLS,
	RESET_TOOLS,
} from 'actions/toolsAction';
import merge from 'lodash.merge';

const initialState = {
	orderbook: {
		is_enabled: true,
		is_visible: true,
	},
	chart: {
		is_enabled: true,
		is_visible: true,
	},
	public_sales: {
		is_enabled: true,
		is_visible: true,
	},
	order_entry: {
		is_enabled: true,
		is_visible: true,
	},
	recent_trades: {
		is_enabled: true,
		is_visible: true,
	},
	open_orders: {
		is_enabled: true,
		is_visible: true,
	},
	wallet: {
		is_enabled: true,
		is_visible: true,
	},
	depth_chart: {
		is_enabled: true,
		is_visible: true,
	},
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case INITIALIZE_TOOLS: {
			Object.keys(payload).forEach((tool) => {
				delete payload[tool].is_enabled;
			});

			return {
				...merge({}, state, payload),
			};
		}
		case TOGGLE_TOOL: {
			const { key } = payload;
			return {
				...state,
				[key]: {
					...state[key],
					is_visible: !state[key].is_visible,
				},
			};
		}
		case RESET_TOOLS:
			return {
				...initialState,
			};
		default:
			return state;
	}
};
