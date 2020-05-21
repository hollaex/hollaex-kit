import React, { Component } from 'react';
import { Tabs, Button, Tag, Icon } from 'antd';

import {
	Balance,
	Logins,
	Audits,
	Verification,
	Otp,
	UserBalance,
	Activate,
	TradeHistory,
	UploadIds,
	Transactions,
	ActiveOrders
} from '../';
import UserData from './UserData';
import BankData from './BankData';
import { isSupport, isAdmin, isKYC } from '../../../utils/token';

import Flagger from '../Flaguser';
import Notes from './Notes';

const TabPane = Tabs.TabPane;

class UserContent extends Component {
	render() {
		const {
			coins,
			constants,
			userInformation,
			userImages,
			clearData,
			refreshData,
			refreshAllData,
			onChangeUserDataSuccess
		} = this.props;
		const {
			id,
			activated,
			otp_enabled,
			flagged,
			verification_level,
			is_admin,
			is_support,
			is_supervisor,
			is_kyc,
			is_tech
		} = userInformation;
		const isSupportUser = isSupport();
		const pairs = Object.keys(coins) || [];
		const verificationInitialValues = {};
		const roleInitialValues = {};
		if (verification_level) {
			verificationInitialValues.verification_level = verification_level;
		}
		if (is_admin) {
			roleInitialValues.role = 'admin';
		} else if (is_support) {
			roleInitialValues.role = 'support';
		} else if (is_supervisor) {
			roleInitialValues.role = 'supervisor';
		} else if (is_kyc) {
			roleInitialValues.role = 'kyc';
		} else if (is_tech) {
			roleInitialValues.role = 'tech';
		} else {
			roleInitialValues.role = 'user';
		}
		return (
			<div className="app_container-content">
				<div className="d-flex justify-content-between">
					<div className="d-flex">
						<Tag color="red">User Id: {userInformation.id}</Tag>
						<Tag>{userInformation.email}</Tag>
						{userInformation.flagged ? (
							<Tag color="red" style={{ fontWeight: 'bold' }}>
								<Icon type="flag" /> flagged user
							</Tag>
						) : null}
					</div>
					<div className="d-flex">
						<Button
							size="small"
							type="primary"
							style={{ marginRight: 5 }}
							onClick={refreshAllData}
						>
							Refresh data
						</Button>
						<Flagger
							user_id={id}
							flagged={flagged}
							refreshData={refreshData}
							small={true}
						/>
					</div>
				</div>
				<Tabs
					tabBarExtraContent={<Button className="mr-3" onClick={clearData}>Back</Button>}
				>
					<TabPane tab="Data" key="data">
						<div>
							<UserData
								initialValues={userInformation}
								onChangeSuccess={onChangeUserDataSuccess}
							/>
						</div>
					</TabPane>
					<TabPane tab="Bank" key="bank">
						<div>
							<BankData
								initialValues={userInformation}
								onChangeSuccess={onChangeUserDataSuccess}
								refreshData={refreshData}
							/>
						</div>
					</TabPane>
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Balance" key="balance">
							<UserBalance userData={userInformation} />
						</TabPane>
					)}
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Orders" key="orders">
							<ActiveOrders userId={userInformation.id} />
						</TabPane>
					)}
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Trade history" key="trade">
							<TradeHistory userId={userInformation.id} />
						</TabPane>
					)}
					{isAdmin() && (
						<TabPane tab="Funding" key="deposit">
							<Balance user_id={id} pairs={pairs} />
						</TabPane>
					)}
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Deposits" key="deposits">
							{/*<Deposits*/}
							{/*initialData={{*/}
							{/*user_id: id*/}
							{/*}}*/}
							{/*queryParams={{*/}
							{/*status: false*/}
							{/*}}*/}
							{/*hideUserColumn={true}*/}
							{/*/>*/}
							<Transactions
								initialData={{
									user_id: id
								}}
								queryParams={{
									status: true,
									type: 'deposit'
								}}
								hideUserColumn={true}
							/>
						</TabPane>
					)}
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Withdrawal" key="withdrawals">
							<Transactions
								initialData={{
									user_id: id
								}}
								queryParams={{
									status: true,
									type: "withdrawal"
								}}
								hideUserColumn={true}
							/>
						</TabPane>
					)}
					<TabPane tab="Verification" key="verification">
						<Verification
							constants={constants}
							user_id={userInformation.id}
							userImages={userImages}
							userInformation={userInformation}
							verificationInitialValues={verificationInitialValues}
							roleInitialValues={roleInitialValues}
							refreshData={refreshData}
						/>
					</TabPane>
					<TabPane tab="Logins" key="logins">
						<Logins userId={userInformation.id} />
					</TabPane>
					{!isSupportUser && !isKYC() && (
						<TabPane tab="OTP" key="otp">
							<Otp
								user_id={id}
								otp_enabled={otp_enabled}
								refreshData={refreshData}
							/>
						</TabPane>
					)}
					<TabPane tab="Status" key="activate">
						<Activate
							user_id={id}
							activated={activated}
							refreshData={refreshData}
						/>
					</TabPane>
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Upload" key="upload">
							<UploadIds user_id={id} refreshData={refreshData} />
						</TabPane>
					)}
					{isAdmin() && (
						<TabPane tab="Audits" key="audits">
							<Audits userId={userInformation.id} />
						</TabPane>
					)}				
					<TabPane tab="Notes" key="notes">
						<Notes 
							initialValues={userInformation}
							onChangeSuccess={onChangeUserDataSuccess}
						/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

export default UserContent;
