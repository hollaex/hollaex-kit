import React from 'react';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import Image from 'components/Image';
import { EditWrapper } from 'components';

const SidebarItem = ({ icon, iconId, path, isActive, stringId, onClick }) => {
	return (
		<div
			className={classnames(
				'd-flex align-items-center app-menu-bar-side_list',
				{ list_active: isActive }
			)}
			onClick={() => onClick(path)}
		>
			<Image icon={icon} wrapperClassName="app-menu-bar-icon" />
			<div className="side-bar-txt">
				<EditWrapper stringId={stringId} iconId={iconId}>
					{STRINGS[stringId] || 'Unnamed page'}
				</EditWrapper>
			</div>
		</div>
	);
};

export default SidebarItem;
