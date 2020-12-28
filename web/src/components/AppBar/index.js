import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import Image from 'components/Image';
import { isMobile } from 'react-device-detect';
import { DEFAULT_URL, IS_XHT } from 'config/constants';
import { LinkButton } from './LinkButton';
import MenuList from './MenuList';
import { MobileBarWrapper } from '../';
import STRINGS from '../../config/localizedStrings';
import { isLoggedIn } from '../../utils/token';
import { getMe, setMe } from '../../actions/userAction';
import {
	getTickers,
	setNotification,
	changeTheme,
	NOTIFICATIONS,
} from '../../actions/appActions';
import { updateUserSettings, setUserData } from '../../actions/userAction';
import ThemeSwitcher from './ThemeSwitcher';
import { EditWrapper } from 'components';
import withEdit from 'components/EditProvider/withEdit';
import withConfig from 'components/ConfigProvider/withConfig';

class AppBar extends Component {
	state = {
		symbolSelectorIsOpen: false,
		isAccountMenu: false,
		selectedMenu: '',
		securityPending: 0,
		verificationPending: 0,
		walletPending: 0,
		selected: '',
	};

	componentDidMount() {
		if (this.props.location && this.props.location.pathname) {
			this.setActiveMenu(this.props.location.pathname);
		}
		if (this.props.user) {
			this.checkVerificationStatus(this.props.user, this.props.enabledPlugins);
			this.checkWalletStatus(this.props.user, this.props.coins);
		}
		if (this.props.isHome && this.props.token) {
			this.getUserDetails();
		}
		this.props.getTickers();
		if (this.props.theme) {
			this.setSelectedTheme(this.props.theme);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			this.props.location &&
			nextProps.location &&
			this.props.location.pathname !== nextProps.location.pathname
		) {
			this.setActiveMenu(nextProps.location.pathname);
		}
		if (JSON.stringify(this.props.user) !== JSON.stringify(nextProps.user)) {
			this.checkVerificationStatus(nextProps.user, nextProps.enabledPlugins);
			this.checkWalletStatus(nextProps.user, nextProps.coins);
		}
		if (
			this.props.token !== nextProps.token &&
			nextProps.token &&
			nextProps.isHome
		) {
			this.getUserDetails();
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.theme !== this.props.theme) {
			this.setSelectedTheme(this.props.theme);
		}
	}

	setSelectedTheme = (theme) => {
		const { themeOptions } = this.props;
		const selected = (
			themeOptions.find(({ value }) => value === theme) || themeOptions[0]
		).value;
		this.setState({ selected });
	};

	getUserDetails = () => {
		return this.props
			.getMe()
			.then(({ value }) => {
				if (value && value.data && value.data.id) {
					this.props.setMe(value.data);
				}
			})
			.catch((err) => {
				const message = err.message || JSON.stringify(err);
				this.props.setNotification(NOTIFICATIONS.ERROR, message);
			});
	};

	checkVerificationStatus = (user, enabledPlugins) => {
		let userData = user.userData || {};
		if (!Object.keys(userData).length && user.id) {
			userData = user;
		}
		const {
			phone_number,
			full_name,
			id_data = {},
			bank_account = [],
		} = userData;
		let securityPending = 0;
		let verificationPending = 0;
		if (user.id) {
			if (!user.otp_enabled) {
				securityPending += 1;
			}
			if (
				user.verification_level < 1 &&
				!full_name &&
				enabledPlugins.includes('kyc')
			) {
				verificationPending += 1;
			}
			if (
				(id_data.status === 0 || id_data.status === 2) &&
				enabledPlugins.includes('kyc')
			) {
				verificationPending += 1;
			}
			if (!phone_number && enabledPlugins.includes('sms')) {
				verificationPending += 1;
			}
			if (
				bank_account.filter((acc) => acc.status === 0 || acc.status === 2)
					.length === bank_account.length &&
				enabledPlugins.includes('bank')
			) {
				verificationPending += 1;
			}
			this.setState({ securityPending, verificationPending });
		}
	};

