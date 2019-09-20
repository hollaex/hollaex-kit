'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (typeof document !== 'undefined') {
		if (document.contains) {
			return document.contains;
		}
		if (document.body && document.body.contains) {
			return document.body.contains;
		}
	}
	return implementation;
};
