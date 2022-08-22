import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	BrokerLimitsSelector,
	QuickTradeLimitsSelector,
} from 'containers/QuickTrade/utils';
import { isMobile } from 'react-device-detect';
import _floor from 'lodash/floor';
import { setWsHeartbeat } from 'ws-heartbeat/client';
import debounce from 'lodash.debounce';
import { message } from 'antd';
import moment from 'moment';

import STRINGS from 'config/localizedStrings';
import {
	changePair,
	getExchangeInfo,
	getTickers,
	setSnackNotification,
} from 'actions/appActions';
import { getSparklines } from 'actions/chartAction';
import { getToken, isLoggedIn } from 'utils/token';
import Markets from 'containers/Summary/components/Markets';
import { QuickTrade, EditWrapper } from 'components';
import { unique } from 'utils/data';
import { getDecimals } from 'utils/utils';
import math from 'mathjs';
import Image from 'components/Image';

import MainSection from './MainSection';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	getBroker,
	getBrokerQuote,
	getWithoutAuthBroker,
} from 'containers/Admin/Trades/actions';
import { setOrderbooks, setPriceEssentials } from 'actions/quickTradeAction';
import { WS_URL } from 'config/constants';
import { isIntentionalClosure, NORMAL_CLOSURE_CODE } from 'utils/webSocket';
import { STATIC_ICONS } from 'config/icons';
import { generateDynamicIconKey } from 'utils/id';
import { MarketsSelector } from 'containers/Trade/utils';
import MarketCard from './MarketCard';

// const DECIMALS = 4;
const MIN_HEIGHT = 450;
const DEFAULT_BG_SECTIONS = ['heading', 'market_list'];

let timeout = undefined;

