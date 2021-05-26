import React from 'react';
import classnames from 'classnames';
import RCTooltip from 'rc-tooltip';

const Overlay = (text) => <span>{text}</span>;

export const Tooltip = ({ children, text, className, ...rest }) => {
	return (
		<RCTooltip
			{...rest}
			overlayClassName={classnames('holla-tooltip', className)}
			overlay={Overlay(text)}
		>
			{children}
		</RCTooltip>
	);
};

Tooltip.defaultProps = {
	mouseEnterDelay: 0.25,
	mouseLeaveDelay: 0,
	className: '',
	text: 'Tooltip text',
	placement: 'bottom',
	destroyTooltipOnHide: true,
};
