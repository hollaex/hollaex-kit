/* eslint-disable */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';

import './index.css';
import P2PDeals from './p2pDeals';
import P2PDisputes from './p2pDisputes';
import P2PSettings from './p2pSettings';
import P2PActive from './p2pActive';
import P2PUnverifiedPayments from './p2punverifiedPayments';
import { setExchange } from 'actions/assetActions';
import P2PFeedbacks from './p2pFeedbacks';

const TabPane = Tabs.TabPane;

const P2P = () => {
	const [hideTabs, setHideTabs] = useState(false);
	const [activeTab, setActiveTab] = useState('1');

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const renderTabBar = (props, DefaultTabBar) => {
		if (hideTabs) return <div></div>;
		return <DefaultTabBar {...props} />;
	};

	return (
		<div className="admin-earnings-container blue-admin-tab-wrapper w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
				renderTabBar={renderTabBar}
			>
				<TabPane tab="P2P public deals" key="0">
					<P2PDeals />
				</TabPane>
				<TabPane tab="P2P settings" key="1">
					<P2PSettings />
				</TabPane>
				<TabPane tab="Active" key="2">
					<P2PActive />
				</TabPane>
				<TabPane tab="Disputes" key="3">
					<P2PDisputes />
				</TabPane>
				<TabPane tab="Unverified accounts" key="4">
					<P2PUnverifiedPayments />
				</TabPane>
				<TabPane tab="Feedbacks" key="5">
					<P2PFeedbacks />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	exchange: state.asset && state.asset.exchange,
	coins: state.asset.allCoins,
	pairs: state.asset.allPairs,
	user: state.user,
	quicktrade: state.app.allContracts.quicktrade,
	networkQuickTrades: state.app.allContracts.networkQuickTrades,
	coinObjects: state.app.allContracts.coins,
	broker: state.app.broker,
	features: state.app.constants.features,
});

const mapDispatchToProps = (dispatch) => ({
	setExchange: bindActionCreators(setExchange, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(P2P);
