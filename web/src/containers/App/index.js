import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../actions/authAction';

import App from './App';

import {
	closeNotification,
	openContactForm,
	openHelpfulResourcesForm,
	setLanguage,
	setChatUnreadMessages
} from '../../actions/appActions';

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	symbol: store.orderbook.symbol,
	prices: store.orderbook.prices,
	activeNotification: store.app.activeNotification,
	verification_level: store.user.verification_level,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	pair: store.app.pair,
	orderbooks: store.orderbook.pairsOrderbooks,
	pairsTrades: store.orderbook.pairsTrades,
	unreadMessages: store.app.chatUnreadMessages,
	info: store.app.info,
	enabledPlugins: store.app.enabledPlugins
});

const mapDispatchToProps = (dispatch) => ({
	logout: bindActionCreators(logout, dispatch),
	closeNotification: bindActionCreators(closeNotification, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	openHelpfulResourcesForm: bindActionCreators(
		openHelpfulResourcesForm,
		dispatch
	),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	setChatUnreadMessages: bindActionCreators(setChatUnreadMessages, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
