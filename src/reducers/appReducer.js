import {
	SET_NOTIFICATION,
	CLOSE_NOTIFICATION,
	CLOSE_ALL_NOTIFICATION,
	SET_SNACK_NOTIFICATION,
	CLOSE_SNACK_NOTIFICATION,
	CHANGE_LANGUAGE,
	SET_ANNOUNCEMENT,
	CHANGE_THEME,
	SET_PAIRS,
	SET_TICKERS,
	SET_UNREAD,
	SET_ORDER_LIMITS,
	SET_TICKER_FROM_TRADE
} from '../actions/appActions';
import { THEME_DEFAULT } from '../config/constants';
import { getLanguage } from '../utils/string';
import { getTheme } from '../utils/theme';

const EMPTY_NOTIFICATION = {
	type: '',
	message: '',
	contactFormData: {},
	helpfulResourcesFormData: {},
	timestamp: undefined
};

const EMPTY_SNACK_NOTIFICATION = {
	showSnack: false,
	icon: '',
	useSvg: true,
	content: ''
};

const INITIAL_STATE = {
	announcements: [],
	notifications: [],
	notificationsQueue: [],
	chatUnreadMessages: 0,
	activeNotification: EMPTY_NOTIFICATION,
	snackNotification: EMPTY_SNACK_NOTIFICATION,
	theme: THEME_DEFAULT,
	language: getLanguage(),
	pairs: {},
	pair: '',
	tickers: {},
	orderLimits: {}
};

const reducer = (state = INITIAL_STATE, { type, payload = {} }) => {
	switch (type) {
		case SET_PAIRS:
			return {
				...state,
				pairs: payload.pairs
			};
		case 'CHANGE_PAIR':
			return {
				...state,
				pair: payload.pair
			};
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
				contactFormData: payload.data,
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
				activeNotification,
				contactFormData: {}
			};
		}

		case SET_SNACK_NOTIFICATION:
			return {
				...state,
				snackNotification: {
					...state.snackNotification,
					showSnack: true,
					icon: payload.icon ? payload.icon : '',
					useSvg: payload.useSvg ? payload.useSvg : true,
					content: payload.content ? payload.content : ''
				}
			};
		
		case CLOSE_SNACK_NOTIFICATION:
			return {
				...state,
				snackNotification: EMPTY_SNACK_NOTIFICATION
			};

		case SET_UNREAD:
			return {
				...state,
				chatUnreadMessages: payload.chatUnreadMessages
			};

		case SET_ANNOUNCEMENT:
			const announcements = state.announcements.concat(payload.announcements);
			return {
				...state,
				announcements
			};

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

		case CHANGE_THEME:
			return {
				...state,
				theme: getTheme(payload.theme)
			};
		case SET_TICKERS:
			return {
				...state,
				tickers: {
					...state.tickers,
					...payload
				}
			};
		case SET_TICKER_FROM_TRADE:
			let tempTickers = {};
			let pairs = Object.keys(state.pairs);
			Object.keys(payload).map(key => {
				if (pairs.includes(key)) {
					let temp = state.tickers[key] || {};
					let pairTrade = payload[key][0];
					let close = pairTrade && pairTrade.price
						? pairTrade.price
						: temp.close
							? temp.close
							: 0;
					tempTickers[key] = {
						...temp,
						close
					}
				}
			});
			return {
				...state,
				tickers: {
					...state.tickers,
					...tempTickers
				}
			};
		case SET_ORDER_LIMITS:
			return {
				...state,
				orderLimits: payload
			};
		default:
			return state;
	}
};

export default reducer;
