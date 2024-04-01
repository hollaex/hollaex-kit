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
export const getLastValuesFromParts = (arr) => {
	const partSize = arr.length/24;
	const partsOf7 = chunkArray(arr, partSize);

	// Get random values from each part
	const randomValues = partsOf7.map((part) => {
		return part[part.length-1];
	});

	return randomValues;
};
