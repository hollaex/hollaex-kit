

import { rebind, merge } from "../utils";

import { rsi } from "../calculator";

import baseIndicator from "./baseIndicator";

var ALGORITHM_TYPE = "RSI";

export default function () {
	var base = baseIndicator().type(ALGORITHM_TYPE).accessor(function (d) {
		return d.rsi;
	});

	var underlyingAlgorithm = rsi();

	var mergedAlgorithm = merge().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.rsi = indicator;
	});

	var indicator = function indicator(data) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { merge: true };

		if (options.merge) {
			if (!base.accessor()) throw new Error("Set an accessor to " + ALGORITHM_TYPE + " before calculating");
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};

	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "options", "undefinedLength");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
//# sourceMappingURL=rsi.js.map