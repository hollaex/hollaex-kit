

import { rebind, merge } from "../utils";

import { tma } from "../calculator";

import baseIndicator from "./baseIndicator";

var ALGORITHM_TYPE = "TMA";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE).accessor(function (d) {
		return d.tma;
	});

	var underlyingAlgorithm = tma();

	var mergedAlgorithm = merge().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.tma = indicator;
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
//# sourceMappingURL=tma.js.map