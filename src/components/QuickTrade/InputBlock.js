import React, { Component } from 'react';
import classnames from 'classnames';
import NumericInput from 'react-numeric-input';
import math from 'mathjs';

import { DECIMALS } from './constants';
import { CurrencyBall } from '../../components';

import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { FLEX_CENTER_CLASSES, LIMIT_VALUES } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

import { translateError } from './utils';

const MIN_VALUE = LIMIT_VALUES.SIZE.MIN;
const MAX_VALUE = LIMIT_VALUES.SIZE.MAX;
const STEP = LIMIT_VALUES.SIZE.STEP;
const PLACEHOLDER = '0.00';

const generateStyle = (value) => {
	const length = typeof value === 'number' ? `${value}`.length : value.length;
	const style = {
		input: {
			width: `${length}rem`
		}
	};
	return style;
};

class InputBlock extends Component {
	state = {
		value: ''
	};

	componentDidMount() {
		if (this.props.initialValue) {
			this.setState({ value: this.props.initialValue });
		}
	}

	onChange = (newValue) => {
		if (typeof newValue === 'number') {
			const value = this.format(newValue);
			this.props.onChange(value);
			this.setState({ value });
		} else if (!newValue) {
			this.props.onChange(0);
			this.setState({ value: newValue });
		}
	};

	format = (value = '') => {
		if ((value && typeof value !== 'number') || value === 0) {
			return value;
		} else if (value < 0) {
			return MIN_VALUE;
		} else if (value > MAX_VALUE) {
			return MAX_VALUE;
		} else {
			const formatedValue = math.round(value, DECIMALS);
			if (formatedValue === 0) {
				return this.state.value;
			}
			return formatedValue;
		}
	};

	onLostFocus = () => {
		if (!this.state.value) {
			this.setState({ value: MIN_VALUE });
		}
	};

	render() {
		const { text, symbol, className, error } = this.props;
		const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];
		const { value } = this.state;
		return (
			<div
				className={classnames(
					'input_block-wrapper',
					'flex-column',
					...FLEX_CENTER_CLASSES,
					className,
					symbol,
					{ has_error: error }
				)}
			>
				<div
					className={classnames(
						'input_block-content',
						'flex-column',
						...FLEX_CENTER_CLASSES,
						className,
						symbol,
						{ has_error: error }
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
							symbol={symbol}
							name={shortName}
							size="s"
							className="input_block-currency_ball"
						/>
						<NumericInput
							className="input_block-inputbox"
							onChange={this.onChange}
							placeholder={PLACEHOLDER}
							step={STEP}
							type="number"
							value={value}
							min={MIN_VALUE}
							max={MAX_VALUE}
							style={generateStyle(value || PLACEHOLDER)}
							onBlur={this.onLostFocus}
							format={this.format}
						/>
					</div>
				</div>
				{error && (
					<FieldError
						error={translateError(error)}
						displayError={true}
						className="input_block-error-wrapper"
					/>
				)}
			</div>
		);
	}
}
export default InputBlock;
