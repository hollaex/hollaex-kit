import React, { Component, Fragment } from 'react';
import { Input, Select, InputNumber, Button, message } from 'antd';
import { connect } from 'react-redux';

import { STATIC_ICONS } from 'config/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from '../../../components/Image';
import { updateLimits } from './action';

class EditLimit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectValues: {},
			formData: {},
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
			};
		});
		this.setState({ selectValues, formData });
	};

	handleChange = (value, level, type) => {
		const selectValues = { ...this.state.selectValues };
		const formData = { ...this.state.formData };
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
		this.setState({ selectValues, formData });
	};

	handleChangeLimit = (value, level, type) => {
		const formData = { ...this.state.formData };
		let tempData = formData[level];
		formData[level] = {
			...tempData,
			[type]: value,
		};
		this.setState({ formData });
	};

	setLimitField = (type, level, selectData, initialData) => {
		return (
			<Fragment>
				<Select
					onSelect={(value) => this.handleChange(value, level, type)}
					value={selectData[type]}
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
					<InputNumber
						onChange={(value) => this.handleChangeLimit(value, level, type)}
						value={initialData[type]}
					/>
				) : (
					<Input value={this.getText(selectData[type])} />
				)}
			</Fragment>
		);
	};

	handleSave = () => {
		const { formData } = this.state;
		let formValues = {
			limits: formData,
		};
		updateLimits(formValues)
			.then((res) => {
				this.props.getTiers();
				this.props.handleClose();
				message.success('Limits updated successfully');
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	render() {
		const {
			constants = {},
			icons: ICONS,
			userTiers = {},
			handleClose,
		} = this.props;
		const { selectValues, formData } = this.state;

		return (
			<div className="admin-tiers-wrapper">
				<h3>Edit deposit and withdraw limits</h3>
				<div className="description">
					Set the limit amounts that are allowed for both deposits and
					withdrawal for the asset Bitcoin (BTC).
				</div>
				<div className="my-3">
					<div className="d-flex align-items-center">
						<Image
							icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
							wrapperClassName="limit-status-icon mr-2"
						/>
						<div className="description">
							{`Deposit limit amount for each account valued in ${constants.native_currency}`}
						</div>
					</div>
					<div className="d-flex align-items-center">
						<Image
							icon={STATIC_ICONS['WITHDRAW_TIERS_SECTION']}
							wrapperClassName="limit-status-icon mr-2"
						/>
						<div className="description">
							{`Withdraw limit amount for each account valued in ${constants.native_currency}`}
						</div>
					</div>
				</div>
				<div className="d-flex mt-3">
					<div className="f-1"></div>
					{/*<div className="d-flex align-items-center f-1 px-2">
						<Image
							icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
							wrapperClassName="limit-status-icon"
						/>
						<div className="sub-title">Deposit</div>
					</div>*/}
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
								{/*<div className="f-2 px-2 d-flex align-items-center">
									{this.setLimitField(
										'deposit_limit',
										level,
										selectData,
										initialData
									)}
								</div>*/}
								<div className="f-2 px-2 d-flex align-items-center">
									{this.setLimitField(
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
				<div className="d-flex my-4">
					<Button className="green-btn" onClick={handleClose}>
						Back
					</Button>
					<div className="mx-2"></div>
					<Button className="green-btn" onClick={this.handleSave}>
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
