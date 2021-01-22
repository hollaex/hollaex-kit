import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { isNumeric, isFloat } from 'validator';

import { CurrencyBall } from '../../components';

import { minValue, maxValue } from '../../components/Form/validations';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { FLEX_CENTER_CLASSES, DEFAULT_COIN_DATA } from '../../config/constants';
import { translateError } from './utils';

const PLACEHOLDER = '0.00';
const DECIMALS = 4;

const generateStyle = (value) => {
	const length = `${value}`.length;
	const style = { width: `${length}rem`, minWidth: '2rem' };
	return style;
};

class InputBlock extends Component {
	state = {
		value: '',
		symbol: '',
	};

	componentWillMount() {
		if (this.props.symbol) {
			this.setState({ symbol: this.props.symbol });
		}
	}

	componentDidMount() {
		if (this.props.initialValue) {
			this.setState({
				value: this.props.initialValue,
				symbol: this.props.symbol,
			});
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.symbol !== this.props.symbol) {
			this.setState({ symbol: nextProps.symbol });
		}
	}

	onChangeEvent = (event) => {
		this.onChange(event.target.value);
	};

	onChange = (newValue) => {
		if (isNumeric(newValue) || isFloat(newValue)) {
			const value = math.round(newValue, DECIMALS);
			if (value) {
				this.props.onChange(value);
			} else {
				this.props.onChange(0);
			}
			this.setState({ value: newValue, errorValue: value });
		} else {
			this.setState({ value: newValue, errorValue: newValue });
			this.props.onChange(0);
		}
	};

	onLostFocus = () => {
		const { orderLimits } = this.props;
		const { value } = this.state;
		if (!value || value < orderLimits[this.state.symbol].SIZE.MIN) {
			this.setState({ value: orderLimits[this.state.symbol].SIZE.MIN });
		} else if (value > orderLimits[this.state.symbol].SIZE.MAX) {
			this.setState({ value: orderLimits[this.state.symbol].SIZE.MAX });
		} else {
			this.setState({ value: math.round(value, DECIMALS) });
		}
	};

	renderErrorMessage = (value) => {
		const { orderLimits } = this.props;
		let error = '';
		if (!value) {
			error = '';
		} else {
			error =
				minValue(orderLimits[this.state.symbol].SIZE.MIN)(value) ||
				maxValue(orderLimits[this.state.symbol].SIZE.MAX)(value);
		}
		return error;
	};

	render() {
		const { text, className, error, orderLimits, pairs, coins } = this.props;
		const { value, errorValue, symbol } = this.state;
		const pair = pairs[symbol] || {};
		const baseCoin = coins[pair.pair_base] || DEFAULT_COIN_DATA;
		const shortName = baseCoin.symbol.toUpperCase();
		const errorMessage = this.renderErrorMessage(errorValue) || error;
		let limitData = orderLimits[this.state.symbol] || { SIZE: {} };
		return (
			<div
				className={classnames(
					'input_block-wrapper',
					'flex-column',
					'direction_ltr',
					...FLEX_CENTER_CLASSES,
					className,
					symbol,
					{ has_error: errorMessage }
				)}
			>
				<div
					className={classnames(
						'input_block-content',
						'flex-column',
						...FLEX_CENTER_CLASSES,
						className,
						symbol,
						{ has_error: errorMessage }
					)}
				>
					{text && <div className="input_block-title">{text}</div>}
					<div
						className={classnames(
							'input_block-input-wrapper',
							...FLEX_CENTER_CLASSES
						)}
					>
						<CurrencyBall
							symbol={pair.pair_base}
							name={shortName}
							size="s"
							className="input_block-currency_ball"
						/>
						<input
							type="number"
							className="input_block-inputbox"
							onChange={this.onChangeEvent}
							placeholder={PLACEHOLDER}
							step={limitData.SIZE.MIN}
							value={value}
							min={limitData.SIZE.MIN}
							max={limitData.SIZE.MAX}
							style={generateStyle(value || PLACEHOLDER)}
							onBlur={this.onLostFocus}
						/>
					</div>
				</div>
				<FieldError
					error={translateError(errorMessage)}
					displayError={true}
					className="input_block-error-wrapper apply_rtl"
				/>
			</div>
		);
	}
}
export default InputBlock;
