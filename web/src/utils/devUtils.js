export const delay = (ms = 3000) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const fakeRequest = async (data) => {
	await delay();
	return data;
};
