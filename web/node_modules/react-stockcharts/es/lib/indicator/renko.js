

import { rebind } from "../utils";

import { renko } from "../calculator";
import baseIndicator from "./baseIndicator";

var ALGORITHM_TYPE = "Renko";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE);

	var underlyingAlgorithm = renko();

	var indicator = underlyingAlgorithm;

	rebind(indicator, base, "id", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator");
	rebind(indicator, underlyingAlgorithm, "options");

	return indicator;
}
//# sourceMappingURL=renko.js.map