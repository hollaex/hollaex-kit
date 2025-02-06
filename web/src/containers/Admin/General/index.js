import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';

import GeneralContent from './General';

import { setIsAdminAnnouncementFeature } from 'actions/appActions';
import './index.css';

const TabPane = Tabs.TabPane;

const General = ({
	isAdminAnnouncementFeature,
	setIsAdminAnnouncementFeature,
}) => {
	const [activeTab, setActiveTab] = useState('0');

	useEffect(() => {
		isAdminAnnouncementFeature && setActiveTab('3');
		return () => {
			setIsAdminAnnouncementFeature(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				<TabPane tab="Apps" key="8">
					<GeneralContent activeTab={'apps'} />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAdminAnnouncementFeature: state.app.isAdminAnnouncementFeature,
});

const mapDispatchToProps = (dispatch) => ({
	setIsAdminAnnouncementFeature: bindActionCreators(
		setIsAdminAnnouncementFeature,
		dispatch
	),
});
export default connect(mapStateToProps, mapDispatchToProps)(General);
