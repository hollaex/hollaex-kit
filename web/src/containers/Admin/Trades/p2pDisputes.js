import React, { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setExchange } from 'actions/assetActions';
import './index.css';

const TabPane = Tabs.TabPane;

const P2PDisputes = () => {
	const [hideTabs, setHideTabs] = useState(false);
	const [activeTab, setActiveTab] = useState('0');
	const [coinData, setCoinData] = useState([]);
	const [pairData, setPairData] = useState([]);
	const [quickTradeData, setQuickTradeData] = useState([]);

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const renderTabBar = (props, DefaultTabBar) => {
		if (hideTabs) return <div></div>;
		return <DefaultTabBar {...props} />;
	};

	return <div className="admin-earnings-container w-100"></div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(P2PDisputes);
