

import { rebind, merge } from "../utils";

import baseIndicator from "./baseIndicator";
import { bollingerband } from "../calculator";

var ALGORITHM_TYPE = "BollingerBand";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE);

	var underlyingAlgorithm = bollingerband();

	var mergedAlgorithm = merge().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.bollingerBand = indicator;
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
	rebind(indicator, underlyingAlgorithm, "options");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
//# sourceMappingURL=bollingerBand.js.map