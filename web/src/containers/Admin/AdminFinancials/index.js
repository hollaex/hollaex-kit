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
//import { getPermissions } from 'utils/token';
import { connect } from 'react-redux';

const TabPane = Tabs.TabPane;

const tabList = [
	'assets',
	'fee-markups',
	'limits',
	'summary',
	'wallet',
	'balances',
	'orders',
	'trades',
	'deposits',
	'withdrawals',
	'earnings',
	'transfers',
	'duster',
];

const AdminFinancials = ({ router, location, user, authUser }) => {
	const [activeTab, setActiveTab] = useState('0');
	const [hideTabs, setHideTabs] = useState(false);

	const tabParams = getTabParams();
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const tab = tabList?.find((data) => params.has(data));
		const tabIndex = tabList?.indexOf(tab);

		if (tab && tabIndex !== -1 && String(tabIndex) !== activeTab) {
			setActiveTab(String(tabIndex));
		} else if (!tab) {
			setActiveTab('0');
			const url = new URL(window.location.href);
			url.search = tabList[0] ? `?${tabList[0]}` : '';
			window.history.replaceState(null, '', url.toString());
		}
	}, [tabParams, activeTab]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		const url = new URL(window.location.href);
		url.search = tabList[key] ? `?${tabList[key]}` : '';
		window.history.replaceState(null, '', url.toString());
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
				{authUser?.permissions?.includes('/admin/balance:get') && (
					<TabPane tab="Assets" key="0">
						<Assets location={location} handleHide={handleHide} />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/balance:get') && (
					<TabPane tab="Summary" key="3">
						<Wallets router={router} />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/user/wallet:get') && (
					<TabPane tab="Wallet" key="4">
						<Wallet />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/balances:get') && (
					<TabPane tab="Balances" key="5">
						<Balances />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/orders:get') && (
					<TabPane tab="Orders" key="6">
						<ExchangeOrdersContainer
							type="orders"
							user={user}
							showFilters={true}
						/>
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/trades:get') && (
					<TabPane tab="Trades" key="7">
						<ExchangeTradesContainer
							type="trades"
							user={user}
							showFilters={true}
						/>
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/deposits:get') && (
					<TabPane tab="Deposits" key="8">
						<DepositPage type="deposit" showFilters={true} />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/withdrawals:get') && (
					<TabPane tab="Withdrawals" key="9">
						<DepositPage type="withdrawal" showFilters={true} />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/fees:get') && (
					<TabPane tab="Earnings" key="10">
						<Earnings />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/transfer:post') && (
					<TabPane tab="Transfers" key="11">
						<Transfer />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/transfer:post') && (
					<TabPane tab="Duster" key="12">
						<Duster />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/transaction/limit:get') && (
					<TabPane tab="Limits" key="2">
						<TransactionLimits location={location} />
					</TabPane>
				)}
				{authUser?.permissions?.includes('/admin/kit:get') && (
					<TabPane tab="Fee Markups" key="1">
						<CoinConfiguration location={location} />
					</TabPane>
				)}
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	authUser: state.user,
});

export default connect(mapStateToProps)(AdminFinancials);
