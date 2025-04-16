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
import { getPermissions } from 'utils/token';

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
				{getPermissions().includes('/admin/balance:get') && (
					<TabPane tab="Assets" key="0">
						<Assets location={location} handleHide={handleHide} />
					</TabPane>
				)}
				{getPermissions().includes('/admin/balance:get') && (
					<TabPane tab="Summary" key="3">
						<Wallets router={router} />
					</TabPane>
				)}
				{getPermissions().includes('/admin/user/wallet:get') && (
					<TabPane tab="Wallet" key="4">
						<Wallet />
					</TabPane>
				)}
				{getPermissions().includes('/admin/balances:get') && (
					<TabPane tab="Balances" key="5">
						<Balances />
					</TabPane>
				)}
				{getPermissions().includes('/admin/orders:get') && (
					<TabPane tab="Orders" key="6">
						<ExchangeOrdersContainer
							type="orders"
							user={user}
							showFilters={true}
						/>
					</TabPane>
				)}
				{getPermissions().includes('/admin/trades:get') && (
					<TabPane tab="Trades" key="7">
						<ExchangeTradesContainer
							type="trades"
							user={user}
							showFilters={true}
						/>
					</TabPane>
				)}
				{getPermissions().includes('/admin/deposits:get') && (
					<TabPane tab="Deposits" key="8">
						<DepositPage type="deposit" showFilters={true} />
					</TabPane>
				)}
				{getPermissions().includes('/admin/withdrawals:get') && (
					<TabPane tab="Withdrawals" key="9">
						<DepositPage type="withdrawal" showFilters={true} />
					</TabPane>
				)}
				{getPermissions().includes('/admin/fees:get') && (
					<TabPane tab="Earnings" key="10">
						<Earnings />
					</TabPane>
				)}
				{getPermissions().includes('/admin/transfer:post') && (
					<TabPane tab="Transfers" key="11">
						<Transfer />
					</TabPane>
				)}
				{getPermissions().includes('/admin/transfer:post') && (
					<TabPane tab="Duster" key="12">
						<Duster />
					</TabPane>
				)}
				{getPermissions().includes('/admin/transaction/limit:get') && (
					<TabPane tab="Limits" key="2">
						<TransactionLimits location={location} />
					</TabPane>
				)}
				{getPermissions().includes('/admin/kit:get') && (
					<TabPane tab="Fee Markups" key="1">
						<CoinConfiguration location={location} />
					</TabPane>
				)}
			</Tabs>
		</div>
	);
};

export default AdminFinancials;
