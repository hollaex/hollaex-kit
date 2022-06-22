import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import Summarycontent from './Summarycontent';
// import Onramp from './Onramp';
// import PaymentAccounts from './PaymentAccounts';
import { getTabParams } from '../AdminFinancials/Assets';
import Kyc from './Kyc';

const TabPane = Tabs.TabPane;

const Fiatmarkets = ({ router, exchange = {}, coins = [] }) => {
	const [activeTab, setActiveTab] = useState('0');
	const [isUpgrade, setIsUpgrade] = useState(false);

	useEffect(() => {
		if (exchange === 'fiat' || exchange === 'boost') {
			setIsUpgrade(false);
		}
	}, [exchange]);

	const tabParams = getTabParams();
	useEffect(() => {
		if (tabParams) {
			setActiveTab(tabParams.tab);
		}
	}, [tabParams]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		router.replace('/admin/fiat');
	};

	const renderTabBar = (props, DefaultTabBar) => {
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
				<TabPane tab="Summary" key="0">
					<Summarycontent
						handleTabChange={handleTabChange}
						coins={coins}
						isUpgrade={isUpgrade}
					/>
				</TabPane>
				<TabPane tab="Payment accounts" key="1">
					{/* <PaymentAccounts
						router={router}
						isUpgrade={isUpgrade}
					/> */}
				</TabPane>
				<TabPane tab="On-ramp" key="2">
					{/* <Onramp
						activeTab={'On-ramp'}
						handleTabChange={handleTabChange}
						coins={coins[0]}
						isUpgrade={isUpgrade}
					/> */}
				</TabPane>
				<TabPane tab="Off-ramp" key="3">
					{/* <Onramp
						activeTab={'Off-ramp'}
						handleTabChange={handleTabChange}
						coins={coins[0]}
						isUpgrade={isUpgrade}
					/> */}
				</TabPane>
				<TabPane tab="KYC" key="4">
					<Kyc />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.asset && state.asset.exchange ? state.asset.exchange : {},
		coins: state.asset.allCoins,
	};
};

export default connect(mapStateToProps, null)(Fiatmarkets);
