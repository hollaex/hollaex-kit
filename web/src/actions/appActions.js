import { setLanguage as storeLanguageInBrowser } from '../utils/string';
import { hasTheme } from 'utils/theme';
import { DEFAULT_LANGUAGE, LANGUAGE_KEY, PLUGIN_URL } from 'config/constants';
import axios from 'axios';
import querystring from 'query-string';
import store from 'store';

export const SET_IS_READY = 'SET_IS_READY';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';
export const CLOSE_ALL_NOTIFICATION = 'CLOSE_ALL_NOTIFICATION';
export const SET_SNACK_NOTIFICATION = 'SET_SNACK_NOTIFICATION';
export const CLOSE_SNACK_NOTIFICATION = 'CLOSE_SNACK_NOTIFICATION';
export const SET_SNACK_DIALOG = 'SET_SNACK_DIALOG';
export const CLOSE_SNACK_DIALOG = 'CLOSE_SNACK_DIALOG';
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
	INVITE_FRIENDS: 'INVITE_FRIENDS',
	STAKE_TOKEN: 'STAKE_TOKEN',
	DEPOSIT_INFO: 'DEPOSIT_INFO',
	XHT_SUCCESS_ACCESS: 'XHT_SUCCESS_ACCESS',
	UNDEFINED_ERROR: 'UNDEFINED_ERROR',
};
export const CONTACT_FORM = 'CONTACT_FORM';
export const HELPFUL_RESOURCES_FORM = 'HELPFUL_RESOURCES_FORM';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const SET_ANNOUNCEMENT = 'SET_ANNOUNCEMENT';
export const SET_APP_ANNOUNCEMENT = 'SET_APP_ANNOUNCEMENT';
export const SET_UNREAD = 'SET_UNREAD';
export const SET_PAIRS = 'SET_PAIRS';
export const CHANGE_PAIR = 'CHANGE_PAIR';
export const SET_TICKERS = 'SET_TICKERS';
export const SET_TICKER_FROM_TRADE = 'SET_TICKER_FROM_TRADE';
export const CHANGE_THEME = 'CHANGE_THEME';
export const SET_ORDER_LIMITS = 'SET_ORDER_LIMITS';
export const FEES_STRUCTURE_AND_LIMITS = 'FEES_STRUCTURE_AND_LIMITS';
export const RISK_PORTFOLIO_ORDER_WARING = 'RISK_PORTFOLIO_ORDER_WARING';
export const RISKY_ORDER = 'RISKY_ORDER';
export const LOGOUT_CONFORMATION = 'LOGOUT_CONFORMATION';
export const SET_CURRENCIES = 'SET_CURRENCIES';
export const SET_CONFIG = 'SET_CONFIG';
export const SET_PLUGINS = 'SET_PLUGINS';
export const REQUEST_XHT_ACCESS = 'REQUEST_XHT_ACCESS';
export const SET_INFO = 'SET_INFO';
export const SET_WAVE_AUCTION = 'SET_WAVE_AUCTION';
export const SET_PLUGINS_REQUEST = 'SET_PLUGINS_REQUEST';
export const SET_PLUGINS_SUCCESS = 'SET_PLUGINS_SUCCESS';
export const SET_PLUGINS_FAILURE = 'SET_PLUGINS_FAILURE';
export const SET_CONFIG_LEVEL = 'SET_CONFIG_LEVEL';
export const ADD_TO_FAVOURITES = 'ADD_TO_FAVOURITES';
export const REMOVE_FROM_FAVOURITES = 'REMOVE_FROM_FAVOURITES';
export const CHANGE_HOME_PAGE_SETTING = 'CHANGE_HOME_PAGE_SETTING';
export const SET_WEB_VIEWS = 'SET_WEB_VIEWS';
export const SET_HELPDESK_INFO = 'SET_HELP_INFO';
export const SET_INJECTED_VALUES = 'SET_INJECTED_VALUES';
export const SET_INJECTED_HTML = 'SET_INJECTED_HTML';

export const USER_TYPES = {
	USER_TYPE_NORMAL: 'normal',
	USER_TYPE_ADMIN: 'admin',
	USER_TYPE_HAP: 'hap',
};

