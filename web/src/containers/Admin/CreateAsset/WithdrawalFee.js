import React, { useState } from 'react';
import { Button, Select, InputNumber, Form, Input } from 'antd';
import { getNetworkLabelByKey } from 'utils/wallet';
import Coins from '../Coins';
import { STATIC_ICONS } from 'config/icons';
import { Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const WITHDRAWAL_FEE_TYPES = ['static', 'percentage'];

const WithdrawalFee = ({
	coinFormData = {},
	updateFormData,
	coins = [],
	handleScreenChange,
	isWithdrawalEdit = false,
	handleWithdrawalFeeChange,
	handleSymbolChange,
	confirm,
	tierValues,
	icons: ICONS,
	assetType,
}) => {
	const [withdrawalFees, setWithdrawalFees] = useState(
		coinFormData?.withdrawal_fees
	);
	const [form] = Form.useForm();

	let network = [];
	if (coinFormData && coinFormData.network) {
		network.push(coinFormData.network);
	}

	let withdrawal_fees = {};
	coins.forEach((data) => {
		if (data.symbol === coinFormData.symbol) {
			withdrawal_fees = data.withdrawal_fees;
		}
	});

	const networkData = network.length && network[0];

	const renderData = () => {
		if (network.length) {
			return network[0];
		} else if (coinFormData && coinFormData.symbol) {
			return coinFormData.symbol;
		}
	};

	const handleUpdate = (values) => {
		let formProps = {};
		let enteredKeys = Object.keys(values);
		if (values) {
			if (enteredKeys.length && enteredKeys.includes('option')) {
				formProps = {
					...formProps,
					[values['option']]: {
						...formProps[values['symbol']],
						symbol: values['symbol'],
						value: values['value'],
					},
				};
			} else {
				Object.keys(values).forEach((data) => {
					const temp = data.split('_');
					formProps = {
						...formProps,
						[temp[0]]: {
							...formProps[temp[0]],
							[temp[1]]: values[data],
						},
					};
				});
			}
		}
		updateFormData('withdrawal_fees', formProps);
		if (isWithdrawalEdit) {
			handleScreenChange('update_confirm');
		} else {
			handleScreenChange('final');
		}
	};

	const getInitialValues = () => {
		let initialValues = {};
		if (withdrawal_fees) {
			Object.keys(withdrawal_fees).forEach((data) => {
				initialValues = {
					...initialValues,
					[`${data}_type`]: withdrawal_fees[data].type,
					[`${data}_value`]: withdrawal_fees[data].value,
					[`${data}_symbol`]: withdrawal_fees[data].symbol,
					[`${data}_max`]: withdrawal_fees[data].max,
					[`${data}_min`]: withdrawal_fees[data].min,
				};
			});
		} else {
			initialValues = {
				...initialValues,
				option: network.length ? [] : coinFormData && coinFormData.symbol,
				value: coinFormData.withdrawal_fee || 0,
				symbol: coinFormData.symbol,
			};
		}
		return initialValues;
	};
	const handleType = (data, val, key) => {
		let tempObj = withdrawal_fees;
		tempObj[data].type = val;
		setWithdrawalFees({ ...tempObj });
		handleWithdrawalFeeChange(data, val, 'type', 'withdrawal_fees');
	};
	return (
		<div className="coin-limit-wrap">
			<div className="title">
				{assetType === 'deposit' ? 'Deposit' : 'Withdrawal'} Fees
			</div>
			<Form
				form={form}
				initialValues={getInitialValues()}
				name="withdrawalForm"
				onFinish={handleUpdate}
			>
				{withdrawal_fees ? (
					<div className="fee-wrapper">
						<div className="d-flex align-items-center">
							<h3 className="mr-5">
								Asset being{' '}
								{assetType === 'deposit' ? 'deposited:' : 'withdrawn:'}
							</h3>
							<Coins
								nohover
								large
								small
								type={(coinFormData.symbol || '').toLowerCase()}
								fullname={coinFormData.fullname}
								color={coinFormData.meta ? coinFormData.meta.color : ''}
							/>
						</div>
						<div className="fee-seperator mb-4"></div>
						<div className="d-flex">
							<Image
								icon={
									assetType === 'deposit'
										? STATIC_ICONS['DEPOSIT_TIERS_SECTION']
										: STATIC_ICONS['WITHDRAW_TIERS_SECTION']
								}
								wrapperClassName="mr-2 tiers-icon"
							/>
							<h3>{assetType === 'deposit' ? 'Deposit' : 'Withdraw'} rules:</h3>
						</div>
						{Object.keys(withdrawal_fees).map((data, key) => {
							return (
								<div key={key}>
									<div className="d-flex align-items-center">
										<div className="mr-2 w-50">
											Network: {getNetworkLabelByKey(data)}
										</div>
										<div className="network-border w-50"></div>
									</div>

									<div className="field-wrap last">
										<div className="sub-title">Type: </div>
										<Form.Item
											name={`${data}_type`}
											rules={[
												{
													required: true,
													message: 'This field is required!',
												},
											]}
										>
											<Select
												size="small"
												className="w-100"
												onChange={(val) => handleType(data, val, key)}
											>
												{WITHDRAWAL_FEE_TYPES.map((option, index) => (
													<Select.Option key={index} value={option}>
														{option === 'percentage'
															? 'percentage (%)'
															: option}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
										<div className="infotxt">
											'Static' uses a consistent value, while 'percentage' will
											deduct a % from the amount moved.
										</div>
									</div>
									<div className="field-wrap last">
										<div className="sub-title">
											Symbol of fee asset (asset used for fees)
										</div>
										<Form.Item
											name={`${data}_symbol`}
											rules={[
												{
													required: true,
													message: 'This field is required!',
												},
											]}
										>
											<Select
												size="small"
												className={
													withdrawalFees[data].type === 'static'
														? 'w-100 '
														: 'w-100 disableall'
												}
												onChange={(val) =>
													handleWithdrawalFeeChange(
														data,
														val,
														'symbol',
														'withdrawal_fees'
													)
												}
											>
												{coins.map((option, index) => (
													<Select.Option key={index} value={option.symbol}>
														{option.symbol}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
										<div className="infotxt">
											The asset symbol should be operationally compatible with
											the network
										</div>
									</div>
									<div className="field-wrap last">
										<div className="sub-title">
											{withdrawalFees[data].type === 'static'
												? `Static value (withdraw fee amount in ${getNetworkLabelByKey(
														data
												  )})`
												: `Percent value (withdraw % fee amount in
											${getNetworkLabelByKey(data)})`}
										</div>
										<Form.Item
											name={`${data}_value`}
											rules={[
												{
													required: true,
													message: 'This field is required!',
												},
											]}
										>
											<Input
												onChange={(e) =>
													handleWithdrawalFeeChange(
														data,
														parseFloat(e.target.value),
														'value',
														'withdrawal_fees'
													)
												}
												className="withdrawInput"
												suffix={
													withdrawalFees[data].type === 'percentage' && '%'
												}
											/>
										</Form.Item>
										<div className="infotxt">
											Value amount is based on the symbol (
											{getNetworkLabelByKey(data)})
										</div>
									</div>
									{withdrawalFees[data].type === 'static' ? null : (
										<div>
											<div className="field-wrap last">
												<div className="sub-title">
													Maximum fee USDT value (optional)
												</div>
												<Form.Item name={`${data}_max`}>
													<Input
														onChange={(e) =>
															handleWithdrawalFeeChange(
																data,
																parseFloat(e.target.value),
																'max',
																'withdrawal_fees'
															)
														}
														className="withdrawInput"
														suffix={data.toUpperCase()}
													/>
												</Form.Item>
												<div className="infotxt">
													If the fee generated from the set percentage goes
													above the set max then the max fee will be applied as
													a cap
												</div>
											</div>
											<div className="field-wrap last">
												<div className="sub-title">
													Minimum fee USDT value (optional)
												</div>
												<Form.Item name={`${data}_min`}>
													<Input
														onChange={(e) =>
															handleWithdrawalFeeChange(
																data,
																parseFloat(e.target.value),
																'min',
																'withdrawal_fees'
															)
														}
														className="withdrawInput"
														suffix={data.toUpperCase()}
													/>
												</Form.Item>
												<div className="infotxt">
													If the fee generated from the set percentage goes
													below the set minimum fee then the min value fee will
													be applied
												</div>
											</div>
										</div>
									)}
									{confirm ? (
										<>
											<div>Advanced:</div>
											<div className="infotxt2">
												Exceptions to default fee rule
											</div>
											<div className="confirmTiers">
												{Object.keys(tierValues).length &&
													Object.keys(tierValues).includes(data) &&
													Object.keys(tierValues).map((item) => {
														if (item === data && tierValues[data]) {
															return Object.keys(tierValues[data]).map(
																(level, index) => {
																	return (
																		<div key={index} className="d-flex">
																			<div key={index} className="d-flex mb-2">
																				<Image
																					icon={
																						ICONS[`LEVEL_ACCOUNT_ICON_${level}`]
																					}
																					wrapperClassName="table-tier-icon mr-2"
																				/>
																				{`Tiers ${level}`}
																			</div>
																			<div className="centerBorder"></div>
																			<div>
																				<span className="bold ml-3">
																					{`${
																						withdrawalFees[data].type ===
																						'static'
																							? 'Static value:' +
																							  ' ' +
																							  tierValues[data][level] +
																							  ' ' +
																							  data
																							: ' Percent Value:' +
																							  tierValues[data][level] +
																							  '%'
																					}`}
																				</span>{' '}
																			</div>
																		</div>
																	);
																}
															);
														} else {
															return null;
														}
													})}
											</div>
											<div
												className="viewLink"
												onClick={() =>
													handleScreenChange(
														'step18',
														data,
														withdrawalFees[data].type
													)
												}
											>
												Edit
											</div>
										</>
									) : (
										<div
											className="viewLink"
											onClick={() =>
												handleScreenChange(
													'step18',
													data,
													withdrawalFees[data].type
												)
											}
										>
											View advanced{' '}
											{assetType === 'deposit' ? 'deposit' : 'withdrawal'} fee
											rule
										</div>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<div>
						<div className="field-wrap last">
							<div className="sub-title">Option</div>
							<Form.Item
								name="option"
								rules={[
									{
										required: true,
										message: 'This field is required!',
									},
								]}
							>
								{network.length ? (
									<Select
										size="small"
										className="w-100"
										onChange={(e) =>
											handleSymbolChange(
												networkData,
												e.target && e.target.value,
												'option',
												'withdrawal_fees'
											)
										}
									>
										{network &&
											network.map((option, index) => (
												<Select.Option key={index} value={option}>
													{option}
												</Select.Option>
											))}
									</Select>
								) : (
									<Input disabled={network && !network.length} />
								)}
							</Form.Item>
						</div>
						<div className="field-wrap last">
							<div className="sub-title">Value</div>
							<Form.Item
								name="value"
								rules={[
									{
										required: true,
										message: 'This field is required!',
									},
								]}
							>
								<InputNumber
									onChange={(val) =>
										handleSymbolChange(
											renderData(),
											val,
											'value',
											'withdrawal_fees'
										)
									}
								/>
							</Form.Item>
						</div>
						<div className="field-wrap last">
							<div className="sub-title">Symbol</div>
							<Form.Item
								name="symbol"
								rules={[
									{
										required: true,
										message: 'This field is required!',
									},
								]}
							>
								<Select
									size="small"
									className="w-100"
									onChange={(val) =>
										handleSymbolChange(
											renderData(),
											val,
											'symbol',
											'withdrawal_fees'
										)
									}
								>
									{coins.map((option, index) => (
										<Select.Option key={index} value={option.symbol}>
											{option.symbol}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</div>
					</div>
				)}
				{isWithdrawalEdit ? (
					<div>
						<Button
							type="primary"
							className="green-btn w-100"
							htmlType="submit"
						>
							Next
						</Button>
					</div>
				) : (
					<div className="btn-wrapper w-100">
						<Button
							type="primary"
							className="green-btn mr-5"
							onClick={() => handleScreenChange('step9')}
						>
							Back
						</Button>
						<Button type="primary" className="green-btn" htmlType="submit">
							Next
						</Button>
					</div>
				)}
			</Form>
		</div>
	);
};

export default withConfig(WithdrawalFee);
