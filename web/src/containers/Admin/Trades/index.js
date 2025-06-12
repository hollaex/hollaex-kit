import React, { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getTabParams } from '../AdminFinancials/Assets';
import PairsSummary from './PairsSummary';
import { getExchange } from '../AdminFinancials/action';
import { setExchange } from 'actions/assetActions';
import OtcDeskContainer from './otcdesk';
import QuickTradeTab from './QuickTradeConfig';
import ExchangeOrdersContainer from '../Orders';
import P2P from './p2p';
//import { getPermissions } from 'utils/token';
import './index.css';

const TabPane = Tabs.TabPane;

const tabList = ['public-markets', 'orders', 'otc-desk', 'p2p', 'quick-trade'];

const PairsTab = (props) => {
	const [hideTabs, setHideTabs] = useState(false);
	const [activeTab, setActiveTab] = useState('0');
	const [coinData, setCoinData] = useState([]);
	const [pairData, setPairData] = useState([]);
	const [quickTradeData, setQuickTradeData] = useState([]);
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
		setQuickTradeData(props.quicktrade);
	}, [
		props.coins,
		props.pairs,
		props.exchange.coins,
		props.exchange.pairs,
		props.quicktrade,
	]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const tab = tabList?.find((data) => params.has(data));
		const tabIndex = tabList?.indexOf(tab);

		if (tabParams?.tab) {
			tabList?.length > tabParams?.tab
				? setActiveTab(tabParams?.tab)
				: setActiveTab('0');
		} else if (tab && tabIndex !== -1 && String(tabIndex) !== activeTab) {
			setActiveTab(String(tabIndex));
		} else if (!tab) {
			setActiveTab('0');
			const url = new URL(window.location.href);
			url.search = `?${tabList[0]}`;
			window.history.replaceState(null, '', url.toString());
		}
	}, [tabParams, activeTab]);

	const handleTabChange = (key) => {
		setActiveTab(key);
		const url = new URL(window.location.href);
		url.search = tabList[key] ? `?${tabList[key]}` : '';
		window.history.replaceState(null, '', url.toString());
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
				{props?.user?.permissions?.includes('/admin/pairs/network:get') && (
					<TabPane tab="Public markets" key="0">
						<PairsSummary
							router={props.router}
							location={props.location}
							handleHide={handleHide}
							getMyExchange={getMyExchange}
						/>
					</TabPane>
				)}
				{props?.user?.permissions?.includes('/admin/orders:get') && (
					<TabPane tab="Orders" key="1">
						<ExchangeOrdersContainer />
					</TabPane>
				)}
				{props?.user?.permissions?.includes('/admin/broker:get') && (
					<TabPane tab="OTC desk" key="2">
						<OtcDeskContainer
							coins={coinData}
							pairs={pairData}
							allCoins={props.coins}
							exchange={props.exchange}
							user={props.user}
							balanceData={props.user && props.user.balance}
						/>
					</TabPane>
				)}
				{props?.user?.permissions?.includes('/admin/p2p/dispute:get') && (
					<TabPane tab="P2P" key="3">
						<P2P
							coins={props.coinObjects}
							pairs={pairData}
							allCoins={props.coins}
							exchange={props.exchange}
							user={props.user}
							balanceData={props.user && props.user.balance}
							quickTradeData={quickTradeData}
							features={props.features}
							brokers={props.broker}
							networkQuickTrades={props.networkQuickTrades}
							handleTabChange={handleTabChange}
						/>
					</TabPane>
				)}
				{props?.user?.permissions?.includes('/admin/exchange:put') && (
					<TabPane tab="Quick Trade" key="4">
						<QuickTradeTab
							coins={props.coinObjects}
							pairs={pairData}
							allCoins={props.coins}
							exchange={props.exchange}
							user={props.user}
							balanceData={props.user && props.user.balance}
							quickTradeData={quickTradeData}
							features={props.features}
							brokers={props.broker}
							networkQuickTrades={props.networkQuickTrades}
							handleTabChange={handleTabChange}
						/>
					</TabPane>
				)}
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

export default connect(mapStateToProps, mapDispatchToProps)(PairsTab);
