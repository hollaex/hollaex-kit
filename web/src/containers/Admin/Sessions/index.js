import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import LoginTable from './LoginTable';
import SessionTable from './SessionTable';

const TabPane = Tabs.TabPane;

const Sessions = () => {
	const [activeTab, setActiveTab] = useState('0');

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	return (
		<div className="admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
			>
				<TabPane tab="Sessions" key="0">
					<SessionTable />
				</TabPane>
				<TabPane tab="Logins" key="1">
					<LoginTable />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pluginNames: state.app.pluginNames,
	coins: state.app.coins,
	constants: state.app.constants,
});

export default connect(mapStateToProps)(Sessions);
