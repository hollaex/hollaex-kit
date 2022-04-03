import React, { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getTabParams } from '../AdminFinancials/Assets';
import PairsSummary from './PairsSummary';
import { getExchange } from '../AdminFinancials/action';
import { setExchange } from 'actions/assetActions';
import OtcDeskContainer from './otcdesk';
import './index.css';

const TabPane = Tabs.TabPane;

const PairsTab = (props) => {
	const [hideTabs, setHideTabs] = useState(false);
	const [activeTab, setActiveTab] = useState('0');
	const [coinData, setCoinData] = useState([]);
	const [pairData, setPairData] = useState([]);
	const tabParams = getTabParams();

	useEffect(() => {
		let exchangeCoins = [];
		let exchangePairs = [];
		props.coins.forEach((elem) => {
			if (props.exchange.coins && props.exchange.coins.includes(elem.symbol)) {
				exchangeCoins.push(elem);
			}
		});

		props.pairs.forEach((elem) => {
			if (props.exchange.pairs && props.exchange.pairs.includes(elem.code)) {
				exchangePairs.push(elem);
			}
		});
		setCoinData(exchangeCoins);
		setPairData(exchangePairs);
	}, [props.coins, props.pairs, props.exchange.coins, props.exchange.pairs]);

	useEffect(() => {
		if (tabParams) {
			setActiveTab(tabParams.tab);
		}
	}, [tabParams]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		props.router.replace('/admin/trade');
	};

	const handleHide = (value) => {
		setHideTabs(value);
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
				<TabPane tab="Public markets" key="0">
					<PairsSummary
						router={props.router}
						location={props.location}
						handleHide={handleHide}
						getMyExchange={getMyExchange}
					/>
				</TabPane>
				<TabPane tab="OTC desk" key="1">
					<OtcDeskContainer
						coins={coinData}
						pairs={pairData}
						allCoins={props.coins}
						exchange={props.exchange}
						user={props.user}
						balanceData={props.user && props.user.balance}
					/>
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
});

const mapDispatchToProps = (dispatch) => ({
	setExchange: bindActionCreators(setExchange, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PairsTab);
