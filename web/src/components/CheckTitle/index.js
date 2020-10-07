import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { EditWrapper } from 'components';

import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';

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
	stringId,
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
					: <div className="empty-notification" />
				}
			</div>
			{title && !stringId && (
				<div className={classnames('check_title-label', titleClassName)}>
					{title}
				</div>
			)}
      {title && stringId && (
      	<EditWrapper stringId={stringId}>
					<div className={classnames('check_title-label', titleClassName)}>
            {title}
					</div>
      	</EditWrapper>
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
		<span style={{ wordBreak: 'normal' }}>
			{bold ? <b>{label}</b> : label}: <span className='information-content'>{information}</span>
		</span>
	</div>
);

export const CustomTabs = ({
	title,
	stringId,
	iconId,
	icon,
	notifications,
	className,
	statusCode = -1
}) => {
	let notificationStatus = renderStatusIcon(statusCode, "verification-stauts");
	return (
		<div className={classnames('check_title-container', className)}>
			<div className="check_title-icon">
				<div className='verification-status-container w-100 d-flex justify-content-end'>
					{!!notificationStatus
						? notificationStatus
						: <div className="empty-notification"></div>
					}
				</div>
				{icon &&
					(icon.indexOf('.svg') > 0 ? (
						<ReactSVG path={icon} wrapperClassName="custom_title-svg" />
					) : (
							<img alt={icon} src={icon} className="custom_title-img" />
						))}
				{!!notifications && (
					<div className="check_title-notification">{notifications}</div>
				)}
			</div>
      <EditWrapper stringId={stringId} iconId={iconId}>
        {title && (
					<div className={classnames('custom_title-label', { 'title-inactive': false })}>
            {title}
					</div>
        )}
      </EditWrapper>
		</div>
	);
};

const status = (key) => {
	switch (key) {
		case -1:
			return '';
		case 0:
			return 'Incompleted';
		case 1:
			return 'Pending';
		case 2:
			return 'Rejected';
		case 3:
			return 'Verified';
		default:
			return 'Incompleted';
	}
}

export const CustomMobileTabs = ({ title, icon, statusCode = -1 }) => {
	const statusText = status(statusCode);
	const statusIcon = renderStatusIcon(statusCode, "custom_tab_status-icon ml-1");
	return (
		<div className={
			classnames(
				"d-flex",
				"justify-content-between"
			)}
		>
			<div className="d-flex">
				<ReactSVG
					path={icon}
					wrapperClassName="custom_tab_icon-mobile"
				/>
				<div className={classnames(FLEX_CENTER_CLASSES, "mobile-tab-title", "ml-3")}>
					{title}
				</div>
			</div>
			<div className={
				classnames(
					FLEX_CENTER_CLASSES,
					statusText.toLowerCase()
				)}
			>
				{!!statusText ? <div className='status_txt'>{statusText}</div> : null}
				{!!statusIcon ? statusIcon : null}
			</div>
		</div>
	);
};

export default CheckTitle;
