import React from 'react';
import { Tabs } from 'antd';

import Earnings from './Earnings';
import Wallets from '../Wallets';
import DepositPage from '../DepositsPage';
import Transfer from '../Transfers';
import Assets from './Assets';
import './index.css';

const TabPane = Tabs.TabPane;

const AdminFinancials = ({ router }) => {
	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs>
				<TabPane tab="Summary" key="summary">
					<Wallets router={router} />
				</TabPane>
				<TabPane tab="Assets" key="assets">
					<Assets />
				</TabPane>
				<TabPane tab="Deposits" key="deposits">
					<DepositPage type="deposit" showFilters={true} />
				</TabPane>
				<TabPane tab="Withdrawals" key="withdrawals">
					<DepositPage type="withdrawal" showFilters={true} />
				</TabPane>
				<TabPane tab="Earnings" key="earnings">
					<Earnings />
				</TabPane>
				<TabPane tab="Transfers" key="transfers">
					<Transfer />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default AdminFinancials;
