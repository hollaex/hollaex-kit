import axios from 'axios';
import { API_URL } from './constants';
import store from 'store';
import { logout } from 'actions/authAction';
import { ERROR_TOKEN_EXPIRED } from 'components/Notification/Logout';
import { isLoggedIn } from 'utils/token';
import { startNetworkTrace, stopNetworkTrace } from './firebase';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = API_URL;

// Request interceptor: Start network trace
axios.interceptors.request.use(
	(config) => {
		// Generate full URL
		const url = config.url || '';
		const baseURL = config.baseURL || axios.defaults.baseURL || '';
		const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

		// Start trace and attach to config
		const trace = startNetworkTrace(fullUrl);
		config._firebaseTrace = trace;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor: Stop network trace and handle errors
axios.interceptors.response.use(
	(response) => {
		// Stop trace on successful response
		if (response.config?._firebaseTrace) {
			stopNetworkTrace(response.config._firebaseTrace);
		}
		return response;
	},
	(error) => {
		// Stop trace on error
		if (error.config?._firebaseTrace) {
			stopNetworkTrace(error.config._firebaseTrace);
		}

		if (error?.response?.status === 401 && isLoggedIn()) {
			store.dispatch(logout(ERROR_TOKEN_EXPIRED));
		}

		return Promise.reject(error);
	}
);
