import axios from 'axios';

export const performConfirmLogin = (token, freeze_account = false) => {
	return axios.post('/user/confirm-login', { token, freeze_account });
};
