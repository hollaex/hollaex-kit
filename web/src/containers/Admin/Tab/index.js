import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Tab = ({
	TabList = [],
	onChange = () => {},
	activeTab = '0',
	renderTabBar = (props, DefaultTabBar) => <DefaultTabBar {...props} />,
}) => {
	const [activeKey, setActiveTab] = useState('0');
	useEffect(() => {
		setActiveTab(activeTab);
	}, [activeTab]);
	const handleChange = (key) => {
		setActiveTab(key);
		onChange(key, TabList[key]);
	};
	return (
		<div className="asset-tabs">
			<div className="tab-wrapper">
				<Tabs
					defaultActiveKey="0"
					activeKey={activeKey}
					onChange={handleChange}
					renderTabBar={renderTabBar}
				>
					{TabList.map((menu, id) => {
						return (
							<TabPane tab={menu.name} key={id}>
								{menu.content && parseInt(activeKey, 10) === id ? (
									menu.content
								) : (
									<div></div>
								)}
							</TabPane>
						);
					})}
				</Tabs>
			</div>
		</div>
	);
};

export default Tab;
