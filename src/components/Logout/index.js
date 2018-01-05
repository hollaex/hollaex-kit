import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const Logout = ({ className, onLogout }) => (
	<div
		className={classnames(
			className,
			'd-flex',
			'justify-content-between',
			'align-items-center',
			'logout-wrapper'
		)}
	>
		<div onClick={onLogout} className="logout-left text-uppercase pointer">
			{STRINGS.LOGOUT}
		</div>
		<div onClick={onLogout} className="logout-right pointer">
			<ReactSVG
				path={ICONS.LOGOUT_DOOR_INACTIVE}
				wrapperClassName="logout-right-icon"
			/>
		</div>
	</div>
);

Logout.defaultProps = {
	className: ''
};
export default Logout;
