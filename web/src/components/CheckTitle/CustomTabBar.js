import React from 'react';
import classnames from 'classnames';
import { Slider } from 'components';

const CustomTabBar = ({ tabs, activeTab, setActiveTab }) => {
	const renderTabs = () => {
		return tabs.map((tab, index) => {
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
		});
	};

	return tabs.length <= 5 ? (
		<div
			className={classnames('custom-tab-wrapper d-flex flex-nowrap flex-row', {
				'justify-content-between': tabs.length > 2,
				'justify-content-around': tabs.length <= 2,
			})}
		>
			{renderTabs()}
		</div>
	) : (
		<div className="custom-tab-wrapper">
			<Slider small autoHideArrows={true} containerClass="h-100">
				{renderTabs()}
			</Slider>
		</div>
	);
};

export default CustomTabBar;
