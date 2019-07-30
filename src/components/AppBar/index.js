import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';
import {
	IS_PRO_VERSION,
	PRO_URL,
	DEFAULT_VERSION_REDIRECT,
	ICONS,
	BASE_CURRENCY
} from '../../config/constants';
import { LinkButton } from './LinkButton';
import PairTabs from './PairTabs';
import MenuList from './MenuList';
import { MobileBarWrapper } from '../';
import STRINGS from '../../config/localizedStrings';
import { isLoggedIn } from '../../utils/token';
import { getMe, setMe } from '../../actions/userAction';
import { getTickers, setNotification, NOTIFICATIONS } from '../../actions/appActions';

class AppBar extends Component {
	state = {
		symbolSelectorIsOpen: false,
		isAccountMenu: false,
		selectedMenu: '',
		securityPending: 0,
		verificationPending: 0
	};

	componentDidMount() {
		if (this.props.location && this.props.location.pathname) {
			this.setActiveMenu(this.props.location.pathname);
		}
		if (this.props.user) {
			this.checkVerificationStatus(this.props.user);
		}
		if (this.props.isHome && this.props.token) {
			this.getUserDetails();
		}
		this.props.getTickers();
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.location && nextProps.location
			&& this.props.location.pathname !== nextProps.location.pathname) {
			this.setActiveMenu(nextProps.location.pathname);
		}
		if (JSON.stringify(this.props.user) !== JSON.stringify(nextProps.user)) {
			this.checkVerificationStatus(nextProps.user);
		}
		if (this.props.token !== nextProps.token && nextProps.token && nextProps.isHome) {
			this.getUserDetails();
		}
	}

	getUserDetails = () => {
		return this.props.getMe()
			.then(({ value }) => {
				if (value && value.data && value.data.id) {
					this.props.setMe(value.data);
				}
			})
			.catch(err => {
				const message = err.message || JSON.stringify(err);
				this.props.setNotification(NOTIFICATIONS.ERROR, message);
			})
	};

	checkVerificationStatus = user => {
		let userData = user.userData || {};
		if (!Object.keys(userData).length && user.id) {
			userData = user;
		}
		const { phone_number, full_name, id_data = {}, bank_account = [] } = userData;
		let securityPending = 0;
		let verificationPending = 0;
		if (user.id) {
			if (!user.otp_enabled) {
				securityPending += 1;
			}
			if (user.verification_level < 1 && !full_name) {
				verificationPending += 1;
			}
			if (id_data.status === 0 || id_data.status === 2) {
				verificationPending += 1;
			}
			if (!phone_number) {
				verificationPending += 1;
			}
			if (bank_account.filter(acc => acc.status === 0 || acc.status === 2).length === bank_account.length) {
				verificationPending += 1;
			}
			this.setState({ securityPending, verificationPending });
		}
	};

	toogleSymbolSelector = () => {
		this.setState({ symbolSelectorIsOpen: !this.state.symbolSelectorIsOpen });
	};

	onChangeSymbol = (symbol) => {
		this.props.changeSymbol(symbol);
		this.toogleSymbolSelector();
	};

	handleAccountMenu = () => {
		this.setState({ isAccountMenu: !this.state.isAccountMenu });
	};

	closeAccountMenu = () => {
		this.setState({ isAccountMenu: false });
	};

	renderSymbolOption = ({ symbol, name, currencySymbol, iconPath }, index) => (
		<div
			key={index}
			className="app_bar-currency_option"
			onClick={() => this.onChangeSymbol(symbol)}
		>
			<img
				alt={symbol}
				src={iconPath}
				className="app_bar-currency_display-icon"
			/>
			<span>{STRINGS[`${symbol.toUpperCase()}_NAME`]}</span>
		</div>
	);

	renderSplashActions = (token, verifyingToken) => {
		const { securityPending, verificationPending } = this.state;
		if (verifyingToken) {
			return <div />;
		}

		const WRAPPER_CLASSES = ['app_bar-controllers-splash', 'd-flex'];
		return token ? (
			<div className="d-flex app-bar-account" onClick={this.handleSummary}>
				<div className="app-bar-account-content mr-2">
					<ReactSVG path={ICONS.SIDEBAR_ACCOUNT_INACTIVE} wrapperClassName="app-bar-currency-icon" />
					{!!(securityPending + verificationPending)
						&& <div className="app-bar-account-notification">{securityPending + verificationPending}</div>
					}
				</div>
				<div className="d-flex align-items-center">{STRINGS.ACCOUNT_TEXT}</div>
			</div>
		) : (
			<div className={classnames(...WRAPPER_CLASSES)}>
				<LinkButton
					path="/login"
					text={STRINGS.LOGIN_TEXT}
					buttonClassName="contrast"
				/>
			</div>
		);
	};

	renderIcon = (isHome, theme) => {
		return (
			<div
				className={classnames('app_bar-icon', 'text-uppercase')}
			>
				{isHome ? (
					<img
						src={ICONS.LOGO_GREY}
						alt={STRINGS.APP_NAME}
						className="app_bar-icon-logo"
					/>
				) : (
					<Link href={IS_PRO_VERSION ? PRO_URL : DEFAULT_VERSION_REDIRECT}>
						<ReactSVG path={ICONS.LOGO_BLACK} wrapperClassName="app_bar-icon-logo" />
					</Link>
				)}
			</div>
		);
	};

	handleSummary = () => {
		this.props.router.push('/summary');
	}
	handleMenu = menu => {
		if (menu === 'account') {
			this.props.router.push('/account');
		} else if (menu === 'security') {
			this.props.router.push('/security');
		} else if (menu === 'verification') {
			this.props.router.push('/verification');
		} else if (menu === 'wallet') {
			this.props.router.push('/wallet');
		} else if (menu === 'settings') {
			this.props.router.push('/settings');
		} /* else if (menu === 'api') {
			this.props.router.push('/api');
		} */ else if (menu === 'summary') {
			this.props.router.push('/summary');
		}
		this.setState({ selectedMenu: menu, isAccountMenu: false });
	};

	setActiveMenu = path => {
		let selectedMenu = this.state.selectedMenu;
		switch (path) {
			case '/account':
				selectedMenu = 'account';
				break;
			case '/summary':
				selectedMenu = 'summary';
				break;
			case '/wallet':
				selectedMenu = 'wallet';
				break;
			case '/security':
				selectedMenu = 'security';
				break;
			case '/settings':
				selectedMenu = 'settings';
				break;
			case '/verification':
				selectedMenu = 'verification';
				break;
			case '/api':
				selectedMenu = 'api';
				break;
			default:
				break;
		};
		this.setState({ selectedMenu });
	};

	render() {
		const {
			noBorders,
			token,
			verifyingToken,
			isHome,
			theme,
			logout,
			router,
			activePath,
			location,
			pairs
		} = this.props;
		const { isAccountMenu, selectedMenu, securityPending, verificationPending } = this.state;
		const totalPending = securityPending + verificationPending;
		let pair = '';
		if (Object.keys(pairs).length) {
			const { pair_base } = pairs[Object.keys(pairs)[0]];
			pair = `${pair_base}-${STRINGS[`${BASE_CURRENCY.toUpperCase()}_SHORTNAME_EN`].toLowerCase()}`;
		} else {
			pair = this.props.pair;
		}

		return isMobile ? (
			<MobileBarWrapper
				className={classnames(
					'd-flex',
					'app_bar-mobile',
					'align-items-center',
					isHome ? 'justify-content-between pl-4 pr-4' : 'justify-content-center'
				)}
			>
				<Link to="/">
					<ReactSVG path={ICONS.LOGO_GREY} wrapperClassName="homeicon-svg" />
				</Link>
				{isHome && this.renderSplashActions(token, verifyingToken)}
			</MobileBarWrapper>
		) : (
			<div className={classnames('app_bar justify-content-between', { 'no-borders': noBorders })}>
				<div className="d-flex">
					<div className="d-flex align-items-center justify-content-center h-100">
						{this.renderIcon(isHome, theme)}
					</div>
					{!isHome && <PairTabs activePath={activePath} location={location} router={router} />}
				</div>
				{!isHome
					? isLoggedIn()
						? <div className="d-flex app-bar-account">
							<div className="d-flex app_bar-quicktrade-container">
									<Link to='/trade/add/tabs'>
									<div
										className={classnames(
											'app_bar-quicktrade',
											'd-flex',
											{ "quick_trade-active": location.pathname === '/trade/add/tabs' })}>
										<ReactSVG
											path={ICONS.SIDEBAR_TRADING_ACTIVE}
												wrapperClassName="quicktrade_icon mx-1" />
										<div className="d-flex align-items-center">{STRINGS.PRO_TRADE}</div>
									</div>
								</Link>
								<Link to={`/quick-trade/${pair}`}>
									<div
										className={classnames(
											'app_bar-quicktrade',
											'd-flex',
											{ "quick_trade-active": activePath === 'quick-trade' })}>
										<ReactSVG
											path={ICONS.QUICK_TRADE_TAB_ACTIVE}
											wrapperClassName="quicktrade_icon" />
										<div className="d-flex align-items-center">{STRINGS.QUICK_TRADE}</div>
									</div>
								</Link>
							</div>
							<div
								className={classnames(
									"app-bar-account-content",
									{ "account-inactive": activePath !== 'account' && activePath !== 'wallet' }
								)}
								onClick={this.handleAccountMenu} >
								<ReactSVG path={ICONS.SIDEBAR_ACCOUNT_INACTIVE} wrapperClassName="app-bar-account-icon" />
								{!!totalPending && <div className="app-bar-account-notification">{totalPending}</div>}
							</div>
						</div>
						: null
					: this.renderSplashActions(token, verifyingToken)
				}
				{isAccountMenu &&
					<MenuList
						selectedMenu={selectedMenu}
						securityPending={securityPending}
						verificationPending={verificationPending}
						handleMenu={this.handleMenu}
						logout={logout}
						activePath={activePath}
						closeAccountMenu={this.closeAccountMenu}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const userData = (!state.user.id && ownProps.user && ownProps.user.id) ? ownProps.user : state.user;
	return {
		user: userData,
		theme: state.app.theme,
		pair: state.app.pair,
		pairs: state.app.pairs
}};

const mapDispatchToProps = (dispatch) => ({
	getMe: bindActionCreators(getMe, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch)
});

AppBar.defaultProps = {
	noBorders: false,
	isHome: false
};

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
