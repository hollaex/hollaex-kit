const initialState = {
	chat: {},
	status: true,
	transaction_id: null,
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case 'P2P_ADD_MESSAGE':
			return { ...state, chat: payload, transaction_id: payload.id };
		case 'P2P_GET_STATUS': {
			return { ...state, status: !state.status, transaction_id: payload.id };
		}
		default:
			return state;
	}
};
