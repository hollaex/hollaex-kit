import React, { useState } from 'react';
import { Button, Form, Select, Input } from 'antd';
import classnames from 'classnames';

import { OPERATORS, getOperatorFields } from './Utils';
import { STATIC_ICONS } from 'config/icons';
import { AdminHocForm } from '../../../components';
import { checkRole } from '../../../utils/token';

// const OperatorRoleFrom = AdminHocForm('OperatorRoleFrom');
const EditOperatorFrom = AdminHocForm('EditOperatorFrom');

const { Item } = Form;

const operatorFields = getOperatorFields();

export const getRoleType = (data) => {
	if (data.is_admin) {
		return 'admin';
	} else if (data.is_communicator) {
		return 'communicator';
	} else if (data.is_kyc) {
		return 'kyc';
	} else if (data.is_supervisor) {
		return 'supervisor';
	} else if (data.is_support) {
		return 'support';
	}
};

export const renderRoleImage = (
	className = 'role-icon',
	type = checkRole()
) => {
	switch (type) {
		case 'supervisor':
			return (
				<img
					src={STATIC_ICONS.BLUE_SCREEN_SUPERVISOR}
					className={className}
					alt="role-icon"
				/>
			);
		case 'kyc':
			return (
				<img
					src={STATIC_ICONS.BLUE_SCREEN_KYC}
					className={className}
					alt="role-icon"
				/>
			);
		case 'communicator':
			return (
				<img
					src={STATIC_ICONS.BLUE_SCREEN_COMMUNICATON_SUPPORT_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		case 'support':
			return (
				<img
					src={STATIC_ICONS.BLUE_SCREEN_EXCHANGE_SUPPORT_ROLE}
					className={className}
					alt="role-icon"
				/>
			);
		default:
			return (
				<img
					src={STATIC_ICONS.BLUE_SCREEN_EYE_ICON}
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
						href="https://dash.bitholla.com/billing"
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

export const OperatorRole = ({ handleInvite, isUpgrade }) => {
	const [selectedRole, setRole] = useState(OPERATORS[0].value);

	const handleSelect = (values) => {
		setRole(values);
	};

	const handleSubmitOperator = (values) => {
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
							defaultValue={OPERATORS[0].value}
							onChange={handleSelect}
							size="small"
							value={selectedRole}
						>
							{OPERATORS.map((option, index) => (
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
					<Button type="primary" htmlType="submit" className="green-btn w-100">
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

export const RoleAccess = ({ handleClose, isUpgrade }) => {
	return (
		<div className="admin-roles-wrapper">
			<h3>Operator role access</h3>
			<div className="role-type-container">
				<div className="d-flex role-description-box">
					<div className="f-1 d-flex align-items-center pl-3">
						{renderRoleImage('role-icon', 'admin')}
						<span className="role-label">Administrator</span>
					</div>
					<div className="line-separator"></div>
					<div className="f-1 p-3">
						<div className="sub-title">Access Level 1</div>
						<div className="description">
							Administrator can access all areas. Coin creation, minting &
							burning, trading pair and designate operator roles.
						</div>
					</div>
				</div>
				<div className="d-flex role-description-box">
					<div className="f-1 d-flex align-items-center pl-3 role-supervisor">
						{renderRoleImage('role-icon', 'supervisor')}
						<span className="role-label ml-2">Supervisor</span>
					</div>
					<div className="line-separator"></div>
					<div className="f-1 p-3">
						<div className="sub-title">Access Level 2</div>
						<div className="description">
							Lead operator can access all areas but Coin creation, minting &
							burning, trade.
						</div>
					</div>
				</div>
				<div className="d-flex role-description-box">
					<div
						className={classnames(
							'f-1 d-flex align-items-center pl-3 role-kyc',
							{ 'disable-area': isUpgrade }
						)}
					>
						{renderRoleImage('role-icon', 'kyc')}
						<span className="role-label ml-2">KYC</span>
					</div>
					{isUpgrade ? (
						<div className="upgrade-text">Requires upgrade</div>
					) : null}
					<div className="line-separator"></div>
					<div className="f-1 p-3">
						<div className="sub-title">Access Level 3</div>
						<div className="description">
							Know your customer (KYC) role can access some user data to review
							KYC requirements.
						</div>
					</div>
				</div>
				<div className="d-flex role-description-box">
					<div
						className={classnames(
							'f-1 d-flex align-items-center pl-3 role-communication',
							{ 'disable-area': isUpgrade }
						)}
					>
						{renderRoleImage('role-icon', 'communicator')}
						<span className="role-label ml-2">Support</span>
					</div>
					{isUpgrade ? (
						<div className="upgrade-text">Requires upgrade</div>
					) : null}
					<div className="line-separator"></div>
					<div className="f-1 p-3">
						<div className="sub-title">Access Level 4</div>
						<div className="description">
							Communications can access to website direct editing such as
							strings and icons for the purpose of content management and
							communications.
						</div>
					</div>
				</div>
				<div className="d-flex role-description-box">
					<div
						className={classnames(
							'f-1 d-flex align-items-center pl-3 role-support',
							{ 'disable-area': isUpgrade }
						)}
					>
						{renderRoleImage('role-icon', 'support')}
						<span className="role-label ml-2">Support</span>
					</div>
					{isUpgrade ? (
						<div className="upgrade-text">Requires upgrade</div>
					) : null}
					<div className="line-separator"></div>
					<div className="f-1 p-3">
						<div className="sub-title">Access Level 5</div>
						<div className="description">
							Support can access some user information for user verification.
						</div>
					</div>
				</div>
			</div>
			{isUpgrade ? renderUpgrade() : null}
			<div className="mt-4">
				<Button
					type="primary"
					className="green-btn w-100"
					onClick={handleClose}
				>
					Back
				</Button>
			</div>
		</div>
	);
};

export const EditModal = ({ onTypeChange, handleUpdateRole, editData }) => {
	const handleSubmitEdit = (values) => {
		handleUpdateRole(values, editData.id);
	};

	return (
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
				buttonClass="green-btn mini-btn mt-2"
				fields={operatorFields.section_2}
			/>
			<div className="divider"></div>
			<div>Revoke role from operator</div>
			<div className="mt-2">
				<Button
					type="primary"
					className="revoke-btn"
					onClick={() => onTypeChange('revoke-role')}
				>
					Revoke role
				</Button>
			</div>
		</div>
	);
};

export const RevokeRole = ({ editData, handleClose, handleUpdateRole }) => {
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
				<Button type="primary" className="green-btn" onClick={handleClose}>
					Exit
				</Button>
				<Button
					type="primary"
					className="revoke-btn ml-3"
					onClick={handleRevoke}
				>
					Revoke
				</Button>
			</div>
		</div>
	);
};
