import React from 'react';
import { Button } from 'antd';

import { OPERATORS, getOperatorFields } from './Utils';
import { STATIC_ICONS } from 'config/icons';
import { AdminHocForm } from '../../../components';
import { checkRole } from '../../../utils/token';

const OperatorRoleFrom = AdminHocForm('OperatorRoleFrom');
const EditOperatorFrom = AdminHocForm('EditOperatorFrom');

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

export const OperatorRole = ({ handleInvite }) => {
	const handleSubmitOperator = (values) => {
		handleInvite(values);
	};

	return (
		<div className="roles-wrapper">
			<h3>Add operator</h3>
			<OperatorRoleFrom
				onSubmit={handleSubmitOperator}
				initialValues={{ role: OPERATORS[0].value }}
				buttonText={'Save'}
				buttonClass="green-btn mt-2"
				fields={operatorFields.section_1}
			/>
		</div>
	);
};

export const RoleAccess = ({ handleClose }) => {
	return (
		<div className="roles-wrapper">
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
					<div className="f-1 d-flex align-items-center pl-3 role-kyc">
						{renderRoleImage('role-icon', 'kyc')}
						<span className="role-label ml-2">KYC</span>
					</div>
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
					<div className="f-1 d-flex align-items-center pl-3 role-communication">
						{renderRoleImage('role-icon', 'communicator')}
						<span className="role-label ml-2">Support</span>
					</div>
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
					<div className="f-1 d-flex align-items-center pl-3 role-support">
						{renderRoleImage('role-icon', 'support')}
						<span className="role-label ml-2">Support</span>
					</div>
					<div className="line-separator"></div>
					<div className="f-1 p-3">
						<div className="sub-title">Access Level 5</div>
						<div className="description">
							Support can access some user information for user verification.
						</div>
					</div>
				</div>
			</div>
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
		<div className="roles-wrapper">
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
		<div className="roles-wrapper">
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
