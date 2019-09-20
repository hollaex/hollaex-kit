

import { rebind } from "../utils";

import { pointAndFigure } from "../calculator";
import baseIndicator from "./baseIndicator";

var ALGORITHM_TYPE = "PointAndFigure";

export default function () {

	var base = baseIndicator().type(ALGORITHM_TYPE);

	var underlyingAlgorithm = pointAndFigure();

	var indicator = underlyingAlgorithm;

	rebind(indicator, base, "id", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator");
	rebind(indicator, underlyingAlgorithm, "options");
	// rebind(indicator, mergedAlgorithm, "merge"/*, "skipUndefined"*/);

	return indicator;
}
//# sourceMappingURL=pointAndFigure.js.map