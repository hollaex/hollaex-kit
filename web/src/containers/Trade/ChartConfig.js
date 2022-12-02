import Color from 'color';

const UP_COLOR_WHITE = '#6496AA';
const DOWN_COLOR_WHITE = '#000000';
const BACKGROUND_COLOR = '#ffffff';
// const TRADING_VIEW_AXIS = '#E6ECEF';
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
	'paneProperties.backgroundType': 'solid',

	'mainSeriesProperties.visible': true,

	'paneProperties.legendProperties.showStudyArguments': true,
	'paneProperties.legendProperties.showStudyTitles': true,
	'paneProperties.legendProperties.showStudyValues': true,
	'paneProperties.legendProperties.showSeriesTitle': true,
	'paneProperties.legendProperties.showSeriesOHLC': true,
	'paneProperties.legendProperties.showLegend': true,
	'paneProperties.legendProperties.showBarChange': true,

	// 'paneProperties.crossHairProperties.color': 'red',
	'symbolWatermarkProperties.color':
		rest['calculated_trad-view_watermark'] || TRADING_VIEW_WATERMARK,
	'scalesProperties.textColor':
		rest['calculated_trad-view_text'] || TRADING_VIEW_TEXT,
	'scalesProperties.backgroundColor':
		rest['base_wallet-sidebar-and-popup'] || BACKGROUND_COLOR,
	// 'mainSeriesProperties.showPriceLine': true,
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

	//  Line styles
	'mainSeriesProperties.lineStyle.color': buy,
	'mainSeriesProperties.lineStyle.linestyle': 0,
	'mainSeriesProperties.lineStyle.linewidth': 2,
	'mainSeriesProperties.lineStyle.priceSource': 'close',

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
	// 'mainSeriesProperties.areaStyle.color1': buy,
	// 'mainSeriesProperties.areaStyle.color2': sell,
	// 'mainSeriesProperties.areaStyle.linecolor': buy,
	// 'mainSeriesProperties.areaStyle.linestyle': 0,
	// 'mainSeriesProperties.areaStyle.linewidth': 2,
	// 'mainSeriesProperties.areaStyle.priceSource': 'close',

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
	'volume.volume.transparency': 80,
});

export const addFullscreenButton = (tvWidget, symbol) => {
	const newWindowButton = tvWidget.createButton({ align: 'right' });
	newWindowButton.setAttribute(
		'title',
		'Open the trading view chart in a new tab.'
	);
	newWindowButton.classList.add('apply-common-tooltip');
	newWindowButton.addEventListener('click', () => {
		if (window) {
			window.open(`/chart-embed/${symbol}`, '_blank');
		}
	});
	// tvWidget.applyOverrides(getThemeOverrides(activeTheme, color));
	// tvWidget.changeTheme(widgetTheme);

	newWindowButton.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.8 17.8" width="17" height="17">
				
					<g>
						<path fill="currentColor" d="M15.1,16.8H0.9V2.6h8.4V1.7H0.5c0,0,0,0,0,0C0.2,1.7,0,1.9,0,2.1v15.2c0,0.1,0,0.2,0.1,0.3
							c0.1,0.1,0.1,0.1,0.2,0.1l0,0h15.2c0,0,0,0,0,0c0.3,0,0.4-0.2,0.4-0.5V8.4h-0.9V16.8z"/>
						<polygon fill="currentColor" points="12.2,0 12.2,0.9 16.2,0.9 8,9.1 8.7,9.8 16.9,1.6 16.9,5.6 17.8,5.6 17.8,0 	"/>
					</g>
					</svg>`;
};
