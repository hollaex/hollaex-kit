import axios from 'axios';

export const performConfirmLogin = (token) => {
	return axios.post('/user/confirm-login', { token });
};
