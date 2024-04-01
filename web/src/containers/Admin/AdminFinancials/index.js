import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import Earnings from './Earnings';
import Duster from './Duster';
import Wallets from '../Wallets';
import DepositPage from '../DepositsPage';
import Transfer from '../Transfers';
import ExchangeOrdersContainer from '../Orders';
import ExchangeTradesContainer from '../QuickTrades';

import Assets, { getTabParams } from './Assets';
import './index.css';
import Wallet from './Wallet';
import Balances from './Balances';
import CoinConfiguration from './CoinConfiguration';
import TransactionLimits from './TransactionLimits';

const TabPane = Tabs.TabPane;

const AdminFinancials = ({ router, location, user }) => {
	const [activeTab, setActiveTab] = useState('0');
	const [hideTabs, setHideTabs] = useState(false);

	const tabParams = getTabParams();
	useEffect(() => {
		if (tabParams) {
			setActiveTab(tabParams.tab);
		}
	}, [tabParams]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		router.replace('/admin/financials');
	};

	const handleHide = (isHide) => {
		setHideTabs(isHide);
	};

	const renderTabBar = (props, DefaultTabBar) => {
		if (hideTabs) return <div></div>;
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
				<TabPane tab="Assets" key="0">
					<Assets location={location} handleHide={handleHide} />
				</TabPane>
				<TabPane tab="Summary" key="3">
					<Wallets router={router} />
				</TabPane>
				<TabPane tab="Wallet" key="4">
					<Wallet />
				</TabPane>
				<TabPane tab="Balances" key="5">
					<Balances />
				</TabPane>
				<TabPane tab="Orders" key="6">
					<ExchangeOrdersContainer
						type="orders"
						user={user}
						showFilters={true}
					/>
				</TabPane>
				<TabPane tab="Trades" key="7">
					<ExchangeTradesContainer
						type="trades"
						user={user}
						showFilters={true}
					/>
				</TabPane>
				<TabPane tab="Deposits" key="8">
					<DepositPage type="deposit" showFilters={true} />
				</TabPane>
				<TabPane tab="Withdrawals" key="9">
					<DepositPage type="withdrawal" showFilters={true} />
				</TabPane>
				<TabPane tab="Earnings" key="10">
					<Earnings />
				</TabPane>
				<TabPane tab="Transfers" key="11">
					<Transfer />
				</TabPane>
				<TabPane tab="Duster" key="12">
					<Duster />
				</TabPane>
				<TabPane tab="Limits" key="2">
					<TransactionLimits location={location} />
				</TabPane>
				<TabPane tab="Fee Markups" key="1">
					<CoinConfiguration location={location} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default AdminFinancials;
