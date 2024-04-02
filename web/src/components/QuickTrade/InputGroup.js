import React from 'react';
import { oneOfType, array, string, func, number, object } from 'prop-types';
import { Select, Input } from 'antd';
import math from 'mathjs';
import { isNumeric, isFloat } from 'validator';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	LoadingOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { DEFAULT_COIN_DATA } from 'config/constants';

import { minValue, maxValue } from 'components/Form/validations';
import { FieldError } from 'components/Form/FormFields/FieldWrapper';
import { translateError } from './utils';
import { Coin } from 'components';
import { getDecimals } from 'utils/utils';

const { Option } = Select;

class InputGroup extends React.PureComponent {
	state = {
		isOpen: false,
	};

	onHandleSearch = React.createRef();

	componentDidUpdate() {
		const { isOpen } = this.state;
		const { setIsOpenTopField, setIsOpenBottomField } = this.props;

		setIsOpenTopField && setIsOpenTopField(isOpen);
		setIsOpenBottomField && setIsOpenBottomField(isOpen);
	}

	onDropdownVisibleChange = (isOpen) => {
		this.setState({ isOpen });
	};

	onChangeEvent = ({ target: { value } }) => {
		this.onInputChange(value);
	};

	onInputChange = (newValue) => {
		const { onInputChange, decimal } = this.props;
		const decimalPoint = getDecimals(decimal);
		const decimalPointValue = Math.pow(10, decimalPoint);

		if (isNumeric(newValue) || isFloat(newValue)) {
			const value =
				math.floor(newValue * decimalPointValue) / decimalPointValue;
			if (isFloat(newValue) && `${newValue}`.endsWith('0')) {
				onInputChange(newValue);
			} else if (value) {
				onInputChange(value);
			} else {
				onInputChange(0);
			}
		} else {
			onInputChange(0);
		}
	};

	renderErrorMessage = (value) => {
		const {
			limits,
			forwardError,
			availableBalance,
			selectValue,
			pair,
		} = this.props;
		const keydata = pair.split('-');
		let error = '';
		if (!value || (value && !parseFloat(value))) {
			error = '';
		} else if (
			keydata[0] === selectValue &&
			limits &&
			minValue(limits.MIN)(value)
		) {
			error = minValue(limits.MIN)(value);
		} else if (
			keydata[0] === selectValue &&
			limits &&
			maxValue(limits.MAX)(value)
		) {
			error = maxValue(limits.MAX)(value);
		} else if (availableBalance) {
			error = maxValue(availableBalance)(value);
		}
		forwardError(error);
		return error;
	};

	render() {
		const { isOpen } = this.state;
		const {
			options,
			inputValue,
			selectValue,
			onSelect,
			limits = {},
			autoFocus,
			coins,
			loading,
			expired,
			disabled,
		} = this.props;

		const suffix = loading ? (
			<LoadingOutlined className="secondary-text ml-1" />
		) : expired ? (
			<SyncOutlined className="secondary-text ml-1" />
		) : null;

		const error = translateError(this.renderErrorMessage(inputValue));

		return (
			<div className="pt-2">
				<div className="input-holder">
					<div className="d-flex">
						<div className="currency-dropdown">
							<Select
								open={isOpen}
								size="default"
								showSearch
								filterOption={true}
								className={
									isOpen
										? 'input-group__select_disabled'
										: 'input-group__select'
								}
								value={selectValue}
								onChange={onSelect}
								onDropdownVisibleChange={this.onDropdownVisibleChange}
								bordered={false}
								listItemHeight={35}
								listHeight={35 * 6}
								dropdownClassName="custom-select-style"
								suffixIcon={
									!isOpen ? (
										<CaretDownOutlined
											onClick={() => this.onDropdownVisibleChange(!isOpen)}
										/>
									) : (
										<CaretUpOutlined
											onClick={() => this.onDropdownVisibleChange(!isOpen)}
										/>
									)
								}
								onSelect={() => {
									this.onHandleSearch.current.focus();
								}}
							>
								{options.map((symbol, index) => {
									const { display_name, icon_id } =
										coins[symbol] || DEFAULT_COIN_DATA;
									return (
										<Option
											name="selectedPairBase"
											value={symbol}
											key={index}
											className="d-flex"
										>
											<div
												className={
													isOpen
														? 'd-flex align-items-center quick-trade-select-wrapper ml-3'
														: 'd-flex align-items-center quick-trade-select-wrapper'
												}
											>
												<div
													className={
														window.innerWidth > 768
															? 'input-group__coin-icons-wrap mb-1'
															: 'input-group__coin-icons-wrap_mobile-view mt-2'
													}
												>
													<Coin
														iconId={icon_id}
														type={
															window.innerWidth > 768 && !isOpen
																? 'CS8'
																: isOpen
																? 'CS6'
																: 'CS11'
														}
													/>
												</div>
												<span className="ml-2 mr-4">{display_name}</span>
											</div>
										</Option>
									);
								})}
							</Select>
						</div>
						<div>
							<Input
								ref={this.onHandleSearch}
								type="number"
								placeholder={loading ? '' : '0'}
								style={{}}
								className={
									inputValue > 0
										? 'input-group__input active-input'
										: 'input-group__input'
								}
								value={inputValue || ''}
								onChange={this.onChangeEvent}
								bordered={false}
								step={limits.MIN}
								min={limits.MIN}
								max={limits.MAX}
								autoFocus={autoFocus}
								suffix={suffix}
								disabled={disabled}
							/>
						</div>
					</div>
					{error && (
						<FieldError
							error={error}
							displayError={true}
							className="input-group__error-wrapper"
						/>
					)}
				</div>
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

export default InputGroup;
