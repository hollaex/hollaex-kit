import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';
import {
	HOLLAEX_LOGO,
	HOLLAEX_LOGO_BLACK,
	IS_PRO_VERSION,
	PRO_URL,
	DEFAULT_VERSION_REDIRECT,
	ICONS
} from '../../config/constants';
import { LinkButton } from './LinkButton';
import PairTabs from './PairTabs';
import MenuList from './MenuList';
import { MobileBarWrapper } from '../';
import STRINGS from '../../config/localizedStrings';

class AppBar extends Component {
	state = {
		symbolSelectorIsOpen: false,
		isAccountMenu: false,
		selectedMenu: ''
	};

	componentDidMount() {
		if (this.props.location && this.props.location.pathname) {
			this.setActiveMenu(this.props.location.pathname);
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.location && nextProps.location
			&& this.props.location.pathname !== nextProps.location.pathname) {
			this.setActiveMenu(nextProps.location.pathname);
		}
	}

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
		if (verifyingToken) {
			return <div />;
		}

		const WRAPPER_CLASSES = ['app_bar-controllers-splash', 'd-flex'];
		return token ? (
			<div className="d-flex app-bar-account" onClick={this.handleAccountMenu}>
				<div className="app-bar-account-content mr-2">
					<ReactSVG path={ICONS.SIDEBAR_ACCOUNT_INACTIVE} wrapperClassName="app-bar-currency-icon" />
					<div className="app-bar-account-notification">2</div>
				</div>
				<div>{STRINGS.ACCOUNT_TEXT}</div>
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
						src={HOLLAEX_LOGO}
						alt={STRINGS.APP_NAME}
						className="app_bar-icon-logo"
					/>
				) : (
					<Link href={IS_PRO_VERSION ? PRO_URL : DEFAULT_VERSION_REDIRECT}>
						<ReactSVG path={HOLLAEX_LOGO_BLACK} wrapperClassName="app_bar-icon-logo" />
					</Link>
				)}
			</div>
		);
	};

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
		}  else if (menu === 'summary') {
			this.props.router.push('/summary');
		} */
		this.setState({ selectedMenu: menu });
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
			logout
		} = this.props;
		const { isAccountMenu, selectedMenu } = this.state;

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
					<ReactSVG path={HOLLAEX_LOGO_BLACK} wrapperClassName="homeicon-svg" />
				</Link>
				{isHome && this.renderSplashActions(token, verifyingToken)}
			</MobileBarWrapper>
		) : (
			<div className={classnames('app_bar justify-content-between', { 'no-borders': noBorders })}>
				<div className="d-flex">
					{this.renderIcon(isHome, theme)}
					<div className="d-flex ml-2 mr-2">
						{!isHome
							? <Link to="/quick-trade/btc-eth">
								<div className='app_bar-quicktrade d-flex'>
									<ReactSVG path={ICONS.QUICK_TRADE_TAB} wrapperClassName="quicktrade_icon" />
									{STRINGS.QUICK_TRADE}
								</div>
							</Link>
							: null
						}
					</div>
					{!isHome && <PairTabs />}
				</div>
				{!isHome
					? <div className="d-flex app-bar-account" onClick={this.handleAccountMenu}>
						<div className="app-bar-account-content mr-2">
							<ReactSVG path={ICONS.SIDEBAR_ACCOUNT_INACTIVE} wrapperClassName="app-bar-account-icon" />
							<div className="app-bar-account-notification">2</div>
						</div>
						<div>{STRINGS.ACCOUNT_TEXT}</div>
					</div>
					: this.renderSplashActions(token, verifyingToken)
				}
				{isAccountMenu && <MenuList selectedMenu={selectedMenu} handleMenu={this.handleMenu} logout={logout} />}
			</div>
		);
	}
}

AppBar.defaultProps = {
	noBorders: false,
	isHome: false
};

export default AppBar;
