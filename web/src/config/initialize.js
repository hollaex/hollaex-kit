import axios from 'axios';
import { API_URL } from './constants';
import store from 'store';
import { logout } from 'actions/authAction';
import { ERROR_TOKEN_EXPIRED } from 'components/Notification/Logout';
import { isLoggedIn } from 'utils/token';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = API_URL;

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 403 && isLoggedIn()) {
			store.dispatch(logout(ERROR_TOKEN_EXPIRED));
		}

		return Promise.reject(error);
	}
);
