import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
	message,
	Modal,
	Button,
	Radio,
	Space,
	Select,
	Checkbox,
	Input,
	Spin,
	InputNumber,
} from 'antd';
import {
	ArrowDownOutlined,
	CheckCircleTwoTone,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import BigNumber from 'bignumber.js';
import _debounce from 'lodash/debounce';

import icons from 'config/icons/dark';
import { postTransfer } from './action';
import { requestUsers } from '../ListUsers/actions';
import { Coin, Image } from '../../../components';
import { renderAsset } from '../Deposits/utils';
import {
	calculateOraclePrice,
	formatCurrencyByIncrementalUnit,
} from 'utils/currency';
import { assetsSelector } from 'containers/Wallet/utils';
import { BASE_CURRENCY } from 'config/constants';
import './Transfers.scss';

const Transfer = ({ coins = {}, assets }) => {
	const [senderData, setSenderData] = useState([]);
	const [receiverData, setReceiverData] = useState([]);
	const [isConfirm, setConfirm] = useState(false);
	const [confirmData, setConfirmData] = useState({ email: true });
	const [isDisableConfirm, setDisableConfirm] = useState(false);
	const [isEmailMode, setEmailMode] = useState(false);
	const [repeatTransfer, setRepeatTransfer] = useState('yes');
	const [isDisplayTranferComplete, setIsDisplayTranferComplete] = useState(
		false
	);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedUserType, setSelectedUserType] = useState('sender');
	const [selectedUserBalance, setSelectedUserBalance] = useState({
		availableBalance: null,
		totalBalance: null,
	});

	const toggleMode = (mode) => {
		setEmailMode(mode === 'email');
		setSenderData([]);
		setReceiverData([]);
		setConfirmData({ email: true });
	};

	const handleLoading = _debounce(() => {
		setIsLoading(false);
	}, 500);

	useEffect(() => {
		return () => {
			handleLoading.cancel();
		};
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (confirmData?.sender_id && confirmData?.currency) {
			setSelectedUserBalance(() => ({
				availableBalance: getBalance('available', confirmData),
				totalBalance: getBalance('balance', confirmData),
			}));
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [confirmData]);

	const getAllUserData = async (params = { search: '' }, type) => {
		setIsLoading(true);
		setSelectedUserType(type);
		try {
			const response = await requestUsers(params);
			if (response.data) {
				const userData = response.data.map((user) => ({
					label: user.email,
					value: user.id,
					balance: user?.balance,
				}));
				if (type === 'sender') {
					setSenderData(userData);
				} else if (type === 'receiver') {
					setReceiverData(userData);
				} else {
					setSenderData(userData);
					setReceiverData(userData);
				}
			}
		} catch (error) {
			console.log('error', error);
		}
		handleLoading();
	};
	const onSearch = (value, key) => {
		if (!value) {
			if (key === 'sender') {
				setSenderData([]);
			} else if (key === 'receiver') {
				setReceiverData([]);
			} else {
				setSenderData([]);
				setReceiverData([]);
			}
		} else {
			const params = isEmailMode ? { search: value } : { id: value };
			getAllUserData(params, key);
		}
	};
	const handleSearch = _debounce(onSearch, 500);
	const handleConfirm = () => {
		setConfirm(true);
	};
	const handleTransfer = () => {
		if (confirmData?.sender_id && confirmData?.receiver_id) {
			handleSubmit(confirmData);
		}
	};
	const handleSubmit = async (formProps) => {
		const {
			sender_email,
			sender_balance,
			receiver_email,
			...restProps
		} = formProps;

		const postValues = {
			...restProps,
			sender_id: parseInt(formProps.sender_id, 10),
			receiver_id: parseInt(formProps.receiver_id, 10),
			amount: parseFloat(formProps.amount),
		};
		setDisableConfirm(true);

		try {
			await postTransfer(postValues);
			setConfirm(false);
			message.success('Transferred Successfully');
		} catch (error) {
			setConfirm(false);
			const msg = error?.data ? error?.data?.message : error?.message;
			message.error(msg);
		}
		setDisableConfirm(false);
		setIsDisplayTranferComplete(true);
	};
	const handleClose = () => {
		setConfirm(false);
		setConfirmData({ email: true });
		setSenderData([]);
		setReceiverData([]);
		setIsDisplayTranferComplete(false);
	};

	const getBalance = (type, sendData = confirmData) => {
		const { sender_id, currency, sender_balance } = sendData || {};
		if (!sender_id || !currency || !sender_balance) return 0;
		return sender_balance[`${currency}_${type}`] || 0;
	};

	const onHandleSelect = async (value, type) => {
		let selectedUser = {};
		if (type === 'sender' || type === 'receiver') {
			try {
				const params = { id: value };
				const response = await requestUsers(params);
				const user = response?.data?.[0];
				if (user) {
					selectedUser = {
						value: user?.id,
						label: user?.email,
						balance: user?.balance,
					};
				}
			} catch (error) {
				console.error('error', error);
			}
		}

		setConfirmData((prev) => ({
			...prev,
			...(type === 'sender' && {
				sender_id: selectedUser?.value,
				sender_email: selectedUser?.label,
				sender_balance: selectedUser?.balance,
			}),
			...(type === 'receiver' && {
				receiver_id: selectedUser?.value,
				receiver_email: selectedUser?.label,
			}),
			...(type === 'currency' && { currency: value }),
		}));
	};

	const onHandleAmount = (e) => {
		const value = new BigNumber(e);
		setConfirmData((prev) => ({
			...prev,
			amount: value === '' ? null : value?.toFixed(),
		}));
	};

	const onHandleClear = (type) => {
		setConfirmData((prev) => ({
			...prev,
			...(type === 'sender' && {
				sender_balance: null,
				sender_id: null,
				sender_email: null,
			}),
			...(type === 'receiver' && {
				receiver_id: null,
				receiver_email: null,
			}),
			...(type === 'currency' && {
				currency: null,
			}),
		}));
		type === 'sender'
			? setSenderData([])
			: type === 'receiver' && setReceiverData([]);
	};

	const onHandleBalance = async () => {
		if (confirmData?.sender_id) {
			try {
				const response = await requestUsers({ id: confirmData?.sender_id });
				if (response.data) {
					const userData = response.data.map((user) => ({
						sender_balance: user?.balance,
					}));
					const sender_balance = userData[0]?.sender_balance;

					setConfirmData((prev) => ({
						...prev,
						sender_balance,
					}));
					setSelectedUserBalance(() => ({
						availableBalance: getBalance('available', {
							...confirmData,
							sender_balance,
						}),
						totalBalance: getBalance('balance', {
							...confirmData,
							sender_balance,
						}),
					}));
				}
			} catch (error) {
				console.error('error', error);
			}
		}
	};

	const onHandleNext = () => {
		if (repeatTransfer === 'no') {
			setConfirmData({ email: true });
			setSenderData([]);
			setReceiverData([]);
			setRepeatTransfer('yes');
		} else {
			onHandleBalance();
		}
		setIsDisplayTranferComplete(false);
	};

	const balanceText = () => {
		if (!confirmData?.currency || !confirmData?.amount) return '';

		const symbol = confirmData?.currency
			? confirmData?.currency?.toLowerCase()
			: '';
		const assetObj = Array.isArray(assets)
			? assets?.find((a) => {
					const data = Array.isArray(a) ? a[0] : a?.symbol;
					return data?.toLowerCase() === symbol;
			  })
			: null;

		const asset = Array.isArray(assetObj) ? assetObj[1] : assetObj;
		const oraclePrice = asset?.oraclePrice || asset?.estimated_price;
		const incrementUnit = coins[confirmData?.currency]?.increment_unit;

		const amount = Number(confirmData?.amount);

		if (!amount || isNaN(amount)) return null;

		if (symbol === BASE_CURRENCY?.toLowerCase()) {
			return formatCurrencyByIncrementalUnit(amount, incrementUnit);
		}
		if (oraclePrice && !isNaN(oraclePrice)) {
			return formatCurrencyByIncrementalUnit(
				calculateOraclePrice(amount, oraclePrice),
				incrementUnit
			);
		}
		return null;
	};

	const isDisabled =
		!confirmData?.sender_id ||
		!confirmData?.receiver_id ||
		!confirmData?.currency ||
		!confirmData?.amount ||
		confirmData?.amount > selectedUserBalance?.availableBalance;

	const isError =
		confirmData &&
		confirmData?.currency &&
		confirmData?.sender_balance &&
		confirmData?.amount > selectedUserBalance?.availableBalance;

	const getSelectedUser = (userData, type) => {
		const id =
			type === 'sender' ? confirmData?.sender_id : confirmData?.receiver_id;
		return userData?.find((user) => user?.value === id)?.label || '';
	};

	return (
		<div className="app_container-content transfer-details-wrapper mb-5">
			<div className="transfer-title-wrapper">
				<span className="transfer-title">Transfer</span>
				<span className="description">
					Select the user accounts that you'd like transfer funds between.
				</span>
			</div>
			<div className="transfer-form-wrapper">
				<div className="transfer-details">
					<div className="transfer-form-details">
						<div className="method-select-container">
							<span
								className={
									!isEmailMode
										? 'transfer-method-active transfer-method pointer'
										: 'transfer-method pointer'
								}
								onClick={() => toggleMode('id')}
							>
								User ID
								<Image
									icon={icons['SIDEBAR_ACCOUNT_INACTIVE']}
									wrapperClassName="transfer-icon user-icon"
								/>
							</span>
							<span
								className={
									isEmailMode
										? 'transfer-method-active transfer-method pointer'
										: 'transfer-method pointer'
								}
								onClick={() => toggleMode('email')}
							>
								User Email
								<Image
									icon={icons['VERIFICATION_EMAIL_NEW']}
									wrapperClassName="transfer-icon email-icon"
								/>
							</span>
						</div>
						<div className="form-field">
							<span className="font-weight-bold">
								{isEmailMode ? 'Sender User Email' : 'Sender User ID'}
							</span>
							<div className="d-flex align-items-center w-100 select-wrapper">
								<Select
									placeholder={
										isEmailMode ? 'Sender User Email' : 'Sender User ID'
									}
									onSearch={(text) => handleSearch(text, 'sender')}
									className="blue-admin-select-dropdown mt-2"
									showSearch
									filterOption={false}
									defaultActiveFirstOption={false}
									allowClear
									notFoundContent={null}
									value={confirmData?.sender_email}
									onSelect={(value) => onHandleSelect(value, 'sender')}
									getPopupContainer={(triggerNode) => triggerNode.parentNode}
									onClear={() => onHandleClear('sender')}
								>
									{senderData
										?.filter((data) => data?.value !== confirmData?.receiver_id)
										?.map((data) => (
											<Select.Option key={data?.value} value={data?.value}>
												{data?.label}
											</Select.Option>
										))}
								</Select>
								{isLoading && selectedUserType === 'sender' && (
									<Spin spinning={isLoading} size="medium" className="ml-2" />
								)}
							</div>
						</div>
						<ArrowDownOutlined className="fs-24" />
						<div className="form-field">
							<span className="font-weight-bold">
								{isEmailMode ? 'Receiver User Email' : 'Receiver User ID'}
							</span>
							<div className="d-flex align-items-center w-100 select-wrapper">
								<Select
									placeholder={
										isEmailMode ? 'Receiver User Email' : 'Receiver User ID'
									}
									onSearch={(text) => handleSearch(text, 'receiver')}
									className="blue-admin-select-dropdown mt-2"
									showSearch
									filterOption={false}
									defaultActiveFirstOption={false}
									notFoundContent={null}
									allowClear
									value={confirmData?.receiver_email}
									onSelect={(value) => onHandleSelect(value, 'receiver')}
									getPopupContainer={(triggerNode) => triggerNode.parentNode}
									onClear={() => onHandleClear('receiver')}
								>
									{receiverData
										?.filter((data) => data?.value !== confirmData?.sender_id)
										?.map((data) => (
											<Select.Option key={data?.value} value={data?.value}>
												{data?.label}
											</Select.Option>
										))}
								</Select>
								{isLoading && selectedUserType === 'receiver' && (
									<Spin spinning={isLoading} size="medium" className="ml-2" />
								)}
							</div>
							<div className="mt-3">
								<Checkbox
									checked={confirmData?.email || false}
									onChange={(e) => {
										setConfirmData((prev) => ({
											...prev,
											email: e.target.checked,
										}));
									}}
								>
									<span className="description-secondary-text">
										Send an email notification about this transfer to the
										receiver
									</span>
								</Checkbox>
							</div>
						</div>
					</div>
				</div>
				<div className="transfer-details mt-5">
					<div className="transfer-form-details">
						<div className="form-field">
							<span className="font-weight-bold">Assets/Currency</span>
							<Select
								placeholder="Currency"
								className="blue-admin-select-dropdown currency-select-field mt-2 w-100"
								showSearch
								allowClear
								value={confirmData?.currency}
								onSelect={(value) => onHandleSelect(value, 'currency')}
								onClear={() => onHandleClear('currency')}
								filterOption={(input, option) =>
									option?.value?.toLowerCase()?.includes(input?.toLowerCase())
								}
								getPopupContainer={(triggerNode) => triggerNode.parentNode}
							>
								{Object.keys(coins)
									?.sort()
									?.map((symbol) => (
										<Select.Option key={symbol} value={symbol}>
											{renderAsset(symbol)}
										</Select.Option>
									))}
							</Select>
							{confirmData?.sender_id && confirmData?.currency && (
								<div>
									<div className="d-flex align-items-end mt-1">
										<span>Senders total Balance: </span>
										<span className="ml-2 description-secondary-text">
											{selectedUserBalance?.totalBalance}{' '}
											{confirmData?.currency?.toUpperCase()}
										</span>
									</div>
									<div className="d-flex align-items-end mt-2">
										<span>Avaliable Balance: </span>
										<span className="ml-2 description-secondary-text">
											{selectedUserBalance?.availableBalance}{' '}
											{confirmData?.currency?.toUpperCase()}
										</span>
									</div>
								</div>
							)}
						</div>
						<div className="form-field mt-2">
							<span className="font-weight-bold">Amount</span>
							<Space className="input-amount-wrapper mt-2">
								<InputNumber
									placeholder="Amount"
									type="number"
									className="w-100"
									value={confirmData?.amount}
									min={0.00000001}
									max={100000000000}
									onChange={(e) => onHandleAmount(e)}
								/>
								{confirmData?.currency && (
									<span className="caps">{confirmData?.currency}</span>
								)}
							</Space>
							{confirmData?.currency &&
								confirmData?.amount > 0 &&
								balanceText() && (
									<div className="d-flex align-items-end mt-2">
										<span>Estimated Value:</span>
										<span className="ml-2 description-secondary-text">
											{balanceText()} {BASE_CURRENCY?.toUpperCase()}
										</span>
									</div>
								)}
						</div>
					</div>
				</div>
				<div className="transfer-details mt-3">
					<div className="form-field w-100">
						<span>
							<span className="font-weight-bold">Description</span>
							<span className="ml-1 description-secondary-text">
								(Recommended, but optional)
							</span>
						</span>
						<Input
							placeholder="Description"
							type="text"
							className="mt-2 input-description-wrapper"
							value={confirmData?.description}
							onChange={(e) => {
								setConfirmData((prev) => ({
									...prev,
									description: e.target.value,
								}));
							}}
						/>
					</div>
				</div>
				{isError && (
					<span className="error-wrapper">
						<ExclamationCircleFilled />
						Entered Amount must be less than or equal to the available balance
					</span>
				)}
				<div className="button-container w-100">
					<Button
						className="green-btn no-border mt-3 w-100"
						onClick={handleConfirm}
						disabled={isDisabled}
					>
						Next
					</Button>
				</div>
			</div>
			<Modal
				visible={isConfirm}
				centered
				footer={null}
				onCancel={handleClose}
				className="confirm-transfer_modal check-confirm-transfer_modal"
			>
				<div className="confirm-transfer-details">
					<span className="confirm-transfer-title caps">
						Check & Confirm Transfer
					</span>
					<div className="confirm-sender-transfer-details mt-5">
						<span className="sender-title caps">Sender</span>
						<div className="sender-transfer-details">
							<div className="pb-2">
								<span className="font-weight-bold">User: </span>
								<span>{getSelectedUser(senderData, 'sender')}</span>
								<span className="ml-1">
									(User ID: {confirmData?.sender_id})
								</span>
							</div>
							<div className="d-flex asset-field align-items-center">
								<span className="font-weight-bold">Asset: </span>
								<div className="d-flex align-items-center asset-field w-100">
									<span className="pt-2">
										<Coin
											type="CS4"
											iconId={coins[confirmData?.currency]?.icon_id}
										/>
									</span>
									<span className="text-capitalize">
										{coins[confirmData?.currency]?.fullname}
									</span>
									<span className="caps">({confirmData?.currency})</span>
								</div>
							</div>
							<div className="transfer-divider pt-3 pb-3">--</div>
							<div className="d-flex transfer-amount flex-wrap">
								<span>Transfer Amount: </span>
								<span>{confirmData?.amount}</span>
								<span className="caps">{confirmData?.currency}</span>
							</div>
							{balanceText() && (
								<div className="d-flex mb-4">
									<span className="font-weight-bold">Estimated Value: </span>
									<span className="ml-2">
										{balanceText()} {BASE_CURRENCY?.toUpperCase()}
									</span>
								</div>
							)}
						</div>
					</div>
					<div className="d-flex arrow-field">
						<div className="arrow-container">
							<ArrowDownOutlined className="down-arrow" />
						</div>
						<div className="d-flex flex-column decriptions">
							{confirmData?.description && (
								<div className="d-flex align-items-center">
									<span>Description:</span>
									<span className="ml-2">{confirmData?.description}</span>
								</div>
							)}
							<div className="d-flex align-items-center asset-field">
								<span>Notify receiver:</span>
								<span className="ml-2">
									{confirmData?.email ? 'Yes' : 'No'}{' '}
								</span>
							</div>
						</div>
					</div>
					<div className="confirm-sender-transfer-details">
						<span className="sender-title caps">Receiver</span>
						<div className="mb-4">
							<span className="font-weight-bold">Receiver User:</span>
							<span className="ml-2">
								{getSelectedUser(receiverData, 'receiver')}
							</span>
							<span> (User ID: {confirmData?.receiver_id})</span>
						</div>
					</div>
					<div className="confirm-transfer-button-container">
						<Button
							className="green-btn no-border back-btn"
							onClick={handleClose}
						>
							Back
						</Button>
						<Button
							className="green-btn no-border confirm-btn"
							onClick={handleTransfer}
							disabled={isDisableConfirm}
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isDisplayTranferComplete}
				centered
				footer={null}
				onCancel={handleClose}
				className="confirm-transfer_modal"
			>
				<div className="transfer-completed-container">
					<div className="d-flex gap-1">
						<span className="fs-24 circle-icon">
							<CheckCircleTwoTone />
						</span>
						<span className="fs-24">Transfer completed!</span>
					</div>
					<div className="d-flex flex-column gap-1 pt-3">
						<span>
							You've successfully transferred{' '}
							<span className="bold">
								{confirmData?.amount} {confirmData?.currency?.toUpperCase()}
							</span>{' '}
							between users.
						</span>
						<span className="bold">Would you like to do another transfer?</span>
					</div>
					<div className="repeat-transfer-select-wrapper pt-5 pb-4">
						<Radio.Group
							onChange={(e) => setRepeatTransfer(e.target.value)}
							value={repeatTransfer}
						>
							<Space direction="vertical">
								<Radio
									className={
										repeatTransfer === 'yes'
											? 'repeat-transfer-option-active'
											: 'repeat-transfer-option'
									}
									value={'yes'}
								>
									Yes - Reuse details
								</Radio>
								<Radio
									className={
										repeatTransfer === 'no'
											? 'repeat-transfer-option-active'
											: 'repeat-transfer-option'
									}
									value={'no'}
								>
									No - Reset
								</Radio>
							</Space>
						</Radio.Group>
					</div>
					<div className="next-btn-container pb-2">
						<Button
							className="green-btn no-border next-btn"
							onClick={() => onHandleNext()}
						>
							Next
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	assets: assetsSelector(state),
});

export default connect(mapStateToProps)(Transfer);