export const MESSAGE_TYPES = {
	MESSAGE_TYPE_NORMAL: 'normal',
	MESSAGE_TYPE_REPLY: 'reply',
	MESSAGE_TYPE_ANNOUNCEMENT: 'announcement',
	MESSAGE_TYPE_IMAGE: 'image',
};

export const setIsReady = (isReady = true) => ({
	type: SET_IS_READY,
	payload: isReady,
});

export const setNotification = (type = '', data = {}, show = true) => ({
	type: SET_NOTIFICATION,
	payload: {
		type,
		data,
		show,
		timestamp: Date.now(),
	},
});

export const closeNotification = () => ({
	type: CLOSE_NOTIFICATION,
	payload: {},
});

export const closeAllNotification = () => ({
	type: CLOSE_ALL_NOTIFICATION,
	payload: {},
});

export const setSnackNotification = (data = {}) => ({
	type: SET_SNACK_NOTIFICATION,
	payload: data,
});

export const closeSnackNotification = () => ({
	type: CLOSE_SNACK_NOTIFICATION,
	payload: {},
});

export const setSnackDialog = (data = {}) => ({
	type: SET_SNACK_DIALOG,
	payload: data,
});

export const closeSnackDialog = (id) => ({
	type: CLOSE_SNACK_DIALOG,
	payload: { dialogId: id },
});

export const openContactForm = () => {
	const {
		app: {
			helpdeskInfo: { has_helpdesk, helpdesk_endpoint },
			constants: { links: { helpdesk } = {} },
		},
	} = store.getState();

	if (window) {
		if (has_helpdesk) {
			axios
				.get(`${PLUGIN_URL}${helpdesk_endpoint}`)
				.then(({ data: { url } }) => {
					window.open(url, '_blank');
					return setNotification(CONTACT_FORM, { helpdesk }, false);
				});
		} else if (helpdesk) {
			window.open(helpdesk, '_blank');
		}
	}

	return setNotification(CONTACT_FORM, { helpdesk }, false);
};

export const openHelpfulResourcesForm = (data = {}) =>
	setNotification(HELPFUL_RESOURCES_FORM, data, true);

export const setLanguage = (value = DEFAULT_LANGUAGE) => {
	const language = storeLanguageInBrowser(value);
	return {
		type: CHANGE_LANGUAGE,
		payload: {
			language,
		},
	};
};

export const sendSupportMail = (values = {}) => {
	const formData = new FormData();
	if (values.attachment instanceof Array) {
		values.attachment.forEach((data, key) => {
			formData.append(`attachment_${key}`, data);
		});
	}

	Object.keys(values).forEach((data, key) => {
		if (data !== 'attachment') {
			formData.append(data, values[data]);
		}
	});

	return axios({
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
		url: '/support',
		method: 'POST',
	});
};

export const setAnnouncements = (announcements) => ({
	type: SET_ANNOUNCEMENT,
	payload: {
		announcements,
	},
});

export const setChatUnreadMessages = (chatUnreadMessages = 0) => ({
	type: SET_UNREAD,
	payload: {
		chatUnreadMessages,
	},
});

export const changeTheme = (theme = '') => ({
	type: CHANGE_THEME,
	payload: {
		theme,
	},
});

export const setPairs = (pairs) => ({
	type: SET_PAIRS,
	payload: {
		pairs,
	},
});

export const changePair = (pair) => ({
	type: CHANGE_PAIR,
	payload: {
		pair,
	},
});

export const getTickers = () => {
	return (dispatch) => {
		axios.get('/ticker/all').then((res) => {
			dispatch({
				type: SET_TICKERS,
				payload: res.data,
			});
		});
	};
};

export const setTickers = (data) => ({
	type: SET_TICKER_FROM_TRADE,
	payload: data,
});

export const setOrderLimits = (data) => ({
	type: SET_ORDER_LIMITS,
	payload: data,
});

export const setCurrencies = (coins) => ({
	type: SET_CURRENCIES,
	payload: {
		coins,
	},
});

export const setConfig = (constants = {}) => {
	let features = {};
	if (constants) {
		if (constants.features) {
			features = constants.features;
		}
	}
	return {
		type: SET_CONFIG,
		payload: {
			constants,
			features,
		},
	};
};

export const setPlugins = (enabledPlugins) => {
	return {
		type: SET_PLUGINS,
		payload: {
			enabledPlugins,
		},
	};
};

