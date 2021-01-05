import React, { Component } from 'react';
import { InputNumber, Button, message } from 'antd';

import { STATIC_ICONS } from 'config/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from '../../../components/Image';
import { updateFees } from './action';

class EditFees extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feeData: {},
		};
	}

	componentDidMount() {
		this.constructData();
	}

	constructData = () => {
		const { userTiers = {}, selectedPair } = this.props;
		const feeData = {};
		Object.keys(userTiers).forEach((level) => {
			let data = userTiers[level];
			let makerData = data.fees ? data.fees.maker : {};
			let takerData = data.fees ? data.fees.taker : {};
			feeData[level] = {
				maker: makerData[selectedPair] || 0,
				taker: takerData[selectedPair] || 0,
			};
		});
		this.setState({ feeData });
	};

	handleChange = (value, level, type) => {
		const feeData = { ...this.state.feeData };
		let levelData = feeData[level] || {};
		feeData[level] = {
			...levelData,
			[type]: value,
		};
		this.setState({ feeData });
	};

	handleSave = () => {
		let formData = {
			pair: this.props.selectedPair,
			fees: this.state.feeData,
		};
		updateFees(formData)
			.then((res) => {
				this.props.getTiers();
				this.props.handleClose();
				message.success('Fees updated successfully');
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	render() {
		const { icons: ICONS = {}, userTiers = {}, handleClose } = this.props;
		const { feeData } = this.state;
		return (
			<div className="admin-tiers-wrapper">
				<h3>Edit fees for account tiers</h3>
				<div>
					<Image
						icon={STATIC_ICONS['TAKER_TIERS_SECTION']}
						wrapperClassName="fee-indicator-icon"
					/>
					<div className="description">
						Taker fee is a trading fee applied to the amount traded during a
						market order (taking from the orderbook).
					</div>
				</div>
				<div>
					<Image
						icon={STATIC_ICONS['MAKER_TIERS_SECTION']}
						wrapperClassName="fee-indicator-icon"
					/>
					<div className="description">
						Maker fee is a trading fee applied to the amount traded for limit
						orders (orders placed and publicly offered on the orderbook).
					</div>
				</div>
				<div className="d-flex mt-3">
					<div className="f-1"></div>
					<div className="f-1 px-2 text-center">
						<Image
							icon={STATIC_ICONS['TAKER_TIERS_SECTION']}
							wrapperClassName="fee-indicator-icon mr-2"
						/>
					</div>
					<div className="f-1 px-2 text-center">
						<Image
							icon={STATIC_ICONS['MAKER_TIERS_SECTION']}
							wrapperClassName="fee-indicator-icon mr-2"
						/>
					</div>
				</div>
				<div className="mb-4">
					{Object.keys(userTiers).map((level, index) => {
						const initialData = feeData[level] || {};
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
								<div className="f-1 px-2">
									<InputNumber
										formatter={(value) => {
											if (value) {
												return `${value}%`;
											}
											return value;
										}}
										parser={(value) => value.replace('%', '')}
										onChange={(value) =>
											this.handleChange(value, level, 'taker')
										}
										value={initialData.taker}
									/>
								</div>
								<div className="f-1 px-2">
									<InputNumber
										formatter={(value) => {
											if (value) {
												return `${value}%`;
											}
											return value;
										}}
										parser={(value) => value.replace('%', '')}
										onChange={(value) =>
											this.handleChange(value, level, 'maker')
										}
										value={initialData.maker}
									/>
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

export default withConfig(EditFees);
