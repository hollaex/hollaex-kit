import React, { useEffect, useState } from 'react';
import { Button, Table, Select, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import { checkRole } from '../../../utils/token';
import {
	OperatorRole,
	RoleAccess,
	EditModal,
	RevokeRole,
	renderRoleImage,
} from './ModalForm';
import { requestRole, inviteOperator, updateRole, fetchRoles } from './action';
import { requestUsers } from '../Stakes/actions';
import _debounce from 'lodash/debounce';
import './index.css';
import '../Trades/index.css';
import '../../Admin/General/index.css';
import Role from './Roles';
import { handleUpgrade } from 'utils/utils';
import { Tabs } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { OtpForm } from 'components';
import { STATIC_ICONS } from 'config/icons';
const TabPane = Tabs.TabPane;

const getColumns = (handleEdit = () => {}) => [
	{
		title: 'Operator email',
		dataIndex: 'email',
	},
	{
		title: 'Color & Symbol',
		render: (data) => {
			return (
				<div className="operator-role-image">{renderRoleImage(data?.role)}</div>
			);
		},
	},
	{
		title: 'Description',
		render: (data) => {
			return <div>{data?.description}</div>;
		},
	},
	{
		title: 'Role',
		render: (data) => {
			return <div className="text-capitalize">{data?.role}</div>;
		},
	},
	{
		render: (data) => {
			if (checkRole() === 'admin') {
				return (
					<span className="admin-link" onClick={() => handleEdit(data)}>
						Edit
					</span>
				);
			}
		},
	},
];

const renderItems = () => {
	switch (checkRole()) {
		case 'supervisor':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Supervisor</span> can access all
						deposit, withdrawals and approval settings
					</div>
				</div>
			);
		case 'kyc':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">KYC</span> role can access some user
						data to review KYC requirements
					</div>
				</div>
			);
		case 'tech':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Communicator</span> can access to
						website direct editing for content management and communications
					</div>
				</div>
			);
		case 'support':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Support</span> can access some user
						information for user verification
					</div>
				</div>
			);
		case 'admin':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Administrator</span> can access all
						controls on the operator control panel
					</div>
				</div>
			);
		default:
			return <div></div>;
	}
};

