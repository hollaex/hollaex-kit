var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { slidingWindow, path } from "../utils";
import { ForceIndex as defaultOptions } from "./defaultOptionsForComputation";

export default function () {

	var options = defaultOptions;

	function calculator(data) {
		var _options = options,
		    sourcePath = _options.sourcePath,
		    volumePath = _options.volumePath;


		var source = path(sourcePath);
		var volume = path(volumePath);

		var forceIndexCalulator = slidingWindow().windowSize(2).accumulator(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    prev = _ref2[0],
			    curr = _ref2[1];

			return (source(curr) - source(prev)) * volume(curr);
		});

		var forceIndex = forceIndexCalulator(data);

		return forceIndex;
	}
	calculator.undefinedLength = function () {
		return 2;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = _extends({}, defaultOptions, x);
		return calculator;
	};

	return calculator;
}
//# sourceMappingURL=forceIndex.js.map