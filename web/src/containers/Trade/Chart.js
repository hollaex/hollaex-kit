import * as React from 'react';
import _isEqual from 'lodash/isEqual';
import { isMobile } from 'react-device-detect';
import { widget } from '../../charting_library';
import {
	getTheme,
	getVolume,
	getToolbarBG,
	getWidgetTheme,
	addFullscreenButton,
} from './ChartConfig';
import { getLanguage } from '../../utils/string';
import { getChartResolution, setChartResolution } from '../../utils/utils';
import {
	getChartConfig,
	getChartSymbol,
	getChartHistory,
} from '../../actions/chartAction';

function getThemeOverrides(theme = 'white', color = {}) {
	return getTheme(color[theme] || {});
}

function getStudiesOverrides(theme = 'white', color = {}) {
	return getVolume(color[theme] || {});
}

class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'xht-usdt', // the trading tab we are in should be passed here
		interval: '60',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		// chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
		time_frames: [
			{ text: '1D', resolution: '1' },
			{ text: '5D', resolution: '5' },
			{ text: '3M', resolution: '60' },
			{ text: '6M', resolution: '120' },
			{ text: '1m', resolution: '30' },
			// { text: "YTD", resolution: "YTD" },
			{ text: '1Y', resolution: 'D' },
			{ text: '3Y', resolution: 'D' },
			{ text: '5Y', resolution: 'W' },
			// { text: "ALL", resolution: "ALL" },
		],
	};

	constructor(props) {
		super(props);
		this.state = {
			subs: {},
			lastBar: {
				close: 0,
				high: 0,
				isBarClosed: false,
				isLastBar: true,
				low: 0,
				open: 0,
				time: new Date().getTime(),
				volume: 0,
			},
		};
		this.ref = React.createRef();
	}

	componentWillMount() {
		var that = this;
		const { api_name } = this.props.constants;
		this.chartConfig = {
			onReady: (cb) => {
				getChartConfig().then((data) => {
					cb(data);
				});
			},
			searchSymbols: (
				userInput,
				exchange,
				symbolType,
				onResultReadyCallback
			) => {},
			resolveSymbol: (
				symbolName,
				onSymbolResolvedCallback,
				onResolveErrorCallback
			) => {
				// expects a symbolInfo object in response
				// var split_data = symbolName.split(/[-/]/)
				// var symbol_stub = {
				// 	name: symbolName,
				// 	description: '',
				// 	type: 'crypto',
				// 	session: '24x7',
				// 	timezone: 'Etc/UTC',
				// 	ticker: symbolName,
				// 	exchange: split_data[0],
				// 	minmov: 1,
				// 	pricescale: 100000000,
				// 	has_intraday: true,
				// 	intraday_multipliers: ['1', '60'],
				// 	supported_resolution:  supportedResolutions,
				// 	volume_precision: 8,
				// 	data_status: 'streaming',
				// }

				// if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
				// 	symbol_stub.pricescale = 100
				// }
				const { increment_price } = this.props.pairData;
				getChartSymbol(symbolName, increment_price, api_name).then((data) => {
					onSymbolResolvedCallback(data);
				});

				// onResolveErrorCallback('Not feeling it today')
			},
			getBars: function (
				symbolInfo,
				resolution,
				{ from, to, firstDataRequest },
				onHistoryCallback,
				onErrorCallback
			) {
				getChartHistory(symbolInfo.ticker, resolution, from, to)
					.then(({ data }) => {
						if (data.length) {
							const bars = data.map((bar) => {
								return {
									time: new Date(bar.time).getTime(), //TradingView requires bar time in ms
									low: bar.low,
									high: bar.high,
									open: bar.open,
									close: bar.close,
									volume: bar.volume,
								};
							});
							let res = data[data.length - 1];
							res = res.close;
							that.props.setChartHigh(res);
							if (firstDataRequest) {
								that.setState({
									lastBar: bars[bars.length - 1],
								});
								// setBars[symbolInfo.ticker] = { lastBar: lastBar }
							}
							onHistoryCallback(bars, { noData: false });
						} else {
							onHistoryCallback(data, { noData: true });
						}
					})
					.catch((err) => {
						onErrorCallback(err);
					});
			},
			subscribeBars: (
				symbolInfo,
				resolution,
				onRealtimeCallback,
				subscribeUID,
				onResetCacheNeededCallback
			) => {
				if (resolution) {
					setChartResolution(resolution, symbolInfo.ticker);
				}
				that.setState({
					sub: {
						uid: subscribeUID,
						resolution,
						symbolInfo,
						lastBar: that.state.lastBar,
						listener: onRealtimeCallback,
					},
				});
				// stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback);
			},
			unsubscribeBars: (subscriberUID) => {
				// stream.unsubscribeBars(subscriberUID)
			},
			calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
				//optional
				// while optional, this makes sure we request 24 hours of minute data at a time
				// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
				return resolution < 60
					? { resolutionBack: 'D', intervalBack: '1' }
					: undefined;
			},
			getMarks: (
				symbolInfo,
				startDate,
				endDate,
				onDataCallback,
				resolution
			) => {
				//optional
			},
			getTimeScaleMarks: (
				symbolInfo,
				startDate,
				endDate,
				onDataCallback,
				resolution
			) => {
				//optional
			},
			getServerTime: (cb) => {},
		};
	}

	componentDidMount() {
		this.updateChart(this.props);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.activeTheme !== nextProps.activeTheme) {
			this.updateChart(nextProps);
		} else if (
			nextProps.tradeHistory &&
			nextProps.tradeHistory.length &&
			this.props.tradeHistory &&
			!_isEqual(this.props.tradeHistory, nextProps.tradeHistory) &&
			this.state.sub
		) {
			this.updateBar(nextProps.tradeHistory[0]);
		}
	}

	componentWillUnmount() {
		if (this.tvWidget !== null && this.tvWidget._ready) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	updateChart = ({
		activeTheme,
		symbol,
		containerId,
		libraryPath,
		interval,
		color = {},
	}) => {
		const resolutionData = getChartResolution();
		let resolution = null;
		if (resolutionData[symbol]) {
			resolution = resolutionData[symbol];
		}
		const toolbar_bg = getToolbarBG(activeTheme, color);
		const widgetTheme = getWidgetTheme(toolbar_bg);
		const locale = getLanguage();
		const widgetOptions = {
			symbol: symbol,
			// BEWARE: no trailing slash is expected in feed URL
			theme: widgetTheme,
			toolbar_bg,
			datafeed: this.chartConfig,
			interval: resolution,
			container_id: containerId,
			library_path: libraryPath,
			// timeframe: 'M',
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			locale: locale === 'id' ? 'en' : locale,
			withdateranges: true,
			range: 'ytd',
			disabled_features: [
				'use_localstorage_for_settings',
				'header_symbol_search',
				'header_compare'
			],
			// preset: isMobile ? 'mobile' : '',
			enabled_features: ['items_favoriting'],
			// time_frames: [
			// { text: '3m', resolution: '60' },
			// { text: '1m', resolution: '60' },
			// { text: '1d', resolution: '60' },
			// // { text: "YTD", resolution: "YTD" },
			// { text: "1Y", resolution: "D" },
			// { text: "3Y", resolution: "D" },
			// { text: "5Y", resolution: "W" },
			// { text: "ALL", resolution: "ALL" },
			// ],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,

			studies_overrides: getStudiesOverrides(activeTheme, color),
			favorites: {
				chartTypes: ['Line', 'Area', 'Candles', 'Bars'],
			},
			loading_screen: { backgroundColor: getToolbarBG(activeTheme, color) },
			custom_css_url: `${process.env.REACT_APP_PUBLIC_URL}/css/chart.css`,
			overrides: getThemeOverrides(activeTheme, color)
		};

		if (isMobile) {
			// remove left side bar in mobile
			widgetOptions.enabled_features = [...widgetOptions.enabled_features, 'hide_left_toolbar_by_default'];
			widgetOptions.disabled_features = [...widgetOptions.disabled_features, 'header_undo_redo', 'header_indicators', 'header_screenshot'];
		}

		const tvWidget = new widget(widgetOptions);

		tvWidget.onChartReady(() => {
			
			if (localStorage.getItem(`chart_${symbol}`)) {
				tvWidget.load(JSON.parse(localStorage.getItem(`chart_${symbol}`)).chartObject)
				addFullscreenButton(tvWidget, symbol)

			} else {
				if (!isMobile) {
					tvWidget.chart().removeAllStudies();
					tvWidget.chart().createStudy('Moving Average', false, false, [7]);
					tvWidget.chart().createStudy('Moving Average', false, false, [25]);
					tvWidget.chart().createStudy('Volume', false, false);
					// tvWidget.chart().createStudy('MACD', false, false, [14, 30, 'close', 9])
				}

				tvWidget.headerReady().then(() => {
					if (!isMobile) {
						const pane = tvWidget.chart().getPanes();
						if (pane.length && pane[1]) {
							pane[1].setHeight(10);
						}
					}

					addFullscreenButton(tvWidget, symbol)
				});
			}
		});
		
		tvWidget.subscribe('onAutoSaveNeeded', () => {
			tvWidget.save((tvChartObject) => {
				let chartID = tvChartObject['charts'][0]['panes'][0]['sources'][0]['id'];

				let chartToSave = {
					tvChartId: chartID,
					chartObject: tvChartObject,
					lastUpdate: Math.floor(Date.now() / 1000),
				};
				// save chart setting in localstorage
				localStorage.setItem(`chart_${symbol}`, JSON.stringify(chartToSave));
			})
		});

		this.tvWidget = tvWidget;
	};

	updateBar(data) {
		const { sub } = this.state;
		let { lastBar, resolution } = sub;
		let coeff = 0;
		if (resolution === '1') {
			coeff = 60 * 1000;
		} else if (resolution === '5') {
			// 1 hour in minutes === 60
			coeff = 5 * 60 * 1000;
		} else if (resolution === '15') {
			// 1 hour in minutes === 60
			coeff = 15 * 60 * 1000;
		} else if (resolution === '60') {
			// 1 hour in minutes === 60
			coeff = 60 * 60 * 1000;
		} else if (resolution === '240') {
			// 1 hour in minutes === 60
			coeff = 240 * 60 * 1000;
		} else if (resolution === '1D') {
			// 1 day in minutes === 1440
			coeff = 60 * 60 * 24 * 1000;
		} else if (resolution === '1W') {
			// 1 week in minutes === 10080
			coeff = 60 * 60 * 24 * 7 * 1000;
		} else {
			// 1 week by default
			coeff = 60 * 60 * 24 * 7 * 1000;
		}

		const lastTradeTime = new Date(data.timestamp).getTime();
		let rounded = Math.floor(lastTradeTime / coeff) * coeff;
		var _lastBar;

		if (rounded > lastBar.time) {
			// create a new candle, use last close as open
			_lastBar = {
				time: rounded,
				open: data.price,
				high: data.price,
				low: data.price,
				close: data.price,
				volume: data.size,
			};
		} else {
			// update lastBar candle!
			if (data.price < lastBar.low) {
				lastBar.low = data.price;
			} else if (data.price > lastBar.high) {
				lastBar.high = data.price;
			}

			lastBar.volume = lastBar.volume ? lastBar.volume + data.size : data.size;
			lastBar.close = data.price;
			if (!lastBar.low) lastBar.low = 0;
			if (!lastBar.close) lastBar.close = 0;
			if (!lastBar.high) lastBar.high = 0;
			if (!lastBar.open) lastBar.open = 0;
			if (!lastBar.time) lastBar.time = new Date().getTime();
			if (!lastBar.volume) lastBar.volume = 0;
			if (lastBar.isBarClosed === undefined) lastBar.isBarClosed = false;
			if (lastBar.isLastBar === undefined) lastBar.isLastBar = true;
			_lastBar = lastBar;
		}
		sub.listener(_lastBar);
		sub.lastBar = _lastBar;
		this.setState({
			sub: sub,
		});
	}

	render() {
		return (
			<div
				id={this.props.containerId}
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			/>
		);
	}
}

export default TVChartContainer;
