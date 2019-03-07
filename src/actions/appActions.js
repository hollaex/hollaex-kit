import { setLanguage as storeLanguageInBrowser } from '../utils/string';
import { DEFAULT_LANGUAGE } from '../config/constants';
import axios from 'axios';

export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';
export const CLOSE_ALL_NOTIFICATION = 'CLOSE_ALL_NOTIFICATION';
export const SET_SNACK_NOTIFICATION = 'SET_SNACK_NOTIFICATION';
export const CLOSE_SNACK_NOTIFICATION = 'CLOSE_SNACK_NOTIFICATION';
export const NOTIFICATIONS = {
	ORDERS: 'NOTIFICATIONS_ORDERS',
	TRADES: 'NOTIFICATIONS_TRADES',
	DEPOSIT: 'NOTIFICATIONS_DEPOSIT',
	WITHDRAWAL: 'NOTIFICATIONS_WITHDRAWAL',
	ERROR: 'NOTIFICATIONS_ERROR',
	LOGOUT: 'NOTIFICATIONS_LOGOUT',
	VERIFICATION: 'NOTIFICATIONS_VERIFICATION',
	CONTACT_FORM: 'NOTIFICATIONS_CONTACT_FORM',
	HELPFUL_RESOURCES_FORM: 'HELPFUL_RESOURCES_FORM',
	NEW_ORDER: 'NOTIFICATIONS_NEW_ORDER',
	GENERATE_API_KEY: 'NOTIFICATIONS_GENERATE_API_KEY',
	CREATED_API_KEY: 'NOTIFICATIONS_CREATED_API_KEY',
	GENERATE_ADDRESS: 'NOTIFICATIONS_GENERATE_ADDRESS',
	WITHDRAWAL_EMAIL_CONFIRMATION: 'WITHDRAWAL_EMAIL_CONFIRMATION',
};
export const CONTACT_FORM = 'CONTACT_FORM';
export const HELPFUL_RESOURCES_FORM = 'HELPFUL_RESOURCES_FORM';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const SET_ANNOUNCEMENT = 'SET_ANNOUNCEMENT';
export const SET_UNREAD = 'SET_UNREAD';
export const SET_PAIRS = 'SET_PAIRS';
export const CHANGE_PAIR = 'CHANGE_PAIR';
export const SET_TICKERS = 'SET_TICKERS';
export const CHANGE_THEME = 'CHANGE_THEME';
export const SET_ORDER_LIMITS = 'SET_ORDER_LIMITS';
export const FEES_STRUCTURE_AND_LIMITS = 'FEES_STRUCTURE_AND_LIMITS';
export const RISK_PORTFOLIO_ORDER_WARING = 'RISK_PORTFOLIO_ORDER_WARING';

export const USER_TYPES = {
	USER_TYPE_NORMAL: 'normal',
	USER_TYPE_ADMIN: 'admin'
};

export const MESSAGE_TYPES = {
	MESSAGE_TYPE_NORMAL: 'normal',
	MESSAGE_TYPE_REPLY: 'reply',
	MESSAGE_TYPE_ANNOUNCEMENT: 'announcement',
	MESSAGE_TYPE_IMAGE: 'image'
};

export const setNotification = (type = '', data = {}, show = true) => ({
	type: SET_NOTIFICATION,
	payload: {
		type,
		data,
		show,
		timestamp: Date.now()
	}
});

export const closeNotification = () => ({
	type: CLOSE_NOTIFICATION,
	payload: {}
});

export const closeAllNotification = () => ({
	type: CLOSE_ALL_NOTIFICATION,
	payload: {}
});

export const setSnackNotification = (data = {}) => ({
	type: SET_SNACK_NOTIFICATION,
	payload: data
});

export const closeSnackNotification = () => ({
	type: CLOSE_SNACK_NOTIFICATION,
	payload: {}
});

export const openContactForm = (data = {}) =>
	setNotification(CONTACT_FORM, data, true);

export const openHelpfulResourcesForm = (data = {}) =>
	setNotification(HELPFUL_RESOURCES_FORM, data, true);

export const setLanguage = (value = DEFAULT_LANGUAGE) => {
	const language = storeLanguageInBrowser(value);
	return {
		type: CHANGE_LANGUAGE,
		payload: {
			language
		}
	};
};

export const sendSupportMail = (values = {}) => {
	return axios.post('/support', values);
};

export const setAnnouncements = (announcements) => ({
	type: SET_ANNOUNCEMENT,
	payload: {
		announcements
	}
});

export const setChatUnreadMessages = (chatUnreadMessages = 0) => ({
	type: SET_UNREAD,
	payload: {
		chatUnreadMessages
	}
});

export const changeTheme = (theme = '') => ({
	type: CHANGE_THEME,
	payload: {
		theme
	}
});

export const setPairs = (pairs) => ({
	type: SET_PAIRS,
	payload: {
		pairs
	}
});

export const changePair = (pair) => ({
	type: CHANGE_PAIR,
	payload: {
		pair
	}
});

export const setTickers = (data) => ({
	type: SET_TICKERS,
	payload: data
});

export const setOrderLimits = (data) => ({
	type: SET_ORDER_LIMITS,
	payload: data
});

export const openFeesStructureandLimits = (data = {}) =>
	setNotification(FEES_STRUCTURE_AND_LIMITS, data, true);

export const openRiskPortfolioOrderWarning = (data = {}) =>
	setNotification(RISK_PORTFOLIO_ORDER_WARING, data, true);
