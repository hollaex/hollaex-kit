import React, { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Pairs from './Pairs';
import { getTabParams } from '../AdminFinancials/Assets';
import PairsSummary from './PairsSummary';
import { getExchange } from '../AdminFinancials/action';
import { setExchange } from 'actions/assetActions';
import './index.css';

const TabPane = Tabs.TabPane;

const PairsTab = (props) => {
	const [hideTabs, setHideTabs] = useState(false);
	const [activeTab, setActiveTab] = useState('0');
	const tabParams = getTabParams();

	useEffect(() => {
		if (tabParams) {
			setActiveTab(tabParams.tab);
		}
	}, [tabParams]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		props.router.replace('/admin/trade');
	};

	const handleHide = () => {
		setHideTabs((v) => !v);
	};

	const renderTabBar = (props, DefaultTabBar) => {
		if (hideTabs) return <div></div>;
		return <DefaultTabBar {...props} />;
	};

	const getMyExchange = async () => {
		try {
			const res = await getExchange();
			const exchange = res.data;
			props.setExchange(exchange);
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	return (
		<div className="admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
				renderTabBar={renderTabBar}
			>
				<TabPane tab="Summary" key="0">
					<PairsSummary getMyExchange={getMyExchange}/>
				</TabPane>
				<TabPane tab="OrderBook" key="1">
					<Pairs
						location={props.location}
						handleHide={handleHide}
						getMyExchange={getMyExchange}
					/>
				</TabPane>
				<TabPane tab="OTC Broker" key="2">
					<div>OTC Broker</div>
				</TabPane>
				<TabPane tab="Volumes" key="3">
					<div>Volumes</div>
				</TabPane>
				<TabPane tab="Active orders" key="4">
					<div>Active orders</div>
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setExchange: bindActionCreators(setExchange, dispatch),
});

export default connect(mapDispatchToProps)(PairsTab);
