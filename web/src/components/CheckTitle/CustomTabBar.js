import React from 'react';
import classnames from 'classnames';

const CustomTabBar = ({ tabs, activeTab, setActiveTab }) => {
	return (
		<div
			className={classnames('custom-tab-wrapper d-flex flex-nowrap flex-row', {
				'justify-content-between': tabs.length > 2,
				'justify-content-around': tabs.length <= 2,
			})}
		>
			{tabs.map((tab, index) => {
				const tabProps = {
					key: `tab_item-${index}`,
					className: classnames('tab_item', 'f-1', {
						'tab_item-active': index === activeTab,
						pointer: setActiveTab,
					}),
				};
				if (setActiveTab) {
					tabProps.onClick = () => setActiveTab(index);
				}

				return <div {...tabProps}>{tab.title}</div>;
			})}
		</div>
	);
};

export default CustomTabBar;
