import * as React from 'react';
import { widget } from '../../charting_library/charting_library.min';
import { API_URL } from '../../config/constants';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,

			locale: getLanguageFromURL() || 'en',
			disabled_features: [
				'use_localstorage_for_settings',
				'edit_buttons_in_legend',
				'context_menus',
				'control_bar',
				'border_around_the_chart',
				'header_symbol_search',
				'header_compare',
				'header_settings'
			],
			enabled_features: [],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			toolbar_bg: 'blue',
			loading_screen: this.props.activeTheme === 'white' ? { backgroundColor: "#ffffff" } : {  backgroundColor: "#1f212a" },
			overrides: {
				"paneProperties.background": "#131722",
				"paneProperties.vertGridProperties.color": "#363c4e",
				"paneProperties.horzGridProperties.color": "#363c4e",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#AAA",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
				"scalesProperties.backgroundColor" : "red"
			},
			theme: this.props.activeTheme
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			const button = tvWidget.createButton()
				.attr('title', 'Click to show a notification popup')
				.addClass('apply-common-tooltip')
				.on('click', () => tvWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));
			if (this.props.activeTheme === 'white') {
				tvWidget.changeTheme('light')
				tvWidget.applyOverrides(
					{
						"paneProperties.background": "#ffffff",
						"paneProperties.vertGridProperties.color": "#ffffff",
						"paneProperties.horzGridProperties.color": "#ffffff",
						"symbolWatermarkProperties.transparency": 90,
						"scalesProperties.textColor": "#AAA",
						"mainSeriesProperties.candleStyle.wickUpColor": '#ffffff',
						"mainSeriesProperties.candleStyle.wickDownColor": '#ffffff',
						"scalesProperties.backgroundColor": "#ffffff"
					}
				)
			}
			else {
				tvWidget.changeTheme('dark')
				tvWidget.applyOverrides(
					{
						"paneProperties.background": "#1f212a",
						"paneProperties.vertGridProperties.color": "#1f212a",
						"paneProperties.horzGridProperties.color": "#1f212a",
						"symbolWatermarkProperties.transparency": 90,
						"scalesProperties.textColor": "#AAA",
						"mainSeriesProperties.candleStyle.wickUpColor": '#1f212a',
						"mainSeriesProperties.candleStyle.wickDownColor": '#1f212a',
						"scalesProperties.backgroundColor": "#1f212a"
					}
				)

			}

			button[0].innerHTML = 'Check API';
		});
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
