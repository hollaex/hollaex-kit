import React from 'react';
import classnames from 'classnames';

const MobileTabBar = ({ tabs, activeTab, setActiveTab, renderContent }) => {
	return (
		<div>
			{tabs.map((tab, index) => {
				const tabProps = {
					key: `tab_item-${index}`,
					className: classnames('mobile_tab-wrapper', {
						active_mobile_tab: index === activeTab,
						mobile_tab_last: index === tabs.length - 1,
						'mobile_tab_last-active':
							index === tabs.length - 1 && index === activeTab,
						pointer: setActiveTab,
					}),
				};
				if (setActiveTab) {
					tabProps.onClick = () => {
						if (index !== activeTab) {
							setActiveTab(index);
						}
					};
				}
				return (
					<div {...tabProps}>
						{tab.title}
						{index === activeTab ? (
							<div className="inner_container py-4">
								{activeTab > -1 && renderContent(tabs, activeTab)}
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
};

export default MobileTabBar;
