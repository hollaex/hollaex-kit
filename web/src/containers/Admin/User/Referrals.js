import React, { useState, useEffect } from 'react';
import { Table, Spin } from 'antd';
import { getUserReferer, getUserAffiliation } from './actions';
import { formatTimestampGregorian, DATETIME_FORMAT } from 'utils/date';
import './index.css';

const COLUMNS = [
	{
		title: 'Time referred /signed up',
		dataIndex: 'created_at',
		key: 'created_at',
		render: (value) => (
			<div>{formatTimestampGregorian(value, DATETIME_FORMAT)}</div>
		),
	},
	{
		title: 'Refereed user',
		dataIndex: 'user',
		key: 'user',
		render: ({ id, email }) => (
			<div className="d-flex">
				<div className="d-flex justify-content-center align-items-center green-badge">
					{id}
				</div>
				<div className="px-2">{email}</div>
			</div>
		),
	},
];

const Referrals = ({ userInformation: { id: userId, affiliation_code } }) => {
	const [loading, setLoading] = useState(true);
	const [invitedBy, setInvitedBy] = useState();
	const [affiliation, setAffiliation] = useState({ count: 0, data: [] });
	const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;

	useEffect(() => {
		getUserReferer(userId).then(({ email }) => {
			setInvitedBy(email);
			getUserAffiliation(userId).then((response) => {
				setAffiliation(response);
				setLoading(false);
			});
		});
	}, [userId]);

	if (loading) {
		return (
			<div className="app_container-content">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="admin-user-container">
			<div className="mt-2">
				Referral affiliation information and table displaying all the successful
				referrals that were onboarded onto the platform from this user.
			</div>
			<div className="d-flex align-items-center m-4">
				<div className="d-flex">
					<div className="bold">Invited by: </div>
					<div className="px-2">{invitedBy}</div>
				</div>
				<div className="user-info-separator" />
				<div className="d-flex">
					<div className="bold">Total referred: </div>
					<div className="px-2">{affiliation.count}</div>
				</div>
				<div className="user-info-separator" />
				<div className="d-flex">
					<div className="bold">Referral link: </div>
					<div className="px-2">{referralLink}</div>
				</div>
			</div>
			<div>
				<div className="bold">Affiliation referral table</div>
				<Table
					className="blue-admin-table"
					columns={COLUMNS}
					dataSource={affiliation.data}
				/>
			</div>
		</div>
	);
};

export default Referrals;
