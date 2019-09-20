

import { rebind, merge } from "../utils";

import { sar } from "../calculator";

import baseIndicator from "./baseIndicator";

var ALGORITHM_TYPE = "SMA";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE).accessor(function (d) {
		return d.sar;
	});

	var underlyingAlgorithm = sar();

	var mergedAlgorithm = merge().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.sar = indicator;
	});

	var indicator = function indicator(data) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { merge: true };

		if (options.merge) {
			if (!base.accessor()) throw new Error("Set an accessor to " + ALGORITHM_TYPE + " before calculating");
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};

	rebind(indicator, base, "id", "accessor", "stroke", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "undefinedLength");
	rebind(indicator, underlyingAlgorithm, "options");
	rebind(indicator, mergedAlgorithm, "merge");

	return indicator;
}
//# sourceMappingURL=sar.js.map