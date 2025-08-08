import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import GeneralContent from './General';

import './index.css';

const TabPane = Tabs.TabPane;

const tabList = [
	'branding',
	'footer',
	'security',
	'features',
	'onboarding',
	'email',
	'localization',
	'help_info',
	'apps',
];

const General = () => {
	const [activeTab, setActiveTab] = useState('0');

	const params = new URLSearchParams(window.location.search);
	useEffect(() => {
		const keys = Array.from(params.keys());
		const tab = keys?.length > 0 ? keys[0] : null;
		const tabIndex = tabList?.indexOf(tab);

		if (tab && tabIndex !== -1 && String(tabIndex) !== activeTab) {
			setActiveTab(String(tabIndex));
		} else if (!tab || tabIndex === -1) {
			setActiveTab('0');
			const url = new URL(window.location.href);
			url.search = tabList[0] ? `?${tabList[0]}` : '';
			window.history.replaceState(null, '', url.toString());
		}
	}, [params, activeTab]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		const url = new URL(window.location.href);
		url.search = tabList[key] ? `?${tabList[key]}` : '';
		window.history.replaceState(null, '', url.toString());
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
					<GeneralContent
						activeTab={'email'}
						handleTabChange={handleTabChange}
					/>
				</TabPane>
				<TabPane tab="Localization" key="6">
					<GeneralContent activeTab={'localization'} />
				</TabPane>
				<TabPane tab="Help info" key="7">
					<GeneralContent activeTab={'help_info'} />
				</TabPane>
				<TabPane tab="Apps" key="8">
					<GeneralContent activeTab={'apps'} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default General;
