import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';

import Summarycontent from './Summarycontent';
import Onramp from './Onramp';
import Offramp from './offramp';
import PaymentAccounts from './PaymentAccounts';
import { getTabParams } from '../AdminFinancials/Assets';
// import Kyc from './Kyc';
import { setConfig } from 'actions/appActions';
import { constractPaymentOption } from 'utils/utils';

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
	const [isLoading, setIsLoading] = useState(false);
	const { user_payments = {}, onramp = {}, offramp = {} } = constants;
	const [offRampData, setOffRamp] = useState(offramp);
	const [onrampData, setOnRamp] = useState(onramp);
	const [userPaymentsData, setOnuserPaymentsData] = useState([]);

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

	useEffect(() => {
		const userPayments = constractPaymentOption(user_payments);
		setOnuserPaymentsData(userPayments);
	}, [user_payments]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		router.replace('/admin/fiat');
	};

	const getUpdatedKitData = (kitData) => {
		setOffRamp(kitData && kitData.offramp);
		setOnRamp(kitData && kitData.onramp);
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
						onramp={onrampData}
						offramp={offRampData}
						isGetExchange={isGetExchange}
					/>
				</TabPane>
				<TabPane tab="Payment accounts" key="1">
					<PaymentAccounts
						router={router}
						isUpgrade={isUpgrade}
						activeTab={activeTab}
						user_payments={user_payments}
						paymentsMethodsData={userPaymentsData}
						onramp={onrampData}
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
						onramp={onrampData}
						user_payments={user_payments}
						paymentsMethodsData={userPaymentsData}
						setConfig={setConfig}
						getUpdatedKitData={getUpdatedKitData}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
				</TabPane>
				<TabPane tab="Off-ramp" key="3">
					<Offramp
						activeTab={'offRamp'}
						handleTabChange={handleTabChange}
						coins={coins[0]}
						isUpgrade={isUpgrade}
						offramp={offRampData}
						user_payments={user_payments}
						paymentsMethodsData={userPaymentsData}
						setConfig={setConfig}
						getUpdatedKitData={getUpdatedKitData}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
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
