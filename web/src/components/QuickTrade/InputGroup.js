import React from 'react';
import { oneOfType, array, string, func, number, object } from 'prop-types';
import { Select, Input } from 'antd';
import math from 'mathjs';
import { isNumeric, isFloat } from 'validator';
import { CaretDownOutlined } from '@ant-design/icons';

import { minValue, maxValue } from 'components/Form/validations';
import { FieldError } from 'components/Form/FormFields/FieldWrapper';
import { translateError } from './utils';
import withConfig from 'components/ConfigProvider/withConfig';
import EditWrapper from 'components/EditWrapper';

const { Option } = Select;
const { Group } = Input;
const DECIMALS = 4;

class InputGroup extends React.PureComponent {
	state = {
		isOpen: false,
	};

	onDropdownVisibleChange = (isOpen) => {
		this.setState({ isOpen });
	};

	onChangeEvent = ({ target: { value } }) => {
		this.onInputChange(value);
	};

	onInputChange = (newValue) => {
		const { onInputChange } = this.props;

		if (isNumeric(newValue) || isFloat(newValue)) {
			const value = math.round(newValue, DECIMALS);
			if (value) {
				onInputChange(value);
			} else {
				onInputChange(0);
			}
		} else {
			onInputChange(0);
		}
	};

	renderErrorMessage = (value) => {
		const { limits, forwardError } = this.props;
		let error = '';
		if (!value) {
			error = '';
		} else {
			error = minValue(limits.MIN)(value) || maxValue(limits.MAX)(value);
		}
		forwardError(error);
		return error;
	};

	render() {
		const { isOpen } = this.state;
		const {
			name,
			options,
			inputValue,
			selectValue,
			onSelect,
			limits = {},
			icons: ICONS,
			autoFocus,
			stringId,
		} = this.props;

		return (
			<div className="py-2">
				<label className="bold caps-first">
					<EditWrapper stringId={stringId}>{name}</EditWrapper>
				</label>
				<Group compact className="input-group__container">
					<Select
						open={isOpen}
						size="default"
						showSearch
						filterOption={true}
						className="input-group__select"
						value={selectValue}
						style={isOpen ? { width: '100%' } : { width: '33%' }}
						onChange={onSelect}
						onDropdownVisibleChange={this.onDropdownVisibleChange}
						bordered={false}
						listItemHeight={35}
						listHeight={35 * 6}
						dropdownClassName="custom-select-style"
						suffixIcon={
							<CaretDownOutlined
								onClick={() => this.onDropdownVisibleChange(!isOpen)}
							/>
						}
					>
						{options.map((symbol, index) => (
							<Option
								name="selectedPairBase"
								value={symbol}
								key={index}
								className="d-flex"
							>
								<div className="d-flex align-items-center">
									<div className="input-group__coin-icons-wrap">
										<img
											src={
												ICONS[`${symbol.toUpperCase()}_ICON`]
													? ICONS[`${symbol.toUpperCase()}_ICON`]
													: ICONS['DEFAULT_ICON']
											}
											className="input-group__coin-icons"
											alt={`${symbol.toUpperCase()}_coin`}
										/>
									</div>
									<span className="pl-1">{symbol.toUpperCase()}</span>
								</div>
							</Option>
						))}
					</Select>
					<Input
						type="number"
						placeholder="Amount"
						style={isOpen ? { display: 'none' } : { width: '67%' }}
						className="input-group__input"
						value={inputValue}
						onChange={this.onChangeEvent}
						bordered={false}
						step={limits.MIN}
						min={limits.MIN}
						max={limits.MAX}
						autoFocus={autoFocus}
					/>
				</Group>
				<FieldError
					error={translateError(this.renderErrorMessage(inputValue))}
					displayError={true}
					className="input-group__error-wrapper"
				/>
			</div>
		);
	}
}

InputGroup.propTypes = {
	name: string,
	options: array,
	inputValue: oneOfType([number, string]),
	onInputChange: func,
	selectValue: string,
	onSelect: func,
	limits: object,
};

export default withConfig(InputGroup);
