

import { rebind, merge } from "../utils";

import { change } from "../calculator";

import baseIndicator from "./baseIndicator";

var ALGORITHM_TYPE = "Change";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE);

	var underlyingAlgorithm = change();

	var mergedAlgorithm = merge().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.absoluteChange = indicator.absoluteChange;
		datum.percentChange = indicator.percentChange;
	});

	var indicator = function indicator(data) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { merge: true };

		if (options.merge) {
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};
	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "options");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
//# sourceMappingURL=change.js.map