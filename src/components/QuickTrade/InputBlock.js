import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { isNumeric, isFloat } from 'validator';

import { DECIMALS } from './constants';
import { CurrencyBall } from '../../components';

import { minValue, maxValue } from '../../components/Form/validations';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { FLEX_CENTER_CLASSES, LIMIT_VALUES } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

import { translateError } from './utils';

const MIN_VALUE = LIMIT_VALUES.SIZE.MIN;
const MAX_VALUE = LIMIT_VALUES.SIZE.MAX;
const STEP = LIMIT_VALUES.SIZE.STEP;
const PLACEHOLDER = '0.00';

const generateStyle = (value) => {
	const length = `${value}`.length;
	const style = { width: `${length}rem`, minWidth: '2rem' };
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
		const { value } = this.state;
		if (!value || value < MIN_VALUE) {
			this.setState({ value: MIN_VALUE });
		} else if (value > MAX_VALUE) {
			this.setState({ value: MAX_VALUE });
		} else {
			this.setState({ value: math.round(value, DECIMALS) });
		}
	};

	renderErrorMessage = (value) => {
		let error = '';
		if (!value) {
			error = '';
		} else {
			error = minValue(MIN_VALUE)(value) || maxValue(MAX_VALUE)(value);
		}
		return error;
	};

	render() {
		const { text, symbol, className, error } = this.props;
		const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];
		const { value, errorValue } = this.state;
		const errorMessage = this.renderErrorMessage(errorValue) || error;
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
							symbol={symbol}
							name={shortName}
							size="s"
							className="input_block-currency_ball"
						/>
						<input
							type="number"
							className="input_block-inputbox"
							onChange={this.onChangeEvent}
							placeholder={PLACEHOLDER}
							step={STEP}
							value={value}
							min={MIN_VALUE}
							max={MAX_VALUE}
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
