
export { default as discontinuousTimeScaleProvider, discontinuousTimeScaleProviderBuilder } from "./discontinuousTimeScaleProvider";
export { default as financeDiscontinuousScale } from "./financeDiscontinuousScale";

export function defaultScaleProvider(xScale) {
	return function (data, xAccessor) {
		return { data: data, xScale: xScale, xAccessor: xAccessor, displayXAccessor: xAccessor };
	};
}
//# sourceMappingURL=index.js.map