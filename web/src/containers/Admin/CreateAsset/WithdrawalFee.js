import React, { useState, useEffect } from 'react';
import { Button, Select, Form, Input } from 'antd';
import { getNetworkLabelByKey } from 'utils/wallet';
import Coins from '../Coins';
import { STATIC_ICONS } from 'config/icons';
import { Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const WITHDRAWAL_FEE_TYPES = ['static', 'percentage'];

const WithdrawalFee = ({
	coinFormData = {},
	coins = [],
	handleScreenChange,
	isWithdrawalEdit = false,
	handleWithdrawalFeeChange,
	handleSymbolChange,
	tierValues,
	icons: ICONS,
	assetType,
	withdrawalFees,
	handleInitialValues,
	updateFormData = () => {},
}) => {
	const [withdrawal_fees, setWithdrawalFees] = useState(withdrawalFees);
	const [form] = Form.useForm();

	useEffect(() => {
		if (withdrawalFees) {
			handleInitialValues(withdrawal_fees);
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (
			coinFormData &&
			withdrawalFees &&
			withdrawalFees[coinFormData?.symbol] &&
			Object.keys(withdrawalFees[coinFormData?.symbol]).length &&
			!Object.keys(withdrawalFees[coinFormData?.symbol]).includes('symbol')
		) {
			updateFormData(
				assetType === 'deposit' ? 'deposit_fees' : 'withdrawal_fees',
				{
					...withdrawal_fees,
					[coinFormData?.symbol]: {
						...withdrawal_fees[coinFormData?.symbol],
						symbol: coinFormData?.symbol,
					},
				}
			);
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (
			coinFormData.withdrawal_fees &&
			JSON.stringify(coinFormData.withdrawal_fees) !==
				JSON.stringify(withdrawalFees) &&
			assetType &&
			assetType !== 'deposit'
		) {
			setWithdrawalFees(coinFormData.withdrawal_fees);
		} else if (
			coinFormData.deposit_fees &&
			JSON.stringify(coinFormData.deposit_fees) !==
				JSON.stringify(withdrawalFees) &&
			assetType &&
			assetType === 'deposit'
		) {
			setWithdrawalFees(coinFormData.deposit_fees);
		}
	}, [coinFormData, withdrawalFees, assetType]);

	let tempArr = [];
	coins.map((data) => {
		return tempArr.push(data.symbol);
	});
	let coinOptions = tempArr.sort();

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
		if (isWithdrawalEdit) {
			handleScreenChange('update_confirm');
		} else {
			handleScreenChange('final');
		}
	};

	const getInitialValues = () => {
		let initialValues = {};

		Object.keys(withdrawal_fees).forEach((data) => {
			initialValues = {
				...initialValues,
				[`${data}_type`]: withdrawal_fees[data] && withdrawal_fees[data].type,
				[`${data}_value`]: withdrawal_fees[data] && withdrawal_fees[data].value,
				[`${data}_symbol`]: withdrawal_fees[data]?.symbol
					? withdrawal_fees[data].symbol
					: coinFormData?.symbol,
				[`${data}_max`]: withdrawal_fees[data] && withdrawal_fees[data].max,
				[`${data}_min`]: withdrawal_fees[data] && withdrawal_fees[data].min,
			};
		});

		return initialValues;
	};

	const handleType = (data, val, key) => {
		let tempObj = withdrawal_fees;
		tempObj[data].type = val;
		setWithdrawalFees({ ...tempObj });
		if (val === 'percentage') {
			handleWithdrawalFeeChange(
				data,
				val,
				'type',
				assetType === 'deposit' ? 'deposit_fees' : 'withdrawal_fees',
				coinFormData?.symbol,
				'symbol'
			);
		} else {
			handleWithdrawalFeeChange(
				data,
				val,
				'type',
				assetType === 'deposit' ? 'deposit_fees' : 'withdrawal_fees'
			);
		}
	};
	const handleValuesChange = (values = {}) => {
		if (
			withdrawal_fees &&
			Object.keys(withdrawal_fees).length &&
			coinFormData &&
			Object.keys(coinFormData).length
		) {
			Object.keys(withdrawal_fees).forEach((data) => {
				if (
					Object.keys(values).length &&
					values[`${data}_type`] &&
					values[`${data}_type`] === 'percentage'
				) {
					form.setFieldsValue({
						[`${data}_symbol`]: coinFormData?.symbol,
					});
				}
			});
		}
	};
	return (
		<div className="coin-limit-wrap">
			<div className="title">
				{assetType && assetType === 'deposit' ? 'Deposit' : 'Withdrawal'} Fees
			</div>
			<Form
				form={form}
				initialValues={getInitialValues()}
				name="withdrawalForm"
				onFinish={handleUpdate}
				onValuesChange={handleValuesChange}
			>
				<div className="fee-wrapper">
					<div className="d-flex align-items-center">
						<h3 className="mr-5">
							Asset being{' '}
							{assetType && assetType === 'deposit'
								? 'deposited:'
								: 'withdrawn:'}
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
								assetType && assetType === 'deposit'
									? STATIC_ICONS['DEPOSIT_TIERS_SECTION']
									: STATIC_ICONS['WITHDRAW_TIERS_SECTION']
							}
							wrapperClassName="mr-2 tiers-icon"
						/>
						<h3>
							{assetType && assetType === 'deposit' ? 'Deposit' : 'Withdraw'}{' '}
							rules:
						</h3>
					</div>
					{withdrawal_fees &&
						Object.keys(withdrawal_fees).length &&
						Object.keys(withdrawal_fees).map((data, key) => {
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
													withdrawal_fees[data] &&
													withdrawal_fees[data]?.type === 'static'
														? 'w-100 '
														: 'w-100 disableall'
												}
												onChange={(val) =>
													handleWithdrawalFeeChange(
														data,
														val,
														'symbol',
														assetType && assetType === 'deposit'
															? 'deposit_fees'
															: 'withdrawal_fees'
													)
												}
											>
												{coinOptions.map((option, index) => (
													<Select.Option key={index} value={option}>
														{option}
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
											{withdrawal_fees[data] &&
											withdrawal_fees[data]?.type === 'static'
												? `Static value (withdraw fee amount in ${getNetworkLabelByKey(
														data
												  )})`
												: `Percent value (withdraw % fee amount in
											${getNetworkLabelByKey(data)})`}
										</div>
										<Form.Item
											name={`${data}_value`}
											rules={
												withdrawal_fees[data] &&
												withdrawal_fees[data]?.type === 'static'
													? [
															{
																required: true,
																message: 'This field is required!',
															},
															{
																pattern: /^[+]?([0-9]+(?:[\\.][0-9]*)?|\.[0-9]+)$/,
																message:
																	'The field should contains positive values',
															},
													  ]
													: [
															{
																required: true,
																message: 'This field is required!',
															},
															{
																pattern: /^[0-9][0-9]?$|^100$/,
																message: 'The field should be 0-100',
															},
													  ]
											}
										>
											<Input
												onChange={(e) =>
													handleWithdrawalFeeChange(
														data,
														parseFloat(e.target.value),
														'value',
														assetType && assetType === 'deposit'
															? 'deposit_fees'
															: 'withdrawal_fees'
													)
												}
												className="withdrawInput"
												suffix={
													withdrawal_fees[data] &&
													withdrawal_fees[data]?.type === 'percentage' &&
													'%'
												}
											/>
										</Form.Item>
										<div className="infotxt">
											Value amount is based on the symbol (
											{getNetworkLabelByKey(data)})
										</div>
									</div>
									{withdrawal_fees[data] &&
									withdrawal_fees[data].type &&
									withdrawal_fees[data].type === 'static' ? null : (
										<div>
											<div className="field-wrap last">
												<div className="sub-title">
													Maximum fee {coinFormData?.symbol.toUpperCase()} value
													(optional)
												</div>
												<Form.Item
													name={`${data}_max`}
													rules={[
														{
															pattern: /^[+]?([0-9]+(?:[\\.][0-9]*)?|\.[0-9]+)$/,
															message:
																'The field should contains positive values',
														},
													]}
												>
													<Input
														onChange={(e) =>
															handleWithdrawalFeeChange(
																data,
																parseFloat(e.target.value),
																'max',
																assetType && assetType === 'deposit'
																	? 'deposit_fees'
																	: 'withdrawal_fees'
															)
														}
														className="withdrawInput"
														suffix={coinFormData?.symbol.toUpperCase()}
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
													Minimum fee {coinFormData?.symbol.toUpperCase()} value
													(optional)
												</div>
												<Form.Item
													name={`${data}_min`}
													rules={[
														{
															pattern: /^[+]?([0-9]+(?:[\\.][0-9]*)?|\.[0-9]+)$/,
															message:
																'The field should contains positive values',
														},
													]}
												>
													<Input
														onChange={(e) =>
															handleWithdrawalFeeChange(
																data,
																parseFloat(e.target.value),
																'min',
																assetType && assetType === 'deposit'
																	? 'deposit_fees'
																	: 'withdrawal_fees'
															)
														}
														className="withdrawInput"
														suffix={coinFormData?.symbol.toUpperCase()}
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
									{withdrawal_fees[data]?.levels &&
									Object.keys(withdrawal_fees[data].levels).length ? (
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
																				<span className="ml-3">
																					{`${
																						withdrawal_fees[data]?.type ===
																						'static'
																							? 'Static value:' +
																							  ' ' +
																							  tierValues[data][level] +
																							  ' ' +
																							  data
																							: ' Percent Value: ' +
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
														withdrawal_fees[data]?.type
													)
												}
											>
												Edit
											</div>
										</>
									) : (
										withdrawal_fees[data]?.type && (
											<div
												className="viewLink"
												onClick={() =>
													handleScreenChange(
														'step18',
														data,
														withdrawal_fees[data]?.type
													)
												}
											>
												View advanced{' '}
												{assetType && assetType === 'deposit'
													? 'deposit'
													: 'withdrawal'}{' '}
												fee rule
											</div>
										)
									)}
								</div>
							);
						})}
				</div>
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
