import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { browserHistory } from 'react-router';
import { Dropdown } from 'antd';
import { Slider } from 'components';
import _get from 'lodash/get';

import TabList from './TabList';
import MarketSelector from './MarketSelector';
import ToolsSelector from './ToolsSelector';
import STRINGS from 'config/localizedStrings';
import { EditWrapper, PriceChange } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { formatToCurrency } from 'utils/currency';
import { MarketsSelector } from 'containers/Trade/utils';

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
		const { router, constants } = this.props;
		if (pair) {
			if (_get(constants, 'features.pro_trade')) {
				router.push(`/trade/${pair}`);
			} else if (_get(constants, 'features.quick_trade')) {
				router.push(`/quick-trade/${pair}`);
			}
			this.setState({ activePairTab: pair });
		}
	};

	render() {
		const {
			activePairTab,
			isMarketSelectorVisible,
			isToolsSelectorVisible,
		} = this.state;

		const { location, favourites, markets } = this.props;
		const market = markets.find(({ key }) => key === activePairTab) || {};
		const {
			pair: { increment_price } = {},
			ticker: { close } = {},
			display_name,
		} = market;

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
										wrapperClassName="app-bar-add-tab-menu"
									/>
								}
								destroyPopupOnHide={true}
								mouseEnterDelay={0}
								mouseLeaveDelay={0.05}
								trigger={['click']}
								visible={isMarketSelectorVisible}
								onVisibleChange={(visible) => {
									this.setState({ isMarketSelectorVisible: visible });
								}}
							>
								<div className="selector-trigger app_bar-pair-tab d-flex align-items-center justify-content-between w-100 h-100">
									{activePairTab ? (
										<div className="app_bar-pair-font d-flex align-items-center justify-content-between">
											<div className="app_bar-currency-txt">
												{display_name}:
											</div>
											<div className="title-font ml-1">
												{formatToCurrency(close, increment_price)}
											</div>
											<PriceChange market={market} />
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
									markets={markets}
									activePairTab={activePairTab}
									onTabClick={this.onTabClick}
								/>
							)}
						</Slider>
					</div>
					{location.pathname.indexOf('/trade/') === 0 && (
						<div className="d-flex h-100 tools-button border-left">
							<div
								className={classnames(
									'app_bar-pair-content',
									'market-trigger',
									'd-flex',
									'justify-content-between',
									'px-2'
								)}
							>
								<Dropdown
									className="market-selector-dropdown"
									overlay={<ToolsSelector />}
									mouseEnterDelay={0}
									mouseLeaveDelay={0.05}
									trigger={['click']}
									visible={isToolsSelectorVisible}
									onVisibleChange={(visible) => {
										this.setState({ isToolsSelectorVisible: visible });
									}}
								>
									<div className="selector-trigger narrow app_bar-pair-tab d-flex align-items-center justify-content-between w-100 h-100">
										<div>Tools</div>
										{isToolsSelectorVisible ? (
											<CaretUpOutlined style={{ fontSize: '14px' }} />
										) : (
											<CaretDownOutlined style={{ fontSize: '14px' }} />
										)}
									</div>
								</Dropdown>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		app: { language: activeLanguage, pairs, favourites, constants },
		orderbook: { prices },
	} = state;

	return {
		activeLanguage,
		pairs,
		prices,
		favourites,
		constants,
		markets: MarketsSelector(state),
	};
};

export default connect(mapStateToProps)(withConfig(PairTabs));
