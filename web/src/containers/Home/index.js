import React, { Component } from 'react';
import classnames from 'classnames';
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

import STRINGS from 'config/localizedStrings';
import {
	changePair,
	setLanguage,
	getExchangeInfo,
	getTickers,
} from 'actions/appActions';
import { logout } from '../../actions/authAction';
import { getToken, isLoggedIn } from 'utils/token';
import Markets from 'containers/Summary/components/Markets';
import { QuickTrade, EditWrapper, ButtonLink } from 'components';
import { unique } from 'utils/data';
import { getDecimals } from 'utils/utils';
import math from 'mathjs';
import Image from 'components/Image';

import MainSection from './MainSection';
import withConfig from 'components/ConfigProvider/withConfig';
import { getBroker } from 'containers/Admin/Trades/actions';
import { setOrderbooks, setPriceEssentials } from 'actions/quickTradeAction';
import { WS_URL } from 'config/constants';
import { isIntentionalClosure, NORMAL_CLOSURE_CODE } from 'utils/webSocket';

// const DECIMALS = 4;
const MIN_HEIGHT = 450;

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
		const { pair } = this.state;
		this.props.getExchangeInfo();
		this.props.getTickers();
		this.generateSections(sections);
		if (window.customRenderCardSection) {
			window.customRenderCardSection();
		}
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
		}
	}

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
		const sectionComponents = Object.entries(sections)
			.filter(([_, { is_active }]) => is_active)
			.sort(
				([_, { order: order_a }], [__, { order: order_b }]) => order_a - order_b
			)
			.map(([key], index) => (
				<div key={`section-${key}`}>{this.getSectionByKey(key)}</div>
			));

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
							<div id="html_card_section"></div>
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
		this.setState({ sourceError });
	};

	forwardTargetError = (targetError) => {
		this.setState({ targetError });
	};

	goToPair = (pair) => {
		const { changePair } = this.props;
		changePair(pair);
	};

	renderIcon = () => {
		const { icons: ICONS } = this.props;
		return (
			<div className={classnames('app_bar-icon', 'text-uppercase', 'h-100')}>
				<div className="d-flex h-100">
					<div className="'h-100'">
						<Image
							iconId="EXCHANGE_LOGO"
							icon={ICONS['EXCHANGE_LOGO']}
							wrapperClassName="app_bar-icon-logo wide-logo h-100"
						/>
					</div>
					<EditWrapper iconId="EXCHANGE_LOGO" position={[-5, 5]} />
				</div>
			</div>
		);
	};

	renderButtonSection = () => {
		return (
			<div className="d-flex align-items-center buttons-section-header">
				<ButtonLink
					link={'/login'}
					type="button"
					label={STRINGS['LOGIN_TEXT']}
					className="main-section_button_invert home_header_button"
				/>
				<div style={{ width: '0.75rem' }} />
				<ButtonLink
					link={'/signup'}
					type="button"
					label={STRINGS['SIGNUP_TEXT']}
					className="main-section_button home_header_button"
				/>
			</div>
		);
	};

	renderAccountButton = () => {
		const { user } = this.props;
		return (
			<div className="pointer" onClick={this.goTo('/account')}>
				{user.email}
			</div>
		);
	};

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
					<div className="home_app_bar d-flex justify-content-between align-items-center my-2 mx-3">
						<div className="d-flex align-items-center justify-content-center h-100">
							{this.renderIcon()}
						</div>
						{isLoggedIn()
							? this.renderAccountButton()
							: this.renderButtonSection()}
					</div>
					<EditWrapper
						iconId="EXCHANGE_LANDING_PAGE"
						style={{ position: 'absolute', right: 10 }}
					/>
					<div className="home-page_content">
						<div className="mx-2 mb-3">{this.generateSections(sections)}</div>
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
	};
};

const mapDispatchToProps = (dispatch) => ({
	// requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	logout: bindActionCreators(logout, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
	setPriceEssentials: bindActionCreators(setPriceEssentials, dispatch),
	setOrderbooks: bindActionCreators(setOrderbooks, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Home));
