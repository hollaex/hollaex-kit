import React, { Component } from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { debounce } from 'lodash';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import {Button, TabController, CheckTitle, MobileBarTabs, ButtonLink } from '../../components';

import STRINGS from '../../config/localizedStrings';
import {
	ICONS,
	PAIRS,
	DEFAULT_PAIR,
	FLEX_CENTER_CLASSES,
	BALANCE_ERROR
} from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

import ToogleButton from './ToogleButton';
import ReviewBlock from './ReviewBlock';
import InputBlock from './InputBlock';


const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

const getInitialTab = ( path ) => {
	let activeTab = -1;
	let activeDevelopers = false;
	if (path === 'btc-eur') {
		activeTab = 0;
	}
	 else if (path === 'eth-eur') {
		activeTab = 1;
	} 
	
	return {
		activeTab,
		activeDevelopers
	};
};
class QuickTrade extends Component {
	state = {
		side: STRINGS.SIDES[0].value,
		value: 0.1,
		symbol: DEFAULT_PAIR,
		tabs: [],
		activeTab:-1,
	};

	componentDidMount() {
		if (this.props.symbol !== fiatSymbol) {
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
		if(activeTab===0) {
			browserHistory.push(`/quick-trade/btc-eur`)
			this.setState({ activeTab });
		} else {
			browserHistory.push(`/quick-trade/eth-eur`)
			this.setState({ activeTab });
		}
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
		let activeDevelopers = false;
		const {theme} = this.props 
		if (updateActiveTab || this.state.activeTab === -1) {
			const initialValues = getInitialTab(this.props.symbol);
			activeTab = initialValues.activeTab;
			activeDevelopers = initialValues.activeDevelopers;
		}
		
		const tabs = [
			{
				title:
					<CheckTitle
						title={STRINGS.BTC_NAME}
						icon={ theme==='dark'? ICONS.BTC_ICON_DARK:ICONS.BTC_ICON}
					/>
				
			},
			{	title:
					<CheckTitle
						title={STRINGS.ETH_NAME}
						icon={theme==='dark'? ICONS.ETH_ICON_DARK:ICONS.ETH_ICON }
					/>
			}
		];

		this.setState({ tabs, activeTab });
	};

	render() {
		const { onReviewQuickTrade, quickTradeData, disabled, theme } = this.props;
		const { side, value, symbol, tabs, activeTab } = this.state;
		const { data, fetching, error } = quickTradeData;
		const name = STRINGS[`${PAIRS[symbol].pair_base.toUpperCase()}_NAME`];
		return (
			<div className={classnames('quick_trade-wrapper', ...GROUP_CLASSES)}>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						...GROUP_CLASSES
					)}
				>
					<ReactSVG path={ICONS.QUICK_TRADE} wrapperClassName="quick_trade-icon" />
					<div className="title text-capitalize">
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
						...GROUP_CLASSES
					)}
				>
					<div className="presentation_container apply_rtl">
						<TabController
							activeTab={activeTab}
							setActiveTab={this.setActiveTab}
							tabs={tabs}
							className="account-tab"
						/>
					</div>
					<ToogleButton
						values={STRINGS.SIDES}
						onToogle={this.onToogleSide}
						selected={side}
					/>
				</div>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						...GROUP_CLASSES
					)}
				>
					<InputBlock
						onChange={this.onChangeValue}
						initialValue={value}
						text={STRINGS.formatString(
							STRINGS.QUICK_TRADE_COMPONENT.INPUT,
							name,
							STRINGS.SIDES_VALUES[side]
						)}
						symbol={symbol}
						className={classnames({ loading: fetching })}
						error={error}
					/>
				</div>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						...GROUP_CLASSES,
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
						...GROUP_CLASSES
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
