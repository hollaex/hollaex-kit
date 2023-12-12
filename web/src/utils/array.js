// Function to split an array into parts of a specific size
export const chunkArray = (arr, size) => {
	const chunkedArr = [];
	let index = 0;

	while (index < arr.length) {
		chunkedArr.push(arr.slice(index, index + size));
		index += size;
	}

	return chunkedArr;
};

// Function to get a random element from each subarray and combine them into a single array
export const getRandomValuesFromParts = (arr) => {
	// Split the array into parts of 7
	const partsOf7 = chunkArray(arr, 7);

	// Get random values from each part
	const randomValues = partsOf7.map((part) => {
		const randomIndex = Math.floor(Math.random() * part.length);
		return part[randomIndex];
	});

	return randomValues;
};
