var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import forceIndex from "./forceIndex";
import ema from "./ema";
import sma from "./sma";
import { zipper } from "../utils";
import { SmoothedForceIndex as defaultOptions } from "./defaultOptionsForComputation";

export default function () {

	var underlyingAlgorithm = forceIndex();
	var merge = zipper().combine(function (force, smoothed) {
		return { force: force, smoothed: smoothed };
	});

	var options = defaultOptions;
	function calculator(data) {
		var _options = options,
		    smoothingType = _options.smoothingType,
		    smoothingWindow = _options.smoothingWindow;
		var _options2 = options,
		    sourcePath = _options2.sourcePath,
		    volumePath = _options2.volumePath;


		var algo = underlyingAlgorithm.options({ sourcePath: sourcePath, volumePath: volumePath });

		var force = algo(data);

		var ma = smoothingType === "ema" ? ema() : sma();
		var forceMA = ma.options({
			windowSize: smoothingWindow,
			sourcePath: undefined
		});

		var smoothed = forceMA(force);
		return merge(force, smoothed);
	}

	calculator.undefinedLength = function () {
		var _options3 = options,
		    smoothingWindow = _options3.smoothingWindow;

		return underlyingAlgorithm.undefinedLength() + smoothingWindow - 1;
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
//# sourceMappingURL=smoothedForceIndex.js.map