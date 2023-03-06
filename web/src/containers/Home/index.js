import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { Spin } from 'antd';

import STRINGS from 'config/localizedStrings';
import { changePair, getExchangeInfo, getTickers } from 'actions/appActions';
import { getSparklines } from 'actions/chartAction';
import Markets from 'containers/Summary/components/Markets';
import { Image, QuickTrade, EditWrapper } from 'components';

import MainSection from './MainSection';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';
import { generateDynamicIconKey } from 'utils/id';
import { MarketsSelector } from 'containers/Trade/utils';
import MarketCard from './MarketCard';

// const DECIMALS = 4;
const MIN_HEIGHT = 450;
const DEFAULT_BG_SECTIONS = ['heading', 'market_list'];

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
	state = {
		height: 0,
		style: {
			minHeight: MIN_HEIGHT,
		},
		sectionData: {},
		chartData: {},
		isLoading: false,
		isHover: false,
		hoveredIndex: 0,
		carouselLoading: true,
	};

	UNSAFE_componentWillMount() {
		const { isReady, router } = this.props;

		if (!isReady) {
			router.push('/summary');
		}
	}

	componentDidMount() {
		const { sections, pairs, getExchangeInfo, getTickers } = this.props;
		getExchangeInfo();
		getTickers();
		getSparklines(Object.keys(pairs)).then((chartData) =>
			this.setState({ chartData })
		);
		this.generateSections(sections);

		setTimeout(() => {
			this.setState({ carouselLoading: false });
		}, 3000);
	}

	goTo = (path) => () => {
		const { router } = this.props;
		router.push(path);
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

	sectionToNav = (sec) => {
		const { router } = this.props;
		router.push(`/trade/${sec?.pair?.code}`);
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
								pair ? this.goTo(`trade/${pair}`) : this.goTo('markets')
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
							<EditWrapper
								stringId="MARKETS_TABLE.TITLE"
								render={(string) => (
									<div className="live-markets_header">{string}</div>
								)}
							>
								{STRINGS['MARKETS_TABLE.TITLE']}
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
				);
			}
			case 'carousel_section': {
				const { markets } = this.props;
				const { chartData, carouselLoading } = this.state;
				let testMarket = [];
				let loopCnt = 0;
				if (markets.length < 12) {
					if (markets.length === 1) {
						loopCnt = 12;
					} else if (markets.length === 2) {
						loopCnt = 6;
					} else if (markets.length === 3) {
						loopCnt = 4;
					} else if (markets.length === 4 || markets.length === 5) {
						loopCnt = 3;
					} else if (markets.length > 5 || markets.length < 12) {
						loopCnt = 2;
					}

					for (let i = 0; i < loopCnt; i++) {
						testMarket = [...testMarket, ...markets];
					}
				} else {
					testMarket = [...markets];
				}

				const duration = parseInt((50 / 12) * testMarket.length);
				const marketsData = [...testMarket, ...testMarket, ...testMarket];

				return (
					<div className="home_carousel_section ">
						<Spin spinning={carouselLoading}>
							<div className="slideshow-wrapper">
								<div
									className="parent-slider d-flex"
									style={{ animationDuration: `${duration}s` }}
								>
									{marketsData.map((sec, index) => {
										return (
											<div
												className="section"
												style={{
													borderRight: `${
														!carouselLoading ? '1px solid #60605d' : 'none'
													}`,
												}}
												key={index}
												onClick={() => this.sectionToNav(sec)}
											>
												{!carouselLoading && (
													<MarketCard
														market={sec}
														onDragStart={this.handleDragStart}
														role="presentation"
														chartData={chartData}
													/>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</Spin>
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
	};
};

const mapDispatchToProps = (dispatch) => ({
	// requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Home));
