import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import Image from 'components/Image';
import { EditWrapper } from 'components';

import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { STATIC_ICONS as ICONS } from 'config/icons';

export const renderStatusIcon = (statusCode = -1, className = '') => {
	switch (statusCode) {
		case -1:
			return null;
		case 0:
			return (
				<ReactSVG
					src={ICONS['VERIFICATION_INCOMPLETE']}
					className={classnames(className, 'incomplete')}
				/>
			);
		case 1:
			return (
				<ReactSVG
					src={ICONS['VERIFICATION_PENDING']}
					className={classnames(className, 'pending')}
				/>
			);
		case 2:
			return (
				<ReactSVG
					src={ICONS['VERIFICATION_REJECTED']}
					className={classnames(className, 'rejected')}
				/>
			);
		case 3:
			return (
				<ReactSVG
					src={ICONS['VERIFICATION_VERIFIED']}
					className={classnames(className, 'verified')}
				/>
			);
		default:
			return (
				<ReactSVG
					src={ICONS['VERIFICATION_INCOMPLETE']}
					className={classnames(className, 'incomplete')}
				/>
			);
	}
};

const CheckTitle = ({
	title,
	stringId,
	icon,
	iconId,
	notifications,
	className,
	titleClassName,
	statusCode = -1,
}) => {
	let notificationStatus = renderStatusIcon(statusCode, 'verification-stauts');
	return (
		<div className={classnames('check_title-container', className)}>
			<div className="verification-status-container w-100 d-flex justify-content-end">
				{!!notificationStatus ? (
					notificationStatus
				) : (
					<div className="empty-notification" />
				)}
			</div>
			<EditWrapper stringId={stringId} iconId={iconId}>
				{title && (
					<div className={classnames('check_title-label', titleClassName)}>
						{title}
					</div>
				)}
			</EditWrapper>
			<div className="check_title-icon">
				<Image
					icon={icon}
					imageWrapperClassName="check_title-img"
					svgWrapperClassName="check_title-svg"
				/>
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
	titleClassName: '',
};

export const PanelInformationRow = ({
	stringId,
	label = '',
	information = '',
	className,
	bold = true,
	disable = false,
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
			{bold ? <b>{label}</b> : label}:{' '}
			<span className="information-content">{information}</span>
		</span>
		<EditWrapper stringId={stringId} />
	</div>
);

export const CustomTabs = ({
	title,
	stringId,
	iconId,
	icon,
	notifications,
	className,
	statusCode = -1,
}) => {
	let notificationStatus = renderStatusIcon(statusCode, 'verification-stauts');
	return (
		<div className={classnames('check_title-container', className)}>
			<div className="check_title-icon">
				<div className="verification-status-container w-100 d-flex justify-content-end">
					{!!notificationStatus ? (
						notificationStatus
					) : (
						<div className="empty-notification"></div>
					)}
				</div>
				<Image
					icon={icon}
					imageWrapperClassName="custom_title-img"
					svgWrapperClassName="custom_title-svg"
				/>
				{!!notifications && (
					<div className="check_title-notification">{notifications}</div>
				)}
			</div>
			<EditWrapper stringId={stringId} iconId={iconId}>
				{title && (
					<div
						className={classnames('custom_title-label', {
							'title-inactive': false,
						})}
					>
						{title}
					</div>
				)}
			</EditWrapper>
		</div>
	);
};

export const status = (key) => {
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
};

export const CustomMobileTabs = ({ title, icon, statusCode = -1 }) => {
	const statusText = status(statusCode);
	const statusIcon = renderStatusIcon(
		statusCode,
		'custom_tab_status-icon ml-1'
	);
	return (
		<div className={classnames('d-flex', 'justify-content-between')}>
			<div className="d-flex">
				<Image icon={icon} wrapperClassName="custom_tab_icon-mobile" />
				<div
					className={classnames(
						FLEX_CENTER_CLASSES,
						'mobile-tab-title',
						'ml-3'
					)}
				>
					{title}
				</div>
			</div>
			<div
				className={classnames(FLEX_CENTER_CLASSES, statusText.toLowerCase())}
			>
				{!!statusText ? <div className="status_txt">{statusText}</div> : null}
				{!!statusIcon ? statusIcon : null}
			</div>
		</div>
	);
};

export default CheckTitle;
