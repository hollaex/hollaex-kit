import React from 'react';
import classnames from 'classnames';
import { MobileBarWrapper } from '.';

const renderMobileTab = ({
	title,
	key,
	className = '',
	active = false,
	notifications = '',
	onClick,
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
			<div className="bartab-text-wrapper">
				{title}
				{notifications && (
					<div className="bartab-notification">{notifications}</div>
				)}
			</div>
		</div>
	);
};

export const MobileBarTabs = ({
	tabs,
	className,
	activeTab,
	setActiveTab,
	renderTab = renderMobileTab,
}) => {
	return (
		<MobileBarWrapper className="d-flex justify-content-between">
			{tabs.map((tab, index) => {
				const tabProps = {
					key: `tab_item-${index}`,
					active: index === activeTab,
					...tab,
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
	tabs: [],
};
