import Color from 'color';

const UP_COLOR_WHITE = '#6496AA';
const DOWN_COLOR_WHITE = '#000000';
const BACKGROUND_COLOR = '#ffffff';
const TRADING_VIEW_AXIS = '#E6ECEF';
const TRADING_VIEW_WATERMARK = '#202020';
const TRADING_VIEW_TEXT = '#292b2c';

export const getToolbarBG = (theme, colors = {}) => {
	const themeData = colors[theme] || {};
	return themeData['base_wallet-sidebar-and-popup'] || BACKGROUND_COLOR;
};

export const getWidgetTheme = (base_background = BACKGROUND_COLOR) => {
	return Color(base_background).isLight() ? 'light' : 'dark';
};

export const getTheme = ({
	'trading_buying-related-elements': buy = UP_COLOR_WHITE,
	'trading_selling-related-elements': sell = DOWN_COLOR_WHITE,
	...rest
}) => ({
	'paneProperties.background':
		rest['base_wallet-sidebar-and-popup'] || BACKGROUND_COLOR,
	'paneProperties.vertGridProperties.color':
		rest['calculated_trad-view_axis'] || TRADING_VIEW_AXIS,
	'paneProperties.horzGridProperties.color':
		rest['calculated_trad-view_axis'] || TRADING_VIEW_AXIS,
	// "paneProperties.crossHairProperties.color": "#1f212a",
	'symbolWatermarkProperties.transparency': 90,
	'symbolWatermarkProperties.color':
		rest['calculated_trad-view_watermark'] || TRADING_VIEW_WATERMARK,
	'scalesProperties.textColor':
		rest['calculated_trad-view_text'] || TRADING_VIEW_TEXT,
	'scalesProperties.backgroundColor':
		rest['base_wallet-sidebar-and-popup'] || BACKGROUND_COLOR,
	'mainSeriesProperties.showPriceLine': true,
	// Candles-property
	'mainSeriesProperties.candleStyle.upColor': buy,
	'mainSeriesProperties.candleStyle.downColor': sell,
	'mainSeriesProperties.candleStyle.drawWick': true,
	'mainSeriesProperties.candleStyle.drawBorder': true,
	'mainSeriesProperties.candleStyle.borderUpColor': buy,
	'mainSeriesProperties.candleStyle.borderDownColor': sell,
	'mainSeriesProperties.candleStyle.wickUpColor': buy,
	'mainSeriesProperties.candleStyle.wickDownColor': sell,
	'mainSeriesProperties.candleStyle.barColorsOnPrevClose': true,

	//  Hollow Candles styles
	'mainSeriesProperties.hollowCandleStyle.upColor': buy,
	'mainSeriesProperties.hollowCandleStyle.downColor': sell,
	'mainSeriesProperties.hollowCandleStyle.drawWick': true,
	'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
	'mainSeriesProperties.hollowCandleStyle.borderColor': sell,
	'mainSeriesProperties.hollowCandleStyle.borderUpColor': buy,
	'mainSeriesProperties.hollowCandleStyle.borderDownColor': sell,
	'mainSeriesProperties.hollowCandleStyle.wickUpColor': buy,
	'mainSeriesProperties.hollowCandleStyle.wickDownColor': sell,

	//  Heiken Ashi styles
	'mainSeriesProperties.haStyle.upColor': buy,
	'mainSeriesProperties.haStyle.downColor': sell,
	'mainSeriesProperties.haStyle.drawWick': true,
	'mainSeriesProperties.haStyle.drawBorder': true,
	'mainSeriesProperties.haStyle.borderColor': sell,
	'mainSeriesProperties.haStyle.borderUpColor': buy,
	'mainSeriesProperties.haStyle.borderDownColor': sell,
	'mainSeriesProperties.haStyle.wickColor': sell,
	'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,

	//	Bars styles
	'mainSeriesProperties.barStyle.upColor': buy,
	'mainSeriesProperties.barStyle.downColor': sell,
	'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
	'mainSeriesProperties.barStyle.dontDrawOpen': false,

	//	Area styles
	'mainSeriesProperties.areaStyle.color1': buy,
	'mainSeriesProperties.areaStyle.color2': sell,
	'mainSeriesProperties.areaStyle.linecolor': sell,
	// "mainSeriesProperties.areaStyle.linestyle": CanvasEx.LINESTYLE_SOLID,
	'mainSeriesProperties.areaStyle.linewidth': 1,
	'mainSeriesProperties.areaStyle.priceSource': 'close',

	//  Baseline styles
	'mainSeriesProperties.baselineStyle.baselineColor': buy,
	'mainSeriesProperties.baselineStyle.topFillColor1': buy,
	'mainSeriesProperties.baselineStyle.topFillColor2': buy,
	'mainSeriesProperties.baselineStyle.bottomFillColor1': sell,
	'mainSeriesProperties.baselineStyle.bottomFillColor2': sell,
	'mainSeriesProperties.baselineStyle.topLineColor': buy,
	'mainSeriesProperties.baselineStyle.bottomLineColor': sell,
	'mainSeriesProperties.baselineStyle.topLineWidth': 1,
	'mainSeriesProperties.baselineStyle.bottomLineWidth': 1,
	'mainSeriesProperties.baselineStyle.priceSource': 'close',
	'mainSeriesProperties.baselineStyle.transparency': 50,
	'mainSeriesProperties.baselineStyle.baseLevelPercentage': 50,
});

export const getVolume = ({
	'trading_buying-related-elements': buy = UP_COLOR_WHITE,
	'trading_selling-related-elements': sell = DOWN_COLOR_WHITE,
}) => ({
	'volume.volume.color.0': sell,
	'volume.volume.color.1': buy,
	'volume.volume.transparency': 50,
});
