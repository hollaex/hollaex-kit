import React from 'react';
import { Icon, Button, Tooltip } from 'antd';
import { Link } from 'react-router';
import { formatCurrency, formatDate } from '../../../utils/index';

import { isSupport } from '../../../utils/token';

export const renderBoolean = (value) => (
	<Icon type={value ? 'check-circle' : 'close-circle-o'} />
);

const ButtonNotAvailable = () => <Icon type="close-square" />;
export const renderValidation = ({
	status,
	dismissed,
	rejected,
	completeDeposit,
	updatingItem
}) =>
	!status && !dismissed && !rejected ? (
		<Tooltip placement="bottom" title="VALIDATE">
			<Button
				type="primary"
				onClick={completeDeposit}
				loading={updatingItem}
				shape="circle"
			>
				{!updatingItem && <Icon type="bank" />}
			</Button>
		</Tooltip>
	) : (
		<ButtonNotAvailable />
	);

export const renderDismiss = ({
	status,
	rejected,
	dismissed,
	dismissDeposit,
	dismissingItem
}) =>
	!status && !dismissed && !rejected ? (
		<Tooltip placement="bottom" title={dismissed ? 'UNDO DISMISS' : 'DISMISS'}>
			<Button
				type={dismissed ? 'dashed' : 'primary'}
				onClick={dismissDeposit}
				loading={dismissingItem}
				shape="circle"
			>
				{!dismissingItem && <Icon type={dismissed ? 'eye' : 'eye-o'} />}
			</Button>
		</Tooltip>
	) : (
		<ButtonNotAvailable />
	);

export const renderUser = (id) => (
	<Tooltip placement="bottom" title={`SEE USER ${id} DETAILS`}>
		<Button type="primary">
			<Link to={`/admin/user?id=${id}`}>{id}</Link>
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
			render: renderUser
		},
		{
			title: transactionTitle,
			dataIndex: 'transaction_id',
			key: 'transaction_id'
		},
		// { title: 'Address', dataIndex: 'address', key: 'address' },
		{ title: 'Currency', dataIndex: 'currency', key: 'currency' },
		{
			title: 'Completed',
			dataIndex: 'status',
			key: 'status',
			render: renderBoolean
		},
		{
			title: 'Dismissed',
			dataIndex: 'dismissed',
			key: 'dismissed',
			render: renderBoolean
		},
		{
			title: 'Rejected',
			dataIndex: 'rejected',
			key: 'rejected',
			render: renderBoolean
		}
		// { title: 'Amount', dataIndex: 'amount', key: 'amount' },
		// { title: 'Fee', dataIndex: 'fee', key: 'fee' },
		// { title: 'Timestamp', dataIndex: 'created_at', key: 'created_at' },
	];
	if (!isSupport()) {
		const adminColumns = [
			{
				title: 'Validate',
				dataIndex: '',
				key: 'completeDeposit',
				render: renderValidation
			},
			{
				title: 'Dismiss',
				dataIndex: '',
				key: 'dismissDeposit',
				render: renderDismiss
			}
		];
		return columns.concat(adminColumns);
	}
	return columns;
};

export const SELECT_KEYS = (currency) => {
	if (currency === 'fiat') {
		return [{ value: 'transaction_id', label: 'Payment Id' }];
	} else {
		return [
			{ value: 'transaction_id', label: 'Transaction ID' },
			{ value: 'address', label: 'Address' }
		];
	}
};

export const renderRowContent = ({
	address,
	description,
	amount,
	fee,
	created_at,
	currency
}) => {
	return (
		<div>
			{address && <div>Address: {address}</div>}
			<div>Currency: {currency}</div>
			<div>Amount: {formatCurrency(amount - fee)}</div>
			<div>Fee: {formatCurrency(fee)}</div>
			<div>Timestamp: {formatDate(created_at)}</div>
			{description && <div>Description: {description}</div>}
		</div>
	);
};
