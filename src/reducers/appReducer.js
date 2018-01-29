import {
	SET_NOTIFICATION,
	CLOSE_NOTIFICATION,
	CLOSE_ALL_NOTIFICATION,
	CHANGE_LANGUAGE
} from '../actions/appActions';

import { getLanguage } from '../utils/string';

const EMPTY_NOTIFICATION = {
	type: '',
	message: '',
	timestamp: undefined
};

const INITIAL_STATE = {
	notifications: [],
	notificationsQueue: [],
	activeNotification: EMPTY_NOTIFICATION,
	language: getLanguage()
};

const reducer = (state = INITIAL_STATE, { type, payload = {} }) => {
	switch (type) {
		case SET_NOTIFICATION: {
			const newNotification =
				payload.type.indexOf('NOTIFICATIONS') > -1 ? [payload] : [];
			const notifications = newNotification.concat(state.notifications);
			const notificationsQueue = [].concat(state.notificationsQueue);
			let activeNotification = { ...state.activeNotification };

			if (payload.show) {
				if (state.activeNotification.type !== '') {
					notificationsQueue.push(payload);
				} else {
					activeNotification = { ...payload };
				}
			}

			return {
				...state,
				notifications,
				activeNotification,
				notificationsQueue
			};
		}

		case CLOSE_NOTIFICATION: {
			const notificationsQueue = [].concat(state.notificationsQueue);
			const activeNotification =
				notificationsQueue.length > 0
					? notificationsQueue.splice(0, 1)[0]
					: EMPTY_NOTIFICATION;

			return {
				...state,
				notificationsQueue,
				activeNotification
			};
		}

		case CLOSE_ALL_NOTIFICATION:
			return {
				...state,
				notificationsQueue: [],
				activeNotification: EMPTY_NOTIFICATION
			};

		case CHANGE_LANGUAGE:
			return {
				...state,
				language: payload.language
			};
		default:
			return state;
	}
};

export default reducer;
