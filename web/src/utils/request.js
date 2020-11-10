import 'whatwg-fetch';
import { API_URL } from '../config/constants';

import { getToken } from './token';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
const parseJSON = (response) => {
	return response.json();
};

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	return response.json().then((data) => {
		const error = new Error(response.statusText);
		error.data = data;
		throw error;
	});
	// .catch((err) => {
	//   const error = new Error(response.statusText);
	//   error.response = response;
	//   throw error;
	// });
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {string} apiUrl    The API URL we want to request, default to API_URL
 *
 * @return {object}           The response data
 */
export const requestAuthenticated = (
	url,
	paramOptions,
	headers,
	apiUrl,
	method = 'GET'
) => {
	const TOKEN = getToken();
	const options = {
		method,
		headers: headers
			? {
					...headers,
					authorization: `Bearer ${TOKEN}`,
			  }
			: {
					'Content-Type': 'application/json',
					authorization: `Bearer ${TOKEN}`,
			  },
		...paramOptions,
	};
	return request(url, options, apiUrl);
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {string} apiUrl    The API URL we want to request, default to API_URL
 *
 * @return {object}           The response data
 */
const request = (url, options, apiUrl = API_URL) => {
	return fetch(`${apiUrl}${url}`, options).then(checkStatus).then(parseJSON);
};

export default request;
