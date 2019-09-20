var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/relativeStrengthIndex.js

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

import { isDefined, last, slidingWindow, path } from "../utils";
import { RSI as defaultOptions } from "./defaultOptionsForComputation";

export default function () {

	var options = defaultOptions;

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize,
		    sourcePath = _options.sourcePath;


		var source = path(sourcePath);
		var prevAvgGain = void 0,
		    prevAvgLoss = void 0;
		var rsiAlgorithm = slidingWindow().windowSize(windowSize).accumulator(function (values) {

			var avgGain = isDefined(prevAvgGain) ? (prevAvgGain * (windowSize - 1) + last(values).gain) / windowSize : mean(values, function (each) {
				return each.gain;
			});

			var avgLoss = isDefined(prevAvgLoss) ? (prevAvgLoss * (windowSize - 1) + last(values).loss) / windowSize : mean(values, function (each) {
				return each.loss;
			});

			var relativeStrength = avgGain / avgLoss;
			var rsi = 100 - 100 / (1 + relativeStrength);

			prevAvgGain = avgGain;
			prevAvgLoss = avgLoss;

			return rsi;
		});

		var gainsAndLossesCalculator = slidingWindow().windowSize(2).undefinedValue(function () {
			return [0, 0];
		}).accumulator(function (tuple) {
			var prev = tuple[0];
			var now = tuple[1];
			var change = source(now) - source(prev);
			return {
				gain: Math.max(change, 0),
				loss: Math.abs(Math.min(change, 0))
			};
		});

		var gainsAndLosses = gainsAndLossesCalculator(data);

		var rsiData = rsiAlgorithm(gainsAndLosses);

		return rsiData;
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
//# sourceMappingURL=rsi.js.map