import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import math from 'mathjs';
import { QuickTradeLimitsSelector, BrokerLimitsSelector } from './utils';
import { setWsHeartbeat } from 'ws-heartbeat/client';
import debounce from 'lodash.debounce';
import { message } from 'antd';
import _floor from 'lodash/floor';
import _debounce from 'lodash/debounce';
import moment from 'moment';

import { executeBroker, submitOrder } from 'actions/orderAction';
import STRINGS from 'config/localizedStrings';

import { QuickTrade, Dialog, Loader, MobileBarBack, Button } from 'components';
import ReviewBlock from 'components/QuickTrade/ReviewBlock';
import { changeSymbol } from 'actions/orderbookAction';
import { formatNumber, formatPercentage } from 'utils/currency';
import { isLoggedIn, getToken } from 'utils/token';
import { unique } from 'utils/data';
import { getDecimals } from 'utils/utils';
import {
	changePair,
	setNotification,
	setSnackNotification,
} from 'actions/appActions';
import { setOrderbooks, setPriceEssentials } from 'actions/quickTradeAction';
import { NORMAL_CLOSURE_CODE, isIntentionalClosure } from 'utils/webSocket';

import QuoteResult from './QuoteResult';
// import { getSparklines } from 'actions/chartAction';
import { BASE_CURRENCY, DEFAULT_COIN_DATA, WS_URL } from 'config/constants';
import { getBroker, getBrokerQuote } from 'containers/Admin/Trades/actions';
import withConfig from 'components/ConfigProvider/withConfig';

// const DECIMALS = 4;
let timeout = undefined;

const Timer = ({ quoteSeconds }) => {
	return <span>{quoteSeconds}s</span>;
};

