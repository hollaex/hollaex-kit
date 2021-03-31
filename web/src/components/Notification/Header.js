import React from 'react';
import { ReactSVG } from 'react-svg';

const Header = ({ icon, text }) => (
	<div className="notification-title-wrapper d-flex flex-column justify-content-between">
		<div className="notification-title-icon f-1 d-flex justify-content-center align-items-center">
			<ReactSVG src={icon} className="notification-title-icon" />
		</div>
		<div className="notification-title-text">{text}</div>
	</div>
);

export default Header;
