class Cache {
	constructor() {
		this.cache = {};
	}

	setKey(key, value) {
		this.cache[key] = value;
	}

	getKey(key) {
		return this.cache[key];
	}

	deleteKey(key) {
		delete this.cache[key];
	}

	hasKey(key) {
		return !!this.cache[key];
	}
}

module.exports = new Cache();
