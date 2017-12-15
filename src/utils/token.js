import { TOKEN_KEY } from '../config/constants';

const TOKEN_TIME_KEY = 'time';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
}

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIME_KEY, new Date().getTime());
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(TOKEN_TIME_KEY);
}

export const getTokenTimestamp = () => {
  return localStorage.getItem(TOKEN_TIME_KEY);
}
