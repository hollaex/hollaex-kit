var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { sum } from "d3-array";

import { slidingWindow } from "../utils";
import { WMA as defaultOptions } from "./defaultOptionsForComputation";

export default function () {

	var options = defaultOptions;

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize,
		    sourcePath = _options.sourcePath;


		var weight = windowSize * (windowSize + 1) / 2;

		var waverage = slidingWindow().windowSize(windowSize).sourcePath(sourcePath).accumulator(function (values) {
			var total = sum(values, function (v, i) {
				return (i + 1) * v;
			});
			return total / weight;
		});

		return waverage(data);
	}
	calculator.undefinedLength = function () {
		var _options2 = options,
		    windowSize = _options2.windowSize;


		return windowSize - 1;
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
//# sourceMappingURL=wma.js.map