import React from 'react';
import classnames from 'classnames';
import { IconTitle } from '../';

const TabController = ({ tabs, activeTab, setActiveTab, title, titleIcon }) => (
	<div className="tab_controller-wrapper">
		{(title || titleIcon) && (
			<IconTitle text={title} iconPath={titleIcon} textType="title" />
		)}
		<div className="tab_controller-tabs">
			{tabs.map((tab, index) => {
				const tabProps = {
					key: `tab_item-${index}`,
					className: classnames('tab_item', {
						'tab_item-active': index === activeTab,
						'tab_item-deactive': index !== activeTab,
						pointer: setActiveTab
					})
				};
				if (setActiveTab) {
					tabProps.onClick = () => setActiveTab(index);
				}

				return <div {...tabProps}>{tab.title}</div>;
			})}
		</div>
	</div>
);

TabController.defaultProps = {
	tabs: []
};
export default TabController;
