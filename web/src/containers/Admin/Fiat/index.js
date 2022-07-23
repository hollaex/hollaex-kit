import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';

import Summarycontent from './Summarycontent';
import Onramp from './Onramp';
import PaymentAccounts from './PaymentAccounts';
import { getTabParams } from '../AdminFinancials/Assets';
// import Kyc from './Kyc';
import { setConfig } from 'actions/appActions';

const TabPane = Tabs.TabPane;

const Fiatmarkets = ({
	router,
	exchange = {},
	coins = [],
	constants = {},
	setConfig,
}) => {
	const [activeTab, setActiveTab] = useState('0');
	const [isUpgrade, setIsUpgrade] = useState(false);
	const [isGetExchange, setIsGetExchange] = useState(false);
	const { user_payments = {}, onramp = {}, offramp = {} } = constants;
	const [offRampData, setOffRamp] = useState(offramp);

	useEffect(() => {
		if (exchange && Object.keys(exchange).length) {
			setIsGetExchange(true);
		}
		if (exchange?.plan === 'fiat' || exchange?.plan === 'boost') {
			setIsUpgrade(true);
		}
	}, [exchange]);

	const tabParams = getTabParams();
	useEffect(() => {
		if (tabParams && tabParams.tab) {
			setActiveTab(tabParams.tab);
		}
	}, [tabParams]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		router.replace('/admin/fiat');
	};

	const getUpdatedKitData = (kitData) => {
		setOffRamp(kitData && kitData.offramp);
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
						user_payments={user_payments}
						exchange={exchange}
						onramp={onramp}
						offramp={offRampData}
						isGetExchange={isGetExchange}
					/>
				</TabPane>
				<TabPane tab="Payment accounts" key="1">
					<PaymentAccounts
						currentActiveTab="paymentAccounts"
						router={router}
						isUpgrade={isUpgrade}
						activeTab={activeTab}
						user_payments={user_payments}
						onramp={onramp}
						offramp={offRampData}
						setConfig={setConfig}
					/>
				</TabPane>
				<TabPane tab="On-ramp" key="2">
					<Onramp
						activeTab={'onRamp'}
						handleTabChange={handleTabChange}
						coins={coins[0]}
						isUpgrade={isUpgrade}
						onramp={onramp}
						offramp={offRampData}
						user_payments={user_payments}
						setConfig={setConfig}
					/>
				</TabPane>
				<TabPane tab="Off-ramp" key="3">
					<Onramp
						activeTab={'offRamp'}
						handleTabChange={handleTabChange}
						coins={coins[0]}
						isUpgrade={isUpgrade}
						onramp={onramp}
						offramp={offRampData}
						user_payments={user_payments}
						setConfig={setConfig}
						getUpdatedKitData={getUpdatedKitData}
					/>
				</TabPane>
				{/* <TabPane tab="KYC" key="4">
					<Kyc />
				</TabPane> */}
			</Tabs>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setConfig: bindActionCreators(setConfig, dispatch),
});

const mapStateToProps = (state) => {
	return {
		exchange: state.asset && state.asset.exchange ? state.asset.exchange : {},
		coins: state.asset.allCoins,
		constants: state.app.constants,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Fiatmarkets);
