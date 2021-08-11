import React, { useState } from 'react';
import { CheckCircleFilled, ClockCircleFilled } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import './index.css';

const displayIcons = (type) => {
	if (type === 'warning') {
		return <ClockCircleFilled className="icon" />;
	} else if (type === 'settings') {
		return (
			<img
				src={STATIC_ICONS.SETTINGS}
				alt="settings"
				className="settings-icon"
			/>
		);
	} else {
		return <CheckCircleFilled className="icon" />;
	}
};

const IconToolTip = ({
	type = '',
	tip,
	animation = true,
	onClick = () => {},
}) => {
	const [showTip, setTipVisible] = useState(false);
	return (
		<div className="tooltip-wrapper">
			<div
				className="icon-tooltip"
				onMouseEnter={() => setTipVisible(true)}
				onMouseLeave={() => setTipVisible(false)}
			>
				<div className={type} onClick={onClick}>
					<div
						className={
							showTip && animation ? 'tip-icon tip-icon-show' : 'tip-icon'
						}
					>
						{displayIcons(type)}
					</div>
					{showTip && tip ? <span className="info">{tip}</span> : null}
				</div>
			</div>
		</div>
	);
};

export default IconToolTip;
