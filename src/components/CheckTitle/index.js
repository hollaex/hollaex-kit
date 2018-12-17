import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import { ICONS } from '../../config/constants';

const CheckTitle = ({
	title,
	icon,
	notifications,
	className,
	titleClassName,
	statusCode = -1
}) => {
	let notificationStatus = '';
	switch (statusCode) {
		case 0:
			notificationStatus = <ReactSVG path={ICONS.VERIFICATION_INCOMPLETE} wrapperClassName="verification-stauts" />;
			break;
		case 1:
			notificationStatus = <ReactSVG path={ICONS.VERIFICATION_PENDING} wrapperClassName="verification-stauts" />;
			break;
		case 2:
			notificationStatus = <ReactSVG path={ICONS.VERIFICATION_REJECTED} wrapperClassName="verification-stauts" />;
			break;
		case 3:
			notificationStatus = <ReactSVG path={ICONS.VERIFICATION_VERIFIED} wrapperClassName="verification-stauts" />;
			break;
		default:
			notificationStatus = '';
	}
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
