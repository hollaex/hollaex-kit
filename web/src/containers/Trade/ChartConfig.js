const UP_COLOR_WHITE = "#6496AA";
const DOWN_COLOR_WHITE = "#000000";
const UP_COLOR_DARK = "#00A69C";
const DOWN_COLOR_DARK = "#EE4036";
const BACKGROUND_COLOR = "#ffffff";
const DARK_BACKGROUND_COLOR = "#202020";
const TRADING_VIEW_AXIS = "#E6ECEF";
const TRADING_VIEW_WATERMARK = "#202020";
const TRADING_VIEW_TEXT = "#292b2c";
const DARK_TRADING_VIEW_AXIS = "#535353";
const DARK_TRADING_VIEW_WATERMARK = "#808080";
const DARK_TRADING_VIEW_TEXT = "#808080";

export const getToolbarBG = (theme, colors = {}) => {
	if (theme === 'dark') {
		let colorDark = colors.dark || {};
		return colorDark['dark-app-background-color'] || DARK_BACKGROUND_COLOR;
	} else {
		let colorLight = colors.light || {};
		return colorLight['app-background-color'] || BACKGROUND_COLOR;
	}
};

export const getWhiteTheme = ({
	buy = UP_COLOR_WHITE,
	sell = DOWN_COLOR_WHITE,
	...rest
}) => ({
	"paneProperties.background": rest['app-background-color'] || BACKGROUND_COLOR,
	"paneProperties.vertGridProperties.color": rest.tradingViewAxis || TRADING_VIEW_AXIS,
	"paneProperties.horzGridProperties.color": rest.tradingViewAxis || TRADING_VIEW_AXIS,
	// "paneProperties.crossHairProperties.color": "#1f212a",
	"symbolWatermarkProperties.transparency": 90,
	"symbolWatermarkProperties.color": rest.tradingViewWaterMark || TRADING_VIEW_WATERMARK,
	"scalesProperties.textColor": rest.tradingViewText || TRADING_VIEW_TEXT,
	"scalesProperties.backgroundColor": rest['app-background-color'] || BACKGROUND_COLOR,
	// Candles-property
	"mainSeriesProperties.candleStyle.upColor": buy,
	"mainSeriesProperties.candleStyle.downColor": sell,
	"mainSeriesProperties.candleStyle.drawWick": true,
	"mainSeriesProperties.candleStyle.drawBorder": true,
	"mainSeriesProperties.candleStyle.borderUpColor": buy,
	"mainSeriesProperties.candleStyle.borderDownColor": sell,
	"mainSeriesProperties.candleStyle.wickUpColor": buy,
	"mainSeriesProperties.candleStyle.wickDownColor": sell,
	"mainSeriesProperties.candleStyle.barColorsOnPrevClose": true,

	//  Hollow Candles styles
	"mainSeriesProperties.hollowCandleStyle.upColor": buy,
	"mainSeriesProperties.hollowCandleStyle.downColor": sell,
	"mainSeriesProperties.hollowCandleStyle.drawWick": true,
	"mainSeriesProperties.hollowCandleStyle.drawBorder": true,
	"mainSeriesProperties.hollowCandleStyle.borderColor": sell,
	"mainSeriesProperties.hollowCandleStyle.borderUpColor": buy,
	"mainSeriesProperties.hollowCandleStyle.borderDownColor": sell,
	"mainSeriesProperties.hollowCandleStyle.wickUpColor": buy,
	"mainSeriesProperties.hollowCandleStyle.wickDownColor": sell,

	//  Heiken Ashi styles
	"mainSeriesProperties.haStyle.upColor": buy,
	"mainSeriesProperties.haStyle.downColor": sell,
	"mainSeriesProperties.haStyle.drawWick": true,
	"mainSeriesProperties.haStyle.drawBorder": true,
	"mainSeriesProperties.haStyle.borderColor": sell,
	"mainSeriesProperties.haStyle.borderUpColor": buy,
	"mainSeriesProperties.haStyle.borderDownColor": sell,
	"mainSeriesProperties.haStyle.wickColor": sell,
	"mainSeriesProperties.haStyle.barColorsOnPrevClose": false,

	//	Bars styles
	"mainSeriesProperties.barStyle.upColor": buy,
	"mainSeriesProperties.barStyle.downColor": sell,
	"mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
	"mainSeriesProperties.barStyle.dontDrawOpen": false,


	//	Area styles
	"mainSeriesProperties.areaStyle.color1": buy,
	"mainSeriesProperties.areaStyle.color2": sell,
	"mainSeriesProperties.areaStyle.linecolor": sell,
	// "mainSeriesProperties.areaStyle.linestyle": CanvasEx.LINESTYLE_SOLID,
	"mainSeriesProperties.areaStyle.linewidth": 1,
	"mainSeriesProperties.areaStyle.priceSource": "close",

	//  Baseline styles
	"mainSeriesProperties.baselineStyle.baselineColor": buy,
	"mainSeriesProperties.baselineStyle.topFillColor1": buy,
	"mainSeriesProperties.baselineStyle.topFillColor2": buy,
	"mainSeriesProperties.baselineStyle.bottomFillColor1": sell,
	"mainSeriesProperties.baselineStyle.bottomFillColor2": sell,
	"mainSeriesProperties.baselineStyle.topLineColor": buy,
	"mainSeriesProperties.baselineStyle.bottomLineColor": sell,
	"mainSeriesProperties.baselineStyle.topLineWidth": 1,
	"mainSeriesProperties.baselineStyle.bottomLineWidth": 1,
	"mainSeriesProperties.baselineStyle.priceSource": "close",
	"mainSeriesProperties.baselineStyle.transparency": 50,
	"mainSeriesProperties.baselineStyle.baseLevelPercentage": 50
});

