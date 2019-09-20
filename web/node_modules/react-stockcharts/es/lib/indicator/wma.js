

import { rebind, merge } from "../utils";

import { wma } from "../calculator";

import baseIndicator from "./baseIndicator";

var ALGORITHM_TYPE = "WMA";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE).accessor(function (d) {
		return d.wma;
	});

	var underlyingAlgorithm = wma();

	var mergedAlgorithm = merge().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.wma = indicator;
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
	rebind(indicator, underlyingAlgorithm, "undefinedLength");
	rebind(indicator, underlyingAlgorithm, "options");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
//# sourceMappingURL=wma.js.map