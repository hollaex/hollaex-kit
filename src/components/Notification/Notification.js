import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

export const NotificationWraper = ({
	icon,
	iconType,
	title,
	children,
	className = '',
	titleClassName = ''
}) => (
	<div className={classnames('notification-content-wrapper', className)}>
		{icon && <ReactSVG path={icon} wrapperClassName="notification-content-icon" />}
		<div className={classnames('font-weight-bold notification-content-title', titleClassName)}>{title}</div>
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
