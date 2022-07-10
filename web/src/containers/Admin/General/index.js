import React, { useState } from 'react';
import { Tabs } from 'antd';

import GeneralContent from './General';

import './index.css';

const TabPane = Tabs.TabPane;

const General = () => {
	const [activeTab, setActiveTab] = useState('0');

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const renderTabBar = (props, DefaultTabBar) => {
		return <DefaultTabBar {...props} />;
	};

	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
				renderTabBar={renderTabBar}
			>
				<TabPane tab="Branding" key="0">
					<GeneralContent
						activeTab={'branding'}
						handleTabChange={handleTabChange}
					/>
				</TabPane>
				<TabPane tab="Footer" key="1">
					<GeneralContent activeTab={'footer'} />
				</TabPane>
				<TabPane tab="Security" key="2">
					<GeneralContent activeTab={'security'} />
				</TabPane>
				<TabPane tab="Features" key="3">
					<GeneralContent activeTab={'features'} />
				</TabPane>
				<TabPane tab="Onboarding" key="4">
					<GeneralContent activeTab={'onboarding'} />
				</TabPane>
				<TabPane tab="Email" key="5">
					<GeneralContent activeTab={'email'} />
				</TabPane>
				<TabPane tab="Localization" key="6">
					<GeneralContent activeTab={'localization'} />
				</TabPane>
				<TabPane tab="Help info" key="7">
					<GeneralContent activeTab={'help_info'} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default General;
