import React, { Component } from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { debounce } from 'lodash';
import { browserHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import {Button, TabController, CheckTitle } from '../../components';

import STRINGS from '../../config/localizedStrings';
import {
	ICONS,
	DEFAULT_PAIR,
	FLEX_CENTER_CLASSES,
	BALANCE_ERROR
} from '../../config/constants';
import { BASE_CURRENCY } from '../../config/constants';

import ToogleButton from './ToogleButton';
import ReviewBlock from './ReviewBlock';
import InputBlock from './InputBlock';


// const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

const getInitialTab = (path, symbols, coins) => {
	let activeTab = -1;
	const baseCoin = coins[BASE_CURRENCY] || { symbol: '' };
	symbols.map((currency, index) => {
		const { symbol } = coins[currency] || {};
		if (path === `${symbol.toLowerCase()}-${baseCoin.symbol.toLowerCase()}`) {
			activeTab = index;
		}
	});
	
	return {
		activeTab,
	};
};
class QuickTrade extends Component {
	state = {
		side: STRINGS.SIDES[0].value,
		value: 0.1,
		symbol: DEFAULT_PAIR,
		tabs: [],
		activeTab:-1,
		currencies: []
	};

	componentDidMount() {
		if (this.props.symbol !== BASE_CURRENCY) {
			this.updateTabs()
			this.onChangeSymbol(this.props.symbol);
		} else {
			this.updateTabs()
			this.onChangeSymbol(DEFAULT_PAIR);
		}
		if (this.props.onChangeSide) {
			this.updateTabs()
			this.props.onChangeSide(this.state.side);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.symbol !== this.props.symbol
		) {
			this.updateTabs()
			this.onChangeSymbol(nextProps.symbol);
		}
	}

	setActiveTab = (activeTab) => {
		const { currencies } = this.state;
		const { symbol = '' } = this.props.coins[BASE_CURRENCY] || {};
		browserHistory.push(`/quick-trade/${currencies[activeTab]}-${symbol.toLowerCase()}`)
		this.setState({ activeTab });
	}

	onChangeSymbol = (symbol) => {
		this.setState({ symbol });
		this.requestValue({
			size: this.state.value,
			symbol: symbol,
			side: this.state.side
		});
	};

	onToogleSide = () => {
		const SIDES = STRINGS.SIDES;

		const side =
			this.state.side === SIDES[0].value ? SIDES[1].value : SIDES[0].value;
		this.setState({ side });
		this.requestValue({
			size: this.state.value,
			symbol: this.state.symbol,
			side: side
		});
		if (this.props.onChangeSide) {
			this.props.onChangeSide(side);
		}
	};

	onChangeValue = (value) => {
		if (value !== this.state.value) {
			this.requestValue({
				size: value || 0,
				symbol: this.state.symbol,
				side: this.state.side
			});
		}
		this.setState({ value });
	};

	requestValue = debounce(this.props.onRequestMarketValue, 250);

	updateTabs = (
		updateActiveTab = false
	) => {
		let activeTab = this.state.activeTab > -1 ? this.state.activeTab : 0;
		const { theme, pairs, coins } = this.props;
		const obj = {};
		Object.entries(pairs).forEach(([key, pair]) => {
			obj[pair.pair_base] = '';
		});
		const symbols = Object.keys(obj).map((key) => key);
		if (updateActiveTab || this.state.activeTab === -1) {
			const initialValues = getInitialTab(this.props.symbol, symbols, coins);
			activeTab = initialValues.activeTab;
		}

		const tabs = symbols.map(pair => {
			let icon = ICONS[`${pair.toUpperCase()}_ICON${theme === 'dark' ? '_DARK' : ''}`];
			if (!icon && theme === 'dark') {
				icon = ICONS[`${pair.toUpperCase()}_ICON`];
			}
			const { fullname = '' } = coins[pair] || {};
			return ({
				title:
					<CheckTitle
						title={fullname}
						icon={icon}
					/>
			});
		});

		this.setState({ tabs, activeTab, currencies: symbols });
	};

	render() {
		const { onReviewQuickTrade, quickTradeData, disabled, orderLimits, pairs, coins } = this.props;
		const { side, value, symbol, tabs, activeTab } = this.state;
		const { data, fetching, error } = quickTradeData;
		const baseCoin = pairs[symbol].pair_base;
		const { fullname } = coins[baseCoin] || {};
		return (
			<div className={classnames('quick_trade-wrapper', 'd-flex', 'flex-column')}>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						// ...GROUP_CLASSES
					)}
				>
					<ReactSVG path={ isMobile ? ICONS.SIDEBAR_QUICK_TRADING_INACTIVE: ICONS.QUICK_TRADE} wrapperClassName= {isMobile ?'quick_trade-tab-icon' :"quick_trade-icon"} />
					<div className={classnames("title text-capitalize", ...FLEX_CENTER_CLASSES)}>
						{STRINGS.formatString(
							STRINGS.QUICK_TRADE_COMPONENT.TRADE_TITLE,
							STRINGS.QUICK_TRADE_COMPONENT.TITLE,
							STRINGS.SIDES_VALUES[side]
						)}
					</div>
				</div>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						// ...GROUP_CLASSES
					)}
				>
					<div className="apply_rtl">
						<TabController
							quicktrade={true}
							activeTab={activeTab}
							setActiveTab={this.setActiveTab}
							tabs={tabs}
							className="account-tab"
						/>
					</div>
					<div>
						<ToogleButton
							values={STRINGS.SIDES}
							onToogle={this.onToogleSide}
							selected={side}
						/>
					</div>
				</div>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						// ...GROUP_CLASSES
					)}
				>
					<InputBlock
						onChange={this.onChangeValue}
						initialValue={value}
						text={STRINGS.formatString(
							STRINGS.QUICK_TRADE_COMPONENT.INPUT,
							fullname,
							STRINGS.SIDES_VALUES[side]
						)}
						symbol={symbol}
						className={classnames({ loading: fetching })}
						error={error}
						orderLimits={orderLimits}
						pairs={pairs}
						coins={coins}
					/>
				</div>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						// ...GROUP_CLASSES,
						{ fetching }
					)}
				>
					<ReviewBlock
						text={STRINGS.QUICK_TRADE_COMPONENT.TOTAL_COST}
						value={data.price || 0}
					/>
				</div>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						// ...GROUP_CLASSES
					)}
				>
					<Button
						label={STRINGS.formatString(
							STRINGS.QUICK_TRADE_COMPONENT.BUTTON,
							STRINGS.SIDES_VALUES[side]
						).join(' ')}
						onClick={onReviewQuickTrade}
						disabled={
							disabled ||
							!onReviewQuickTrade ||
							(!!error && error !== BALANCE_ERROR) ||
							fetching
						}
						type="button"
					/>
				</div>
			</div>
		);
	}
}

QuickTrade.defaultProps = {
	onRequestMarketValue: () => {},
	onReviewQuickTrade: () => {},
	estimatedValue: 0,
	disabled: false
};

export default QuickTrade;
