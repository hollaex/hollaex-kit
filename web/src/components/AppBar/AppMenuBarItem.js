import React from 'react';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';

const AppMenuBarItem = ({ path, isActive, onClick, stringId }) => {
	return (
		<div
			className={classnames('app-menu-bar-content d-flex text_overflow', {
				'active-menu': isActive,
			})}
			onClick={() => onClick(path)}
		>
			<div className="app-menu-bar-content-item d-flex text_overflow">
				<EditWrapper stringId={stringId}>{STRINGS[stringId]}</EditWrapper>
			</div>
		</div>
	);
};

export default AppMenuBarItem;
