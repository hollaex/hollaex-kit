import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Tabs } from 'antd';
import LoginTable from './LoginTable';
import SessionTable from './SessionTable';
import '../Trades/index.css';
import '../../Admin/General/index.css';
const TabPane = Tabs.TabPane;

const Sessions = ({ router }) => {
	const [activeTab, setActiveTab] = useState('0');

	useEffect(() => {
		const [, params] = window.location.search.split('?');
		if (params === 'active') {
			setActiveTab('0');
		} else if (params === 'logins') {
			setActiveTab('1');
		} else if (!params) {
			setActiveTab('0');
			router.replace('/admin/sessions?active');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location.search]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		if (key === '0') {
			return router?.replace('/admin/sessions?active');
		} else {
			return router?.replace('/admin/sessions?logins');
		}
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

export default connect(mapStateToProps)(withRouter(Sessions));
