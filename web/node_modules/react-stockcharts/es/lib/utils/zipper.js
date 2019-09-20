

/* an extension to d3.zip so we call a function instead of an array */

import { min } from "d3-array";

import identity from "./identity";

export default function zipper() {
	var combine = identity;

	function zip() {
		var n = arguments.length;
		if (!n) return [];
		var m = min(arguments, d3_zipLength);

		// eslint-disable-next-line prefer-const
		var i = void 0,
		    zips = new Array(m);
		for (i = -1; ++i < m;) {
			for (var j = -1, _zip = zips[i] = new Array(n); ++j < n;) {
				_zip[j] = arguments[j][i];
			}
			zips[i] = combine.apply(this, zips[i]);
		}
		return zips;
	}
	function d3_zipLength(d) {
		return d.length;
	}
	zip.combine = function (x) {
		if (!arguments.length) {
			return combine;
		}
		combine = x;
		return zip;
	};
	return zip;
}
//# sourceMappingURL=zipper.js.map