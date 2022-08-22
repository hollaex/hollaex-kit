import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { Link } from 'react-router';

import { STATIC_ICONS } from 'config/icons';
import { Image } from 'components';

import './index.css';

const Kyc = () => {
	const [tableData] = useState([]);

	const COLUMNS = [
		{ title: 'Account created', key: 'account_created' },
		{ title: 'ID', key: 'id' },
		{ title: 'Username', key: 'userName' },
		{ title: 'Email', key: 'email' },
		{ title: 'Verification Level', key: 'verification_level' },
		{
			title: 'Activated',
			key: 'activated',
		},
	];

	let locale = {
		emptyText: (
			<span>
				<div>
					<Image
						icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
						wrapperClassName="limit-status-icon"
					/>
				</div>
				<div>No pending KYC information here yet.</div>
				<div>Invite users to your exchange and/or turn on KYC plugins.</div>
				<span className="anchor">Visit KYC section</span>
			</span>
		),
	};

	const renderCard = () => {
		return (
			<div className="box-wrapper">
				<div className="box-container">
					<div className="d-flex">
						<div className="cloud-icon">
							<img src={STATIC_ICONS['KYC_USER_ICON']} alt="KYC_USER_ICON" />
						</div>
						<div className="box-text-wrapper">
							<div className="content-title">User Verification lefts</div>
							<div className="warning-wrapper">
								{/* <div className="small-round warning"></div> */}
								<div>
									<span>{0}</span> users
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="btn-wrapper rounded-btn">
					<Link>View last bill</Link>
					<Button type="primary">Activate</Button>
				</div>
			</div>
		);
	};

	const renderInformation = () => {
		return (
			<div className="warn-text">
				Note, as two active KYC plugins will not work you must first remove the
				manual KYC plugin in order to activate the automated KYC.
			</div>
		);
	};

	return (
		<div className="kyc-wrapper">
			<div className="kyc-content">
				<div className="d-flex box-style">
					<div className="KYC_PLUGIN_ICON">
						<img src={STATIC_ICONS['KYC_PLUGIN_ICON']} alt="KYC_PLUGIN_ICON" />
					</div>
					<div className="divider-style" />
					<div>
						<div>
							Activate an automated KYC and AML plugin that will streamline your
							user on boarding and verification.
						</div>
						<div>
							First pay for a one time setup and activation and then pay as you
							go for as many user verification as you need.
						</div>
						<div className="divider-style" />
						<div className="disabled-btn rounded-btn">
							<Button type="primary">Download Plugin</Button>
						</div>
					</div>
				</div>
				<div className="content-panel">
					{renderCard()}
					<div className="warning-wrapper">
						<div className="small-round"></div>
						{renderInformation()}
					</div>
				</div>
				<div className="kyc-table-wrapper">
					<div className="kyc-info">
						KYC - recent pending user verifications
					</div>
					<Table
						className={
							tableData.length
								? 'blue-admin-table'
								: 'blue-admin-table empty-table'
						}
						columns={COLUMNS}
						rowKey={(data) => {
							return data.id;
						}}
						dataSource={tableData}
						pagination={null}
						locale={locale}
					/>
				</div>
			</div>
		</div>
	);
};

export default Kyc;
