import React, { Component } from 'react';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Button } from '../../components';

import STRINGS from '../../config/localizedStrings';
import { ICONS, CURRENCIES, FLEX_CENTER_CLASSES } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

import ToogleButton from './ToogleButton';
import ReviewBlock from './ReviewBlock';
import InputBlock from './InputBlock';

import { DEFAULT_SYMBOL } from './constants';

const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

class QuickTrade extends Component {
	state = {
		side: STRINGS.SIDES[0].value,
		value: 0.1,
		symbol: DEFAULT_SYMBOL
	};

	componentDidMount() {
		if (this.props.symbol !== fiatSymbol) {
			this.onChangeSymbol(this.props.symbol);
		} else {
			this.onChangeSymbol(DEFAULT_SYMBOL);
		}
		if (this.props.onChangeSide) {
			this.props.onChangeSide(this.state.side);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.symbol !== fiatSymbol &&
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
		const { onReviewQuickTrade, quickTradeData, disabled } = this.props;
		const { side, value, symbol } = this.state;
		const { data, fetching, error } = quickTradeData;
		const { name } = CURRENCIES[symbol];

		return (
			<div className={classnames('quick_trade-wrapper', ...GROUP_CLASSES)}>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						...GROUP_CLASSES
					)}
				>
					<img src={ICONS.QUICK_TRADE} alt="" className="quick_trade-icon" />
					<div className="title">
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
						disabled={disabled || !onReviewQuickTrade || !!error || fetching}
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
