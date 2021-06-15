import React from 'react';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import Image from 'components/Image';
import { EditWrapper } from 'components';

const MenuListItem = ({
	icon,
	iconId,
	path,
	isActive,
	stringId,
	onClick,
	notifications,
	showNotification,
}) => {
	return (
		<div
			className={classnames(
				'app-bar-account-menu-list d-flex',
				{ 'menu-active': isActive && !showNotification },
				{ 'menu-notification-active': isActive && showNotification },
				{ verification_notification: !isActive && showNotification }
			)}
			onClick={() => onClick(path)}
		>
			<div className="notification-content">
				{showNotification && (
					<div
						className={
							isActive
								? 'app-bar-account-list-notification verification_selected'
								: 'app-bar-account-list-notification verification_selected_inactive'
						}
					>
						{notifications}
					</div>
				)}
			</div>
			<Image icon={icon} wrapperClassName="app-bar-account-list-icon" />
			<EditWrapper stringId={stringId} iconId={iconId}>
				{STRINGS[stringId] || 'Unnamed page'}
			</EditWrapper>
		</div>
	);
};

export default MenuListItem;
