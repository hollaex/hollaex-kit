import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import GeneralContent from './General';

import './index.css';
import { ADMIN_TABS_PERMISSIONS } from '../paths';

const TabPane = Tabs.TabPane;

const tabList = [
	{ tab: 'branding', tabName: 'Branding' },
	{ tab: 'footer', tabName: 'Footer' },
	{ tab: 'security', tabName: 'Security' },
	{ tab: 'features', tabName: 'Features' },
	{ tab: 'onboarding', tabName: 'Onboarding' },
	{ tab: 'email', tabName: 'Email' },
	{ tab: 'localization', tabName: 'Localization' },
	{ tab: 'help_info', tabName: 'Help Info' },
	{ tab: 'apps', tabName: 'Apps' },
];
const General = ({ user: { configs = [] } = {}, router }) => {
	const [activeTab, setActiveTab] = useState('0');
	const params = new URLSearchParams(window.location.search);
	const isTabAvailable = (tabIndex = 0) => {
		const pathname = router?.location?.pathname;
		const tabPermissions = ADMIN_TABS_PERMISSIONS?.[pathname];
		if (!tabPermissions) {
			return false;
		}
		const tabValue = tabPermissions[String(tabIndex)] || '';
		return configs?.some((data) => tabValue?.includes(data));
	};

	useEffect(() => {
		const keys = Array.from(params.keys());
		const tabKey = keys?.length > 0 ? keys[0] : null;
		const tabIndex = tabList?.findIndex(({ tab }) => tab === tabKey);
		const firstAvailableTabIndex = tabList?.findIndex((_, idx) =>
			isTabAvailable(idx)
		);

		if (tabKey && tabIndex !== -1 && String(tabIndex) !== activeTab) {
			setActiveTab(String(tabIndex));
		} else if (
			!tabKey ||
			tabIndex === -1 ||
			(!isTabAvailable(tabIndex) && configs?.length)
		) {
			setActiveTab(String(firstAvailableTabIndex));
			const url = new URL(window.location.href);
			url.search = tabList[firstAvailableTabIndex]?.tab
				? `?${tabList[firstAvailableTabIndex]?.tab}`
				: '';
			window.history.replaceState(null, '', url.toString());
		}
		// eslint-disable-next-line
	}, [params, activeTab]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		const url = new URL(window.location.href);
		url.search = tabList[key]?.tab ? `?${tabList[key]?.tab}` : '';
		window.history.replaceState(null, '', url.toString());
	};

	const renderTabBar = (props, DefaultTabBar) => {
		return <DefaultTabBar {...props} />;
	};

	const renderGeneralTabBar = (tab, tabName, idx) => {
		if (!isTabAvailable(idx)) return null;
		const tabsWithHandler = ['branding', 'email'];
		return (
			<TabPane tab={tabName} key={idx}>
				<GeneralContent
					activeTab={tab}
					{...(tabsWithHandler?.includes(tab) ? { handleTabChange } : {})}
				/>
			</TabPane>
		);
	};

	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
				renderTabBar={renderTabBar}
			>
				{tabList?.map(({ tab, tabName }, idx) =>
					renderGeneralTabBar(tab, tabName, idx)
				)}
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
});

export default connect(mapStateToProps)(General);
