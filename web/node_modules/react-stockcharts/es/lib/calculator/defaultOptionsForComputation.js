

export var BollingerBand = {
	windowSize: 20,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	multiplier: 2,
	movingAverageType: "sma"
};

export var ATR = {
	windowSize: 14
};

export var ForceIndex = {
	sourcePath: "close", // "high", "low", "open", "close"
	volumePath: "volume"
};
export var SmoothedForceIndex = {
	sourcePath: "close", // "high", "low", "open", "close"
	volumePath: "volume",
	smoothingType: "ema",
	smoothingWindow: 13
};
export var Change = {
	sourcePath: "close" // "high", "low", "open", "close"
};
export var Compare = {
	basePath: "close",
	mainKeys: ["open", "high", "low", "close"],
	compareKeys: []
};

export var ElderRay = {
	windowSize: 13,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close", // "high", "low", "open", "close"
	movingAverageType: "sma"
};

export var ElderImpulse = {
	sourcePath: "close" // "high", "low", "open", "close"
};

export var SAR = {
	accelerationFactor: 0.02,
	maxAccelerationFactor: 0.2
};

export var MACD = {
	fast: 12,
	slow: 26,
	signal: 9,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close"
};

export var FullStochasticOscillator = {
	windowSize: 12,
	kWindowSize: 3,
	dWindowSize: 3
};

export var RSI = {
	windowSize: 14,
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close" // "high", "low", "open", "close"
};

export var EMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

export var SMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

export var WMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

export var TMA = {
	// source: d => d.close, // "high", "low", "open", "close"
	sourcePath: "close",
	windowSize: 10
};

export var Kagi = {
	reversalType: "ATR", // "ATR", "FIXED"
	windowSize: 14,
	reversal: 2,
	sourcePath: "close" // "high", "low", "open", "close"
	/* dateAccessor: d => d.date,
 dateMutator: (d, date) => { d.date = date; }, */
};

export var Renko = {
	reversalType: "ATR", // "ATR", "FIXED"
	windowSize: 14,
	fixedBrickSize: 2,
	sourcePath: "high/low" // "close", "high/low"
	/* source: d => ({ high: d.high, low: d.low }),
 dateAccessor: d => d.date,
 dateMutator: (d, date) => { d.date = date; }, */
};

export var PointAndFigure = {
	boxSize: 0.5,
	reversal: 3,
	sourcePath: "high/low" // "close", "high/low"

	/* source: d => ({ high: d.high, low: d.low }), // "close", "hi/lo"
 dateAccessor: d => d.date,
 dateMutator: (d, date) => { d.date = date; }, */
};
//# sourceMappingURL=defaultOptionsForComputation.js.map