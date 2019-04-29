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
			// "paneProperties.crossHairProperties.color": "#1f212a",
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
			// "paneProperties.crossHairProperties.color": "#aaaaaa",
			"symbolWatermarkProperties.transparency": 90,
			"symbolWatermarkProperties.color": '#aaaaaa',
			"scalesProperties.textColor": "#AAA",
			"scalesProperties.backgroundColor": "#000000",

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
		time_frames: [
			{ text: "1D", resolution: "1" },
			{ text: "5D", resolution: "5" },
			{ text: "3M", resolution: "60" },
			{ text: "6M", resolution: "120" },
			{ text: "1m", resolution: "30" },
			// { text: "YTD", resolution: "YTD" },
			{ text: "1Y", resolution: "D" },
			{ text: "3Y", resolution: "D" },
			{ text: "5Y", resolution: "W" },
			// { text: "ALL", resolution: "ALL" },
		],
	};

	tvWidget = null;

	componentDidMount() {
		const { activeTheme } = this.props;
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			theme: activeTheme === 'white' ? 'light' : 'dark',
			toolbar_bg: activeTheme === 'white' ? '#ffffff' : '#1f212a',
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,

			locale: getLanguageFromURL() || 'en',
			withdateranges: true,
			range: 'ytd',
			disabled_features: [
				'use_localstorage_for_settings',
				'edit_buttons_in_legend',
				'context_menus',
				'border_around_the_chart',
				'header_symbol_search',
				'header_compare',
				'header_settings',
				'control_bar',
				'header_screenshot'
			],
			enabled_features: ['items_favoriting', 'support_multicharts'],
			time_frames: [
				{ text: "1m", resolution: "1m" },
				{ text: "1h", resolution: "1h" },
				{ text: "1D", resolution: "1D" },
				{ text: "1W", resolution: "1W" },
				{ text: "1M", resolution: "1M" },
				// // { text: "YTD", resolution: "YTD" },
				// { text: "1Y", resolution: "D" },
				// { text: "3Y", resolution: "D" },
				// { text: "5Y", resolution: "W" },
				// { text: "ALL", resolution: "ALL" },
			],
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
			custom_css_url: `${process.env.PUBLIC_URL}/css/chart.css`,
			overrides: getThemeOverrides(activeTheme)
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			const button = tvWidget.createButton({ 'align': 'right' })
				.attr('title', 'Take instant snapshot of your chart. No more paint or other editors to save screenshots - simply click the button and copy the link of the picture.')
				.addClass('apply-common-tooltip screen-button')
				.on('click', () => tvWidget.takeScreenshot());
			tvWidget.applyOverrides(getThemeOverrides(activeTheme))
			if (activeTheme === 'white') {
				tvWidget.changeTheme('light')
			} else {
				tvWidget.changeTheme('dark')
			}
			
			button[0].innerHTML = `<div class='screen-container'><div class='screen-content'>Share Screenshot</div> <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 17" width="21" height="17"><g fill="none" stroke="currentColor"><path d="M2.5 2.5h3.691a.5.5 0 0 0 .447-.276l.586-1.171A1 1 0 0 1 8.118.5h4.764a1 1 0 0 1 .894.553l.586 1.17a.5.5 0 0 0 .447.277H18.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-16a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z"></path><circle cx="10.5" cy="9.5" r="4"></circle></g></svg></div></div>`;
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
