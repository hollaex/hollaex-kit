import React, { Component } from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { debounce } from 'lodash';
import { browserHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Button } from '../../components';
import MobileDropdownWrapper from '../../containers/Trade/components/MobileDropdownWrapper';
import STRINGS from '../../config/localizedStrings';
import {
	ICONS,
	FLEX_CENTER_CLASSES,
	BALANCE_ERROR,
	DEFAULT_COIN_DATA
} from '../../config/constants';
import ToogleButton from './ToogleButton';
import ReviewBlock from './ReviewBlock';
import InputBlock from './InputBlock';

// const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];
// const getInitialTab = (path, symbols, coins) => {
// 	let activeTab = -1;
// 	const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
// 	symbols.map((currency, index) => {
// 		const { symbol } = coins[currency] || DEFAULT_COIN_DATA;
// 		if (path === `${symbol.toLowerCase()}-${baseCoin.symbol.toLowerCase()}`) {
// 			activeTab = index;
// 		}
// 	});

// 	return {
// 		activeTab,
// 	};
// };
class QuickTrade extends Component {
	state = {
		side: STRINGS.SIDES[0].value,
		value: 1,
		symbol: '',
		currencies: []
	};

	componentWillMount() {
		if (this.props.symbol) {
			this.onChangeSymbol(this.props.symbol);
		}
	}

	componentDidMount() {
		if (this.props.symbol) {
			this.onChangeSymbol(this.props.symbol);
		}
		if (this.props.onChangeSide) {
			this.props.onChangeSide(this.state.side);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.symbol !== this.props.symbol
		) {
			this.onChangeSymbol(nextProps.symbol);
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

	goToPair = (pair) => {
		browserHistory.push(`/quick-trade/${pair}`)
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

	render() {
		const { onReviewQuickTrade, quickTradeData, disabled, orderLimits, pairs, coins } = this.props;
		const { side, value, symbol } = this.state;
		const { data, fetching, error } = quickTradeData;
		const baseCoin = pairs[symbol].pair_base;
		const { fullname } = coins[baseCoin] || DEFAULT_COIN_DATA;
		return (
			<div className={classnames('quick_trade-wrapper', 'd-flex', 'flex-column')}>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						// ...GROUP_CLASSES
					)}
				>
					<ReactSVG path={ICONS.QUICK_TRADE} wrapperClassName={isMobile ? 'quick_trade-tab-icon' : "quick_trade-icon"} />
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
					<div className='mobile_dropdown-section d-flex justify-content-center align-items-center '>
						<div className='my-5'>
							<MobileDropdownWrapper goToPair={this.goToPair} />
						</div>
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
	onRequestMarketValue: () => { },
	onReviewQuickTrade: () => { },
	estimatedValue: 0,
	disabled: false
};

export default QuickTrade;
