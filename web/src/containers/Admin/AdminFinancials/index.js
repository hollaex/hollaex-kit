import React from 'react';
import { Tabs } from 'antd';

import { MoveToDash } from 'containers';
import Earnings from './Earnings';
import Wallets from '../Wallets';
import './index.css';

const TabPane = Tabs.TabPane;

const AdminFinancials = ({ router }) => {
	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs>
				<TabPane tab="Summary" key="summary">
					<div className="tab-contents">
						<Wallets router={router} />
					</div>
				</TabPane>
				<TabPane tab="Assets" key="assets">
					<div className="tab-contents">
						<MoveToDash />
					</div>
				</TabPane>
				<TabPane tab="Deposits" key="deposits">
					<div className="tab-contents">
						<MoveToDash />
					</div>
				</TabPane>
				<TabPane tab="Withdrawals" key="withdrawals">
					<div className="tab-contents">
						<MoveToDash />
					</div>
				</TabPane>
				<TabPane tab="Earnings" key="earnings">
					<Earnings />
				</TabPane>
				<TabPane tab="Transfers" key="transfers">
					<div className="tab-contents">
						<MoveToDash />
					</div>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default AdminFinancials;
