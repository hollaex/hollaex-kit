import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import Earnings from './Earnings';
import Wallets from '../Wallets';
import DepositPage from '../DepositsPage';
import Transfer from '../Transfers';
import Assets, { getTabParams } from './Assets';
import './index.css';

const TabPane = Tabs.TabPane;

const AdminFinancials = ({ router, location }) => {
	const [ activeTab, setActiveTab] = useState('0');

	const tabParams = getTabParams();
	useEffect(() => {
		if (tabParams) {
			setActiveTab(tabParams.tab);
		}
	}, [tabParams]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		router.replace('/admin/financials');
	}
	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
			>
				<TabPane tab="Summary" key="0">
					<Wallets router={router} />
				</TabPane>
				<TabPane tab="Assets" key="1">
					<Assets location={location} />
				</TabPane>
				<TabPane tab="Deposits" key="2">
					<DepositPage type="deposit" showFilters={true} />
				</TabPane>
				<TabPane tab="Withdrawals" key="3">
					<DepositPage type="withdrawal" showFilters={true} />
				</TabPane>
				<TabPane tab="Earnings" key="4">
					<Earnings />
				</TabPane>
				<TabPane tab="Transfers" key="5">
					<Transfer />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default AdminFinancials;
