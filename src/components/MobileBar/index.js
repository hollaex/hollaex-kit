import React from 'react';
import classnames from 'classnames';

export const MobileBarWrapper = ({ className, children }) => {
	return <div className={classnames('mobile-bar', className)}>{children}</div>;
};

MobileBarWrapper.defaultProps = {
	className: ''
};

const renderMobileTab = ({
	title,
	key,
	className = '',
	active = false,
	onClick
}) => {
	return (
		<div
			key={key}
			className={classnames(
				'mobile-bar-tab f-1 d-flex justify-content-center align-items-center',
				className,
				{ active }
			)}
			onClick={onClick}
		>
			{title}
		</div>
	);
};

export const MobileBarTabs = ({
	tabs,
	className,
	activeTab,
	setActiveTab,
	renderTab = renderMobileTab
}) => {
	return (
		<MobileBarWrapper className="d-flex justify-content-between">
			{tabs.map((tab, index) => {
				const tabProps = {
					key: `tab_item-${index}`,
					active: index === activeTab,
					...tab
				};
				if (setActiveTab) {
					tabProps.onClick = () => setActiveTab(index);
				}
				return renderTab(tabProps);
			})}
		</MobileBarWrapper>
	);
};

MobileBarWrapper.defaultProps = {
	tabs: []
};
