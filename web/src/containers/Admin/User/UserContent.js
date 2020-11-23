import React, { Component } from 'react';
import { Tabs, Button, Breadcrumb, message } from 'antd';
import { Link } from 'react-router';
import ReactSVG from 'react-svg';

import {
	Balance,
	// Logins,
	// Audits,
	// Verification,
	// Otp,
	UserBalance,
	// Activate,
	TradeHistory,
	// UploadIds,
	Transactions,
	ActiveOrders,
} from '../';
// import UserData from './UserData';
import BankData from './BankData';
import AboutData from './AboutData';
import { isSupport, isAdmin, isKYC } from '../../../utils/token';
import { STATIC_ICONS } from 'config/icons';
import { deactivateOtp, flagUser, activateUser } from './actions';

// import Flagger from '../Flaguser';
// import Notes from './Notes';

const TabPane = Tabs.TabPane;
const { Item } = Breadcrumb;

class UserContent extends Component {
	disableOTP = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};
		return deactivateOtp(postValues)
			.then((res) => {
				refreshData({ otp_enabled: false });
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	flagUser = (value) => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
			flagged: value,
		};
		flagUser(postValues)
			.then((res) => {
				refreshData(postValues);
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	freezeAccount = (value) => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
			activated: value,
		};
		activateUser(postValues)
			.then((res) => {
				refreshData(postValues);
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	render() {
		const {
			coins,
			constants,
			userInformation,
			userImages,
			// clearData,
			refreshData,
			refreshAllData,
			onChangeUserDataSuccess,
		} = this.props;
		const {
			id,
			// activated,
			// otp_enabled,
			// flagged,
			verification_level,
			is_admin,
			is_support,
			is_supervisor,
			is_kyc,
			is_tech,
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
			<div className="app_container-content user-content">
				<Breadcrumb>
					<Item>
						<Link to="/admin">Home</Link>
					</Item>
					<Item>
						<Link to="/admin/user">Users</Link>
					</Item>
					<Item>User profile</Item>
				</Breadcrumb>
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-center user-details">
						<ReactSVG
							path={STATIC_ICONS.USER_DETAILS_ICON}
							wrapperClassName="user-icon"
						/>
						<div>User Id: {userInformation.id}</div>
						<div className="user-seperator"></div>
						<div>{userInformation.email}</div>
					</div>
					<div className="d-flex">
						<Button
							size="medium"
							type="primary"
							style={{ marginRight: 5 }}
							onClick={refreshAllData}
						>
							Refresh
						</Button>
					</div>
				</div>
				<Tabs
				// tabBarExtraContent={<Button className="mr-3" onClick={clearData}>Back</Button>}
				>
					<TabPane tab="About" key="about">
						<div>
							<AboutData
								user_id={userInformation.id}
								userData={userInformation}
								userImages={userImages}
								constants={constants}
								refreshData={refreshData}
								onChangeSuccess={onChangeUserDataSuccess}
								disableOTP={this.disableOTP}
								flagUser={this.flagUser}
								freezeAccount={this.freezeAccount}
							/>
						</div>
					</TabPane>
					{/* <TabPane tab="Data" key="data">
						<div>
							<UserData
								initialValues={userInformation}
								onChangeSuccess={onChangeUserDataSuccess}
							/>
						</div>
					</TabPane> */}
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
									user_id: id,
								}}
								queryParams={{
									status: true,
									type: 'deposit',
								}}
								hideUserColumn={true}
							/>
						</TabPane>
					)}
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Withdrawal" key="withdrawals">
							<Transactions
								initialData={{
									user_id: id,
								}}
								queryParams={{
									status: true,
									type: 'withdrawal',
								}}
								hideUserColumn={true}
							/>
						</TabPane>
					)}
				</Tabs>
			</div>
		);
	}
}

export default UserContent;
