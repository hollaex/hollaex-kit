export const generateHeaders = (coins = {}) => {
	const headers = [
		{ label: 'ID', key: 'id' },
		{ label: 'Name', key: 'name' },
		{ label: 'Email', key: 'email' }
	];
	Object.keys(coins).map(coin => {
		headers.push({ label: coin, key: `${coin}_balance` });
	});
	headers.push({ label: 'created at', key: 'created_at' });
	return headers;
};