	checkWalletStatus = (user, coins) => {
		let walletPending = false;
		if (user.balance) {
			walletPending = true;
			Object.keys(coins).forEach((pair) => {
				if (user.balance[`${pair.toLowerCase()}_balance`] > 0) {
					walletPending = false;
				}
			});
		}
		this.setState({ walletPending: walletPending ? 1 : 0 });
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

	handleTheme = (selected) => {
		const { isEditMode, themeOptions } = this.props;
		if (!isLoggedIn() || isEditMode) {
			this.props.changeTheme(selected);
			localStorage.setItem('theme', selected);
		} else {
			const { settings = { interface: {} } } = this.props.user;
			const settingsObj = { interface: { ...settings.interface } };
			const theme = (
				themeOptions.find(({ value }) => value === selected) || themeOptions[0]
			).value;
			settingsObj.interface.theme = theme;
			return updateUserSettings(settingsObj)
				.then(({ data }) => {
					this.props.setUserData(data);
					if (data.settings && data.settings.interface) {
						this.props.changeTheme(data.settings.interface.theme);
						localStorage.setItem('theme', data.settings.interface.theme);
					}
				})
				.catch((err) => {
					const error = { _error: err.message };
					if (err.response && err.response.data) {
						error._error = err.response.data.message;
					}
				});
		}
	};

	closeAccountMenu = () => {
		this.setState({ isAccountMenu: false });
	};

	renderSymbolOption = ({ symbol, name, currencySymbol, iconPath }, index) => {
		const { fullname } = this.props.coins[symbol] || {};
		return (
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
				<span>{fullname}</span>
			</div>
		);
	};

	renderSplashActions = (token, verifyingToken) => {
		const { securityPending, verificationPending, walletPending } = this.state;
		const { icons: ICONS } = this.props;
		if (verifyingToken) {
			return <div />;
		}

		const totalPending = IS_XHT
			? securityPending + walletPending
			: securityPending + verificationPending;

		const WRAPPER_CLASSES = ['app_bar-controllers-splash', 'd-flex'];
		return token ? (
			<div className="d-flex app-bar-account" onClick={this.handleSummary}>
				<div className="app-bar-account-content mr-2">
					<Image
						iconId="SIDEBAR_ACCOUNT_INACTIVE"
						icon={ICONS['SIDEBAR_ACCOUNT_INACTIVE']}
						wrapperClassName="app-bar-currency-icon"
					/>
					{!!totalPending && (
						<div className="app-bar-account-notification">{totalPending}</div>
					)}
				</div>
				<EditWrapper stringId="ACCOUNT_TEXT">
					<div className="d-flex align-items-center">
						{STRINGS['ACCOUNT_TEXT']}
					</div>
				</EditWrapper>
			</div>
		) : (
			<div className={classnames(...WRAPPER_CLASSES)}>
				<LinkButton
					path="/login"
					text={STRINGS['LOGIN_TEXT']}
					buttonClassName="contrast"
				/>
			</div>
		);
	};

	renderIcon = (isHome) => {
		const { icons: ICONS, isEditMode } = this.props;
		return (
			<div className={classnames('app_bar-icon', 'text-uppercase', 'h-100')}>
				<div className="d-flex h-100">
					<Link
						to={DEFAULT_URL}
						className={classnames(
							{ 'disabled-link': isHome || isEditMode },
							'h-100'
						)}
					>
						<Image
							iconId="EXCHANGE_LOGO"
							icon={ICONS['EXCHANGE_LOGO']}
							wrapperClassName="app_bar-icon-logo h-100"
						/>
					</Link>
					<EditWrapper iconId="EXCHANGE_LOGO" position={[-5, 5]} />
				</div>
			</div>
		);
	};

	handleSummary = () => {
		this.props.router.push('/summary');
	};
	handleMenu = (menu) => {
		const { pairs } = this.props;

		let pair = '';
		if (Object.keys(pairs).length) {
			pair = Object.keys(pairs)[0];
		} else {
			pair = this.props.pair;
		}

		if (menu === 'account') {
			this.props.router.push('/account');
		} else if (menu === 'security') {
			this.props.router.push('/security');
		} else if (menu === 'history') {
			this.props.router.push('/transactions');
		} else if (menu === 'verification') {
			this.props.router.push('/verification');
		} else if (menu === 'wallet') {
			this.props.router.push('/wallet');
		} else if (menu === 'settings') {
			this.props.router.push('/settings');
		} /* else if (menu === 'api') {
			this.props.router.push('/api');
		} */ else if (
			menu === 'summary'
		) {
			this.props.router.push('/summary');
		} else if (menu === 'quick-trade') {
			this.props.router.push(`/quick-trade/${pair}`);
		} else if (menu === 'pro-trade') {
			this.props.router.push('/trade/add/tabs');
		}
		this.setState({ selectedMenu: menu, isAccountMenu: false });
	};

	setActiveMenu = (path) => {
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
			case '/transactions':
				selectedMenu = 'history';
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
			case '/trade/add/tabs':
				selectedMenu = 'pro-trade';
				break;
			default:
				break;
		}

		if (path.includes('quick-trade')) {
			selectedMenu = 'quick-trade';
		}

		this.setState({ selectedMenu });
	};