export const getDarkTheme = ({
	buy = UP_COLOR_DARK,
	sell = DOWN_COLOR_DARK,
	...rest
}) => ({
	"paneProperties.background": rest['dark-app-background-color'] || DARK_BACKGROUND_COLOR,
	"paneProperties.vertGridProperties.color": rest.tradingViewAxis || DARK_TRADING_VIEW_AXIS,
	"paneProperties.horzGridProperties.color": rest.tradingViewAxis || DARK_TRADING_VIEW_AXIS,
	// "paneProperties.crossHairProperties.color": "#aaaaaa",
	"symbolWatermarkProperties.transparency": 90,
	"symbolWatermarkProperties.color": rest.tradingViewWaterMark || DARK_TRADING_VIEW_WATERMARK,
	"scalesProperties.textColor": rest.tradingViewText || DARK_TRADING_VIEW_TEXT,
	"scalesProperties.backgroundColor": rest['dark-app-background-color'] || DARK_BACKGROUND_COLOR,

	// Candles-property
	"mainSeriesProperties.candleStyle.upColor": buy,
	"mainSeriesProperties.candleStyle.downColor": sell,
	"mainSeriesProperties.candleStyle.drawWick": true,
	"mainSeriesProperties.candleStyle.drawBorder": true,
	"mainSeriesProperties.candleStyle.borderUpColor": buy,
	"mainSeriesProperties.candleStyle.borderDownColor": sell,
	"mainSeriesProperties.candleStyle.wickUpColor": buy,
	"mainSeriesProperties.candleStyle.wickDownColor": sell,
	"mainSeriesProperties.candleStyle.barColorsOnPrevClose": true,

	//  Hollow Candles styles
	"mainSeriesProperties.hollowCandleStyle.upColor": buy,
	"mainSeriesProperties.hollowCandleStyle.downColor": sell,
	"mainSeriesProperties.hollowCandleStyle.drawWick": true,
	"mainSeriesProperties.hollowCandleStyle.drawBorder": true,
	"mainSeriesProperties.hollowCandleStyle.borderColor": sell,
	"mainSeriesProperties.hollowCandleStyle.borderUpColor": buy,
	"mainSeriesProperties.hollowCandleStyle.borderDownColor": sell,
	"mainSeriesProperties.hollowCandleStyle.wickUpColor": buy,
	"mainSeriesProperties.hollowCandleStyle.wickDownColor": sell,

	//  Heiken Ashi styles
	"mainSeriesProperties.haStyle.upColor": buy,
	"mainSeriesProperties.haStyle.downColor": sell,
	"mainSeriesProperties.haStyle.drawWick": true,
	"mainSeriesProperties.haStyle.drawBorder": true,
	"mainSeriesProperties.haStyle.borderColor": sell,
	"mainSeriesProperties.haStyle.borderUpColor": buy,
	"mainSeriesProperties.haStyle.borderDownColor": sell,
	"mainSeriesProperties.haStyle.wickColor": sell,
	"mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
	"mainSeriesProperties.haStyle.wickUpColor": buy,
	"mainSeriesProperties.haStyle.wickDownColor": sell,
	
	//	Bars styles
	"mainSeriesProperties.barStyle.upColor": buy,
	"mainSeriesProperties.barStyle.downColor": sell,
	"mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
	"mainSeriesProperties.barStyle.dontDrawOpen": false,

	//	Area styles
	"mainSeriesProperties.areaStyle.color1": buy,
	"mainSeriesProperties.areaStyle.color2": sell,
	"mainSeriesProperties.areaStyle.linecolor": buy,
	// "mainSeriesProperties.areaStyle.linestyle": CanvasEx.LINESTYLE_SOLID,
	"mainSeriesProperties.areaStyle.linewidth": 1,
	"mainSeriesProperties.areaStyle.priceSource": "close",

	//  Baseline styles
	"mainSeriesProperties.baselineStyle.baselineColor": buy,
	"mainSeriesProperties.baselineStyle.topFillColor1": buy,
	"mainSeriesProperties.baselineStyle.topFillColor2": buy,
	"mainSeriesProperties.baselineStyle.bottomFillColor1": sell,
	"mainSeriesProperties.baselineStyle.bottomFillColor2": sell,
	"mainSeriesProperties.baselineStyle.topLineColor": buy,
	"mainSeriesProperties.baselineStyle.bottomLineColor": sell,
	"mainSeriesProperties.baselineStyle.topLineWidth": 1,
	"mainSeriesProperties.baselineStyle.bottomLineWidth": 1,
	"mainSeriesProperties.baselineStyle.priceSource": "close",
	"mainSeriesProperties.baselineStyle.transparency": 50,
	"mainSeriesProperties.baselineStyle.baseLevelPercentage": 50
});

export const getVolumeWhite = ({ buy = UP_COLOR_WHITE, sell = DOWN_COLOR_WHITE }) => ({
	"volume.volume.color.0": sell,
	"volume.volume.color.1": buy,
	"volume.volume.transparency": 50,
});

export const getVolumeDark = ({ buy = UP_COLOR_DARK, sell = DOWN_COLOR_DARK }) => ({
	"volume.volume.color.0": sell,
	"volume.volume.color.1": buy,
	"volume.volume.transparency": 50,
});
