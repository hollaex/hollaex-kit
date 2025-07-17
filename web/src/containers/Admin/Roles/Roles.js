import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import _toLower from 'lodash/toLower';

import RoleManagement from './RoleManagement';
import { STATIC_ICONS } from 'config/icons';

const Role = ({
	constants,
	onHandleTabChange,
	isColorDark,
	user,
	coins,
	setRolesList,
}) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentRole, setCurrentRole] = useState(null);

	const handleCreate = () => {
		setCurrentRole(null);
		setIsModalVisible(true);
	};

	const handleUpgrade = (info = {}) => {
		if (_toLower(info.plan) !== 'fiat') {
			return true;
		} else {
			return false;
		}
	};

	const isUpgrade = handleUpgrade(constants?.info);

	return (
		<div className="operator-roles-wrapper">
			<div className="header-section">
				<div className="title-content">
					<div className="title">Role permissions & customizations</div>
					<div className="description">
						Degisn a custom-fit role that seamlessly integrates into your team,
						with permissions tailored to match your unique requirements
					</div>
				</div>
				<div>
					{!isUpgrade && (
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={handleCreate}
							className="create-btn green-btn no-border"
						>
							Create New Role
						</Button>
					)}
				</div>
			</div>

			<div className="description-wrapper">
				<ReactSVG
					src={STATIC_ICONS.OPERATOR_ROLES}
					className="operator-roles-icon"
				/>
				<div className="operator-role-description">
					<div className="description-text">
						To complete your team structure, simply add your team and assign a
						role to the appropriate{' '}
						<span
							className="text-decoration-underline pointer"
							onClick={() => onHandleTabChange('0')}
						>
							operator here
						</span>
						.
					</div>
					<div className="description-text edit-permission-text">
						(Only the Admin and{' '}
						<a
							className="enterprise-text pointer"
							target="_blank"
							rel="noopener noreferrer"
							href="https://www.hollaex.com/pricing"
						>
							Enterprise
						</a>{' '}
						platforms can edit permissions and create new roles.)
					</div>
				</div>
			</div>

			<div className="mt-5 role-management">
				<RoleManagement
					constants={constants}
					isModalVisible={isModalVisible}
					setIsModalVisible={setIsModalVisible}
					currentRole={currentRole}
					setCurrentRole={setCurrentRole}
					handleCreate={handleCreate}
					isUpgrade={isUpgrade}
					isColorDark={isColorDark}
					user={user}
					coins={coins}
					setRolesList={setRolesList}
				/>
			</div>
		</div>
	);
};

export default Role;
