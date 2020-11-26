import React from 'react';
import { Tabs } from 'antd';

import { MoveToDash } from 'containers';
import Earnings from './Earnings';
import './index.css';

const TabPane = Tabs.TabPane;

const AdminFinancials = () => {
	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs>
				<TabPane tab="Assets" key="assets">
					<div className="tab-contents">
						<MoveToDash />
					</div>
				</TabPane>
				<TabPane tab="Deposits" key="deposits">
					<div>Deposits</div>
				</TabPane>
				<TabPane tab="Withdrawals" key="withdrawals">
					<div>Withdrawals</div>
				</TabPane>
				<TabPane tab="Earnings" key="earnings">
					<Earnings />
				</TabPane>
				<TabPane tab="Transfers" key="transfers">
					<div>Transfers</div>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default AdminFinancials;
