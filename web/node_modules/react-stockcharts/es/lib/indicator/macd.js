

import { rebind, merge } from "../utils";

import { macd } from "../calculator";

import baseIndicator from "./baseIndicator";
import { MACD as appearanceOptions } from "./defaultOptionsForAppearance";

var ALGORITHM_TYPE = "MACD";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE).fill(appearanceOptions.fill).stroke(appearanceOptions.stroke).accessor(function (d) {
		return d.macd;
	});

	var underlyingAlgorithm = macd();

	var mergedAlgorithm = merge().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.macd = indicator;
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
//# sourceMappingURL=macd.js.map