import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import Earnings from './Earnings';
import Duster from './Duster';
import Wallets from '../Wallets';
import DepositPage from '../DepositsPage';
import Transfer from '../Transfers';
import ExchangeOrdersContainer from '../Orders';

import Assets, { getTabParams } from './Assets';
import './index.css';

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
				<TabPane tab="Summary" key="1">
					<Wallets router={router} />
				</TabPane>
				<TabPane tab="Orders" key="2">
					<ExchangeOrdersContainer
						type="orders"
						user={user}
						showFilters={true}
					/>
				</TabPane>
				<TabPane tab="Deposits" key="3">
					<DepositPage type="deposit" showFilters={true} />
				</TabPane>
				<TabPane tab="Withdrawals" key="4">
					<DepositPage type="withdrawal" showFilters={true} />
				</TabPane>
				<TabPane tab="Earnings" key="5">
					<Earnings />
				</TabPane>
				<TabPane tab="Transfers" key="6">
					<Transfer />
				</TabPane>
				<TabPane tab="Duster" key="7">
					<Duster />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
});

export default connect(mapStateToProps)(AdminFinancials);
