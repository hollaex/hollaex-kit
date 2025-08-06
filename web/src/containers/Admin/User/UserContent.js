import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { ReactSVG } from 'react-svg';
import { Tabs, Button, Breadcrumb, message, Modal } from 'antd';

import {
	// Balance,
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
import Referrals from './Referrals';
import VerifyEmailConfirmation from './VerifyEmailConfirmation';
import ActivationConfirmation from './ActivationConfirmation';
import { isSupport, isKYC } from '../../../utils/token';
import { STATIC_ICONS } from 'config/icons';
import {
	deactivateOtp,
	flagUser,
	activateUser,
	verifyUser,
	recoverUser,
	deleteUser,
	requestTiers,
} from './actions';
import UserMetaForm from './UserMetaForm';
import PaymentMethods from './PaymentMethods';
import DeletionConfirmation from './DeleteConfirmation';
import {
	setIsActiveAddNewUsers,
	setIsActiveDeleteUser,
	setIsActiveFlagUser,
	setIsActiveFreezeUser,
	setIsDisabledUser2fa,
	setIsEmailVerifiedUser,
} from 'actions/appActions';
import UserStaking from '../Stakes/UserStaking';

// import Flagger from '../Flaguser';
// import Notes from './Notes';

const TabPane = Tabs.TabPane;
const { Item } = Breadcrumb;

class UserContent extends Component {
	state = {
		showVerifyEmailModal: false,
		showRecoverModal: false,
		showDeleteModal: false,
		userTiers: {},
		activeTab: 'about',
		userTabs: [
			'about',
			'balance',
			'orders',
			'bank',
			'trade',
			'deposits',
			'withdrawals',
			'payment_methods',
			'referrals',
			'meta',
			'stakes',
		],
	};

	componentDidMount() {
		const { userProfile } = this.props;
		const {
			location: { pathname, query },
		} = this.props.router;
		const { activeTab, userTabs } = this.state;
		this.getTiers();
		const params = new URLSearchParams();
		params.set('id', query?.id);
		params.set('tab', userProfile ? userProfile : activeTab);
		const updateParams = `${pathname}?${params?.toString()}`;
		if (userProfile) {
			this.setState({ activeTab: userProfile });
		}
		if (userTabs?.includes(activeTab)) {
			this.props.router.replace(updateParams?.toString());
		} else {
			this.props.router.push(`/admin`);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { activeTab, userTabs } = this.state;
		if (!userTabs?.includes(activeTab)) {
			this.props.router.push(`/admin`);
		}
		if (
			(this.state.activeTab !== prevState.activeTab ||
				!userTabs?.includes(window.location.search)) &&
			this.props.router?.location?.search
		) {
			this.onHandlePath();
		}
	}

	onHandlePath = () => {
		const {
			location: { pathname, query },
		} = this.props.router;
		const { activeTab, userTabs } = this.state;
		const params = new URLSearchParams();
		params.set('id', query?.id);
		params.set('tab', activeTab);
		const updateParams = `${pathname}?${params?.toString()}`;
		if (userTabs?.includes(activeTab)) {
			window.history.replaceState(null, '', updateParams?.toString());
		}
	};

	getTiers = () => {
		requestTiers()
			.then((userTiers = {}) => {
				this.setState({ userTiers });
			})
			.catch((err) => {
				console.error(err);
			});
	};

	disableOTP = () => {
		const {
			userInformation = {},
			refreshData,
			setIsDisabledUser2fa,
		} = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};
		Modal.confirm({
			title: <div className="modal-confirm-title">Disable 2FA</div>,
			width: '450px',
			maskStyle: { background: 'rgba(0, 0, 0, 0.7)' },
			content: (
				<div>
					<div>
						Disabling 2FA on this account may leave this account vulnerable.
					</div>
					<div className="mt-3">
						Are you sure want to disable 2FA for this account?
					</div>
				</div>
			),
			onOk() {
				deactivateOtp(postValues)
					.then((res) => {
						refreshData({ otp_enabled: false });
					})
					.catch((err) => {
						const _error =
							err.data && err.data.message ? err.data.message : err.message;
						message.error(_error);
					});
				setIsDisabledUser2fa(false);
			},
			onCancel() {
				setIsDisabledUser2fa(false);
			},
		});
	};

	flagUser = (value) => {
		const {
			userInformation = {},
			refreshData,
			setIsActiveFlagUser = () => {},
		} = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
			flagged: value,
		};
		Modal.confirm({
			title: (
				<div>
					{value ? (
						<div className="modal-confirm-title">Flag user</div>
					) : (
						<div className="modal-confirm-title">Unflag user</div>
					)}
				</div>
			),
			width: '450px',
			maskStyle: { background: 'rgba(0, 0, 0, 0.7)' },
			content: (
				<div>
					{value
						? 'Are you sure want to flag this user?'
						: 'Are you sure want to unflag this user?'}
				</div>
			),
			onOk() {
				flagUser(postValues)
					.then((res) => {
						refreshData(postValues);
					})
					.catch((err) => {
						const _error =
							err.data && err.data.message ? err.data.message : err.message;
						message.error(_error);
					});
				setIsActiveFlagUser(false);
			},
			onCancel() {
				setIsActiveFlagUser(false);
			},
		});
	};

	freezeAccount = (value) => {
		const {
			userInformation = {},
			refreshData,
			setIsActiveFreezeUser,
		} = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
			activated: value,
		};
		Modal.confirm({
			title: (
				<div>
					{!value ? (
						<div className="modal-confirm-title">Freeze account</div>
					) : (
						<div className="modal-confirm-title">Unfreeze account</div>
					)}
				</div>
			),
			width: '450px',
			maskStyle: { background: 'rgba(0, 0, 0, 0.7)' },
			content: (
				<div>
					{!value ? (
						<div>
							Freezing this account will make this account inaccessible
							<div className="mt-3">
								Are you sure want to freeze this account?
							</div>
						</div>
					) : (
						<div className="mt-3">
							Are you sure want to unfreeze this account?
						</div>
					)}
				</div>
			),
			onOk() {
				activateUser(postValues)
					.then((res) => {
						refreshData(postValues);
					})
					.catch((err) => {
						const _error =
							err.data && err.data.message ? err.data.message : err.message;
						message.error(_error);
					});
				setIsActiveFreezeUser(false);
			},
			onCancel() {
				setIsActiveFreezeUser(false);
			},
		});
	};

	verifyUserEmail = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};

		verifyUser(postValues)
			.then((res) => {
				refreshData({ ...postValues, email_verified: true });
				this.setState({ showVerifyEmailModal: false });
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
		this.props.setIsEmailVerifiedUser(false);
	};

	handleRecoverUser = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};

		recoverUser(postValues)
			.then((res) => {
				refreshData({ ...postValues, activated: true });
				this.setState({ showRecoverModal: false });
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	handleDeleteUser = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};

		deleteUser(postValues)
			.then((res) => {
				refreshData({ ...postValues, activated: false });
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
		this.setState({ showDeleteModal: false });
		this.props.setIsActiveDeleteUser(false);
	};

	openVerifyEmailModal = () => {
		this.setState({
			showVerifyEmailModal: true,
		});
	};

	openRecoverUserModel = () => {
		this.setState({
			showRecoverModal: true,
		});
	};

	openDeleteUserModel = () => {
		this.setState({
			showDeleteModal: true,
		});
	};

	renderTabBar = (props, DefaultTabBar) => {
		if (this.props.isConfigure) return <div></div>;
		return <DefaultTabBar {...props} />;
	};

	onHandleTabChange = (value) => {
		this.setState({ activeTab: value });
	};

	onHandleCancel = (modalType = '') => {
		if (modalType === 'verifyEmailModal') {
			this.setState({ showVerifyEmailModal: false });
			this.props.setIsEmailVerifiedUser(false);
		} else if (modalType === 'deleteConfirmationModal') {
			this.setState({ showDeleteModal: false });
			this.props.setIsActiveDeleteUser(false);
		}
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
			isConfigure,
			showConfigure,
			kycPluginName,
			requestUserData,
			referral_history_config,
		} = this.props;

		const {
			showVerifyEmailModal,
			showRecoverModal,
			showDeleteModal,
			userTiers,
		} = this.state;

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
		// const pairs = Object.keys(coins) || [];
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
			<div className="app_container-content admin-user-content">
				<Breadcrumb>
					<Item>
						<Link to="/admin">Home</Link>
					</Item>
					<Item>
						<Link to="/admin/user">Users</Link>
					</Item>
					<Item
						onClick={() => {
							if (isConfigure) {
								showConfigure();
							}
						}}
					>
						<Link>User profile</Link>
					</Item>
					{isConfigure ? (
						<Item>
							<Link>Configure Meta</Link>
						</Item>
					) : null}
				</Breadcrumb>
				{!isConfigure ? (
					<div className="d-flex justify-content-between">
						<div className="d-flex align-items-center user-details">
							<ReactSVG
								src={STATIC_ICONS.USER_DETAILS_ICON}
								className="user-icon"
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
								className="green-btn"
							>
								Refresh
							</Button>
						</div>
					</div>
				) : null}
				<Tabs
					// tabBarExtraContent={<Button className="mr-3" onClick={clearData}>Back</Button>}
					renderTabBar={this.renderTabBar}
					activeKey={this.state.activeTab}
					onChange={this.onHandleTabChange}
				>
					<TabPane tab="About" key="about">
						<div>
							<AboutData
								user_id={userInformation.id}
								userData={userInformation}
								userImages={userImages}
								userTiers={userTiers}
								constants={constants}
								refreshData={refreshData}
								onChangeSuccess={onChangeUserDataSuccess}
								disableOTP={this.disableOTP}
								flagUser={this.flagUser}
								freezeAccount={this.freezeAccount}
								verifyEmail={this.openVerifyEmailModal}
								recoverUser={this.openRecoverUserModel}
								deleteUser={this.openDeleteUserModel}
								kycPluginName={kycPluginName}
								requestUserData={requestUserData}
								refreshAllData={refreshAllData}
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
					<TabPane tab="Payment Methods" key="payment_methods">
						<div>
							<PaymentMethods user={userInformation} />
						</div>
					</TabPane>
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Balance" key="balance">
							<UserBalance coins={coins} userData={userInformation} />
						</TabPane>
					)}
					{
						<TabPane tab="Orders" key="orders">
							<ActiveOrders userId={userInformation.id} />
						</TabPane>
					}
					{
						<TabPane tab="Trade history" key="trade">
							<TradeHistory userId={userInformation.id} />
						</TabPane>
					}
					{/* {isAdmin() && (
						<TabPane tab="Funding" key="deposit">
							<Balance user_id={id} pairs={pairs} />
						</TabPane>
					)} */}
					{
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
									type: 'deposit',
								}}
								hideUserColumn={true}
								showFilters={true}
							/>
						</TabPane>
					}
					{
						<TabPane tab="Withdrawal" key="withdrawals">
							<Transactions
								initialData={{
									user_id: id,
								}}
								queryParams={{
									type: 'withdrawal',
								}}
								hideUserColumn={true}
								showFilters={true}
							/>
						</TabPane>
					}
					<TabPane tab="Stakes" key="stakes">
						<UserStaking
							coins={this.props?.coins}
							isUserProfileStakeTab={true}
							selectedUserId={userInformation?.id}
						/>
					</TabPane>
					{
						<TabPane tab="Referrals" key="referrals">
							<Referrals
								userInformation={userInformation}
								referral_history_config={referral_history_config}
							/>
						</TabPane>
					}
					{
						<TabPane tab="Meta" key="meta">
							<UserMetaForm
								constants={constants}
								userData={userInformation}
								handleConfigure={showConfigure}
								isConfigure={isConfigure}
							/>
						</TabPane>
					}
				</Tabs>
				<VerifyEmailConfirmation
					visible={showVerifyEmailModal}
					onCancel={() => this.onHandleCancel('verifyEmailModal')}
					onConfirm={this.verifyUserEmail}
					userData={userInformation}
				/>
				<ActivationConfirmation
					visible={showRecoverModal}
					onCancel={() => this.setState({ showRecoverModal: false })}
					onConfirm={this.handleRecoverUser}
					userData={userInformation}
				/>
				<DeletionConfirmation
					visible={showDeleteModal}
					onCancel={() => this.onHandleCancel('deleteConfirmationModal')}
					onConfirm={this.handleDeleteUser}
					userData={userInformation}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	setIsActiveAddNewUsers: bindActionCreators(setIsActiveAddNewUsers, dispatch),
	setIsActiveDeleteUser: bindActionCreators(setIsActiveDeleteUser, dispatch),
	setIsActiveFreezeUser: bindActionCreators(setIsActiveFreezeUser, dispatch),
	setIsEmailVerifiedUser: bindActionCreators(setIsEmailVerifiedUser, dispatch),
	setIsDisabledUser2fa: bindActionCreators(setIsDisabledUser2fa, dispatch),
	setIsActiveFlagUser: bindActionCreators(setIsActiveFlagUser, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
