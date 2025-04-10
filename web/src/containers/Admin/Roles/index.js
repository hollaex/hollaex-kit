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

const TabPane = Tabs.TabPane;

const getColumns = (handleEdit = () => {}) => [
	{
		title: 'Operator email',
		dataIndex: 'email',
	},
	{
		title: 'Role',
		render: (data) => {
			return <div>{data.role}</div>;
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

const Roles = ({ constants }) => {
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
				}));
				setRoles(roleNames);
			})
			.catch((err) => {
				message.error('Error fetching roles:', err);
			});

		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		setButtonSubmitting(true);
		updateRole(formProps, { user_id })
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

	const handleSearch = _debounce(searchUser, 1000);
	return (
		<Tabs defaultActiveKey="0" style={{ width: '100%' }}>
			<TabPane tab="Operator" key="0">
				<div className="admin-roles-wrapper w-100 my-4">
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
								className="green-btn"
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
							dataSource={operatorList}
							rowKey={(data) => {
								return data.id;
							}}
							pagination={{
								current: currentTablePage,
								onChange: pageChange,
							}}
							loading={isLoading}
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
						>
							<h2 style={{ fontWeight: '600', color: 'white' }}>
								Assign a role to user
							</h2>
							<div style={{ fontWeight: '400', color: 'white' }}>
								You can assign roles to users below
							</div>
							<div style={{ marginBottom: 30, marginTop: 10 }}>
								<div style={{ marginBottom: 10 }}>
									<div className="mb-2">User</div>
									<div className="d-flex align-items-center">
										<Select
											showSearch
											placeholder="user@exchange.com"
											className="user-search-field"
											onSearch={(text) => handleSearch(text)}
											filterOption={() => true}
											style={{ width: '100%' }}
											value={selectedEmailData && selectedEmailData.label}
											onChange={(text) => handleEmailChange(text)}
											showAction={['focus', 'click']}
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

								<div style={{ marginBottom: 10 }}>
									<div className="mb-1">Role</div>
									<Select
										onChange={(value) =>
											setRolePayload({
												...rolePayload,
												role_id: value,
											})
										}
										value={rolePayload?.role_id}
										style={{ width: '100%' }}
										placeholder="Select Role Type"
									>
										{roles.map((role) => (
											<Select.Option value={role.value}>
												{role.label}
											</Select.Option>
										))}
									</Select>
								</div>
							</div>

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
												{ role: rolePayload.role_id },
												{ user_id: rolePayload.user_id }
											);
											setRolePayload({});
											setDisplayAssignRole(false);
											requestInitRole();
											message.success('Role Assigned');
										} catch (error) {
											let errMsg = '';
											if (error.response) {
												errMsg = error.response.data.message;
											} else {
												errMsg = error.message;
											}
											message.error(errMsg);
										}
									}}
									style={{
										backgroundColor: '#288500',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									Proceed
								</Button>
							</div>
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
				<Role constants={constants} />
			</TabPane>
		</Tabs>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

export default connect(mapStateToProps)(Roles);
