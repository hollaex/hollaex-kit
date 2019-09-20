var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/elderRay.js

The MIT License (MIT)

Copyright (c) 2014-2015 Scott Logic Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { mean } from "d3-array";

import ema from "./ema";

import { ElderRay as defaultOptions } from "./defaultOptionsForComputation";
import { isDefined, zipper, slidingWindow } from "../utils";

export default function () {

	var options = defaultOptions;
	var ohlc = function ohlc(d) {
		return { open: d.open, high: d.high, low: d.low, close: d.close };
	};

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize,
		    sourcePath = _options.sourcePath,
		    movingAverageType = _options.movingAverageType;


		var meanAlgorithm = movingAverageType === "ema" ? ema().options({ windowSize: windowSize, sourcePath: sourcePath }) : slidingWindow().windowSize(windowSize).accumulator(function (values) {
			return mean(values);
		}).sourcePath(sourcePath);

		var zip = zipper().combine(function (datum, mean) {
			var bullPower = isDefined(mean) ? ohlc(datum).high - mean : undefined;
			var bearPower = isDefined(mean) ? ohlc(datum).low - mean : undefined;
			return { bullPower: bullPower, bearPower: bearPower };
		});

		var newData = zip(data, meanAlgorithm(data));
		return newData;
	}
	calculator.undefinedLength = function () {
		var _options2 = options,
		    windowSize = _options2.windowSize;

		return windowSize - 1;
	};
	calculator.ohlc = function (x) {
		if (!arguments.length) {
			return ohlc;
		}
		ohlc = x;
		return calculator;
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
//# sourceMappingURL=elderRay.js.map