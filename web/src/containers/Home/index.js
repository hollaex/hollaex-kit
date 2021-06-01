import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { QuickTradeLimitsSelector } from 'containers/QuickTrade/utils';
import { isMobile } from 'react-device-detect';

import STRINGS from 'config/localizedStrings';
import {
	changePair,
	setLanguage,
	getExchangeInfo,
	getTickers,
} from 'actions/appActions';
import { logout } from '../../actions/authAction';
import { isLoggedIn } from 'utils/token';
import Markets from 'containers/Summary/components/Markets';
import { QuickTrade, EditWrapper, ButtonLink } from 'components';
import { unique } from 'utils/data';
import math from 'mathjs';
import Image from 'components/Image';

import MainSection from './MainSection';
import withConfig from 'components/ConfigProvider/withConfig';

const DECIMALS = 4;
const MIN_HEIGHT = 450;

class Home extends Component {
	constructor(props) {
		super(props);
		const { pairs, sourceOptions, tickers } = this.props;
		const pair = Object.keys(pairs)[0];
		const pairArray = pair ? pair.split('-') : [];
		const [, selectedSource = sourceOptions[0]] = pairArray;
		const targetOptions = this.getTargetOptions(selectedSource);
		const [selectedTarget = targetOptions[0]] = pairArray;
		const { close: tickerClose } = tickers[pair] || {};

		this.state = {
			side: 'buy',
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
		};
		this.goToPair(pair);
	}

	componentDidMount() {
		const { sections } = this.props;
		this.props.getExchangeInfo();
		this.props.getTickers();
		this.generateSections(sections);
	}

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

	getSectionByKey = (key) => {
		switch (key) {
			case 'heading': {
				const {
					constants: { features: { quick_trade = false } = {} } = {},
					isReady,
					pair,
					sections,
				} = this.props;

				const sectionsNumber = Object.entries(sections)
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
							<Markets
								coins={coins}
								pairs={pairs}
								router={router}
								showSearch={false}
								showMarkets={true}
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
				} = this.props;

				const {
					targetAmount,
					sourceAmount,
					selectedTarget,
					selectedSource,
					targetOptions,
					side,
				} = this.state;

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
								orderLimits={orderLimits[pair]}
								pairs={pairs}
								coins={coins}
								sourceOptions={sourceOptions}
								targetOptions={targetOptions}
								selectedSource={selectedSource}
								selectedTarget={selectedTarget}
								targetAmount={targetAmount}
								sourceAmount={sourceAmount}
								onChangeTargetAmount={this.onChangeTargetAmount}
								onChangeSourceAmount={this.onChangeSourceAmount}
								forwardSourceError={this.forwardSourceError}
								forwardTargetError={this.forwardTargetError}
								autoFocus={false}
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
		const { tickers } = this.props;
		const { selectedSource } = this.state;

		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (tickers[pairName]) {
			const { close } = tickers[pairName];
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (tickers[reversePairName]) {
			const { close } = tickers[reversePairName];
			tickerClose = 1 / close;
			side = 'sell';
			pair = reversePairName;
		}

		this.setState({
			tickerClose,
			side,
			selectedTarget,
			targetAmount: undefined,
			sourceAmount: undefined,
		});
		this.goToPair(pair);
	};

	onSelectSource = (selectedSource) => {
		const { tickers } = this.props;

		const targetOptions = this.getTargetOptions(selectedSource);
		const selectedTarget = targetOptions[0];
		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (tickers[pairName]) {
			const { close } = tickers[pairName];
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (tickers[reversePairName]) {
			const { close } = tickers[reversePairName];
			tickerClose = 1 / close;
			side = 'sell';
			pair = reversePairName;
		}

		this.setState({
			tickerClose,
			side,
			selectedSource,
			selectedTarget,
			targetOptions: targetOptions,
			targetAmount: undefined,
			sourceAmount: undefined,
		});
		this.goToPair(pair);
	};

	getTargetOptions = (sourceKey) => {
		const { sourceOptions, pairs } = this.props;

		return sourceOptions.filter(
			(key) => pairs[`${key}-${sourceKey}`] || pairs[`${sourceKey}-${key}`]
		);
	};

	onChangeTargetAmount = (targetAmount) => {
		const { tickerClose } = this.state;
		const sourceAmount = math.round(targetAmount * tickerClose, DECIMALS);

		this.setState({
			targetAmount,
			sourceAmount,
		});
	};

	onChangeSourceAmount = (sourceAmount) => {
		const { tickerClose } = this.state;
		const targetAmount = math.round(sourceAmount / tickerClose, DECIMALS);

		this.setState({
			sourceAmount,
			targetAmount,
		});
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

const getSourceOptions = (pairs = {}) => {
	const coins = [];
	Object.entries(pairs).forEach(([, { pair_base, pair_2 }]) => {
		coins.push(pair_base);
		coins.push(pair_2);
	});

	return unique(coins);
};

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair] || {};
	const sourceOptions = getSourceOptions(store.app.pairs);
	const qtlimits = QuickTradeLimitsSelector(store);

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
	};
};

const mapDispatchToProps = (dispatch) => ({
	// requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	logout: bindActionCreators(logout, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Home));
