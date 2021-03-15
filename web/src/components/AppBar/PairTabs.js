import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { browserHistory } from 'react-router';
import { Dropdown } from 'antd';
import { Slider } from 'components';

import TabList from './TabList';
import MarketSelector from './MarketSelector';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { donutFormatPercentage, formatToCurrency } from 'utils/currency';
import { isMobile } from 'react-device-detect';

class PairTabs extends Component {
	state = {
		activePairTab: '',
	};

	componentDidMount() {
		const { router, pairs } = this.props;
		let active = '';
		if (router && router.params.pair) {
			active = router.params.pair;
		}
		this.setState({ activePairTab: active });
		this.initTabs(pairs, active);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { activePath, pairs, router, location } = nextProps;
		let active = this.state.activePairTab;

		if (this.props.activePath !== activePath && activePath !== 'trade') {
			active = '';
			this.setState({ activePairTab: active });
		}

		if (JSON.stringify(this.props.pairs) !== JSON.stringify(pairs)) {
			this.initTabs(pairs, active);
		}

		if (
			this.props.location &&
			location &&
			this.props.location.pathname !== location.pathname
		) {
			if (
				router &&
				router.params.pair &&
				location.pathname.indexOf('/trade/') === 0
			) {
				active = router.params.pair;
				this.setState({ activePairTab: active });
			} else if (router && !router.params.pair) {
				active = '';
				this.setState({ activePairTab: active });
			}
			this.initTabs(pairs, active);
		}
		if (this.props.activeLanguage !== nextProps.activeLanguage) {
			this.initTabs(pairs, active);
		}
	}

	initTabs = (pairs, activePair) => {};

	onTabClick = (pair) => {
		if (pair) {
			this.props.router.push(`/trade/${pair}`);
			this.setState({ activePairTab: pair });
		}
	};

	render() {
		const { activePairTab, isMarketSelectorVisible } = this.state;

		const { tickers, location, coins, favourites, pairs } = this.props;

		const pair = pairs[activePairTab] || {};
		const ticker = tickers[activePairTab] || {};
		const { symbol } =
			coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const pairTwo = coins[pair.pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const { increment_price } = pair;
		const priceDifference =
			ticker.open === 0 ? 0 : (ticker.close || 0) - (ticker.open || 0);
		const tickerPercent =
			priceDifference === 0 || ticker.open === 0
				? 0
				: (priceDifference / ticker.open) * 100;
		const priceDifferencePercent = isNaN(tickerPercent)
			? donutFormatPercentage(0)
			: donutFormatPercentage(tickerPercent);

		return (
			<div className="d-flex justify-content-between">
				<div className="market-bar d-flex align-items-center title-font apply_rtl">
					<div className="d-flex h-100">
						<div
							className={classnames(
								'app_bar-pair-content',
								'd-flex',
								'justify-content-between',
								'px-2',
								'market-trigger',
								{
									'active-tab-pair': location.pathname === '/trade/add/tabs',
								},
								{
									'active-market-trigger': activePairTab,
								}
							)}
						>
							<Dropdown
								id="selector-nav-container"
								className="market-selector-dropdown"
								overlay={
									<MarketSelector
										onViewMarketsClick={() =>
											browserHistory.push('/trade/add/tabs')
										}
										addTradePairTab={this.onTabClick}
										closeAddTabMenu={() =>
											this.setState((prevState) =>
												this.setState({
													isMarketSelectorVisible: !prevState.isMarketSelectorVisible,
												})
											)
										}
									/>
								}
								mouseEnterDelay={0}
								mouseLeaveDelay={0.05}
								trigger={[isMobile ? 'click' : 'hover']}
								visible={isMarketSelectorVisible}
								onVisibleChange={(visible) => {
									this.setState({ isMarketSelectorVisible: visible });
								}}
							>
								<div className="selector-trigger app_bar-pair-tab d-flex align-items-center justify-content-between w-100 h-100">
									{activePairTab ? (
										<div className="app_bar-pair-font d-flex align-items-center justify-content-between">
											<div className="app_bar-currency-txt">
												{symbol.toUpperCase()}/{pairTwo.symbol.toUpperCase()}:
											</div>
											<div className="title-font ml-1">
												{formatToCurrency(ticker.close, increment_price)}
											</div>
											<div
												className={
													priceDifference < 0
														? 'app-price-diff-down app-bar-price_diff_down'
														: 'app-bar-price_diff_up app-price-diff-up'
												}
											/>
											<div
												className={
													priceDifference < 0
														? 'title-font app-price-diff-down'
														: 'title-font app-price-diff-up'
												}
											>
												{priceDifferencePercent}
											</div>
										</div>
									) : (
										<div className="d-flex align-items-center">
											<EditWrapper stringId="ADD_TRADING_PAIR">
												{STRINGS['ADD_TRADING_PAIR']}
											</EditWrapper>
										</div>
									)}
									{isMarketSelectorVisible ? (
										<CaretUpOutlined style={{ fontSize: '14px' }} />
									) : (
										<CaretDownOutlined style={{ fontSize: '14px' }} />
									)}
								</div>
							</Dropdown>
						</div>
					</div>
					<div
						id="favourite-nav-container"
						className="h-100 w-100 favourite-list border-left"
					>
						<Slider small autoHideArrows={true} containerClass="h-100">
							{favourites && favourites.length > 0 && (
								<TabList
									items={favourites}
									pairs={pairs}
									tickers={tickers}
									coins={coins}
									activePairTab={activePairTab}
									onTabClick={this.onTabClick}
								/>
							)}
						</Slider>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({
	app: { language: activeLanguage, pairs, tickers, coins, favourites },
	orderbook: { prices },
}) => ({
	activeLanguage,
	pairs,
	tickers,
	coins,
	prices,
	favourites,
});

export default connect(mapStateToProps)(withConfig(PairTabs));
