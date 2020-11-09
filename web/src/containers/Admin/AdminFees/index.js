import React from 'react';
import { Tabs } from 'antd';

import SettledList from './SettledList';
import CalculateFee from './CaculateFee';

const TabPane = Tabs.TabPane;

const AdminFees = () => {
	return (
		<div className="app_container-content">
			<Tabs>
				<TabPane tab="Settled" key="Settled">
					<SettledList />
				</TabPane>
				<TabPane tab="Calculate" key="Calculate">
					<CalculateFee />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default AdminFees;
