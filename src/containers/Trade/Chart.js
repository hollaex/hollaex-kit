import * as React from 'react';
import { widget } from '../../charting_library/charting_library.min';
import { API_URL } from '../../config/constants';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getThemeOverrides(theme = 'white') {
	if (theme === 'white') {
		return {
			"paneProperties.background": "#ffffff",
			"paneProperties.vertGridProperties.color": "#E6ECEF",
			"paneProperties.horzGridProperties.color": "#E6ECEF",
			"symbolWatermarkProperties.transparency": 90,
			"symbolWatermarkProperties.color": '#1f212a',
			"scalesProperties.textColor": "#292b2c",
			"scalesProperties.backgroundColor": "#ffffff",
			// Candles-property
			"mainSeriesProperties.candleStyle.upColor": "#D6FFE7",
			"mainSeriesProperties.candleStyle.downColor": "#ED1C24",
			"mainSeriesProperties.candleStyle.drawWick": true,
			"mainSeriesProperties.candleStyle.drawBorder": true,
			"mainSeriesProperties.candleStyle.borderUpColor": "#008000",
			"mainSeriesProperties.candleStyle.borderDownColor": "#ED1C24",
			"mainSeriesProperties.candleStyle.wickUpColor": '#008000',
			"mainSeriesProperties.candleStyle.wickDownColor": '#ED1C24',
			"mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
			//	Bars styles
			"mainSeriesProperties.barStyle.upColor": "#D6FFE7",
			"mainSeriesProperties.barStyle.downColor": "#ED1C24",
			"mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
			"mainSeriesProperties.barStyle.dontDrawOpen": false,


			//	Area styles
			"mainSeriesProperties.areaStyle.color1": "#D6FFE7",
			"mainSeriesProperties.areaStyle.color2": "#ED1C24",
			"mainSeriesProperties.areaStyle.linecolor": "#008000",
			// "mainSeriesProperties.areaStyle.linestyle": CanvasEx.LINESTYLE_SOLID,
			"mainSeriesProperties.areaStyle.linewidth": 1,
			"mainSeriesProperties.areaStyle.priceSource": "close"
		}
	} else {
		return {
			"paneProperties.background": "#1F212A",
			"paneProperties.vertGridProperties.color": "#34416D",
			"paneProperties.horzGridProperties.color": "#0C1D51",
			"symbolWatermarkProperties.transparency": 90,
			"symbolWatermarkProperties.color": '#aaaaaa',
			"scalesProperties.textColor": "#AAA",
			"scalesProperties.backgroundColor": "#ffffff",

			// Candles-property
			"mainSeriesProperties.candleStyle.upColor": "#6D9EEB",
			"mainSeriesProperties.candleStyle.downColor": "#FF9800",
			"mainSeriesProperties.candleStyle.drawWick": true,
			"mainSeriesProperties.candleStyle.drawBorder": true,
			"mainSeriesProperties.candleStyle.borderUpColor": "#6D9EEB",
			"mainSeriesProperties.candleStyle.borderDownColor": "#FF9800",
			"mainSeriesProperties.candleStyle.wickUpColor": '#6D9EEB',
			"mainSeriesProperties.candleStyle.wickDownColor": '#FF9800',
			"mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
			//	Bars styles
			"mainSeriesProperties.barStyle.upColor": "#6D9EEB",
			"mainSeriesProperties.barStyle.downColor": "#FF9800",
			"mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
			"mainSeriesProperties.barStyle.dontDrawOpen": false,

			//	Area styles
			"mainSeriesProperties.areaStyle.color1": "#6D9EEB",
			"mainSeriesProperties.areaStyle.color2": "#FF9800",
			"mainSeriesProperties.areaStyle.linecolor": "#6D9EEB",
			// "mainSeriesProperties.areaStyle.linestyle": CanvasEx.LINESTYLE_SOLID,
			"mainSeriesProperties.areaStyle.linewidth": 1,
			"mainSeriesProperties.areaStyle.priceSource": "close"
		}
	}
}

class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'eth-eur', // the trading tab we are in should be passed here
		interval: 'D',
		containerId: 'tv_chart_container',
		datafeedUrl: `${API_URL}/udf`,
		libraryPath: '/charting_library/',
		// chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};

	tvWidget = null;

	componentDidMount() {
		const { activeTheme } = this.props;
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			toolbar_bg: activeTheme === 'white' ? '#ffffff' : '#1f212a',
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,

			locale: getLanguageFromURL() || 'en',
			disabled_features: [
				'use_localstorage_for_settings',
				'edit_buttons_in_legend',
				'context_menus',
				'border_around_the_chart',
				'header_symbol_search',
				'header_compare',
				'header_settings'
			],
			enabled_features: ['items_favoriting'],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			favorites: {
				chartTypes: ["Area", "Candles", "Bars"]
			},
			loading_screen: activeTheme === 'white'
				? { backgroundColor: "#ffffff" }
				: { backgroundColor: "#1f212a" },
			overrides: getThemeOverrides(activeTheme)
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			// const button = tvWidget.createButton()
			// 	.attr('title', 'Click to show a notification popup')
			// 	.addClass('apply-common-tooltip')
			// 	.on('click', () => tvWidget.showNoticeDialog({
			// 		title: 'Notification',
			// 		body: 'TradingView Charting Library API works correctly',
			// 		callback: () => {
			// 			console.log('Noticed!');
			// 		},
			// 	}));
			tvWidget.addCustomCSSFile(`${process.env.PUBLIC_URL}/css/chart.css`)
			tvWidget.applyOverrides(getThemeOverrides(activeTheme))
			if (activeTheme === 'white') {
				tvWidget.changeTheme('light')
			} else {
				tvWidget.changeTheme('dark')
				tvWidget.applyOverrides(getThemeOverrides(activeTheme))
			}

			// button[0].innerHTML = 'Check API';
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.activeTheme !== nextProps.activeTheme) {
			if (nextProps.activeTheme === 'white') {
				this.tvWidget.changeTheme('light')
				this.tvWidget.applyOverrides(getThemeOverrides(nextProps.activeTheme))
			} else {
				this.tvWidget.changeTheme('dark')
				this.tvWidget.applyOverrides(getThemeOverrides(nextProps.activeTheme))
				this.tvWidget.addCustomCSSFile(`${process.env.PUBLIC_URL}/css/chart.css`)
			}
		}
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div
				id={ this.props.containerId }
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			/>
		);
	}
}

export default TVChartContainer;
