import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button, Table, Select, Modal, message } from 'antd';
import { Tabs, Input } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';
import _debounce from 'lodash/debounce';

import { checkRole } from '../../../utils/token';
import {
	OperatorRole,
	EditModal,
	RevokeRole,
	renderRoleImage,
} from './ModalForm';
import { requestRole, inviteOperator, updateRole, fetchRoles } from './action';
import { requestUsers } from '../Stakes/actions';
import { handleUpgrade } from 'utils/utils';
import { OtpForm } from 'components';
import { onHandleBadge, roleStyles } from './RoleManagement';
import { setRolesList } from 'actions/appActions';
import { isColorDark } from './Utils';
import './index.css';
import '../Trades/index.css';
import '../../Admin/General/index.css';
import Role from './Roles';
const TabPane = Tabs.TabPane;

const getColumns = (handleEdit = () => {}, isColorDark = () => {}) => [
	{
		title: 'Operator email',
		dataIndex: 'email',
	},
	{
		title: 'Color & Symbol',
		render: (data) => {
			const roleStyle = roleStyles[data?.role?.toLowerCase()] || {};
			const isDark = isColorDark(data?.color);
			const roleClassWrapper = isDark
				? `${
						roleStyle?.cardWrapper || ''
				  } operator-role-image operator-control-card-light`
				: `${
						roleStyle?.cardWrapper || ''
				  } operator-role-image operator-control-card-dark`;
			return (
				<div
					className={roleClassWrapper}
					style={{ backgroundColor: data?.color }}
				>
					<ReactSVG
						src={roleStyle?.rolesImage || onHandleBadge(data?.role)}
						className="role-badge"
					/>
				</div>
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

const renderItems = (filteredRoles) => {
	const currentRole =
		filteredRoles?.find(
			(data) => data?.label?.toLowerCase() === checkRole()?.toLowerCase()
		) || {};

	// switch (checkRole()) {
	// 	case 'supervisor':
	// 		return (
	// 			<div>
	// 				<div className="sub-title">Your current role:</div>
	// 				<div className="description">
	// 					<span className="sub-title">Supervisor</span> can access all
	// 					deposit, withdrawals and approval settings
	// 				</div>
	// 			</div>
	// 		);
	// 	case 'kyc':
	// 		return (
	// 			<div>
	// 				<div className="sub-title">Your current role:</div>
	// 				<div className="description">
	// 					<span className="sub-title">KYC</span> role can access some user
	// 					data to review KYC requirements
	// 				</div>
	// 			</div>
	// 		);
	// 	case 'tech':
	// 		return (
	// 			<div>
	// 				<div className="sub-title">Your current role:</div>
	// 				<div className="description">
	// 					<span className="sub-title">Communicator</span> can access to
	// 					website direct editing for content management and communications
	// 				</div>
	// 			</div>
	// 		);
	// 	case 'support':
	// 		return (
	// 			<div>
	// 				<div className="sub-title">Your current role:</div>
	// 				<div className="description">
	// 					<span className="sub-title">Support</span> can access some user
	// 					information for user verification
	// 				</div>
	// 			</div>
	// 		);
	// 	case 'admin':
	// 		return (
	// 			<div>
	// 				<div className="sub-title">Your current role:</div>
	// 				<div className="description">
	// 					<span className="sub-title">Administrator</span> can access all
	// 					controls on the operator control panel
	// 				</div>
	// 			</div>
	// 		);
	// 	default:
	// 		return (
	// 			<div>
	// 				<div className="sub-title">Your current role:</div>
	// 				<div className="description">
	// 					<span className="sub-title text-capitalize">{checkRole()}</span>
	// 				</div>
	// 			</div>)
	// }

	return (
		<div>
			<div className="sub-title">Your current role:</div>
			<div className="description">
				<span className="sub-title text-capitalize">{currentRole?.label}</span>{' '}
				{currentRole?.description}
			</div>
		</div>
	);
};

const Roles = ({ constants, user, coins, setRolesList }) => {
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
	const [userEmail, setUserEmail] = useState();

	const isUpgrade = handleUpgrade(constants.info);
	const requestInitRole = async (pageNo = 1, email = null) => {
		setIsLoading(true);
		try {
			const res = await requestRole({ page: pageNo, limit, email });
			let temp = pageNo === 1 ? res.data : [...operatorList, ...res.data];
			setOperatorList(temp);
			setPage(pageNo);
			let currentPage = pageNo === 1 ? 1 : currentTablePage;
			setCurrentTablePage(currentPage);
			setIsRemaining(res.count > pageNo * limit);
		} catch (err) {
			let error = err && err.data ? err.data.message : err.message;
			message.error(error);
		}
		setIsLoading(false);
	};
	useEffect(() => {
		setUserEmail(null);
		if (activeTab === '0') {
			handleSearch('');
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
					setRolesList(response?.data);
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
		}
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

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
			case 'edit':
				return (
					<EditModal
						editData={editData}
						onTypeChange={onTypeChange}
						handleUpdateRole={handleUpdateRole}
						roles={roles}
						user={user}
						handleClose={handleClose}
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

	const searchUser = (searchText = '', type) => {
		getAllUserData({ search: searchText }, type);
	};

	const onSubmitRoleOtp = async (values) => {
		setSelectedEmailData({});
		handleSearch('');
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

	const onHandleRoleSelect = (selectedRolr) => {
		const filteredRole = roles.find(
			(role) => role?.value?.toLowerCase() === selectedRolr?.toLowerCase()
		);
		if (filteredRole) {
			const { description = '', permission = '', color } = filteredRole;
			setRolePayload({
				...rolePayload,
				role_id: selectedRolr,
				description,
				permission,
				color,
			});
		}
	};

	const filteredRoles = roles?.sort((a, b) => {
		const roleOrder = Object.keys(roleStyles);
		const indexA =
			roleOrder?.indexOf(a?.label) !== -1
				? roleOrder?.indexOf(a?.label)
				: roleOrder?.length;
		const indexB =
			roleOrder?.indexOf(b?.label) !== -1
				? roleOrder?.indexOf(b?.label)
				: roleOrder?.length;

		return indexA - indexB || a?.label?.localeCompare(b?.label);
	});

	const onHandleAddOperator = () => {
		setDisplayAssignRole(true);
		setRolePayload({
			role_id: roles[0]?.label,
			description: roles[0]?.description,
			permission: roles[0]?.permission,
			color: roles[0]?.color,
		});
	};

	const onCloseAddOperator = () => {
		setDisplayAssignRole(false);
		setSelectedEmailData({});
		handleSearch('');
		setRolePayload({});
	};

	return (
		<div className="admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={onHandleTabChange}
				// className='w-100'
			>
				<TabPane tab="Operator" key="0">
					<div className="admin-roles-wrapper admin-roles-wrapper-container w-100 my-4">
						<div className="d-flex justify-content-between">
							<div>
								<h3>Designate operator roles</h3>
								<div className="description">
									Invite other exchange operators and specify their roles to
									help manage exchange.
								</div>
							</div>
							<div>
								<Button
									type="primary"
									className="green-btn no-border"
									onClick={() => onHandleAddOperator()}
								>
									Add operator
								</Button>
							</div>
						</div>
						<div className="d-flex align-items-start my-4">
							<div>{renderRoleImage()}</div>
							<div className="ml-4">
								<div>{renderItems(filteredRoles)}</div>
								<div className="sub-title">Role types:</div>
								<div className="mt-2">
									<ol className="role-lists">
										{filteredRoles?.map((role, index) => {
											const description = role?.description?.replace(
												/(<([^>]+)>)/gi,
												' '
											);
											const roleDescription =
												description?.length > 60
													? description?.substring(0, 60)?.trim() + '...'
													: description;
											return (
												<li className="font-weight-bold" key={index}>
													<span className="text-capitalize">
														{role?.label}:{' '}
													</span>
													<span className="font-weight-normal">
														{roleDescription}
													</span>
												</li>
											);
										})}
									</ol>
									{/* <div className="description text-nowrap">
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
								</div> */}
								</div>
								<div className="description mt-2">
									Learn more about{' '}
									<span
										className="pointer admin-link"
										onClick={() => setActiveTab('1')}
									>
										operator role access.
									</span>
								</div>
							</div>
						</div>
						<div className="search-field-wrapper">
							<div>Search user</div>
							<div className="operator-search-field">
								<Input
									placeholder="Search User Email"
									onChange={(e) => {
										setUserEmail(e.target.value);
									}}
									value={userEmail}
								/>
								<Button
									onClick={() => {
										requestInitRole(1, userEmail);
									}}
									type="default"
									className="green-btn no-border"
								>
									Apply
								</Button>
							</div>
						</div>
						<div className="table-wrapper">
							<Table
								columns={getColumns(handleEdit, isColorDark)}
								dataSource={!isLoading && filteredDetails}
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
								closeIcon={<CloseOutlined />}
								visible={displayAssignRole}
								footer={null}
								onCancel={() => onCloseAddOperator()}
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
												{roles?.map((role, index) => (
													<Select.Option value={role?.value} key={index}>
														{role.label}
													</Select.Option>
												))}
											</Select>
										</div>
										<div className="operator-card-wrapper">
											{rolePayload && (
												<div
													className={
														isColorDark(rolePayload?.color)
															? `operator-role-card operator-control-card-light ${
																	roleStyles[rolePayload?.role_id]?.cardWrapper
															  }`
															: `operator-role-card operator-control-card-dark ${
																	roleStyles[rolePayload?.role_id]?.cardWrapper
															  }`
													}
													style={{ backgroundColor: rolePayload?.color }}
												>
													<div className="operator-role-card-details">
														<p className="font-weight-bold role-name">
															{rolePayload?.role_id?.toUpperCase()}
														</p>
														<p className="role-description caps">
															{rolePayload?.description}
														</p>
													</div>
													<ReactSVG
														src={
															roleStyles[rolePayload?.role_id?.toLowerCase()]
																?.rolesImage ||
															onHandleBadge(rolePayload?.role_id)
														}
														className="role-badge"
													/>
												</div>
											)}
											<div>
												<p>
													PERMISSIONS: {rolePayload?.permission?.length || 0}
												</p>
												<p
													className="text-decoration-underline pointer"
													onClick={() => {
														onHandleTabChange('1');
														onCloseAddOperator();
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

								<div className="button-container">
									<Button
										onClick={() => onCloseAddOperator()}
										type="default"
										className="green-btn no-border w-50"
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
										type="default"
										disabled={!user.otp_enabled}
										className="green-btn no-border w-50"
									>
										Proceed
									</Button>
								</div>
							</Modal>
						)}
						{otpDialogIsOpen && (
							<Modal
								maskClosable={false}
								closeIcon={<CloseOutlined />}
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
								!user?.otp_enabled
									? 400
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
						coins={coins}
						setRolesList={setRolesList}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	user: state.user,
	coins: state.app.coins,
});

const mapDispatchToProps = (dispatch) => ({
	setRolesList: bindActionCreators(setRolesList, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
