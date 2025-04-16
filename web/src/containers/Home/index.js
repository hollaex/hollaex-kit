import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { Input } from 'antd';
import {
	LoadingOutlined,
	MinusCircleFilled,
	PlusCircleFilled,
} from '@ant-design/icons';

import STRINGS from 'config/localizedStrings';
import {
	changePair,
	getExchangeInfo,
	getTickers,
	setCoinsData,
	setEmailDetail,
	setSignupEmail,
} from 'actions/appActions';
import {
	Image,
	QuickTrade,
	EditWrapper,
	Button,
	Coin,
	PriceChange,
} from 'components';

import MainSection from './MainSection';
import withConfig from 'components/ConfigProvider/withConfig';
import MiniQuickTrade from 'components/MiniQuickTrade';
import icons from 'config/icons/dark';
import { generateDynamicIconKey } from 'utils/id';
import { MarketsSelector } from 'containers/Trade/utils';
import { isLoggedIn } from 'utils/token';
import { getMiniCharts } from 'actions/chartAction';
import {
	countDecimals,
	formatCurrencyByIncrementalUnit,
	formatPercentage,
	formatToCurrency,
} from 'utils/currency';
import {
	flipPair,
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';
import { Loading } from 'containers/DigitalAssets/components/utils';

// const DECIMALS = 4;
const MIN_HEIGHT = 450;
const DEFAULT_BG_SECTIONS = ['heading', 'market_list'];

const data = [
	{
		imageSrc: icons['ACCOUNT_FUNDING'],
		headerContent: STRINGS['HOME.ACCOUNT_FUNDING_TITLE'],
		mainContent: STRINGS['HOME.ACCOUNT_FUNDING_DESC'],
	},
	{
		imageSrc: icons['WORLD_TRADE'],
		headerContent: STRINGS['HOME.TRADE_TITLE'],
		mainContent: STRINGS['HOME.TRADE_DESC'],
	},
	{
		imageSrc: icons['API_BUILDER'],
		headerContent: STRINGS['HOME.API_TITLE'],
		mainContent: STRINGS['HOME.API_DESC'],
	},
	{
		imageSrc: icons['LIVE_TRADE_ICON'],
		headerContent: STRINGS['HOME.LIVE_TRADE_TITLE'],
		mainContent: STRINGS['HOME.LIVE_TRADE_DESC'],
	},
];
class Home extends Component {
	state = {
		height: 0,
		style: {
			minHeight: MIN_HEIGHT,
		},
		sectionData: {},
		// chartData: {},
		isLoading: false,
		isHover: false,
		hoveredIndex: 0,
		carouselLoading: true,
		expandedQuestion: null,
	};

	UNSAFE_componentWillMount() {
		const { isReady, router } = this.props;

		if (!isReady) {
			router.push('/summary');
		}
	}

	componentDidMount() {
		const {
			sections,
			getExchangeInfo,
			getTickers,
			setSignupEmail,
			setEmailDetail,
		} = this.props;
		getExchangeInfo();
		getTickers();
		// getSparklines(Object.keys(pairs)).then((chartData) =>
		//  this.props.changeSparkLineData(chartData)
		// );
		this.getMinicharData();
		this.generateSections(sections);
		setSignupEmail(null);
		setEmailDetail(null);
		setTimeout(() => {
			this.setState({ carouselLoading: false });
		}, 3000);
	}

	goTo = (path) => () => {
		const { router } = this.props;
		router.push(path);
	};

	getIndexofOneDay = (dates) => {
		const currentTime = new Date().getTime();
		const oneDayAgoTime = currentTime - 24 * 60 * 60 * 1000;

		const index = dates.findIndex((dateString) => {
			const date = new Date(dateString).getTime();
			return date > oneDayAgoTime;
		});

		return index;
	};

	getPriceDetails = (price) => {
		const firstPrice = price[0];
		const lastPrice = price[price.length - 1];
		const priceDifference = lastPrice - firstPrice;
		const priceDifferencePercent = formatPercentage(
			(priceDifference / firstPrice) * 100
		);
		const formattedNumber = (val) =>
			formatToCurrency(val, 0, val < 1 && countDecimals(val) > 8);

		const priceDifferencePercentVal = Number(
			priceDifferencePercent.replace('%', '')
		);

		return {
			priceDifference,
			priceDifferencePercent,
			priceDifferencePercentVal,
			lastPrice: formattedNumber(lastPrice),
		};
	};

	getPricingData = (chartData) => {
		const { price = [], time } = chartData || {};

		if (time?.length > 0 && price?.length > 0) {
			const {
				priceDifference,
				priceDifferencePercent,
				priceDifferencePercentVal,
				lastPrice,
			} = this.getPriceDetails(price);

			const indexOneDay = this.getIndexofOneDay(time);
			const oneDayChartPrices = price.slice(indexOneDay, price?.length);

			const {
				priceDifference: oneDayPriceDifference,
				priceDifferencePercent: oneDayPriceDifferencePercent,
				priceDifferencePercentVal: oneDayPriceDifferencePercenVal,
			} = this.getPriceDetails(oneDayChartPrices);

			return {
				oneDayPriceDifference,
				oneDayPriceDifferencePercent,
				oneDayPriceDifferencePercenVal,
				priceDifference,
				priceDifferencePercent,
				priceDifferencePercentVal,
				lastPrice,
			};
		}
		return {};
	};

	getCoinsData = (coinsList, chartValues) => {
		const { coins, quicktradePairs, setCoinsData } = this.props;
		const coinsData = coinsList
			.map((name) => {
				const {
					code,
					icon_id,
					symbol,
					fullname,
					type,
					created_at,
					increment_unit,
				} = coins[name];

				const key = `${code}-usdt`;
				const pricingData = this.getPricingData(chartValues[key]);

				return {
					...pricingData,
					chartData: chartValues[key],
					code,
					icon_id,
					symbol,
					fullname,
					type,
					key,
					increment_unit,
					networkType: quicktradePairs[key]?.type,
					created_at,
				};
			})
			?.filter(({ type }) => type === 'blockchain')
			?.sort(
				(a, b) =>
					(coins[b?.symbol]?.market_cap || 0) -
					(coins[a?.symbol]?.market_cap || 0)
			);

		this.setState({ coinsData: coinsData });
		setCoinsData(coinsData);
	};

	getMinicharData = async () => {
		const { coins } = this.props;
		const coinsList = Object.keys(coins)?.map((val) => coins[val]?.code);
		try {
			this.setState({ isLoading: true });
			await getMiniCharts(coinsList.toLocaleString()).then((chartValues) => {
				this.setState({ chartData: chartValues });
				this.getCoinsData(coinsList, chartValues);
			});
			this.setState({ isLoading: false });
		} catch (error) {
			console.error(error);
		}
	};

	generateSections = (sections) => {
		const { icons: ICONS } = this.props;
		const generateId = generateDynamicIconKey('LANDING_PAGE_SECTION');
		const sectionComponents = Object.entries(sections)
			.filter(([key, { is_active }]) => is_active && key !== 'market_list')
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

	sectionToNav = (sec) => {
		const {
			router,
			pairs,
			quicktradePairs,
			constants: { features },
		} = this.props;

		if (this.state.carouselLoading) return;

		const getFilteredPairs = (pairsList) =>
			Object.keys(pairsList).find(
				(data) => data === sec?.key || data === flipPair(sec?.key)
			);

		const filteredPair = getFilteredPairs(pairs);
		const filteredQuickTradePair = getFilteredPairs(quicktradePairs);

		if (features?.pro_trade && filteredPair) {
			router.push(`/trade/${filteredPair}`);
		} else if (features.quick_trade && filteredQuickTradePair) {
			router.push(`/quick-trade/${filteredQuickTradePair}`);
		} else {
			router.push(`/prices/coin/${sec?.symbol}`);
		}
	};

	onMouseOver = (val, hoveredIndex) => {
		this.setState({ isHover: val, hoveredIndex });
	};

	onHandleNavigate = () => {
		const { router } = this.props;
		const path = isLoggedIn() ? '/summary' : '/signup';
		router.push(path);
	};

	renderPriceCard = (data, index, carouselLoading) => {
		const roundPrice = data?.lastPrice?.split(',')?.join('');
		const isPriceAvailable =
			data?.oneDayPriceDifferencePercent !== undefined &&
			data?.oneDayPriceDifference !== undefined;
		const formattedPrice = data?.lastPrice
			? formatCurrencyByIncrementalUnit(roundPrice, data?.increment_unit)
			: '-';

		return (
			<div className="price-card-wrapper">
				<div className="price-card-header">
					{carouselLoading ? (
						<LoadingOutlined />
					) : (
						<Coin type="CS9" iconId={data?.icon_id} />
					)}
					<span className="font-weight-bold asset-name">
						{carouselLoading ? <Loading index={index} /> : data?.fullname}
					</span>
					<span className="asset-symbol">
						{carouselLoading ? (
							<Loading index={index} />
						) : (
							data?.symbol?.toUpperCase()
						)}
					</span>
				</div>
				<div className="price-card-content">
					{isPriceAvailable ? (
						carouselLoading ? (
							<Loading index={index} />
						) : (
							<PriceChange
								market={{
									priceDifference: data?.oneDayPriceDifference,
									priceDifferencePercent: data?.oneDayPriceDifferencePercent,
								}}
								key={index}
							/>
						)
					) : (
						<span className="d-flex justify-content-end font-raleway asset-symbol">
							{carouselLoading ? <Loading index={index} /> : '0%'}
						</span>
					)}
					{carouselLoading ? (
						<Loading index={index} />
					) : (
						<span className="last-price-label">
							{data?.lastPrice && '$'}
							{formattedPrice}
						</span>
					)}
				</div>
			</div>
		);
	};

	getSectionByKey = (key) => {
		const {
			constants: {
				features: { quick_trade = false, pro_trade = false } = {},
			} = {},
			pairs,
			setSignupEmail,
			signupEmail,
			emailDetail,
			setEmailDetail,
		} = this.props;
		const filteredPair = Object.keys(pairs);
		const navigateToTrade = !isLoggedIn()
			? '/signup'
			: pro_trade && filteredPair?.length
			? `/trade/${filteredPair[0]}`
			: quick_trade && filteredPair?.length
			? `/quick-trade/${filteredPair[0]}`
			: '/accounts';

		const onHandlenavigate = () => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			this.goTo(navigateToTrade)();
			if (!emailRegex.test(emailDetail)) {
				setEmailDetail(null);
			}
		};
		switch (key) {
			case 'heading': {
				const {
					constants: { features: { quick_trade = false } = {} } = {},
					isReady,
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
							onClickDemo={this.goTo('/signup')}
							onClickTrade={this.goTo(navigateToTrade)}
							setSignupEmail={setSignupEmail}
							signupEmail={signupEmail}
						/>
					</div>
				);
			}
			case 'quick_trade': {
				const {
					constants: { features: { quick_trade = false } = {} } = {},
					isReady,
					pairs,
				} = this.props;

				return (
					pairs &&
					Object.keys(pairs).length &&
					quick_trade &&
					isReady && (
						<div className="home-page_section-wrapper">
							<QuickTrade autoFocus={false} preview={true} />
						</div>
					)
				);
			}
			case 'quick_trade_calculator': {
				return (
					<div className="home-page_section-wrapper mini-quick-trade-calculator-wrapper">
						<div
							className={`home-title text-center ${
								isMobile ? '' : 'mini-quicktrade-description-text'
							}`}
						>
							<EditWrapper stringId="HOME.MINI_QUICKTRADE">
								{STRINGS['HOME.MINI_QUICKTRADE']}
							</EditWrapper>
						</div>
						<div
							className={`text-center text-section ${
								isMobile ? 'mb-5' : 'w-50 mt-3 mb-5'
							}`}
						>
							<EditWrapper stringId="HOME.MINI_QUICKTRADE_DESC">
								{STRINGS['HOME.MINI_QUICKTRADE_DESC']}
							</EditWrapper>
						</div>
						<MiniQuickTrade />
					</div>
				);
			}
			case 'card_section': {
				const { icons: ICONS } = this.props;
				return (
					<div className="html_card_section">
						<EditWrapper stringId="HOME.WHY_US">
							<span className="home-title">{STRINGS['HOME.WHY_US']}</span>
						</EditWrapper>
						<div className="card-description-text">
							<EditWrapper stringId="HOME.CARD_DESC">
								<span className="text-section text-center w-100 d-block">
									{STRINGS['HOME.CARD_DESC']}
								</span>
							</EditWrapper>
						</div>
						<div className="cards-wrapper">
							{data.map((item, index) => {
								const { imageSrc, headerContent, mainContent } = item;
								return (
									<div
										className="card-section-wrapper"
										key={index}
										onClick={() => this.onHandleNavigate()}
									>
										<div className="card-section">
											<div className="card_section_logo_wrapper">
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
											<EditWrapper
												stringId={`CARD_SECTION_HEADER_${index}`}
												render={(string) => (
													<div className="header_txt">{string}</div>
												)}
											>
												{STRINGS[`CARD_SECTION_HEADER_${index}`]
													? STRINGS[`CARD_SECTION_HEADER_${index}`]
													: headerContent}
											</EditWrapper>
											<div className="card_section_main">
												<EditWrapper
													stringId={`CARD_SECTION_MAIN_${index}`}
													render={(string) => <div>{string}</div>}
												>
													{STRINGS[`CARD_SECTION_MAIN_${index}`]
														? STRINGS[`CARD_SECTION_MAIN_${index}`]
														: mainContent}
												</EditWrapper>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				);
			}
			case 'carousel_section': {
				const { coinsData } = this.props;
				const { carouselLoading } = this.state;
				let loopCnt = 0;

				const splitData = [[], [], []];
				if (coinsData) {
					coinsData.forEach((coin, index) => {
						splitData[index % 3].push(coin);
					});
				}

				const duplicatedCoins = splitData?.map((data) => {
					let testCoinData = [];
					if (data?.length < 12) {
						if (data?.length === 1) {
							loopCnt = 12;
						} else if (data?.length === 2) {
							loopCnt = 6;
						} else if (data?.length === 3) {
							loopCnt = 4;
						} else if (data?.length === 4 || data?.length === 5) {
							loopCnt = 3;
						} else if (data?.length > 5 && data?.length < 12) {
							loopCnt = 2;
						}
						for (let i = 0; i < loopCnt; i++) {
							testCoinData = [...testCoinData, ...data];
						}
					} else {
						testCoinData = [...data];
					}
					return [...testCoinData, ...testCoinData, ...testCoinData];
				});

				const maxLength = Math.max(
					...duplicatedCoins?.map((data) => data?.length)
				);
				const normalizedCoins = duplicatedCoins?.map((data) => {
					const diff = maxLength - data?.length;
					if (diff > 0) {
						return [...data, ...Array(diff).fill(null)];
					}
					return data;
				});

				const speeds = [20, 12, 15];
				return (
					<div
						className={
							carouselLoading
								? 'home_carousel_section '
								: 'home_carousel_section  price-carousel'
						}
					>
						{normalizedCoins?.map((coin, index) => {
							const duration = (speed = 10) =>
								parseInt((speed / 12) * coin?.length);
							return (
								<div className="slideshow-wrapper" key={index}>
									<div
										className="parent-slider d-flex"
										style={{ animationDuration: `${duration(speeds[index])}s` }}
									>
										{coin?.map((data, ind) => (
											<div
												className="section"
												key={ind}
												onClick={() => this.sectionToNav(data)}
											>
												{data
													? this.renderPriceCard(data, ind, carouselLoading)
													: null}
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				);
			}
			case 'question_section': {
				const { expandedQuestion } = this.state;

				const faq = [
					{ id: 1, question: 'HOME.QUESTION_1', answer: 'HOME.ANSWER_1' },
					{ id: 2, question: 'HOME.QUESTION_2', answer: 'HOME.ANSWER_2' },
					{ id: 3, question: 'HOME.QUESTION_3', answer: 'HOME.ANSWER_3' },
				];

				const toggleExpand = (id) => {
					this.setState({
						expandedQuestion: expandedQuestion === id ? null : id,
					});
				};

				return (
					<div className="home-page_section-wrapper question-answer-wrapper">
						<div className={`home-title text-center ${isMobile ? '' : 'w-50'}`}>
							<EditWrapper stringId="HOME.GOT_QUESTION_TEXT">
								{STRINGS['HOME.GOT_QUESTION_TEXT']}
							</EditWrapper>
						</div>
						<div
							className={`home-title text-center ${
								isMobile ? '' : 'faq-description-text'
							}`}
						>
							<EditWrapper stringId="HOME.GOT_ANSWER_TEXT">
								{STRINGS['HOME.GOT_ANSWER_TEXT']}
							</EditWrapper>
						</div>

						<div className="faq-details mt-5">
							{faq?.map(({ id, question, answer }) => (
								<div key={id} className="text-section">
									<div className="questions-container">
										<div
											className="question-row"
											onClick={() => toggleExpand(id)}
										>
											<EditWrapper stringId={question}>
												<span className="font-weight-bold">
													{STRINGS[question]}
												</span>
											</EditWrapper>
											{expandedQuestion === id ? (
												<MinusCircleFilled />
											) : (
												<PlusCircleFilled />
											)}
										</div>
									</div>
									{expandedQuestion === id && (
										<div className="answer-section">
											<EditWrapper stringId={answer}>
												{STRINGS[answer]}
											</EditWrapper>
										</div>
									)}
								</div>
							))}
						</div>

						<div className="more-btn main-section_button pointer">
							<EditWrapper stringId="HOME.MORE">
								{STRINGS['HOME.MORE']}
							</EditWrapper>
						</div>
					</div>
				);
			}
			case 'create_account_section': {
				return (
					<div className="home-page_section-wrapper question-answer-wrapper create-account-wrapper">
						<div className={`home-title text-center ${isMobile ? '' : 'w-50'}`}>
							<EditWrapper stringId="HOME.CREATE_ACCOUNT_DESC">
								{STRINGS['HOME.CREATE_ACCOUNT_DESC']}
							</EditWrapper>
						</div>
						{!isLoggedIn() ? (
							<div className="input-wrapper">
								<Input
									className="create-account-field"
									placeholder={STRINGS['HOME.EMAIL_TEXT']}
									onChange={(e) => setEmailDetail(e.target.value)}
									value={emailDetail}
								/>
								<Button
									label={STRINGS['SIGNUP_TEXT']}
									className="signup-btn"
									onClick={onHandlenavigate}
								/>
							</div>
						) : (
							<div
								className={`text-section text-center mt-5 ${
									isMobile ? '' : 'w-50'
								}`}
							>
								<EditWrapper stringId="HOME.TRADE_CRYPTO">
									<span
										onClick={this.goTo(navigateToTrade)}
										className="start-trade-btn pointer main-section_button no-border"
									>
										{STRINGS['HOME.TRADE_CRYPTO']}
									</span>
								</EditWrapper>
							</div>
						)}
					</div>
				);
			}
			default:
				return null;
		}
	};

	handleDragStart = (e) => e.preventDefault();

	render() {
		const { sections } = this.props;

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
							zIndex: 5,
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

const mapStateToProps = (store) => {
	return {
		pair: store.app.pair,
		pairs: store.app.pairs,
		coins: store.app.coins,
		activeLanguage: store.app.language,
		constants: store.app.constants,
		fetchingAuth: store.auth.fetching,
		isReady: store.app.isReady,
		markets: MarketsSelector(store),
		sparkLineChartData: store.app.sparkLineChartData,
		signupEmail: store.app.signupEmail,
		emailDetail: store.app.emailDetail,
		coinsData: store.app.coinsData,
		quicktradePairs: quicktradePairSelector(store),
	};
};

const mapDispatchToProps = (dispatch) => ({
	// requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
	setSignupEmail: bindActionCreators(setSignupEmail, dispatch),
	setEmailDetail: bindActionCreators(setEmailDetail, dispatch),
	setCoinsData: bindActionCreators(setCoinsData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Home));
