import React, { useState } from 'react';
import { Button, Modal, Select, message } from 'antd';
import _debounce from 'lodash/debounce';
import { CloseOutlined } from '@ant-design/icons';

import RoleManagement from './RoleManagement';
import { requestUsers } from '../Stakes/actions';
// eslint-disable-next-line
import { assignRole, fetchRoles } from './action';
const Role = ({ constants }) => {
	const [selectedEmailData, setSelectedEmailData] = useState({});
	const [emailOptions, setEmailOptions] = useState([]);
	const [rolePayload, setRolePayload] = useState({});
	const [displayAssignRole, setDisplayAssignRole] = useState(false);
	// eslint-disable-next-line
	const [roles, setRoles] = useState([]);

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
		<div style={{ height: '70vh', overflowY: 'auto' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<div style={{ color: 'white', fontSize: 20 }}>
						Role permissions & customizations
					</div>
					<div style={{ color: '#ccc', marginTop: 10 }}>
						Degisn a custom-fit role that seamlessly integrates into your team,
						with permissions tailored to match your unique requirements
					</div>
				</div>
				<div>
					{/* <Button
						onClick={() => {
							fetchRoles()
								.then((response) => {
									const transformedRoles = response.data.map((role) => {
										return { value: role.id, label: role.role_name };
									});
									setRoles(transformedRoles);
								})
								.catch((err) => {
									message.error('Error fetching roles:', err);
								});
							setDisplayAssignRole(true);
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
							marginRight: 10,
						}}
						type="default"
					>
						Assign Role to Users
					</Button> */}
				</div>
			</div>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ marginLeft: 15, marginTop: 10 }}>
					<div style={{ marginBottom: 5 }}>
						To complete your team structure, simply add your team and assign a
						role to the appropriate operator here.
					</div>
					<div>
						(Only the Admin and Enterprise platforms can edit permissions and
						creatae new roles.)
					</div>
				</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'row', marginTop: 50 }}>
				<RoleManagement constants={constants} />
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
									<Select.Option value={role.value}>{role.label}</Select.Option>
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
									await assignRole(rolePayload);
									setRolePayload({});
									setDisplayAssignRole(false);
									message.success('Role Assigned');
								} catch (error) {
									message.error(error.response.data.message);
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
		</div>
	);
};

export default Role;