const data = [
	{
		imageSrc: STATIC_ICONS['CARD_SECTION_ICON_1'],
		headerContent: 'Fast deposits',
		mainContent: 'Make a deposit and begin buying and selling crypto',
	},
	{
		imageSrc: STATIC_ICONS['CARD_SECTION_ICON_2'],
		headerContent: 'Trade globally 24/7',
		mainContent: 'Trade the biggest global crypto assets 24/7 365 days a year.',
	},
	{
		imageSrc: STATIC_ICONS['CARD_SECTION_ICON_3'],
		headerContent: 'APIs',
		mainContent:
			'Publicly accessible endpoints for market data, exchange status and more',
	},
	{
		imageSrc: STATIC_ICONS['CARD_SECTION_ICON_4'],
		headerContent: 'Best prices',
		mainContent: 'Get the best prices and live price data all in one place',
	},
];
class Home extends Component {
	constructor(props) {
		super(props);
		const { pairs, sourceOptions, tickers, broker, router } = this.props;
		const pairKeys = Object.keys(pairs);
		let pair = Object.keys(pairs)[0];
		let flippedPair = this.flipPair(pair);
		const brokerPairs = broker.map((br) => br.symbol);

		let side;
		let tickerClose;
		let originalPair;
		if (brokerPairs.includes(pair)) {
			originalPair = pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (brokerPairs.includes(flippedPair)) {
			originalPair = pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.includes(pair)) {
			originalPair = pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (pairKeys.includes(flippedPair)) {
			originalPair = pair;
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

		this.state = {
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
			height: 0,
			style: {
				minHeight: MIN_HEIGHT,
			},
			market: [],
			sectionData: {},
			isShowChartDetails: false,
			existBroker: {},
			isBrokerPaused: false,
			pair,
			brokerTargetAmount: undefined,
			brokerSourceAmount: undefined,
			orderbookWs: null,
			wsInitialized: false,
			chartData: {},
			isTimer: false,
			isLoading: false,
			buyPrice: 0,
			sellPrice: 0,
			token: '',
			quoteSeconds: '',
			OriginalQuoteSeconds: '',
			isAmountChanged: false,
			isHover: false,
			hoveredIndex: 0,
		};
		this.goToPair(pair);
		this.props.setPriceEssentials({ side: this.state.side });
	}

	UNSAFE_componentWillMount() {
		const { isReady, router, changePair } = this.props;
		const { pair } = this.state;
		changePair(pair);
		if (!isReady) {
			router.push('/summary');
		}
		this.initializeOrderbookWs(pair, getToken());
	}

	componentDidMount() {
		const { sections, broker, pairs } = this.props;
		const { pair, side } = this.state;
		this.props.getExchangeInfo();
		this.props.getTickers();
		getSparklines(Object.keys(pairs)).then((chartData) =>
			this.setState({ chartData })
		);
		this.generateSections(sections);
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

	componentDidUpdate(prevProps, prevState) {
		if (
			prevState.selectedSource !== this.state.selectedSource ||
			prevState.selectedTarget !== this.state.selectedTarget
		) {
			const { pairs, broker } = this.props;
			let pair = `${this.state.selectedSource}-${this.state.selectedTarget}`;
			let existBroker = {};
			broker.forEach((item) => {
				const splitPair = item.symbol.split('-');
				if (
					pair === item.symbol ||
					pair === `${splitPair[1]}-${splitPair[0]}`
				) {
					existBroker = item;
				}
			});
			let flipPair = this.flipPair(pair);

			if (Object.keys(existBroker).length) {
				if (pairs[pair] !== undefined || pairs[flipPair] !== undefined) {
					this.setState({ isShowChartDetails: true, existBroker });
					this.getBrokerData();
				} else {
					this.setState({ isShowChartDetails: false, existBroker });
					this.getBrokerData();
				}
				if (existBroker && existBroker.symbol === flipPair) {
					pair = flipPair;
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
				side: this.state.side,
				targetAmount: undefined,
				sourceAmount: undefined,
			});

			this.setState({
				isSelectChange: false,
				targetAmount: undefined,
				sourceAmount: undefined,
				brokerTargetAmount: undefined,
				brokerSourceAmount: undefined,
				pair,
			});

			this.initializeOrderbookWs(pair, getToken());
			this.handleBrokerQuote(pair, this.state.side);
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

	getBrokerQuoteData = async (symbol, side) => {
		try {
			const res = await getBrokerQuote(symbol, side);
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

	handleBrokerQuote = debounce(this.getBrokerQuoteData, 1000);

	handleSec = (isTimer) => {
		this.setState({ isTimer });
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

	getBrokerData = async () => {
		try {
			if (isLoggedIn()) {
				await getBroker();
			} else {
				await getWithoutAuthBroker();
			}
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
				const { pair } = this.state;
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
					this.initializeOrderbookWs(this.state.pair, getToken());
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

	goTo = (path) => () => {
		this.props.router.push(path);
	};

	onReviewQuickTrade = () => {
		const { pair } = this.props;
		if (isLoggedIn()) {
			this.goTo(`/quick-trade/${pair}`)();
		} else {
			this.goTo('/login')();
		}
	};

	generateSections = (sections) => {
		const { icons: ICONS } = this.props;
		const generateId = generateDynamicIconKey('LANDING_PAGE_SECTION');
		const sectionComponents = Object.entries(sections)
			.filter(([_, { is_active }]) => is_active)
			.sort(
				([_, { order: order_a }], [__, { order: order_b }]) => order_a - order_b
			)
			.map(([key, { className = '' }]) => {
				const iconId = generateId(key);

				const defaultBgStyle = {
					backgroundImage: `url(${
						ICONS[iconId] || ICONS['EXCHANGE_LANDING_PAGE']
					})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
				};

				const defaultNoBGstyle = {
					...(ICONS[iconId]
						? {
								backgroundImage: `url(${ICONS[iconId]})`,
						  }
						: {}),
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
				};

				const style =
					DEFAULT_BG_SECTIONS.includes(key) && ICONS[iconId]
						? defaultBgStyle
						: defaultNoBGstyle;

				const temp = JSON.parse(localStorage.getItem('removedBackgroundItems'));
				if (
					temp &&
					!!temp.filter((item) => style?.backgroundImage?.includes(item))
						?.length
				) {
					style['backgroundImage'] = '';
				}

				return (
					<div key={`section-${key}`} style={style} className={className}>
						<EditWrapper
							iconId={iconId}
							style={{ position: 'absolute', right: 10, zIndex: 1 }}
						/>
						{this.getSectionByKey(key)}
					</div>
				);
			});

		return sectionComponents;
	};

	calculateMinHeight = (sectionsNumber) => {
		if (sectionsNumber === 1) {
			if (isMobile) {
				return '30rem';
			} else {
				return 'calc(100vh - 15rem)';
			}
		} else {
			return '14rem';
		}
	};

	renderContent = (market) => {
		if (market) {
			this.setState({ market });
		}
	};

	flipPair = (pair) => {
		const pairArray = pair.split('-');
		return pairArray.reverse().join('-');
	};

	sectionToNav = (sec) => {
		this.props.router.push(`/trade/${sec?.props?.market?.pair?.code}`);
	};

	onMouseOver = (val, hoveredIndex) => {
		this.setState({ isHover: val, hoveredIndex });
	};

	getSectionByKey = (key) => {
		switch (key) {
			case 'heading': {
				const {
					constants: { features: { quick_trade = false } = {} } = {},
					isReady,
					pair,
					// sections,
				} = this.props;

				const sectionsNumber = Object.entries(this.state.sectionData)
					.filter(([_, { is_active }]) => is_active)
					.filter(([key]) => key !== 'quick_trade' || (quick_trade && isReady))
					.length;

				return (
					<div className="home-page_section-wrapper main-section-wrapper">
						<MainSection
							style={{
								minHeight: this.calculateMinHeight(sectionsNumber),
							}}
							onClickDemo={
								pair ? this.goTo(`trade/${pair}`) : this.goTo('trade/add/tabs')
							}
							onClickTrade={this.goTo('signup')}
						/>
					</div>
				);
			}
			case 'market_list': {
				const { router, coins, pairs } = this.props;
				return (
					<div className="home-page_section-wrapper">
						<div className="d-flex justify-content-center">
							<EditWrapper stringId="MARKETS_TABLE.TITLE">
								<div className="live-markets_header">
									{STRINGS['MARKETS_TABLE.TITLE']}
								</div>
							</EditWrapper>
						</div>
						<div className="home-page__market-wrapper">
							<div id="injected_code_section"></div>
							<Markets
								coins={coins}
								pairs={pairs}
								router={router}
								showSearch={false}
								showMarkets={true}
								isHome={true}
								renderContent={this.renderContent}
							/>
						</div>
					</div>
				);
			}
			case 'quick_trade': {
				const {
					constants: { features: { quick_trade = false } = {} } = {},
					isReady,
					pair,
					coins,
					pairs,
					orderLimits,
					sourceOptions,
					user,
					broker,
					estimatedPrice,
					router,
					targetAmount,
					sourceAmount,
				} = this.props;

				const {
					selectedTarget,
					selectedSource,
					targetOptions,
					side,
					market,
					existBroker,
					isShowChartDetails,
					isBrokerPaused,
					brokerTargetAmount,
					brokerSourceAmount,
				} = this.state;
				let marketData;
				if (market) {
					market.forEach((data) => {
						const keyData = data.key.split('-');
						if (
							(keyData[0] === selectedSource &&
								keyData[1] === selectedTarget) ||
							(keyData[1] === selectedSource && keyData[0] === selectedTarget)
						) {
							marketData = data;
						}
					});
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

				return (
					pairs &&
					Object.keys(pairs).length &&
					selectedTarget &&
					selectedTarget &&
					quick_trade &&
					isReady && (
						<div className="home-page_section-wrapper">
							<QuickTrade
								onReviewQuickTrade={this.onReviewQuickTrade}
								onSelectTarget={this.onSelectTarget}
								onSelectSource={this.onSelectSource}
								side={side}
								symbol={pair}
								disabled={false}
								orderLimits={orderLimits[pair] || {}}
								pairs={pairs}
								coins={coins}
								sourceOptions={sourceOptions}
								targetOptions={targetOptions}
								selectedSource={selectedSource}
								selectedTarget={selectedTarget}
								targetAmount={targetValue}
								sourceAmount={sourceValue}
								onChangeTargetAmount={this.onChangeTargetAmount}
								onChangeSourceAmount={this.onChangeSourceAmount}
								forwardSourceError={this.forwardSourceError}
								forwardTargetError={this.forwardTargetError}
								autoFocus={false}
								user={user}
								market={marketData}
								broker={broker}
								router={router}
								flipPair={this.flipPair}
								estimatedPrice={estimatedPrice}
								isShowChartDetails={isShowChartDetails}
								isExistBroker={isExistBroker}
								isBrokerPaused={isBrokerPaused}
							/>
						</div>
					)
				);
			}
			case 'card_section': {
				const { icons: ICONS } = this.props;
				return (
					<div className="html_card_section">
						{data.map((item, index) => {
							const { imageSrc, headerContent, mainContent } = item;
							return (
								<div className="card-section-wrapper" key={index}>
									<div className="card-section">
										<div>
											<Image
												iconId={`CARD_SECTION_LOGO_${index}`}
												icon={
													ICONS[`CARD_SECTION_LOGO_${index}`]
														? ICONS[`CARD_SECTION_LOGO_${index}`]
														: imageSrc
												}
												wrapperClassName={
													index === 0 && imageSrc.includes('Group_93')
														? 'fill-none'
														: 'card_section_logo'
												}
											/>
										</div>
										<EditWrapper stringId={`CARD_SECTION_HEADER_${index}`}>
											<div className="header_txt">
												{STRINGS[`CARD_SECTION_HEADER_${index}`]
													? STRINGS[`CARD_SECTION_HEADER_${index}`]
													: headerContent}
											</div>
										</EditWrapper>
										<div className="card_section_main">
											<EditWrapper stringId={`CARD_SECTION_MAIN_${index}`}>
												<div>
													{STRINGS[`CARD_SECTION_MAIN_${index}`]
														? STRINGS[`CARD_SECTION_MAIN_${index}`]
														: mainContent}
												</div>
											</EditWrapper>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				);
			}
			case 'carousel_section': {
				const { markets } = this.props;
				const { chartData } = this.state;
				const marketsData = [...markets, ...markets, ...markets];
				const items = marketsData.map((market, index) => (
					<MarketCard
						market={market}
						onDragStart={this.handleDragStart}
						role="presentation"
						chartData={chartData}
					/>
				));

				return (
					<div className="home_carousel_section ">
						<div class="slideshow-wrapper">
							<div class="parent-slider d-flex">
								{items.map((sec, index) => {
									return (
										<div
											className="section"
											onClick={() => this.sectionToNav(sec)}
										>
											{sec}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				);
			}
			default:
				return null;
		}
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
			pair,
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
			selectedSource,
			selectedTarget,
			targetOptions: targetOptions,
			isSelectChange: true,
			pair,
		});
		if (pair) {
			this.goToPair(pair);
		}
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
		const { tickerClose, existBroker } = this.state;
		const { pairData = {} } = this.props;
		const decimalPoint = getDecimals(pairData.increment_size);
		const sourceAmount = math.round(targetAmount * tickerClose, decimalPoint);
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
			this.setState({
				targetAmount,
				sourceAmount,
			});
		}
	};

	onChangeSourceAmount = (sourceAmount) => {
		const { tickerClose, existBroker } = this.state;
		const { pairData = {} } = this.props;
		const decimalPoint = getDecimals(pairData.increment_size);
		const targetAmount = math.round(sourceAmount / tickerClose, decimalPoint);
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
			this.setState({
				sourceAmount,
				targetAmount,
			});
		}
	};

	forwardSourceError = (sourceError) => {
		this.setState({ sourceError }, () => {
			let temp = false;
			if (
				parseFloat(this.state.brokerTargetAmount) ||
				parseFloat(this.state.brokerSourceAmount)
			) {
				temp = sourceError || this.state.targetError ? false : true;
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
			}
			this.setState({ isAmountChanged: temp });
		});
	};

	goToPair = (pair) => {
		const { changePair } = this.props;
		changePair(pair);
	};

	handleDragStart = (e) => e.preventDefault();

	render() {
		const {
			// symbol,
			// quickTradeData,
			// requestQuickTrade,
			sections,
		} = this.props;

		return (
			<div className="home_container">
				{/*<div className="home-page_overlay" />*/}
				<div>
					<EditWrapper
						sectionId="LANDING_PAGE_SECTIONS"
						position={[0, 0]}
						style={{
							position: 'fixed',
							right: '5px',
							top: 'calc((100vh - 160px)/2)',
							display: 'flex !important',
							zIndex: 1,
						}}
					/>
					<div className="home-page_content">
						{this.generateSections(sections)}
					</div>
				</div>
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
		// estimatedValue: 100,
		// symbol: store.orderbook.symbol,
		// quickTradeData: store.orderbook.quickTrade,
		activeLanguage: store.app.language,
		info: store.app.info,
		activeTheme: store.app.theme,
		constants: store.app.constants,
		tickers: store.app.tickers,
		orderLimits: qtlimits,
		user: store.user,
		settings: store.user.settings,
		fetchingAuth: store.auth.fetching,
		isReady: store.app.isReady,
		broker,
		estimatedPrice: store.quickTrade.estimatedPrice,
		sourceAmount: store.quickTrade.sourceAmount,
		targetAmount: store.quickTrade.targetAmount,
		markets: MarketsSelector(store),
	};
};

const mapDispatchToProps = (dispatch) => ({
	// requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
	setPriceEssentials: bindActionCreators(setPriceEssentials, dispatch),
	setOrderbooks: bindActionCreators(setOrderbooks, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Home));
