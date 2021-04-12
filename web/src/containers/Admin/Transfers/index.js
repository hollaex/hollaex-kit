import React, { useState } from 'react';
import { Divider, message, Modal, Button } from 'antd';
import { connect } from 'react-redux';
// import { SubmissionError } from 'redux-form';
import _debounce from 'lodash/debounce';

import { postTransfer } from './action';
import { requestUsers } from '../ListUsers/actions';
import { AdminHocForm } from '../../../components';
import {
	validateRequired,
	validateRange,
	validatePositiveNumber,
} from '../../../components/AdminForm/validations';

const Form = AdminHocForm('TRANSFER_FORM');

const getFields = (
	coins,
	senderData = [],
	receiverData = [],
	handleSearch = () => {}
) => ({
	sender_id: {
		type: 'select',
		label: 'Sender email',
		placeholder: 'Sender email',
		validate: [validateRequired],
		showSearch: true,
		fullWidth: true,
		options: senderData,
		defaultActiveFirstOption: false,
		showArrow: false,
		filterOption: false,
		notFoundContent: null,
		onSearch: (text) => handleSearch(text, 'sender'),
	},
	receiver_id: {
		type: 'select',
		label: 'Receiver email',
		placeholder: 'Receiver email',
		validate: [validateRequired],
		showSearch: true,
		fullWidth: true,
		options: receiverData,
		defaultActiveFirstOption: false,
		showArrow: false,
		filterOption: false,
		notFoundContent: null,
		onSearch: (text) => handleSearch(text, 'receiver'),
	},
	currency: {
		type: 'select',
		label: 'Currency',
		placeholder: 'Currency',
		options: coins,
		validate: [validateRequired, validateRange(coins)],
	},
	amount: {
		type: 'number',
		label: 'Amount',
		placeholder: 'Amount',
		min: 0.00000001,
		max: 100000000000,
		validate: [validateRequired, validatePositiveNumber(0)],
	},
	description: {
		type: 'text',
		label: 'Description',
	},
	email: {
		type: 'checkbox',
		label: 'Send an email notification to receiver user about this transfer.',
	},
});

const TransferForm = ({ fields, initialValues, handleSubmitTransfer }) => {
	return (
		<div className="mb-4">
			<Form
				initialValues={initialValues}
				onSubmit={handleSubmitTransfer}
				buttonText={'Transfer'}
				buttonClass="green-btn"
				fields={fields}
			/>
		</div>
	);
};

const Transfer = ({ coins = {} }) => {
	const [senderData, setSenderData] = useState([]);
	const [receiverData, setReceiverData] = useState([]);
	const [isConfirm, setConfirm] = useState(false);
	const [confirmData, setConfirmData] = useState({});
	// useEffect(() => {
	// 	// getAllUserData();
	// }, []);
	const getAllUserData = async (params = { search: '' }, type) => {
		try {
			const response = await requestUsers(params);
			if (response.data) {
				const userData = response.data.map((user) => ({
					label: user.email,
					value: user.id,
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
			getAllUserData({ search: value }, key);
		}
	};
	const handleSearch = _debounce(onSearch, 500);
	const handleConfirm = (formProps) => {
		setConfirm(true);
		setConfirmData(formProps);
	};
	const handleTransfer = () => {
		if (confirmData.sender_id && confirmData.receiver_id) {
			handleSubmit(confirmData);
		}
	};
	const handleSubmit = (formProps) => {
		const postValues = {
			...formProps,
			sender_id: parseInt(formProps.sender_id, 10),
			receiver_id: parseInt(formProps.receiver_id, 10),
			amount: parseFloat(formProps.amount),
		};
		return postTransfer(postValues)
			.then((res) => {
				setConfirm(false);
				setConfirmData({});
				message.success('Transferred Successfully');
				setSenderData([]);
				setReceiverData([]);
			})
			.catch((error) => {
				setConfirm(false);
				const msg = error.data ? error.data.message : error.message;
				// throw new SubmissionError({ _error: message });
				setSenderData([]);
				setReceiverData([]);
				message.error(msg);
			});
	};
	const handleClose = () => {
		setConfirm(false);
		setConfirmData({});
		setSenderData([]);
		setReceiverData([]);
	};
	const coinData = Object.keys(coins || {});
	const fields = getFields(coinData, senderData, receiverData, handleSearch);
	return (
		<div className="app_container-content">
			<h1 className="m-top">Transfer</h1>
			<Divider />
			<TransferForm
				initialValues={{
					currency: coinData[0] ? coinData[0] : '',
					email: true,
					...confirmData,
				}}
				fields={fields}
				handleSubmitTransfer={handleConfirm}
			/>
			<Modal visible={isConfirm} footer={null} onCancel={handleClose}>
				<div className="transfer-confirmation-popup">
					<h2>Transfer</h2>
					<div>Transferring will send funds between two user accounts.</div>
					<div>Please carefully check that the details are correct.</div>
					<span className="legend">Check & Confirm</span>
					<div className="confirm-container">
						<div>
							<span className="bold">Sender user ID:</span>{' '}
							{confirmData.sender_id}
						</div>
						<div>
							<span className="bold">Receiver user ID:</span>{' '}
							{confirmData.receiver_id}
						</div>
						<div>
							<span className="bold">Asset:</span> {confirmData.currency}
						</div>
						<div>
							<span className="bold">Amount:</span> {confirmData.amount}
						</div>
						<div>
							<span className="bold">Description:</span>{' '}
							{confirmData.description}
						</div>
						<div>
							<span className="bold">Send email:</span>{' '}
							{confirmData.email ? 'Yes' : 'No'}
						</div>
					</div>
					<div className="d-flex align-items-center mt-4">
						<Button className="green-btn f-1" onClick={handleClose}>
							Back
						</Button>
						<Button className="green-btn f-1 ml-2" onClick={handleTransfer}>
							Confirm
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

export default connect(mapStateToProps)(Transfer);
