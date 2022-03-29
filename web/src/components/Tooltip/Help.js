import React, { useState } from 'react';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import ICONS from 'config/icons/static';
import { Image } from 'components';

const Help = ({ children, tip }) => {
	const [isVisible, setIsVisible] = useState(false);
	const onVisibleChange = (visible) => setIsVisible(visible);

	return (
		<Tooltip
			title={tip}
			onVisibleChange={onVisibleChange}
			visible={isVisible}
			placement="rightBottom"
			overlayClassName="help-tooltip"
		>
			<span className="inline-flex">
				<span className={classnames({ tooltip_source__active: isVisible })}>
					{children}
				</span>
				<Image
					icon={ICONS['TOOLTIP']}
					wrapperClassName="tooltip_icon_wrapper"
				/>
			</span>
		</Tooltip>
	);
};

export default Help;
