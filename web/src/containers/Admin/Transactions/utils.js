import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { BankOutlined, CloseSquareOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { Link } from 'react-router';

// import { isSupport } from '../../../utils';
import { formatCurrency, formatDate } from '../../../utils';

export const renderBoolean = (value) => (
	<LegacyIcon type={value ? 'check-circle' : 'close-circle-o'} />
);

const ButtonNotAvailable = () => <CloseSquareOutlined />;
export const renderValidation = ({ status, completeDeposit, updatingItem }) =>
	!status ? (
		<Tooltip placement="bottom" title="VALIDATE">
			<Button
				type="primary"
				onClick={completeDeposit}
				loading={updatingItem}
				shape="circle"
			>
				{!updatingItem && <BankOutlined />}
			</Button>
		</Tooltip>
	) : (
		<ButtonNotAvailable />
	);

export const renderDismiss = ({
	status,
	dismissed,
	rejected,
	dismissDeposit,
	dismissingItem,
}) =>
	!status && !rejected ? (
		<Tooltip placement="bottom" title={dismissed ? 'UNDO DISMISS' : 'DISMISS'}>
			<Button
				type={dismissed ? 'dashed' : 'primary'}
				onClick={dismissDeposit}
				loading={dismissingItem}
				shape="circle"
			>
				{!dismissingItem && <LegacyIcon type={dismissed ? 'eye' : 'eye-o'} />}
			</Button>
		</Tooltip>
	) : (
		<ButtonNotAvailable />
	);

export const renderUser = (id) => (
	<Tooltip placement="bottom" title={`SEE USER ${id} DETAILS`}>
		<Button type="primary">
			<Link to={`user?id=${id}`}>{id}</Link>
		</Button>
	</Tooltip>
);

export const COLUMNS = (currency, type) => {
	const transactionTitle =
		currency === 'fiat' ? 'Payment Id' : 'Transaction Id';
	const columns = [
		{
			title: 'User Id',
			dataIndex: 'user_id',
			key: 'user_id',
			render: renderUser,
		},
		{
			title: transactionTitle,
			dataIndex: 'transaction_id',
			key: 'transaction_id',
		},
		// { title: 'Address', dataIndex: 'address', key: 'address' },
		{ title: 'Type', dataIndex: 'type', key: 'type' },
		{ title: 'Currency', dataIndex: 'currency', key: 'currency' },

		{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
		// { title: 'Fee', dataIndex: 'fee', key: 'fee' },
		// { title: 'Timestamp', dataIndex: 'created_at', key: 'created_at' },
	];
	return columns;
};

export const SELECT_KEYS = (currency) => {
	if (currency === 'fiat') {
		return [{ value: 'transaction_id', label: 'Payment Id' }];
	} else {
		return [
			{ value: 'transaction_id', label: 'Transaction ID' },
			{ value: 'address', label: 'Address' },
		];
	}
};

export const renderRowContent = ({
	address,
	description,
	amount,
	fee,
	created_at,
	currency,
	type,
}) => {
	return (
		<div>
			{address && <div>Address: {address}</div>}
			<div>Type: {type}</div>
			<div>Currency: {currency}</div>
			<div>Amount: {formatCurrency(amount)}</div>
			<div>Fee: {formatCurrency(fee)}</div>
			<div>Timestamp: {formatDate(created_at)}</div>
			{description && <div>Description: {description}</div>}
		</div>
	);
};
