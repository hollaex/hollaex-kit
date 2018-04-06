import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

const renderIcon = (path, type) => {
	if (type === 'svg') {
		return <ReactSVG path={path} wrapperClassName="notification-content-icon" />
	} else {
		return <img src={path} alt="" className="notification-content-icon" />
	}
}
export const NotificationWraper = ({
	icon,
	iconType,
	title,
	children,
	className = ''
}) => (
	<div className={classnames('notification-content-wrapper', className)}>
		{icon && renderIcon(icon, iconType)}
		<div className="font-weight-bold notification-content-title">{title}</div>
		{children}
	</div>
);

export const NotificationContent = ({ children, className = '' }) => (
	<div className={classnames('notification-content-information', className)}>
		{children}
	</div>
);

export const InformationRow = ({ label, value }) => (
	<div className="d-flex">
		<div className="f-1 text_disabled">{label}:</div>
		<div className="f-1">{value}</div>
	</div>
);
