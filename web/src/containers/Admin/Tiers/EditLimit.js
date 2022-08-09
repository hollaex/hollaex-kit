import React, { Component, Fragment } from 'react';
import { Input, Select, Button } from 'antd';
import { connect } from 'react-redux';

import { STATIC_ICONS } from 'config/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from '../../../components/Image';

class EditLimit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectValues: {},
		};
	}

	componentDidMount() {
		this.constructData();
	}

	getValue = (value) => {
		if (value !== 0 && value !== -1) {
			return 1;
		}
		return value;
	};

	getText = (value) => {
		if (value === 0) {
			return 'Unlimited';
		} else if (value === -1) {
			return 'Disabled';
		} else {
			return 'N/A';
		}
	};

	constructData = () => {
		const { userTiers = {} } = this.props;
		const selectValues = {};
		const formData = {};
		Object.keys(userTiers).forEach((level) => {
			let data = userTiers[level];
			selectValues[level] = {
				deposit_limit: this.getValue(data.deposit_limit),
				withdrawal_limit: this.getValue(data.withdrawal_limit),
			};
			formData[level] = {
				deposit_limit: data.deposit_limit,
				withdrawal_limit: data.withdrawal_limit,
				native_currency_limit: data.native_currency_limit,
			};
		});
		this.props.setFormData(formData);
		this.setState({ selectValues });
	};

	handleChange = (value, level, type) => {
		const selectValues = { ...this.state.selectValues };
		const formData = { ...this.props.formData };
		let levelData = selectValues[level] || {};
		selectValues[level] = {
			...levelData,
			[type]: value,
		};
		let tempData = formData[level];
		if (value !== 1) {
			formData[level] = {
				...tempData,
				[type]: value,
			};
		} else {
			formData[level] = {
				...tempData,
				[type]: 0,
			};
		}
		this.props.setFormData(formData);
		this.setState({ selectValues });
	};

	handleChangeLimit = (value, level, type) => {
		const formData = { ...this.props.formData };
		let tempData = formData[level];
		formData[level] = {
			...tempData,
			[type]: value,
		};
		this.props.setFormData(formData);
	};

	setLimitField = (
		currency,
		type,
		level,
		selectData,
		initialData,
		isDeposit = false
	) => {
		return (
			<Fragment>
				<Select
					onSelect={(value) => this.handleChange(value, level, type)}
					value={selectData[type]}
					disabled={isDeposit}
				>
					<Select.Option key={1} value={0}>
						Unlimited
					</Select.Option>
					<Select.Option key={2} value={-1}>
						Disabled
					</Select.Option>
					<Select.Option key={3} value={1}>
						Custom
					</Select.Option>
				</Select>
				{selectData[type] === 1 ? (
					<Input
						onChange={(e) =>
							this.handleChangeLimit(parseFloat(e.target.value), level, type)
						}
						value={initialData[type]}
						disabled={isDeposit}
						suffix={currency}
					/>
				) : (
					<Input
						value={this.getText(selectData[type])}
						disabled={isDeposit}
						suffix={currency}
					/>
				)}
			</Fragment>
		);
	};

	render() {
		const {
			constants = {},
			icons: ICONS,
			userTiers = {},
			handleClose,
			handleScreenUpdate,
			tierName,
			coinSymbol,
			formData,
			handleSave,
			buttonSubmitting,
			isNativeCoin,
		} = this.props;
		const { selectValues } = this.state;

		const { native_currency } = constants;

		const currentCoin = isNativeCoin
			? native_currency?.toUpperCase()
			: coinSymbol?.toUpperCase();
		return (
			<div className="admin-tiers-wrapper">
				<h3>Edit deposit and withdraw limits</h3>
				<div className="description">
					Set the limit amounts that are allowed for both deposits and
					withdrawal for the asset{' '}
					{`${tierName} (${coinSymbol?.toUpperCase()})`}.
				</div>
				<div className="my-3">
					<div className="d-flex align-items-center">
						<Image
							icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
							wrapperClassName="limit-status-icon mr-2"
						/>
						<div className="description f-16">
							{`Deposit limit amount for each account valued in ${currentCoin}`}
						</div>
					</div>
					<div className="d-flex align-items-center">
						<Image
							icon={STATIC_ICONS['WITHDRAW_TIERS_SECTION']}
							wrapperClassName="limit-status-icon mr-2"
						/>
						<div className="description f-16">
							{`Withdraw limit amount for each account valued in ${currentCoin}`}
						</div>
					</div>
					<div className="d-flex align-items-center mt-3">
						<Image
							icon={STATIC_ICONS['SWITCH_ASSET_FOR_FEES']}
							wrapperClassName="limit-status-icon mr-2"
						/>
						<div className="description">
							Change limit value type to{' '}
							<span
								className="underline cursor-pointer"
								onClick={() => handleScreenUpdate('change-limits')}
							>
								{!isNativeCoin
									? `native asset ${native_currency}`
									: `${tierName} (${coinSymbol?.toUpperCase()})`}
							</span>
						</div>
					</div>
				</div>
				<div className="d-flex mt-3">
					<div className="f-1"></div>
					<div className="d-flex align-items-center f-1 px-2">
						<Image
							icon={STATIC_ICONS['WITHDRAW_TIERS_SECTION']}
							wrapperClassName="limit-status-icon"
						/>
						<div className="sub-title">Withdraw</div>
					</div>
				</div>
				<div className="mb-4">
					{Object.keys(userTiers).map((level, index) => {
						const initialData = formData[level] || {};
						const selectData = selectValues[level] || {};
						return (
							<div className="d-flex py-2" key={index}>
								<div className="f-1">
									<div className="d-flex align-items-center">
										<Image
											icon={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]}
											wrapperClassName="table-tier-icon mr-2"
										/>
										{`Tiers ${level}`}
									</div>
								</div>
								<div className="f-2 px-2 d-flex align-items-center">
									{this.setLimitField(
										currentCoin,
										'withdrawal_limit',
										level,
										selectData,
										initialData
									)}
								</div>
							</div>
						);
					})}
				</div>
				<div className="d-flex mt-3">
					<div className="f-1"></div>
					<div className="d-flex align-items-center f-1 px-2">
						<Image
							icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
							wrapperClassName="limit-status-icon"
						/>
						<div className="sub-title">Deposit</div>
					</div>
				</div>
				<div className="mb-4">
					{Object.keys(userTiers).map((level, index) => {
						const initialData = formData[level] || {};
						const selectData = selectValues[level] || {};
						return (
							<div className="d-flex py-2" key={index}>
								<div className="f-1">
									<div className="d-flex align-items-center">
										<Image
											icon={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]}
											wrapperClassName="table-tier-icon mr-2"
										/>
										{`Tiers ${level}`}
									</div>
								</div>
								<div className="f-2 px-2 d-flex align-items-center">
									{this.setLimitField(
										currentCoin,
										'deposit_limit',
										level,
										selectData,
										initialData,
										true
									)}
								</div>
							</div>
						);
					})}
				</div>
				<div className="d-flex my-4">
					<Button className="green-btn" onClick={handleClose}>
						Back
					</Button>
					<div className="mx-2"></div>
					<Button
						className="green-btn"
						onClick={handleSave}
						disabled={buttonSubmitting}
					>
						Confirm
					</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

export default connect(mapStateToProps)(withConfig(EditLimit));
