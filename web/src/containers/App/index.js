import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../actions/authAction';
import { setMe, setBalance, updateUser } from '../../actions/userAction';
import { addUserTrades } from '../../actions/walletActions';
import { menuItemsSelector } from './selector';

import {
	setUserOrders,
	addOrder,
	updateOrder,
	removeOrder,
} from '../../actions/orderAction';
import {
	setOrderbooks,
	setTrades,
	setOrderbook,
	addTrades,
	setPairsData,
} from '../../actions/orderbookAction';

import App from './App';

import {
	setTickers,
	setPairs,
	changePair,
	setCurrencies,
	setNotification,
	closeNotification,
	openContactForm,
	openHelpfulResourcesForm,
	setLanguage,
	changeTheme,
	closeAllNotification,
	setChatUnreadMessages,
	setOrderLimits,
	setSnackDialog,
	setConfig,
	setInfo,
	setIsReady,
} from '../../actions/appActions';

import { setPricesAndAsset } from 'actions/assetActions';

const mapStateToProps = (store) => ({
	menuItems: menuItemsSelector(store),
	isReady: store.app.isReady,
	coins: store.app.coins,
	symbol: store.orderbook.symbol,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	totalAsset: store.asset.totalAsset,
	oraclePrices: store.asset.oraclePrices,
	chartData: store.asset.chartData,
	activeNotification: store.app.activeNotification,
	// verification_level: store.user.verification_level,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	// user: store.user,
	pair: store.app.pair,
	pairs: store.app.pairs,
	unreadMessages: store.app.chatUnreadMessages,
	constants: store.app.constants,
	info: store.app.info,
	enabledPlugins: store.app.enabledPlugins,
	features: store.app.features,
	config_level: store.app.config_level,
	pairsTradesFetched: store.orderbook.pairsTradesFetched,
	injected_values: store.app.injected_values,
	injected_html: store.app.injected_html,
});

const mapDispatchToProps = (dispatch) => ({
	logout: bindActionCreators(logout, dispatch),
	addTrades: bindActionCreators(addTrades, dispatch),
	setOrderbook: bindActionCreators(setOrderbook, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	setBalance: bindActionCreators(setBalance, dispatch),
	setUserOrders: bindActionCreators(setUserOrders, dispatch),
	addOrder: bindActionCreators(addOrder, dispatch),
	updateOrder: bindActionCreators(updateOrder, dispatch),
	removeOrder: bindActionCreators(removeOrder, dispatch),
	addUserTrades: bindActionCreators(addUserTrades, dispatch),
	updateUser: bindActionCreators(updateUser, dispatch),
	closeNotification: bindActionCreators(closeNotification, dispatch),
	closeAllNotification: bindActionCreators(closeAllNotification, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	openHelpfulResourcesForm: bindActionCreators(
		openHelpfulResourcesForm,
		dispatch
	),
	setNotification: bindActionCreators(setNotification, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	setPairs: bindActionCreators(setPairs, dispatch),
	setPairsData: bindActionCreators(setPairsData, dispatch),
	setOrderbooks: bindActionCreators(setOrderbooks, dispatch),
	setTrades: bindActionCreators(setTrades, dispatch),
	setTickers: bindActionCreators(setTickers, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	setChatUnreadMessages: bindActionCreators(setChatUnreadMessages, dispatch),
	setOrderLimits: bindActionCreators(setOrderLimits, dispatch),
	setSnackDialog: bindActionCreators(setSnackDialog, dispatch),
	setCurrencies: bindActionCreators(setCurrencies, dispatch),
	setConfig: bindActionCreators(setConfig, dispatch),
	setInfo: bindActionCreators(setInfo, dispatch),
	setPricesAndAsset: bindActionCreators(setPricesAndAsset, dispatch),
	setIsReady: bindActionCreators(setIsReady, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
