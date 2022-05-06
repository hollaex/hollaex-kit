import React from 'react';
import { Image } from 'components';
import classnames from 'classnames';

const Tab = ({ icon, title, className }) => {
	return (
		<div className={classnames('check_title-container', 'h-100', className)}>
			<div className="check_title-icon">
				<Image
					icon={icon}
					imageWrapperClassName="custom_title-img"
					svgWrapperClassName="custom_title-svg"
				/>
			</div>
			{title && (
				<div
					className={classnames('custom_title-label', {
						'title-inactive': false,
					})}
				>
					{title}
				</div>
			)}
		</div>
	);
};

export default Tab;
