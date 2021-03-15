import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { Button } from '../';
import STRINGS from '../../config/localizedStrings';
import Image from 'components/Image';
import { EditWrapper } from 'components';

export const NotificationWraperDesktop = ({
	icon,
	iconId,
	iconType,
	stringId,
	title,
	children,
	className = '',
	titleClassName = '',
	onClose,
	onBack,
}) => (
	<div className={classnames('notification-content-wrapper', className)}>
		<Image
			iconId={iconId}
			icon={icon}
			wrapperClassName="notification-content-icon"
		/>
		<div
			className={classnames(
				'font-weight-bold notification-content-title',
				titleClassName
			)}
		>
			<EditWrapper stringId={stringId}>{title}</EditWrapper>
		</div>
		{children}
		{onBack ? (
			<Button
				label={STRINGS['NOTIFICATIONS.BUTTONS.OKAY']}
				onClick={onClose}
				autoFocus
			></Button>
		) : (
			''
		)}
	</div>
);

export const NotificationWraperMobile = ({
	icon,
	iconId,
	iconType,
	title,
	children,
	className = '',
	titleClassName = '',
}) => (
	<div className={classnames('notification-content-wrapper', className)}>
		<Image
			iconId={iconId}
			icon={icon}
			wrapperClassName="notification-content-icon"
		/>
		<div className="notification-content-mobile-wrapper">
			<div
				className={classnames(
					'font-weight-bold notification-content-title',
					titleClassName
				)}
			>
				{title}
			</div>
			{children}
		</div>
	</div>
);

export const NotificationWraper = ({
	onClose,
	compressOnMobile = false,
	...props
}) =>
	compressOnMobile && isMobile ? (
		<NotificationWraperMobile {...props} />
	) : (
		<NotificationWraperDesktop {...props} onClose={onClose} />
	);

export const NotificationContent = ({ children, className = '' }) => (
	<div className={classnames('notification-content-information', className)}>
		{children}
	</div>
);

export const InformationRow = ({ label, value, stringId }) => (
	<div className="d-flex">
		<div className="f-1 text_disabled">
			<EditWrapper stringId={stringId}>{label}:</EditWrapper>
		</div>
		<div className="f-1">{value}</div>
	</div>
);
