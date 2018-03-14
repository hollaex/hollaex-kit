import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

export const Row = ({ className, iconClassName, onClick, text, iconPath }) => (
	<div
		className={classnames(
			className,
			'd-flex',
			'justify-content-between',
			'align-items-center',
			'logout-wrapper',
			'pointer'
		)}
		onClick={onClick}
	>
		<div className="sidebar-row--left text-uppercase">{text}</div>
		<div className="sidebar-row--right">
			<ReactSVG
				path={iconPath}
				wrapperClassName={classnames('sidebar-row--right-icon', iconClassName)}
			/>
		</div>
	</div>
);

export const Logout = ({ onLogout, ...rest }) => (
	<Row
		onClick={onLogout}
		{...rest}
		text={STRINGS.LOGOUT}
		iconPath={ICONS.LOGOUT_DOOR_INACTIVE}
		iconClassName="icon--logout"
	/>
);

export const Help = ({ onHelp, ...rest }) => (
	<Row
		onClick={onHelp}
		{...rest}
		text={STRINGS.HELP_TEXT}
		iconPath={ICONS.HELP_ICON}
		iconClassName="icon--help"
	/>
);