const Roles = ({ constants, user }) => {
	const limit = 50;
	const [operatorList, setOperatorList] = useState([]);
	const [page, setPage] = useState(1);
	const [currentTablePage, setCurrentTablePage] = useState(1);
	const [isRemaining, setIsRemaining] = useState(true);
	const [editData, setData] = useState([]);
	const [modalType, setType] = useState('');
	const [isOpen, setOpen] = useState(false);
	const [buttonSubmitting, setButtonSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [roles, setRoles] = useState([]);
	const [selectedEmailData, setSelectedEmailData] = useState({});
	const [emailOptions, setEmailOptions] = useState([]);
	const [rolePayload, setRolePayload] = useState({});
	const [displayAssignRole, setDisplayAssignRole] = useState(false);
	const [otpDialogIsOpen, setOtpDialogIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('0');

	const isUpgrade = handleUpgrade(constants.info);
	const requestInitRole = (pageNo = 1) => {
		setIsLoading(true);
		requestRole({ pageNo, limit })
			.then((res) => {
				let temp = pageNo === 1 ? res.data : [...operatorList, ...res.data];
				setOperatorList(temp);
				setPage(pageNo);
				let currentPage = pageNo === 1 ? 1 : currentTablePage;
				setCurrentTablePage(currentPage);
				setIsRemaining(res.count > pageNo * limit);
				setIsLoading(false);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				setIsLoading(false);
			});
	};
	useEffect(() => {
		requestInitRole();
		fetchRoles()
			.then((response) => {
				const roleNames = response.data.map((role) => ({
					label: role.role_name,
					value: role.role_name,
					description: role?.description,
					permission: [...role?.permissions, ...role?.configs],
					color: role?.color,
				}));
				setRoles(roleNames);
				setRolePayload({
					role_id: roleNames[0]?.label,
					description: roleNames[0]?.description,
					permission: roleNames[0]?.permission,
					color: roleNames[0]?.color,
				});
			})
			.catch((err) => {
				message.error('Error fetching roles:', err);
			});

		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [displayAssignRole]);

	const handleInvite = (values) => {
		setButtonSubmitting(true);
		inviteOperator(values)
			.then((res) => {
				requestInitRole();
				handleClose();
				setButtonSubmitting(false);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				setButtonSubmitting(false);
			});
	};

	const handleUpdateRole = (formProps, user_id) => {
		const selectedRole =
			roles.find((role) => role?.value === formProps.role) || {};
		const { permission = '', description = '', color } = selectedRole;
		setButtonSubmitting(true);
		setRolePayload({
			role_id: formProps.role,
			user_id,
			description,
			permission,
			color,
		});
		updateRole({ otp_code: '', ...formProps }, { user_id })
			.then((res) => {
				requestInitRole();
				handleClose();
				setButtonSubmitting(false);
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				if (_error.toLowerCase().indexOf('otp') > -1) {
					setOtpDialogIsOpen(true);
				} else {
					message.error(_error);
				}
				setButtonSubmitting(false);
			});
	};

	const renderContent = (type, onTypeChange, isUpgrade) => {
		switch (type) {
			case 'operator-role':
				return (
					<OperatorRole
						handleInvite={handleInvite}
						isUpgrade={isUpgrade}
						buttonSubmitting={buttonSubmitting}
						roles={roles}
					/>
				);
			case 'role-access':
				return <RoleAccess handleClose={handleClose} isUpgrade={isUpgrade} />;
			case 'edit':
				return (
					<EditModal
						editData={editData}
						onTypeChange={onTypeChange}
						handleUpdateRole={handleUpdateRole}
						roles={roles}
					/>
				);
			case 'revoke-role':
				return (
					<RevokeRole
						editData={editData}
						handleClose={handleClose}
						handleUpdateRole={handleUpdateRole}
						buttonSubmitting={buttonSubmitting}
					/>
				);
			default:
				return <div></div>;
		}
	};
	// eslint-disable-next-line
	const handleAdd = () => {
		setOpen(true);
		setType('operator-role');
	};

	const handleRoleAccess = () => {
		setOpen(true);
		setType('role-access');
	};

	const handleEdit = (data) => {
		setOpen(true);
		setType('edit');
		setData(data);
		setRolePayload({
			role_id: data?.role,
			description: data?.description,
			permission: data?.permission,
			color: data?.color,
		});
	};

	const handleClose = () => {
		setOpen(false);
		setType('');
		setData({});
	};

	const onTypeChange = (type) => {
		setType(type);
	};

	const pageChange = (count, pageSize) => {
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestInitRole(page + 1);
		}
		setCurrentTablePage(count);
	};
	const handleEmailChange = (value) => {
		let emailId = parseInt(value);
		let emailData = {};
		emailOptions &&
			emailOptions.forEach((item) => {
				if (item.value === emailId) {
					emailData = item;
				}
			});
		setSelectedEmailData(emailData);
		setRolePayload({
			...rolePayload,
			user_id: emailData.value,
		});
		handleSearch(emailData.label);
	};

	const getAllUserData = async (params = {}) => {
		try {
			const res = await requestUsers(params);
			if (res && res.data) {
				const userData = res.data.map((user) => ({
					label: user.email,
					value: user.id,
				}));
				setEmailOptions(userData);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	const searchUser = (searchText, type) => {
		getAllUserData({ search: searchText }, type);
	};

	const onSubmitRoleOtp = async (values) => {
		try {
			await updateRole(
				{
					role: rolePayload.role_id || rolePayload.role,
					otp_code: values.otp_code,
				},
				{ user_id: rolePayload.user_id }
			);
			setRolePayload({});
			setDisplayAssignRole(false);
			requestInitRole();
			setOtpDialogIsOpen(false);
			handleClose();
			setButtonSubmitting(false);
			message.success('Changes Saved.');
		} catch (err) {
			const _error =
				err.data && err.data.message ? err.data.message : err.message;

			message.error(_error);
		}
	};
	const handleSearch = _debounce(searchUser, 1000);

	const onHandleTabChange = (tab) => {
		setActiveTab(tab);
	};

	const roleDetails = roles.reduce(
		(acc, { value, description, color, permission }) => ({
			...acc,
			[value]: { description, permission, color },
		}),
		{}
	);

	const filteredDetails = operatorList.map((data) => ({
		...data,
		description: roleDetails[data?.role]?.description || '',
		permission: roleDetails[data?.role]?.permission || [],
		color: roleDetails[data?.role]?.color || '',
	}));

	const roleStyles = {
		admin: {
			cardWrapper: 'operator-card-wrapper admin-operator-card-wrapper',
			rolesImage: STATIC_ICONS.ADMIN_ROLE,
		},
		supervisor: {
			cardWrapper: 'supervisor-operator-card-wrapper operator-card-wrapper',
			rolesImage: STATIC_ICONS.SUPERVISOR_ROLE,
		},
		kyc: {
			cardWrapper: 'operator-card-wrapper kyc-operator-card-wrapper',
			rolesImage: STATIC_ICONS.KYC_ROLE,
		},
		support: {
			cardWrapper: 'support-operator-card-wrapper operator-card-wrapper',
			rolesImage: STATIC_ICONS.SUPPORT_ROLE,
		},
		communicator: {
			cardWrapper: 'communication-operator-card-wrapper operator-card-wrapper',
			rolesImage: STATIC_ICONS.SUPPORT_COMMUNICATION_ROLE,
		},
		'Customize a Role': {
			cardWrapper: 'customize-role-operator-card-wrapper operator-card-wrapper',
		},
		default: {
			cardWrapper: 'operator-card-wrapper',
			rolesImage: STATIC_ICONS.OPERATOR_ROLES,
		},
	};

	const onHandleRoleSelect = (selectedRolr) => {
		const filteredRole = roles.find(
			(role) => role?.value?.toLowerCase() === selectedRolr?.toLowerCase()
		);
		if (filteredRole) {
			const { description = '', permission = '', color } = filteredRole;
			setRolePayload({
				role_id: selectedRolr,
				description,
				permission,
				color,
			});
		}
	};

	const isColorDark = (hexColor) => {
		if (hexColor) {
			const hex = hexColor?.replace('#', '');

			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);

			const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

			// If luminance < 0.5, it's dark
			return luminance < 0.5;
		}
		return true;
	};

	return (
		<Tabs
			defaultActiveKey="0"
			style={{ width: '100%' }}
			activeKey={activeTab}
			onChange={onHandleTabChange}
		>
			<TabPane tab="Operator" key="0">
				<div
					style={{ maxHeight: '70vh', overflowY: 'auto' }}
					className="admin-roles-wrapper w-100 my-4"
				>
					<div className="d-flex justify-content-between">
						<div>
							<h3>Designate operator roles</h3>
							<div className="description">
								Invite other exchange operators and specify their roles to help
								manage exchange.
							</div>
						</div>
						<div>
							<Button
								type="primary"
								className="green-btn no-border"
								onClick={() => {
									setDisplayAssignRole(true);
								}}
							>
								Add operator
							</Button>
						</div>
					</div>
					<div className="d-flex my-4">
						<div>{renderRoleImage()}</div>
						<div className="ml-4">
							<div>{renderItems()}</div>
							<div className="sub-title">Role types:</div>
							<div className="mt-4">
								<div className="description text-nowrap">
									<span className="sub-title">1. Administrator</span> can access
									all areas. Coin creation, minting & burning, trading pair and
									designate operator roles
								</div>
								<div className="description text-nowrap">
									<span className="sub-title">2. Supervisor</span> can access
									all deposit, withdrawals and approval settings
								</div>
								<div className="description text-nowrap">
									<span className="sub-title">3. KYC</span> role can access some
									user data to review KYC requirements
								</div>
								<div className="description text-nowrap">
									<span className="sub-title">4. Communications</span> can
									access to website direct editing for content management and
									communications
								</div>
								<div className="description text-nowrap">
									<span className="sub-title">5. Support</span> can access some
									user information for user verification
								</div>
							</div>
							<div className="description mt-4">
								Learn more about{' '}
								<span className="pointer admin-link" onClick={handleRoleAccess}>
									operator role access.
								</span>
							</div>
						</div>
					</div>
					<div className="table-wrapper">
						<Table
							columns={getColumns(handleEdit)}
							dataSource={filteredDetails}
							rowKey={(data) => {
								return data.id;
							}}
							pagination={{
								current: currentTablePage,
								onChange: pageChange,
							}}
							loading={isLoading}
							className="exchange-operator-role-details"
						/>
					</div>
					{displayAssignRole && (
						<Modal
							maskClosable={false}
							closeIcon={<CloseOutlined style={{ color: 'white' }} />}
							bodyStyle={{
								backgroundColor: '#27339D',
								marginTop: 60,
							}}
							visible={displayAssignRole}
							footer={null}
							onCancel={() => {
								setDisplayAssignRole(false);
							}}
							wrapClassName="assign-role-popup-wrapper"
						>
							<h2 className="assign-role-title">Add Operator</h2>
							<div className="assign-role-title">
								Select the role you’d like to assign and enter the new team
								member's email address.
							</div>
							{!user.otp_enabled && (
								<div className="authentication-wrapper mb-3">
									<div>
										<p>
											<WarningOutlined />
										</p>
										<p>
											To assign roles, you need to enable the 2-factor
											authentication.
										</p>
									</div>
									<Link to="/security">Enable 2FA</Link>
								</div>
							)}
							{user.otp_enabled && (
								<div className="mt-1 mb-3">
									<div className="mb-1">
										<div className="mb-1">Role</div>
										<Select
											onChange={(value) => onHandleRoleSelect(value)}
											value={rolePayload?.role_id}
											placeholder="Select Role Type"
											className="w-100"
											dropdownClassName="select-roles-dropdown"
										>
											{roles.map((role) => (
												<Select.Option value={role.value}>
													{role.label}
												</Select.Option>
											))}
										</Select>
									</div>
									<div className="operator-card-wrapper">
										{rolePayload && (
											<div
												className={
													rolePayload?.color && isColorDark(rolePayload?.color)
														? 'operator-role-card operator-control-card-light'
														: roleStyles[rolePayload?.role_id]
														? `operator-role-card ${
																roleStyles[rolePayload?.role_id]?.cardWrapper
														  }`
														: 'operator-role-card operator-control-card-dark'
												}
												style={{ backgroundColor: rolePayload?.color }}
											>
												<div className="operator-role-card-details">
													<p className="font-weight-bold">
														{rolePayload?.role_id?.toUpperCase()}
													</p>
													<p className="role-description">
														{rolePayload?.description}
													</p>
												</div>
												{rolePayload?.role_id &&
													renderRoleImage('', rolePayload?.role_id)}
											</div>
										)}
										<div>
											<p>Permissions: {rolePayload?.permission?.length || 0}</p>
											<p
												className="text-decoration-underline pointer"
												onClick={() => {
													onHandleTabChange('1');
													setDisplayAssignRole(false);
												}}
											>
												OPEN THE ROLES PAGE
											</p>
										</div>
									</div>
									<div className="mb-1">
										<div className="mb-2">Email</div>
										<div className="d-flex align-items-center">
											<Select
												showSearch
												placeholder="user@exchange.com"
												className="user-search-field w-100"
												onSearch={(text) => handleSearch(text)}
												filterOption={() => true}
												value={selectedEmailData && selectedEmailData.label}
												onChange={(text) => handleEmailChange(text)}
												showAction={['focus', 'click']}
												dropdownClassName="select-roles-dropdown"
											>
												{emailOptions &&
													emailOptions.map((email) => (
														<Select.Option key={email.value}>
															{email.label}
														</Select.Option>
													))}
											</Select>
										</div>
									</div>
								</div>
							)}

							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									gap: 15,
									justifyContent: 'space-between',
								}}
							>
								<Button
									onClick={() => {
										setRolePayload({});
										setDisplayAssignRole(false);
									}}
									style={{
										backgroundColor: '#288500',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
									className="no-border"
								>
									Back
								</Button>
								<Button
									onClick={async () => {
										try {
											if (!rolePayload.user_id || !rolePayload.role_id) {
												message.error('Please select all the inputs');
												return;
											}
											await updateRole(
												{ role: rolePayload.role_id, otp_code: '' },
												{ user_id: rolePayload.user_id }
											);
											setRolePayload({});
											setDisplayAssignRole(false);
											requestInitRole();
											message.success('Role Assigned');
										} catch (err) {
											const _error =
												err.data && err.data.message
													? err.data.message
													: err.message;
											if (_error.toLowerCase().indexOf('otp') > -1) {
												setOtpDialogIsOpen(true);
											} else {
												message.error(_error);
											}
										}
									}}
									style={{
										backgroundColor: '#288500',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
									disabled={!user.otp_enabled}
									className="no-border"
								>
									Proceed
								</Button>
							</div>
						</Modal>
					)}
					{otpDialogIsOpen && (
						<Modal
							maskClosable={false}
							closeIcon={<CloseOutlined style={{ color: 'white' }} />}
							bodyStyle={{
								backgroundColor: '#27339D',
								marginTop: 60,
							}}
							visible={otpDialogIsOpen}
							footer={null}
							onCancel={() => {
								setOtpDialogIsOpen(false);
							}}
						>
							<OtpForm onSubmit={onSubmitRoleOtp} />
						</Modal>
					)}
					<Modal
						visible={isOpen}
						footer={null}
						onCancel={handleClose}
						width={
							modalType === 'role-access'
								? 600
								: modalType === 'operator-role'
								? 500
								: 350
						}
					>
						{renderContent(modalType, onTypeChange, isUpgrade)}
					</Modal>
				</div>
			</TabPane>

			<TabPane tab="Roles" key="1">
				<Role
					constants={constants}
					onHandleTabChange={onHandleTabChange}
					isColorDark={isColorDark}
					user={user}
				/>
			</TabPane>
		</Tabs>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	user: state.user,
});

export default connect(mapStateToProps)(Roles);
