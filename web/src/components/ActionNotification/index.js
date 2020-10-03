import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';
import { EditWrapper } from 'components';

const getClassNames = (status) => {
	switch (status) {
		case 'success':
			return 'notification-success';
		case 'warning':
			return 'notification-warning';
		case 'information':
			return 'notification-info';
		case 'disabled':
			return 'notification-disabled';
		case 'loading':
			return 'notification-loading';
		default:
			return '';
	}
};

const ActionNotification = ({
	useSvg,
	text,
	stringId,
	status,
	onClick,
	iconPath,
	className,
	reverseImage,
	textPosition,
	iconPosition,
	showPointer,
	rotate,
	rotateIfLtr,
	rotateIfRtl,
	showActionText,
	disable = false
}) => (
	<div
		className={classnames(
			'action_notification-wrapper',
			{
				pointer: !disable && showPointer,
				left: textPosition === 'left',
				right: textPosition === 'right',
				'icon_on-right': iconPosition === 'right',
				'icon_on-left': iconPosition === 'left',
				disabled: disable
			},
			className
		)}
		onClick={disable ? () => {} : onClick}
	>
		{(showActionText || !isMobile) && !stringId && (
			<div
				className={classnames(
					'action_notification-text',
					getClassNames(status)
				)}
			>
				{text}
			</div>
		)}
    {(showActionText || !isMobile) && stringId && (
			<EditWrapper stringId={stringId}>
				<div
					className={classnames(
            'action_notification-text',
            getClassNames(status)
          )}
				>
          {text}
				</div>
			</EditWrapper>
    )}
		{iconPath &&
			(useSvg ? (
				<ReactSVG path={iconPath} wrapperClassName="action_notification-svg" />
			) : (
				<img
					src={iconPath}
					alt={text}
					className={classnames('action_notification-image', {
						rotate_ltr: rotateIfLtr,
						rotate_rtl: rotateIfRtl,
						rotate,
						reverse: reverseImage
					})}
				/>
			))}
	</div>
);

ActionNotification.defaultProps = {
	useSvg: false,
	text: '',
	status: 'information',
	iconPath: '',
	className: '',
	reverseImage: false,
	textPosition: 'right',
	iconPosition: 'right',
	showPointer: true,
	rotate: false,
	rotateIfRtl: false,
	rotateIfLtr: false
};
export default ActionNotification;
