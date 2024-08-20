// Set p2pChat from websocket
export function p2pAddMessage(message) {
	return {
		type: 'P2P_ADD_MESSAGE',
		payload: message,
	};
}

export function p2pGetStatus(message) {
	return {
		type: 'P2P_GET_STATUS',
		payload: message,
	};
}
