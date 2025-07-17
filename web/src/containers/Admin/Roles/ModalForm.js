import React, { useState } from 'react';
import { browserHistory } from 'react-router';
import { ReactSVG } from 'react-svg';
import { Button, Form, Select, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import { AdminHocForm } from '../../../components';
import { checkRole } from '../../../utils/token';
import { onHandleBadge } from './RoleManagement';

// const OperatorRoleFrom = AdminHocForm('OperatorRoleFrom');
const EditOperatorFrom = AdminHocForm('EditOperatorFrom');

const { Item } = Form;

export const getRoleType = (data) => {
	return data.role;
};

export const renderRoleImage = (
	className = 'role-icon',
	type = checkRole()
) => {
	switch (type) {
		case 'supervisor':
			return (
				<ReactSVG
					src={STATIC_ICONS.SUPERVISOR_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		case 'kyc':
			return (
				<ReactSVG
					src={STATIC_ICONS.KYC_ROLE}
					className={`${className} admin-role-icon`}
					alt="role-icon"
				/>
			);
		case 'communicator':
			return (
				<ReactSVG
					src={STATIC_ICONS.SUPPORT_COMMUNICATION_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		case 'support':
			return (
				<ReactSVG
					src={STATIC_ICONS.SUPPORT_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		case 'admin':
			return (
				<ReactSVG
					src={STATIC_ICONS.ADMIN_ROLE}
					className={`${className} admin-role-icon`}
					alt="role-icon"
				/>
			);
		case 'auditor':
			return (
				<ReactSVG
					src={STATIC_ICONS.AUDITOR_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		case 'announcer':
			return (
				<ReactSVG
					src={STATIC_ICONS.ANNOUNCER_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		case 'manager':
			return (
				<ReactSVG
					src={STATIC_ICONS.MANAGER_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		default:
			return (
				<ReactSVG
					src={onHandleBadge(type) || STATIC_ICONS.BLUE_SCREEN_EYE_ICON}
					className={className}
					alt="role-icon"
				/>
			);
	}
};

export const renderUpgrade = () => {
	return (
		<div className="d-flex align-items-center justify-content-center">
			<div className="d-flex align-items-center justify-content-between upgrade-section mt-5 mb-4">
				<div>
					<div className="font-weight-bold">Team management</div>
					<div>Invite more people to specific team roles</div>
				</div>
				<div className="ml-5 button-wrapper">
					<a
						href="https://dash.hollaex.com/billing"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button type="primary" className="w-100">
							Upgrade Now
						</Button>
					</a>
				</div>
			</div>
		</div>
	);
};

export const OperatorRole = ({
	handleInvite,
	isUpgrade,
	buttonSubmitting,
	roles,
}) => {
	const [selectedRole, setRole] = useState(roles[0].value);

	const handleSelect = (values) => {
		setRole(values);
	};

	const handleSubmitOperator = (values) => {
		const roleData = selectedRole;
		values.role = roleData;
		handleInvite(values);
	};

	return (
		<div className="admin-roles-wrapper">
			<h3>Add operator</h3>
			<Form name="OperatorRoleFrom" onFinish={handleSubmitOperator}>
				<div className="interface-box mb-5">
					<div className="sub-title">Role</div>
					<Item name="role">
						<Select
							defaultValue={roles[0].value}
							onChange={handleSelect}
							size="small"
							value={selectedRole}
						>
							{roles.map((option, index) => (
								<Select.Option key={index} value={option.value}>
									{option.label}
								</Select.Option>
							))}
						</Select>
					</Item>
					{isUpgrade ? renderUpgrade() : null}
					<div className={isUpgrade ? 'disable-area' : ''}>
						<div className="sub-title mt-5">email</div>
						<Item
							name="email"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input />
						</Item>
					</div>
				</div>
				<div className={isUpgrade ? 'disable-area' : ''}>
					<Button
						type="primary"
						htmlType="submit"
						className="green-btn w-100 no-border"
						disabled={buttonSubmitting}
					>
						Save
					</Button>
				</div>
			</Form>
			{/* <OperatorRoleFrom
				onSubmit={handleSubmitOperator}
				initialValues={{ role: OPERATORS[0].value }}
				buttonText={'Save'}
				buttonClass="green-btn mt-2"
				fields={operatorFields.section_1}
			/> */}
		</div>
	);
};

export const EditModal = ({
	onTypeChange,
	handleUpdateRole,
	editData,
	roles,
	user,
	handleClose,
}) => {
	const handleSubmitEdit = (values) => {
		handleUpdateRole(values, editData.id);
	};

	return (
		<>
			{user?.otp_enabled ? (
				<div className="admin-roles-wrapper">
					<h3>Edit operator role</h3>
					<div className="d-flex align-items-center my-3">
						{renderRoleImage('edit-role-icon', getRoleType(editData))}
						<div className="ml-3">{editData.email}</div>
					</div>
					<EditOperatorFrom
						onSubmit={handleSubmitEdit}
						initialValues={{
							email: editData.email,
							role: getRoleType(editData),
						}}
						buttonText={'Save'}
						buttonClass="green-btn mini-btn mt-2 no-border"
						fields={{
							role: {
								type: 'select',
								label: 'Change roles',
								options: roles,
								value: getRoleType(editData),
							},
						}}
					/>
					<div className="divider"></div>
					<div>Revoke role from operator</div>
					<div className="mt-2">
						<Button
							type="primary"
							className="revoke-btn no-border"
							onClick={() => onTypeChange('revoke-role')}
						>
							Revoke role
						</Button>
					</div>
				</div>
			) : (
				<div className="warning-verification-popup-details">
					<span className="heading-text font-weight-bold">Enable 2FA</span>
					<div className="warning-message-wrapper mt-3 mb-4">
						<ExclamationCircleOutlined />
						<span>
							To edit a role, you need to enable 2FA (two-factor authentication)
							first.
						</span>
					</div>
					<span>
						Click here to{' '}
						<span
							className="text-decoration-underline pointer"
							onClick={() => browserHistory.push('/security')}
						>
							enable 2FA
						</span>
					</span>
					<div className="d-flex justify-content-center mt-4">
						<Button
							className="w-50 green-btn no-border"
							type="primary"
							onClick={() => handleClose()}
						>
							Close
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export const RevokeRole = ({
	editData,
	handleClose,
	handleUpdateRole,
	buttonSubmitting,
}) => {
	const handleRevoke = () => {
		handleUpdateRole(
			{
				email: editData.email,
				role: 'user',
			},
			editData.id
		);
	};
	return (
		<div className="admin-roles-wrapper">
			<h3>Revoke role</h3>
			<div>
				{`Are you sure you want to revoke this role from ${editData.email}?`}
			</div>
			<div className="d-flex mt-3">
				<Button
					type="primary"
					className="green-btn w-50 no-border"
					onClick={handleClose}
				>
					Exit
				</Button>
				<Button
					type="primary"
					className="revoke-btn ml-3 w-50 no-border"
					onClick={handleRevoke}
					disabled={buttonSubmitting}
				>
					Revoke
				</Button>
			</div>
		</div>
	);
};
