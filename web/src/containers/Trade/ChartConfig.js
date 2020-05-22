const UP_COLOR_WHITE = "#6496AA";
const DOWN_COLOR_WHITE = "#000000";
const UP_COLOR_DARK = "#00A69C";
const DOWN_COLOR_DARK = "#EE4036";
export const TOOLBAR_BG = {
	dark: '#202020',
	white: '#ffffff'
};

export const getWhiteTheme = ({ buy = UP_COLOR_WHITE, sell = DOWN_COLOR_WHITE }) => ({
	"paneProperties.background": "#ffffff",
	"paneProperties.vertGridProperties.color": "#E6ECEF",
	"paneProperties.horzGridProperties.color": "#E6ECEF",
	// "paneProperties.crossHairProperties.color": "#1f212a",
	"symbolWatermarkProperties.transparency": 90,
	"symbolWatermarkProperties.color": '#202020',
	"scalesProperties.textColor": "#292b2c",
	"scalesProperties.backgroundColor": "#ffffff",
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

export const getDarkTheme = ({ buy = UP_COLOR_DARK, sell = DOWN_COLOR_DARK }) => ({
	"paneProperties.background": "#202020",
	"paneProperties.vertGridProperties.color": "#535353",
	"paneProperties.horzGridProperties.color": "#535353",
	// "paneProperties.crossHairProperties.color": "#aaaaaa",
	"symbolWatermarkProperties.transparency": 90,
	"symbolWatermarkProperties.color": '#808080',
	"scalesProperties.textColor": "#808080",
	"scalesProperties.backgroundColor": "#202020",

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
