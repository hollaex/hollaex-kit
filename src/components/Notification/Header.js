import React from 'react';

const Header = ({ icon, text }) => (
	<div className="notification-title-wrapper d-flex flex-column justify-content-between">
		<div className="notification-title-icon f-1 d-flex justify-content-center align-items-center">
			<img src={icon} alt="" className="notification-title-icon" />
		</div>
		<div className="notification-title-text">{text}</div>
	</div>
);

export default Header;