class QuickTradeContainer extends PureComponent {
	constructor(props) {
		super(props);
		const {
			routeParams,
			sourceOptions,
			tickers,
			pairs,
			router,
			broker,
		} = this.props;

		const pairKeys = Object.keys(pairs);
		const flippedPair = this.flipPair(routeParams.pair);
		const brokerPairs = broker.map((br) => br.symbol);

		let pair;
		let side;
		let tickerClose;
		let originalPair;
		if (brokerPairs.includes(routeParams.pair)) {
			originalPair = routeParams.pair;
			pair = routeParams.pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (brokerPairs.includes(flippedPair)) {
			originalPair = routeParams.pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.includes(routeParams.pair)) {
			originalPair = routeParams.pair;
			pair = routeParams.pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (pairKeys.includes(flippedPair)) {
			originalPair = routeParams.pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.length) {
			originalPair = pairKeys[0];
			pair = pairKeys[0];
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else {
			router.push('/summary');
		}

		const [, selectedSource = sourceOptions[0]] = originalPair.split('-');
		const targetOptions = this.getTargetOptions(selectedSource);
		const [selectedTarget = targetOptions[0]] = originalPair.split('-');

		this.props.setPriceEssentials({ side });
		this.state = {
			pair,
			side,
			tickerClose,
			showQuickTradeModal: false,
			targetOptions,
			selectedSource,
			selectedTarget,
			targetAmount: undefined,
			sourceAmount: undefined,
			order: {
				fetching: false,
				error: false,
				data: {},
			},
			sourceError: '',
			targetError: '',
			data: [],
			page: 0,
			pageSize: 12,
			searchValue: '',
			isSelectChange: false,
			wsInitialized: false,
			orderbookWs: null,
			isSourceChanged: false,
			isShowChartDetails: false,
			existBroker: {},
			brokerTargetAmount: undefined,
			brokerSourceAmount: undefined,
			isBrokerPaused: false,
			isTimer: false,
			isLoading: false,
			buyPrice: 0,
			sellPrice: 0,
			token: '',
			quoteSeconds: '',
			OriginalQuoteSeconds: '',
		};

		this.goToPair(pair);
	}

	getSearchPairs = (value) => {
		const { pairs, coins } = this.props;
		let result = {};
		let searchValue = value.toLowerCase().trim();
		Object.keys(pairs).map((key) => {
			let temp = pairs[key];
			const { fullname } = coins[temp.pair_base] || DEFAULT_COIN_DATA;
			let cashName = fullname ? fullname.toLowerCase() : '';
			if (
				key.indexOf(searchValue) !== -1 ||
				temp.pair_base.indexOf(searchValue) !== -1 ||
				temp.pair_2.indexOf(searchValue) !== -1 ||
				cashName.indexOf(searchValue) !== -1
			) {
				result[key] = temp;
			}
			return key;
		});
		return result;
	};

	handleMarket = (pairval, tickers, searchValue) => {
		const pairs = searchValue ? this.getSearchPairs(searchValue) : pairval;
		const pairKeys = Object.keys(pairs).sort((a, b) => {
			const { volume: volumeA = 0, close: closeA = 0 } = tickers[a] || {};
			const { volume: volumeB = 0, close: closeB = 0 } = tickers[b] || {};
			const marketCapA = math.multiply(volumeA, closeA);
			const marketCapB = math.multiply(volumeB, closeB);
			return marketCapB - marketCapA;
		});
		this.setState({ data: pairKeys });
	};

	UNSAFE_componentWillMount() {
		const { isReady, router, routeParams } = this.props;
		this.changePair(routeParams.pair);
		if (!isReady) {
			router.push('/summary');
		}
		this.initializeOrderbookWs(routeParams.pair, getToken());
	}

	componentDidMount() {
		const { pairs, tickers, broker } = this.props;
		const { pair, searchValue, side } = this.state;
		if (
			this.props.constants &&
			this.props.constants.features &&
			!this.props.constants.features.quick_trade &&
			!this.props.fetchingAuth
		) {
			this.props.router.push('/account');
		}
		if (this.props.sourceOptions && this.props.sourceOptions.length) {
			this.constructTarget();
		}
		this.handleMarket(pairs, tickers, searchValue);
		let existBroker = {};
		broker.forEach((item) => {
			const splitPair = item.symbol.split('-');
			if (pair === item.symbol || pair === `${splitPair[1]}-${splitPair[0]}`) {
				existBroker = item;
			}
		});
		const flipPair = this.flipPair(pair);
		if (Object.keys(existBroker).length) {
			if (pairs[pair] !== undefined || pairs[flipPair] !== undefined) {
				this.setState({ isShowChartDetails: true, existBroker });
				this.getBrokerData();
			} else {
				this.setState({ isShowChartDetails: false, existBroker });
				this.getBrokerData();
			}
		} else {
			this.setState({ isShowChartDetails: true, existBroker: {} });
		}
		if (existBroker && !existBroker.paused) {
			this.setState({ isBrokerPaused: false });
		} else {
			this.setState({ isBrokerPaused: true });
		}

		this.handleBrokerQuote(pair, side);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.pair !== this.props.routeParams.pair) {
			this.changePair(nextProps.routeParams.pair);
			this.subscribe(nextProps.routeParams.pair);
			this.unsubscribe(this.props.routeParams.pair);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			!prevProps.sourceOptions.length &&
			JSON.stringify(prevProps.sourceOptions) !==
				JSON.stringify(this.props.sourceOptions)
		) {
			this.constructTarget();
		}
		if (
			JSON.stringify(prevProps.routeParams.pair) !==
				JSON.stringify(this.props.routeParams.pair) &&
			!this.state.isSelectChange
		) {
			const {
				routeParams,
				sourceOptions,
				tickers,
				pairs,
				router,
				broker,
			} = this.props;
			const pairKeys = Object.keys(pairs);
			const flippedPair = this.flipPair(routeParams.pair);
			const brokerPairs = broker.map((br) => br.symbol);

			let pair;
			let side;
			let tickerClose;
			let originalPair;
			if (brokerPairs.includes(routeParams.pair)) {
				originalPair = routeParams.pair;
				pair = routeParams.pair;
				const { close } = tickers[pair] || {};
				side = 'buy';
				tickerClose = close;
			} else if (brokerPairs.includes(flippedPair)) {
				originalPair = routeParams.pair;
				pair = flippedPair;
				const { close } = tickers[pair] || {};
				side = 'sell';
				tickerClose = 1 / close;
			} else if (pairKeys.includes(routeParams.pair)) {
				originalPair = routeParams.pair;
				pair = routeParams.pair;
				const { close } = tickers[pair] || {};
				side = 'buy';
				tickerClose = close;
			} else if (pairKeys.includes(flippedPair)) {
				originalPair = routeParams.pair;
				pair = flippedPair;
				const { close } = tickers[pair] || {};
				side = 'sell';
				tickerClose = 1 / close;
			} else if (pairKeys.length) {
				originalPair = pairKeys[0];
				pair = pairKeys[0];
				const { close } = tickers[pair] || {};
				side = 'buy';
				tickerClose = close;
			} else {
				router.push('/summary');
			}

			const [, selectedSource = sourceOptions[0]] = originalPair.split('-');
			const targetOptions = this.getTargetOptions(selectedSource);
			const [selectedTarget = targetOptions[0]] = originalPair.split('-');
			let existBroker = {};
			this.props.broker.forEach((item) => {
				const splitPair = item.symbol.split('-');
				if (
					pair === item.symbol ||
					pair === `${splitPair[1]}-${splitPair[0]}`
				) {
					existBroker = item;
				}
			});
			const flipPair = this.flipPair(pair);
			if (Object.keys(existBroker).length) {
				if (pairs[pair] !== undefined || pairs[flipPair] !== undefined) {
					this.setState({ isShowChartDetails: true, existBroker });
					this.getBrokerData();
				} else {
					this.setState({ isShowChartDetails: false, existBroker });
					this.getBrokerData();
				}
			} else {
				this.setState({ isShowChartDetails: true, existBroker: {} });
			}

			if (existBroker && !existBroker.paused) {
				this.setState({ isBrokerPaused: false });
			} else {
				this.setState({ isBrokerPaused: true });
			}

			this.props.setPriceEssentials({
				side,
				targetAmount: undefined,
				sourceAmount: undefined,
			});

			this.setState({
				pair,
				side,
				tickerClose,
				targetOptions,
				selectedSource,
				selectedTarget,
			});

			this.handleBrokerQuote(pair, side);
		} else if (this.state.isSelectChange) {
			const { pair, side } = this.state;
			const { pairs } = this.props;
			let existBroker = {};
			this.props.broker.forEach((item) => {
				const splitPair = item.symbol.split('-');
				if (
					pair === item.symbol ||
					pair === `${splitPair[1]}-${splitPair[0]}`
				) {
					existBroker = item;
				}
			});
			const flipPair = this.flipPair(pair);
			if (Object.keys(existBroker).length) {
				if (pairs[pair] !== undefined || pairs[flipPair] !== undefined) {
					this.setState({ isShowChartDetails: true, existBroker });
					this.getBrokerData();
				} else {
					this.setState({ isShowChartDetails: false, existBroker });
					this.getBrokerData();
				}
			} else {
				this.setState({ isShowChartDetails: true, existBroker: {} });
			}

			if (existBroker && !existBroker.paused) {
				this.setState({ isBrokerPaused: false });
			} else {
				this.setState({ isBrokerPaused: true });
			}

			this.setState({
				isSelectChange: false,
				targetAmount: undefined,
				sourceAmount: undefined,
				brokerTargetAmount: undefined,
				brokerSourceAmount: undefined,
			});
			this.handleBrokerQuote(pair, side);
		}
		if (prevState.isTimer !== this.state.isTimer && this.state.isTimer) {
			const { icons: ICONS, setSnackNotification } = this.props;
			setSnackNotification({
				icon: ICONS.COPY_NOTIFICATION,
				content: STRINGS['ORDER_EXPIRED_MSG'],
			});
		}

		if (prevState.quoteSeconds !== this.state.quoteSeconds) {
			this.handleSecondsChange(this.state.quoteSeconds);
		}

		if (
			prevState.isAmountChanged !== this.state.isAmountChanged &&
			this.state.isAmountChanged
		) {
			this.handleBrokerQuote(this.state.pair, this.state.side);
		}
	}

	componentWillUnmount() {
		this.closeOrderbookSocket();
	}

	getBrokerQuoteData = async (symbol, side) => {
		const brokerPairs = this.props.broker.map((br) => br.symbol);
		const flipSymbol = this.flipPair(symbol);
		const pairData = brokerPairs.includes(symbol) ? symbol : flipSymbol;
		try {
			const res = await getBrokerQuote(pairData, side);
			if (res) {
				if (side === 'buy') {
					this.setState({ buyPrice: res.price });
				} else {
					this.setState({ sellPrice: res.price });
				}

				let quoteSeconds = '';
				if (!isNaN(moment(res.expiry).diff(moment(), 'seconds')))
					quoteSeconds = moment(res.expiry).diff(moment(), 'seconds');
				clearTimeout(timeout);
				this.setState({
					token: res.token,
					OriginalQuoteSeconds: quoteSeconds,
					quoteSeconds,
					isAmountChanged: false,
				});
			}
		} catch (error) {
			if (error) {
				clearTimeout(timeout);
				this.setState({
					quoteSeconds: '',
					isTimer: false,
					isAmountChanged: false,
				});
			}
		}
	};

	handleBrokerQuote = _debounce(this.getBrokerQuoteData, 1000);

	getBrokerData = async () => {
		try {
			await getBroker();
		} catch (error) {
			if (error) {
				message.error(error.message);
			}
		}
	};

	storeData = (data) => {
		this.props.setOrderbooks(data);
		this.orderCache = {};
	};

	storeOrderData = debounce(this.storeData, 250);

	initializeOrderbookWs = (symbol, token = '') => {
		let url = `${WS_URL}/stream`;
		if (token) {
			url = `${WS_URL}/stream?authorization=Bearer ${token}`;
		}

		const orderbookWs = new WebSocket(url);

		this.setState({ orderbookWs });

		orderbookWs.onopen = (evt) => {
			this.setState({ wsInitialized: true }, () => {
				const {
					routeParams: { pair },
				} = this.props;
				this.subscribe(pair);
			});

			setWsHeartbeat(orderbookWs, JSON.stringify({ op: 'ping' }), {
				pingTimeout: 60000,
				pingInterval: 25000,
			});
		};

		orderbookWs.onmessage = (evt) => {
			const data = JSON.parse(evt.data);
			if (data.topic === 'orderbook')
				switch (data.action) {
					case 'partial':
						const tempData = {
							...data,
							[data.symbol]: data.data,
						};
						delete tempData.data;
						this.orderCache = { ...this.orderCache, ...tempData };
						this.storeOrderData(this.orderCache);
						break;

					default:
						break;
				}
		};

		orderbookWs.onerror = (evt) => {
			console.error('orderbook socket error', evt);
		};

		orderbookWs.onclose = (evt) => {
			this.setState({ wsInitialized: false });

			if (!isIntentionalClosure(evt)) {
				setTimeout(() => {
					this.initializeOrderbookWs(this.props.routeParams.pair, getToken());
				}, 1000);
			}
		};
	};

	subscribe = (pair) => {
		const { orderbookWs, wsInitialized } = this.state;
		if (orderbookWs && wsInitialized) {
			orderbookWs.send(
				JSON.stringify({
					op: 'subscribe',
					args: [`orderbook:${pair}`],
				})
			);
		}
	};

	unsubscribe = (pair) => {
		const { orderbookWs, wsInitialized } = this.state;
		if (orderbookWs && wsInitialized) {
			orderbookWs.send(
				JSON.stringify({ op: 'unsubscribe', args: [`orderbook:${pair}`] })
			);
		}
	};

	closeOrderbookSocket = () => {
		const { orderbookWs, wsInitialized } = this.state;
		if (orderbookWs && wsInitialized) {
			orderbookWs.close(NORMAL_CLOSURE_CODE);
		}
	};

	changePair = (pair) => {
		this.setState({ pair });
		this.props.changePair(pair);
	};

	onOpenDialog = () => {
		this.setState({ showQuickTradeModal: true });
	};

	onCloseDialog = () => {
		this.setState(
			{ showQuickTradeModal: false, isTimer: false },
			this.resetOrderData
		);
	};

	onReviewQuickTrade = () => {
		this.onOpenDialog();
	};

	onExecuteTrade = () => {
		const {
			side,
			pair,
			existBroker,
			brokerSourceAmount,
			brokerTargetAmount,
			sellPrice,
			buyPrice,
			token,
		} = this.state;
		const { pairs, targetAmount, sourceAmount } = this.props;
		const pairData = pairs[pair] || {};
		const { increment_size } = pairData;

		let size;
		let price;

		if (!Object.keys(existBroker).length) {
			if (side === 'buy') {
				[size, price] = [targetAmount, sourceAmount];
			} else {
				[price, size] = [targetAmount, sourceAmount];
			}
			const orderData = {
				type: 'market',
				side,
				size: formatNumber(size, getDecimals(increment_size)),
				symbol: pair,
			};

			this.setState({
				order: {
					completed: false,
					fetching: true,
					error: false,
					data: orderData,
				},
			});

			submitOrder(orderData)
				.then(({ data }) => {
					this.setState({
						order: {
							completed: true,
							fetching: false,
							error: false,
							data: {
								...data,
								price,
							},
						},
					});
				})
				.catch((err) => {
					const _error =
						err.response && err.response.data
							? err.response.data.message
							: err.message;

					this.setState({
						order: {
							completed: true,
							fetching: false,
							error: _error,
							data: orderData,
						},
					});
				});
		} else {
			const {
				sell_price,
				buy_price,
				increment_size,
				symbol,
				type,
			} = existBroker;
			if (type === 'manual') {
				if (side === 'buy') {
					price = sell_price;
					size = brokerTargetAmount;
				} else {
					price = buy_price;
					size = brokerSourceAmount;
				}
			} else {
				if (side === 'buy') {
					price = sellPrice;
					size = brokerTargetAmount;
				} else {
					price = buyPrice;
					size = brokerSourceAmount;
				}
			}
			const selectedPair = symbol === pair ? pair : this.flipPair(pair);
			const brokerOrderData = {
				price,
				side,
				symbol: selectedPair,
				size: formatNumber(size, getDecimals(increment_size)),
				token,
			};

			executeBroker(brokerOrderData)
				.then((data) => {
					this.setState({
						order: {
							completed: true,
							fetching: false,
							error: false,
							data,
						},
					});
					this.getBrokerData();
				})
				.catch((err) => {
					const _error =
						err.data && err.data.message ? err.data.message : err.message;
					this.setState({
						order: {
							completed: true,
							fetching: false,
							error: _error,
							data: brokerOrderData,
						},
					});
				});
		}
	};

	onGoBack = () => {
		this.props.router.push(`/trade/${this.state.pair}`);
	};

	flipPair = (pair) => {
		const pairArray = pair.split('-');
		return pairArray.reverse().join('-');
	};

	onSelectTarget = (selectedTarget) => {
		const { tickers, pairs, broker } = this.props;
		const { selectedSource } = this.state;
		const brokerPairs = broker.map((br) => br.symbol);

		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (pairs[pairName] || brokerPairs.includes(pairName)) {
			const { close } = tickers[pairName] || {};
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (
			pairs[reversePairName] ||
			brokerPairs.includes(reversePairName)
		) {
			const { close } = tickers[reversePairName] || {};
			tickerClose = 1 / close;
			side = 'sell';
			pair = reversePairName;
		}

		this.props.setPriceEssentials({
			side,
			targetAmount: undefined,
			sourceAmount: undefined,
		});
		this.setState({
			side,
			tickerClose,
			selectedTarget,
			isSelectChange: true,
		});
		if (pair) {
			this.goToPair(pair);
		}
	};

	onSelectSource = (selectedSource) => {
		const { tickers, pairs, broker } = this.props;
		let targetOptions = this.getTargetOptions(selectedSource);
		let selectedTarget = targetOptions && targetOptions[0];
		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;
		const brokerPairs = broker.map((br) => br.symbol);

		let tickerClose;
		let side;
		let pair;
		if (pairs[pairName] || brokerPairs.includes(pairName)) {
			const { close } = tickers[pairName] || {};
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (
			pairs[reversePairName] ||
			brokerPairs.includes(reversePairName)
		) {
			const { close } = tickers[reversePairName] || {};
			tickerClose = 1 / close;
			side = 'sell';
			pair = reversePairName;
		}

		this.props.setPriceEssentials({
			side,
			targetAmount: undefined,
			sourceAmount: undefined,
		});
		this.setState({
			side,
			tickerClose,
			// pair,
			selectedSource,
			selectedTarget,
			targetOptions: targetOptions,
			isSelectChange: true,
		});
		if (pair) {
			this.goToPair(pair);
		}
	};

	constructTarget = () => {
		const {
			sourceOptions,
			routeParams,
			pairs,
			router,
			tickers,
			broker,
		} = this.props;

		const pairKeys = Object.keys(pairs);
		const flippedPair = this.flipPair(routeParams.pair);
		const brokerPairs = broker.map((br) => br.symbol);

		let pair;
		let side;
		let tickerClose;
		let originalPair;
		if (brokerPairs.includes(routeParams.pair)) {
			originalPair = routeParams.pair;
			pair = routeParams.pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (brokerPairs.includes(flippedPair)) {
			originalPair = routeParams.pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.includes(routeParams.pair)) {
			originalPair = routeParams.pair;
			pair = routeParams.pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (pairKeys.includes(flippedPair)) {
			originalPair = routeParams.pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.length) {
			originalPair = pairKeys[0];
			pair = pairKeys[0];
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else {
			router.push('/summary');
		}

		const [, selectedSource = sourceOptions[0]] = originalPair.split('-');
		const targetOptions = this.getTargetOptions(selectedSource);
		const [selectedTarget = targetOptions[0]] = originalPair.split('-');
		this.setState({
			selectedTarget,
			targetOptions,
			side,
			tickerClose,
		});

		this.goToPair(pair);
	};

	getTargetOptions = (sourceKey) => {
		const { sourceOptions, pairs, broker } = this.props;
		let brokerPairs = {};
		broker.forEach((br) => {
			brokerPairs[br.symbol] = br;
		});

		return sourceOptions.filter(
			(key) =>
				pairs[`${key}-${sourceKey}`] ||
				pairs[`${sourceKey}-${key}`] ||
				brokerPairs[`${sourceKey}-${key}`] ||
				brokerPairs[`${key}-${sourceKey}`]
		);
	};

	brokerTargetChange = (existBroker, targetAmount) => {
		const decimalPoint = getDecimals(existBroker.increment_size);
		if (this.state.side === 'buy') {
			const sourceAmount = _floor(
				targetAmount * existBroker.sell_price,
				decimalPoint
			);
			this.setState({
				brokerTargetAmount: targetAmount,
				brokerSourceAmount: sourceAmount,
			});
		} else {
			const sourceAmount = _floor(
				targetAmount / existBroker.buy_price,
				decimalPoint
			);
			this.setState({
				brokerTargetAmount: targetAmount,
				brokerSourceAmount: sourceAmount,
			});
		}
	};

	brokerSourceChange = (existBroker, sourceAmount) => {
		const decimalPoint = getDecimals(existBroker.increment_size);
		if (this.state.side === 'buy') {
			const targetAmount = _floor(
				sourceAmount / existBroker.sell_price,
				decimalPoint
			);
			this.setState({
				brokerTargetAmount: targetAmount,
				brokerSourceAmount: sourceAmount,
			});
		} else {
			const targetAmount = _floor(
				sourceAmount * existBroker.buy_price,
				decimalPoint
			);
			this.setState({
				brokerTargetAmount: targetAmount,
				brokerSourceAmount: sourceAmount,
			});
		}
	};

	onChangeTargetAmount = (targetAmount) => {
		const { existBroker } = this.state;
		if (existBroker && Object.keys(existBroker).length) {
			this.brokerTargetChange(existBroker, targetAmount);
			clearTimeout(timeout);
			this.setState({ quoteSeconds: '' });
		} else {
			this.props.setPriceEssentials({
				size: targetAmount,
				targetAmount,
				isSourceChanged: false,
			});
		}
	};

	onChangeSourceAmount = (sourceAmount) => {
		const { existBroker } = this.state;
		if (existBroker && Object.keys(existBroker).length) {
			this.brokerSourceChange(existBroker, sourceAmount);
			clearTimeout(timeout);
			this.setState({ quoteSeconds: '' });
		} else {
			this.props.setPriceEssentials({
				size: sourceAmount,
				sourceAmount,
				isSourceChanged: true,
			});
		}
	};

	isReviewDisabled = () => {
		const {
			selectedTarget,
			selectedSource,
			sourceError,
			targetError,
			brokerSourceAmount,
			brokerTargetAmount,
			pair,
			isBrokerPaused,
		} = this.state;
		const { targetAmount, sourceAmount, broker, pairs } = this.props;
		const brokerPairs = broker.map((br) => br.symbol);
		const flipPair = this.flipPair(pair);
		let isUseBroker = false;
		if (brokerPairs.includes(pair) || brokerPairs.includes(flipPair)) {
			if (pairs[pair] !== undefined || pairs[flipPair] !== undefined) {
				isUseBroker = true;
			} else {
				isUseBroker = true;
			}
		} else {
			isUseBroker = false;
		}
		if (isUseBroker) {
			return (
				!isLoggedIn() ||
				!selectedTarget ||
				!selectedSource ||
				!brokerSourceAmount ||
				!brokerTargetAmount ||
				sourceError ||
				targetError ||
				isBrokerPaused
			);
		} else {
			return (
				!isLoggedIn() ||
				!selectedTarget ||
				!selectedSource ||
				!targetAmount ||
				!sourceAmount ||
				sourceError ||
				targetError
			);
		}
	};

	goToPair = (pair) => {
		browserHistory.push(`/quick-trade/${pair}`);
	};

	resetOrderData = () => {
		this.setState({
			order: {
				fetching: false,
				error: false,
				data: {},
			},
		});
	};

	goToWallet = () => {
		this.props.router.push('/wallet');
	};

	forwardSourceError = (sourceError) => {
		this.setState({ sourceError }, () => {
			let temp = false;
			if (
				parseFloat(this.state.brokerTargetAmount) ||
				parseFloat(this.state.brokerSourceAmount)
			) {
				temp = sourceError || this.state.targetError ? false : true;
				clearTimeout(timeout);
			}
			this.setState({ isAmountChanged: temp });
		});
	};

	forwardTargetError = (targetError) => {
		this.setState({ targetError }, () => {
			let temp = false;
			if (
				parseFloat(this.state.brokerTargetAmount) ||
				parseFloat(this.state.brokerSourceAmount)
			) {
				temp = targetError || this.state.sourceError ? false : true;
				clearTimeout(timeout);
			}
			this.setState({ isAmountChanged: temp });
		});
	};

	handleSec = (isTimer) => {
		this.setState({ isTimer });
	};

	handleRefresh = () => {
		const { pair, side } = this.state;
		this.setState({ isLoading: true });
		this.handleBrokerQuote(pair, side);
		setTimeout(() => {
			this.setState({ isLoading: false }, this.handleSec(false));
		}, 2000);
	};

	handleSecondsChange = (quoteSeconds) => {
		if (quoteSeconds > 0) {
			timeout = setTimeout(
				() => this.setState({ quoteSeconds: quoteSeconds - 1 }),
				1000
			);
		} else {
			clearTimeout(timeout);
			this.setState({ quoteSeconds: '' });
			this.handleSec(true);
		}
	};

	renderFooterBtn = (isExistBroker, quoteSeconds) => {
		if (isExistBroker) {
			if (quoteSeconds <= 0) {
				return (
					<Button
						label={STRINGS['REFRESH']}
						onClick={this.handleRefresh}
						className="ml-2"
					/>
				);
			} else {
				return (
					<Button
						label={
							<div>
								{STRINGS['CONFIRM_TEXT']} (
								<Timer quoteSeconds={quoteSeconds} />)
							</div>
						}
						onClick={this.onExecuteTrade}
						className="ml-2"
					/>
				);
			}
		} else {
			return (
				<Button
					label={STRINGS['CONFIRM_TEXT']}
					onClick={this.onExecuteTrade}
					className="ml-2"
				/>
			);
		}
	};

	render() {
		const {
			pairData = {},
			activeTheme,
			orderLimits,
			pairs,
			coins,
			sourceOptions,
			tickers,
			user,
			router,
			constants,
			estimatedPrice,
			targetAmount,
			sourceAmount,
			broker,
		} = this.props;
		const {
			order,
			selectedTarget,
			selectedSource,
			showQuickTradeModal,
			pair,
			targetOptions,
			side,
			data,
			isShowChartDetails,
			brokerTargetAmount,
			brokerSourceAmount,
			existBroker,
			isBrokerPaused,
			isLoading,
			quoteSeconds,
			OriginalQuoteSeconds,
		} = this.state;

		let market = data.map((key) => {
			let pair = pairs[key] || {};
			let { fullname, symbol = '' } =
				coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
			const pairTwo = coins[pair.pair_2] || DEFAULT_COIN_DATA;
			const { increment_price, increment_size } = pair;
			let ticker = tickers[key] || {};
			const priceDifference =
				ticker.open === 0 ? 0 : (ticker.close || 0) - (ticker.open || 0);
			const tickerPercent =
				priceDifference === 0 || ticker.open === 0
					? 0
					: (priceDifference / ticker.open) * 100;
			const priceDifferencePercent = isNaN(tickerPercent)
				? formatPercentage(0)
				: formatPercentage(tickerPercent);
			return {
				key,
				pair,
				symbol,
				pairTwo,
				fullname,
				ticker,
				increment_price,
				increment_size,
				priceDifference,
				priceDifferencePercent,
			};
		});

		let marketData;
		market.forEach((data) => {
			const keyData = data.key.split('-');
			if (
				(keyData[0] === selectedSource && keyData[1] === selectedTarget) ||
				(keyData[1] === selectedSource && keyData[0] === selectedTarget)
			) {
				marketData = data;
			}
		});
		const decimalPoint = getDecimals(pairData.increment_size);

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		const targetValue =
			existBroker && Object.keys(existBroker).length
				? brokerTargetAmount
				: targetAmount;
		const sourceValue =
			existBroker && Object.keys(existBroker).length
				? brokerSourceAmount
				: sourceAmount;
		const isExistBroker =
			existBroker && Object.keys(existBroker).length ? true : false;

		let widthPercent = 100;
		if (!isNaN((quoteSeconds / OriginalQuoteSeconds) * 100)) {
			widthPercent = (quoteSeconds / OriginalQuoteSeconds) * 100;
		}

		return (
			<div className="h-100">
				<div id="quick-trade-header"></div>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}

				<div
					className={classnames(
						'd-flex',
						'f-1',
						'quote-container',
						'h-100',
						'justify-content-center',
						{
							'flex-column': isMobile,
						}
					)}
				>
					<QuickTrade
						onReviewQuickTrade={this.onReviewQuickTrade}
						onSelectTarget={this.onSelectTarget}
						onSelectSource={this.onSelectSource}
						side={side}
						symbol={pair}
						disabled={this.isReviewDisabled()}
						orderLimits={orderLimits[pair] || {}}
						pairs={pairs}
						coins={coins}
						market={marketData}
						user={user}
						sourceOptions={sourceOptions}
						targetOptions={targetOptions}
						selectedSource={selectedSource}
						selectedTarget={selectedTarget}
						targetAmount={targetValue}
						sourceAmount={sourceValue}
						router={router}
						onChangeTargetAmount={this.onChangeTargetAmount}
						onChangeSourceAmount={this.onChangeSourceAmount}
						forwardSourceError={this.forwardSourceError}
						forwardTargetError={this.forwardTargetError}
						constants={constants}
						estimatedPrice={estimatedPrice}
						isShowChartDetails={isShowChartDetails}
						isExistBroker={isExistBroker}
						flipPair={this.flipPair}
						broker={broker}
						isBrokerPaused={isBrokerPaused}
					/>
					<Dialog
						isOpen={showQuickTradeModal}
						label="quick-trade-modal"
						onCloseDialog={this.onCloseDialog}
						shouldCloseOnOverlayClick={false}
						showCloseText={false}
						theme={activeTheme}
						style={{ 'z-index': 100 }}
					>
						{isLoading ? (
							<Loader relative={true} background={false} />
						) : showQuickTradeModal ? (
							!order.fetching && !order.completed ? (
								<div className="quote-review-wrapper">
									<div>
										<div className="mb-4">
											<div className="quote_header">
												{STRINGS['CONFIRM_TEXT']}
											</div>
											<div className="quote_content">
												{STRINGS['QUOTE_CONFIRMATION_MSG_TEXT_1']}
											</div>
											<div className="quote_content">
												{STRINGS['QUOTE_CONFIRMATION_MSG_TEXT_2']}
											</div>
										</div>
										<div
											className={
												quoteSeconds <= 0 && isExistBroker
													? 'disabled-area'
													: ''
											}
										>
											<ReviewBlock
												symbol={selectedSource}
												text={STRINGS['SPEND_AMOUNT']}
												amount={sourceValue}
												decimalPoint={decimalPoint}
												isExistBroker={isExistBroker}
											/>
											{isExistBroker ? (
												<div
													className={'loading-border'}
													style={{ width: `${widthPercent}%` }}
												></div>
											) : null}
											<ReviewBlock
												symbol={selectedTarget}
												text={STRINGS['ESTIMATE_RECEIVE_AMOUNT']}
												amount={targetValue}
												decimalPoint={decimalPoint}
												isExistBroker={isExistBroker}
											/>
										</div>
										<footer className="d-flex pt-4">
											<Button
												label={STRINGS['CLOSE_TEXT']}
												onClick={this.onCloseDialog}
												className="mr-2"
											/>
											{this.renderFooterBtn(isExistBroker, quoteSeconds)}
										</footer>
									</div>
								</div>
							) : (
								<QuoteResult
									coins={coins}
									pairData={pairData}
									data={order}
									onClose={this.onCloseDialog}
									onConfirm={this.goToWallet}
								/>
							)
						) : (
							<div />
						)}
					</Dialog>
				</div>
				<div id="quick-trade-footer"></div>
			</div>
		);
	}
}

const getSourceOptions = (pairs = {}, broker = []) => {
	const coins = [];
	Object.entries(pairs).forEach(([, { pair_base, pair_2 }]) => {
		coins.push(pair_base);
		coins.push(pair_2);
	});
	broker.forEach((data) => {
		const brokerCoin = data.symbol.split('-');
		if (!coins.includes(brokerCoin[0])) {
			coins.push(brokerCoin[0]);
		}
		if (!coins.includes(brokerCoin[1])) {
			coins.push(brokerCoin[1]);
		}
	});

	return unique(coins);
};

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair] || {};
	const sourceOptions = getSourceOptions(store.app.pairs, store.app.broker);
	const broker = store.app.broker || [];
	let flippedPair = pair.split('-');
	flippedPair = flippedPair.reverse().join('-');
	const qtlimits = !!broker.filter(
		(item) => item.symbol === pair || item.symbol === flippedPair
	)
		? BrokerLimitsSelector(store)
		: QuickTradeLimitsSelector(store);

	return {
		sourceOptions,
		pair,
		pairData,
		pairs: store.app.pairs,
		coins: store.app.coins,
		tickers: store.app.tickers,
		activeTheme: store.app.theme,
		activeLanguage: store.app.language,
		orderLimits: qtlimits,
		user: store.user,
		settings: store.user.settings,
		constants: store.app.constants,
		fetchingAuth: store.auth.fetching,
		isReady: store.app.isReady,
		estimatedPrice: store.quickTrade.estimatedPrice,
		sourceAmount: store.quickTrade.sourceAmount,
		targetAmount: store.quickTrade.targetAmount,
		broker,
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	setOrderbooks: bindActionCreators(setOrderbooks, dispatch),
	setPriceEssentials: bindActionCreators(setPriceEssentials, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(QuickTradeContainer));
