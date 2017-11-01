import { TOKEN_KEY } from '../config/constants';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
}

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('time', new Date().getTime());
}

export const removeToken = () => {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.clear();
}
