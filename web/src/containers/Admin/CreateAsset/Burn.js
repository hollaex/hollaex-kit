import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
	Button,
	InputNumber,
	Form,
	Input,
	Select,
	message,
	Modal,
	Radio,
	Space,
	Spin,
} from 'antd';
import { CheckCircleTwoTone, ClockCircleOutlined } from '@ant-design/icons';
import _debounce from 'lodash/debounce';

import { storeBurn, storeMint } from '../AdminFinancials/action';
import { requestUsers } from '../ListUsers/actions';
import { Coin, Image } from 'components';
import { STATIC_ICONS } from 'config/icons';
const { TextArea } = Input;
const { Option } = Select;

const Burn = ({
	type = 'burn',
	coinFormData = {},
	onClose = () => {},
	exchangeUsers,
	exchange,
	coins,
}) => {
	const [dataSource, setDataSource] = useState([]);
	const [form] = Form.useForm();
	const [displayAdvanced, setDisplayAdvanced] = useState(false);
	const [formValues, setFormValues] = useState({});
	const [isConfirmSubmit, setIsConfirmSubmit] = useState(false);
	const [isDisplayReusePopup, setIsDisplayReusePopup] = useState(false);
	const [isConfirmRepeat, setIsConfirmRepeat] = useState('yes');
	const [isLoading, setIsLoading] = useState(false);

	const userDetail = dataSource?.find(
		(data) => Number(data?.id) === Number(formValues?.user_id)
	);
	const handleIsLoading = _debounce(() => setIsLoading(false), 500);

	const getAllUsers = useCallback(async (params = {}) => {
		setIsLoading(true);
		try {
			const res = await requestUsers(params);
			if (res && res.data) {
				const exchangeUsers = res.data || [];
				setDataSource(exchangeUsers);
			}
		} catch (error) {
			console.log('error', error);
		}
		handleIsLoading();
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		getAllUsers();
	}, [getAllUsers]);

	const onHandleFormSubmit = (values) => {
		setFormValues(values);
		setIsConfirmSubmit(true);
	};

	const handleClose = () => {
		isConfirmSubmit && setIsConfirmSubmit(false);
		isDisplayReusePopup && setIsDisplayReusePopup(false);
		form.resetFields();
	};

	const onHandleNext = () => {
		setIsDisplayReusePopup(false);
		if (isConfirmRepeat === 'no') {
			setFormValues({});
			form.resetFields();
		}
	};

	const handleSubmit = (values) => {
		if (values) {
			const {
				amount,
				user_id,
				description,
				status,
				transaction_id,
				fee,
				address,
			} = values;

			const formProps = {
				currency: coinFormData.symbol,
				amount,
				user_id: user_id ? parseInt(user_id, 10) : user_id,
				...(fee && { fee }),
				...(description && { description }),
				status: Number(status) ? true : false,
				...(transaction_id && { transaction_id }),
				...(address && { address }),
			};
			setIsConfirmSubmit(false);
			setIsConfirmRepeat('yes');
			if (type === 'mint') {
				handleMint(formProps);
				onClose();
			} else {
				handleBurn(formProps);
				onClose();
			}
		}
	};

	const handleBurn = async (formValues) => {
		try {
			const res = await storeBurn(formValues);
			if (res) {
				message.success(`${res.amount} ${res.currency} successfully burnt`);
			}
			setIsDisplayReusePopup(true);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
				form.resetFields();
			}
		}
	};

	const handleMint = async (formValues) => {
		try {
			const res = await storeMint(formValues);
			if (res) {
				message.success(
					`${res.amount} ${res.currency} successfully minted and allocated to user`
				);
			}
			setIsDisplayReusePopup(true);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
				form.resetFields();
			}
		}
	};

	const searchUser = (searchText) => {
		if (searchText) {
			getAllUsers({ search: searchText });
		} else {
			getAllUsers();
		}
	};

	const handleSearch = _debounce(searchUser, 1000);

	useEffect(() => {
		return () => {
			handleSearch && handleSearch.cancel();
			handleIsLoading && handleIsLoading.cancel();
		};
		// eslint-disable-next-line
	}, []);

	const checkEmail = (rule, value, callback) => {
		let baseData = dataSource;
		let emailData = baseData.filter((data) => data.id === parseInt(value, 10));
		if (!emailData.length) {
			callback("User doesn't exists");
		} else {
			callback();
		}
	};

	return (
		<div className="burn-wrapper">
			<div className="d-flex align-items-center">
				<Image
					icon={STATIC_ICONS[type === 'burn' ? 'BURN_ICON' : 'MINT_ICON']}
					wrapperClassName="selected-type-image"
				/>
				<div className="title ml-2">{type === 'burn' ? 'Burn' : 'Mint'}</div>
			</div>
			<div>
				{type === 'burn'
					? 'Burning will reduce the supply of the asset in existence.'
					: 'Minting will create new supply of the asset into existence.'}
			</div>
			<Form
				form={form}
				name="EditAssetForm"
				onFinish={onHandleFormSubmit}
				className="burn-wrapper-form"
			>
				<h3>Amount</h3>
				<Form.Item
					name="amount"
					rules={[
						{
							required: true,
							message: 'Please enter the amount',
						},
					]}
				>
					<InputNumber placeholder="Amount" />
				</Form.Item>
				<h3>Email</h3>
				<Space align="start">
					<Form.Item
						name="user_id"
						rules={[
							{
								required: true,
								message: 'Please input email',
							},
							{
								validator: checkEmail,
							},
						]}
						className="w-100"
					>
						<Select
							showSearch
							placeholder="Select an user"
							className="user-search-field w-100"
							onSearch={(text) => handleSearch(text)}
							filterOption={() => true}
							autoComplete={false}
							getPopupContainer={(triggerNode) => triggerNode.parentNode}
						>
							{dataSource.map((sender) => (
								<Option key={sender.id}>{sender.email}</Option>
							))}
						</Select>
					</Form.Item>
					<Spin spinning={isLoading} className="user-search-spinner" />
				</Space>

				<h3>Status</h3>
				<Form.Item initialValue={'1'} name="status">
					<Select
						placeholder="Select an user"
						className="user-search-field"
						autoComplete={false}
						getPopupContainer={(triggerNode) => triggerNode.parentNode}
					>
						<Option key={'1'}>Completed</Option>
						<Option key={'0'}>Pending</Option>
					</Select>
				</Form.Item>

				<h3>Description</h3>
				<Form.Item name="description" className="description-wrapper">
					<TextArea placeholder="description" rows={3} />
				</Form.Item>

				<div
					onClick={() => {
						setDisplayAdvanced(!displayAdvanced);
					}}
					className="underline-text fs-12 pointer mb-3 toggle-advance-text"
				>
					{displayAdvanced ? 'Hide Advanced' : 'Show Advance'}
				</div>
				{displayAdvanced && (
					<>
						<h3>
							Transaction ID <span className="optional-text">(optional)</span>
						</h3>
						<Form.Item name="transaction_id">
							<Input placeholder="Transaction ID" />
						</Form.Item>
						<h3>
							Fees <span className="optional-text">(optional)</span>
						</h3>
						<Form.Item name="fee">
							<InputNumber placeholder="Amount" />
						</Form.Item>
						<h3>
							Address <span className="optional-text">(optional)</span>
						</h3>
						<Form.Item name="address">
							<Input placeholder="Address" />
						</Form.Item>
					</>
				)}

				<Button type="primary" className="green-btn" htmlType="submit">
					REVIEW
				</Button>
			</Form>
			<Modal
				maskClosable={false}
				visible={isConfirmSubmit}
				footer={null}
				onCancel={() => handleClose()}
				className="confirm-burn-details-popup"
			>
				<div className="confirm-transfer-details">
					<div className="d-flex align-items-center">
						<Image
							icon={STATIC_ICONS[type === 'burn' ? 'BURN_ICON' : 'MINT_ICON']}
							wrapperClassName="selected-type-image"
						/>
						<span className="confirm-transfer-title caps">
							Check & Confirm {type?.toUpperCase()}
						</span>
					</div>
					<div className="confirm-sender-transfer-details mt-4">
						<span className="sender-title caps">{type}</span>
						<div className="sender-transfer-details">
							<div className="pb-2">
								<span className="font-weight-bold">User: </span>
								<span>
									{userDetail?.email} (user ID : {userDetail?.id})
								</span>
							</div>
							<div className="d-flex asset-field align-items-center">
								<span className="font-weight-bold">Asset: </span>
								<div className="d-flex asset-field w-100 align-items-center">
									{coins[coinFormData?.symbol] && (
										<Coin
											iconId={coins[coinFormData?.symbol]?.icon_id}
											type="CS8"
										/>
									)}
									<span className="text-capitalize">
										{coinFormData?.fullname}
									</span>
									<span className="caps">({coinFormData?.symbol})</span>
								</div>
							</div>
							<div className="d-flex asset-field align-items-center">
								<span className="bold">Status:</span>
								<span>
									{formValues?.status === '1' ? 'Completed' : 'Pending'}
								</span>
							</div>
							{formValues?.description && (
								<div className="d-flex asset-field align-items-center">
									<span className="bold">Description:</span>
									<span>{formValues?.description}</span>
								</div>
							)}
							<div className="transfer-divider pt-3 pb-3">--</div>
							<div className="d-flex transfer-amount flex-wrap">
								<span>Amount: </span>
								<span>{formValues?.amount}</span>
								<span className="caps">({coinFormData?.symbol})</span>
							</div>
						</div>
					</div>
					{(formValues?.transaction_id ||
						formValues?.fee ||
						formValues?.address) && (
						<>
							<div className="confirm-sender-transfer-details mt-5">
								<span className="sender-title caps">Advance</span>
								<div className="mb-3">
									{formValues?.transaction_id && (
										<div className="d-flex asset-field flex-wrap">
											<span className="bold">Transaction ID:</span>
											<span>{formValues?.transaction_id}</span>
										</div>
									)}
									{formValues?.fee && (
										<div className="d-flex asset-field flex-wrap">
											<span className="bold">Fee:</span>
											<span>{formValues?.fee}</span>
											<span className="caps">({coinFormData?.symbol})</span>
										</div>
									)}
									{formValues?.address && (
										<div className="d-flex asset-field flex-wrap">
											<span className="bold">Address:</span>
											<span>{formValues?.address}</span>
										</div>
									)}
								</div>
							</div>
						</>
					)}

					<div className="confirm-transfer-button-container">
						<Button onClick={handleClose} className="green-btn no-border w-100">
							Back
						</Button>
						<Button
							onClick={() => {
								handleSubmit(formValues);
							}}
							className="green-btn no-border w-100"
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isDisplayReusePopup}
				centered
				footer={null}
				onCancel={handleClose}
				className="confirm-transfer_modal confirm-burn-details-popup"
			>
				<div className="transfer-completed-container">
					<div className="d-flex gap-1">
						<span className="fs-24 circle-icon">
							{formValues?.status === '1' ? (
								<CheckCircleTwoTone />
							) : (
								<ClockCircleOutlined />
							)}
						</span>
						<span className="fs-24 text-capitalize">
							{formValues?.status === '1' ? 'Completed' : 'Pending'} {type}{' '}
							Created
						</span>
					</div>
					<div className="d-flex flex-column gap-1 pt-3">
						<span>
							You've successfully{' '}
							{formValues?.status === '1' ? 'completed a' : 'created a pending'}{' '}
							{type} of
							<span className="bold ml-2">
								{formValues?.amount} {coinFormData?.symbol?.toUpperCase()}
							</span>{' '}
							.
						</span>
						<span className="bold">
							Would you like to do another{' '}
							{formValues?.status === '1' ? 'completed' : 'pending'} {type}?
						</span>
					</div>
					<div className="repeat-transfer-select-wrapper pt-5 pb-4">
						<Radio.Group
							onChange={(e) => setIsConfirmRepeat(e.target.value)}
							value={isConfirmRepeat}
						>
							<Space direction="vertical">
								<Radio
									className={
										isConfirmRepeat === 'yes'
											? 'repeat-transfer-option-active'
											: 'repeat-transfer-option'
									}
									value={'yes'}
								>
									Yes - Reuse details
								</Radio>
								<Radio
									className={
										isConfirmRepeat === 'no'
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
});
export default connect(mapStateToProps)(Burn);