	onToggle = (theme) => {
		this.setSelectedTheme(theme);
		this.handleTheme(theme);
	};

	render() {
		const {
			// noBorders,
			token,
			verifyingToken,
			isHome,
			theme,
			logout,
			activePath,
			location,
			onHelp,
			// user,
			constants = {},
			children,
		} = this.props;
		const {
			selectedMenu,
			securityPending,
			verificationPending,
			walletPending,
		} = this.state;

		let disableBorder = false;
		// noBorders || (activePath !== 'trade' && activePath !== 'quick-trade');
		const { selected } = this.state;
		const { themeOptions } = this.props;
		return isMobile ? (
			<MobileBarWrapper
				className={classnames(
					'd-flex',
					'app_bar-mobile',
					'align-items-center',
					isHome
						? 'justify-content-between pl-4 pr-4'
						: 'justify-content-center'
				)}
			>
				<Link to="/">
					<div
						style={{
							backgroundImage: `url(${constants.logo_image})`,
						}}
						className="homeicon-svg"
					/>
				</Link>
				{isHome && this.renderSplashActions(token, verifyingToken)}
			</MobileBarWrapper>
		) : (
			<div
				className={classnames('app_bar d-flex justify-content-between', {
					'no-borders': disableBorder,
				})}
			>
				<div
					id="home-nav-container"
					className="d-flex align-items-center justify-content-center h-100"
				>
					{this.renderIcon(isHome, theme)}
				</div>
				{children}
				{!isLoggedIn() && (
					<div id="trade-nav-container">
						<ThemeSwitcher
							selected={selected}
							options={themeOptions}
							toggle={this.onToggle}
						/>
					</div>
				)}
				{!isHome ? (
					isLoggedIn() ? (
						<div
							id="trade-nav-container"
							className="d-flex app-bar-account justify-content-end"
						>
							<div className="d-flex app_bar-quicktrade-container">
								<ThemeSwitcher
									selected={selected}
									options={themeOptions}
									toggle={this.onToggle}
								/>
							</div>
							<MenuList
								selectedMenu={selectedMenu}
								securityPending={securityPending}
								verificationPending={verificationPending}
								walletPending={walletPending}
								handleMenu={this.handleMenu}
								logout={logout}
								activePath={activePath}
								closeAccountMenu={this.closeAccountMenu}
								onHelp={onHelp}
								location={location}
							/>
						</div>
					) : null
				) : (
					this.renderSplashActions(token, verifyingToken)
				)}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const userData =
		!state.user.id && ownProps.user && ownProps.user.id
			? ownProps.user
			: state.user;
	return {
		user: userData,
		theme: state.app.theme,
		pair: state.app.pair,
		pairs: state.app.pairs,
		coins: state.app.coins,
		info: state.app.info,
		enabledPlugins: state.app.enabledPlugins,
		constants: state.app.constants,
		activeLanguage: state.app.language,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getMe: bindActionCreators(getMe, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	setUserData: bindActionCreators(setUserData, dispatch),
});

AppBar.defaultProps = {
	noBorders: false,
	isHome: false,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withEdit(withConfig(AppBar)));
