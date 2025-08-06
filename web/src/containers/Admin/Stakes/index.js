import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import UserStaking from './UserStaking';
import CeFi from './CeFi';

const TabPane = Tabs.TabPane;

const tabList = ['cefi', 'user-staking'];

const Stakes = (props) => {
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
		window.history.replaceState(null, '', url?.toString());
	};

	return (
		<div className="admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
			>
				<TabPane tab="CeFi" key="0">
					<CeFi
						coins={props.coins}
						features={props.features}
						kit={props.constants}
					/>
				</TabPane>
				<TabPane tab="User Staking" key="1">
					<UserStaking coins={props.coins} isUserProfileStakeTab={false} />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	features: state.app.constants.features,
	pluginNames: state.app.pluginNames,
	coins: state.app.coins,
	constants: state.app.constants,
});

export default connect(mapStateToProps)(Stakes);