export const setWebViews = (enabledPlugins) => {
	return {
		type: SET_WEB_VIEWS,
		payload: {
			enabledPlugins,
		},
	};
};

export const setHelpdeskInfo = (enabledPlugins) => {
	return {
		type: SET_HELPDESK_INFO,
		payload: {
			enabledPlugins,
		},
	};
};

export const setInfo = (info) => ({
	type: SET_INFO,
	payload: {
		info,
	},
});

export const openFeesStructureandLimits = (data = {}) =>
	setNotification(FEES_STRUCTURE_AND_LIMITS, data, true);

export const openRiskPortfolioOrderWarning = (data = {}) =>
	setNotification(RISK_PORTFOLIO_ORDER_WARING, data, true);

export const logoutconfirm = (data = {}) =>
	setNotification(LOGOUT_CONFORMATION, data, true);

export const requestPlugins = () => axios.get(`${PLUGIN_URL}/plugins`);
export const requestInitial = () => axios.get('/kit');
export const requestConstant = () => axios.get('/constants');
export const requestAdminData = () => axios.get('/admin/kit');
export const requestPlugin = (params) =>
	axios.get(`${PLUGIN_URL}/plugins?${querystring.stringify(params)}`);

export const getExchangeInfo = () => {
	return (dispatch) => {
		axios.get('/kit').then((res) => {
			if (res && res.data) {
				dispatch(setConfig(res.data));
				if (res.data.defaults) {
					const themeColor = localStorage.getItem('theme');
					const isThemeValid = hasTheme(themeColor, res.data.color);
					const language = localStorage.getItem(LANGUAGE_KEY);
					if (res.data.defaults.theme && (!themeColor || !isThemeValid)) {
						dispatch(changeTheme(res.data.defaults.theme));
						localStorage.setItem('theme', res.data.defaults.theme);
					}
					if (!language && res.data.defaults.language) {
						dispatch(setLanguage(res.data.defaults.language));
					}
				}
				if (res.data.info) {
					dispatch({
						type: SET_INFO,
						payload: { info: { ...res.data.info } },
					});
				}
			}
		});
	};
};

export const getWaveAuction = () => {
	return (dispatch) => {
		axios.get('/wave').then((res) => {
			if (res && res.data && res.data.data) {
				dispatch({
					type: SET_WAVE_AUCTION,
					payload: { data: res.data.data },
				});
			}
		});
	};
};

export const getAnnouncement = () => (dispatch) => {
	return axios
		.get(`${PLUGIN_URL}/plugins/announcements`)
		.then((res) => {
			if (res.data && res.data.data) {
				dispatch({
					type: SET_APP_ANNOUNCEMENT,
					payload: { announcements: res.data.data },
				});
			}
		})
		.catch((err) => {});
};

export const requestAvailPlugins = () => (dispatch) => {
	dispatch({ type: SET_PLUGINS_REQUEST });
	return axios
		.get(`${PLUGIN_URL}/plugins`)
		.then((res) => {
			if (res.data) {
				let available = res.data.available ? [...res.data.available] : [];
				let enabled = res.data.enabled.filter(
					(val) => !available.includes(val)
				);
				dispatch({
					type: SET_PLUGINS_SUCCESS,
					payload: [...available, ...enabled],
				});
			}
		})
		.catch((err) => {
			dispatch({ type: SET_PLUGINS_FAILURE });
		});
};

export const requestTiers = () => (dispatch) => {
	return axios
		.get('/tiers')
		.then((res) => {
			dispatch({ type: SET_CONFIG_LEVEL, payload: res.data });
		})
		.catch((err) => {});
};

export const addToFavourites = (payload) => ({
	type: ADD_TO_FAVOURITES,
	payload,
});

export const removeFromFavourites = (payload) => ({
	type: REMOVE_FROM_FAVOURITES,
	payload,
});

export const setHomePageSetting = (home_page = false) => ({
	type: CHANGE_HOME_PAGE_SETTING,
	payload: home_page,
});

export const setInjectedValues = (payload) => ({
	type: SET_INJECTED_VALUES,
	payload,
});

export const setInjectedHTML = (payload) => ({
	type: SET_INJECTED_HTML,
	payload,
});
