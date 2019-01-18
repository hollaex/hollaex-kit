import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import { ICONS } from '../../config/constants';

export const renderStatusIcon = (statusCode = -1, className = "") => {

	switch (statusCode) {
		case -1:
			return null;
		case 0:
			return <ReactSVG path={ICONS.VERIFICATION_INCOMPLETE} wrapperClassName={className} />;
		case 1:
			return <ReactSVG path={ICONS.VERIFICATION_PENDING} wrapperClassName={className} />;
		case 2:
			return <ReactSVG path={ICONS.VERIFICATION_REJECTED} wrapperClassName={className} />;
		case 3:
			return <ReactSVG path={ICONS.VERIFICATION_VERIFIED} wrapperClassName={className} />;
		default:
			return <ReactSVG path={ICONS.VERIFICATION_INCOMPLETE} wrapperClassName={className} />;
	}
};

const CheckTitle = ({
	title,
	icon,
	notifications,
	className,
	titleClassName,
	statusCode = -1
}) => {
	let notificationStatus = renderStatusIcon(statusCode, "verification-stauts");
	return (
		<div className={classnames('check_title-container', className)}>
			<div className='verification-status-container w-100 d-flex justify-content-end'>
				{!!notificationStatus
					? notificationStatus
					: <div className="empty-notification"></div>
				}
			</div>
			{title && (
				<div className={classnames('check_title-label', titleClassName)}>
					{title}
				</div>
			)}
			<div className="check_title-icon">
				{icon &&
					(icon.indexOf('.svg') > 0 ? (
						<ReactSVG path={icon} wrapperClassName="check_title-svg" />
					) : (
						<img alt={icon} src={icon} className="check_title-img" />
					))}
				{!!notifications && (
					<div className="check_title-notification">{notifications}</div>
				)}
			</div>
		</div>
	);
};

CheckTitle.defaultProps = {
	title: '',
	status: '',
	notifications: '',
	className: '',
	titleClassName: ''
};

export const PanelInformationRow = ({
	label = '',
	information = '',
	className,
	bold = true,
	disable = false
}) => (
	<div
		className={classnames(
			'd-flex',
			'justify-content-start',
			'align-items-center',
			'panel-information-row',
			className,
			{ 'panel-information-row-disable': disable }
		)}
	>
		<span style={{ wordBreak: 'normal' }}>{bold ? <b>{label}</b> : label}: {information}</span>
	</div>
);

export default CheckTitle;
