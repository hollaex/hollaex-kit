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
			{STRINGS[stringId] === 'Verification' ? (
				<React.Fragment>
					<Image icon={icon} wrapperClassName="app-menu-bar-icon" />
					<div className="side-bar-txt warning_text">
						<EditWrapper stringId={stringId} iconId={iconId}>
							{STRINGS[stringId] || 'Unnamed page'}
						</EditWrapper>
						<sup className="sup-text">1</sup>
					</div>
				</React.Fragment>
			) : (
				<React.Fragment>
					<Image icon={icon} wrapperClassName="app-menu-bar-icon" />
					<div className="side-bar-txt">
						<EditWrapper stringId={stringId} iconId={iconId}>
							{STRINGS[stringId] || 'Unnamed page'}
						</EditWrapper>
					</div>
				</React.Fragment>
			)}
		</div>
	);
};

export default SidebarItem;
