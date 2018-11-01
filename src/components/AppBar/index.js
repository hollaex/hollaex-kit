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
import { MobileBarWrapper } from '../';
import STRINGS from '../../config/localizedStrings';

class AppBar extends Component {
	state = {
		symbolSelectorIsOpen: false,
		isAccountMenu: false
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
				<div className="app-bar-account-content mr-5">
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
	render() {
		const {
			noBorders,
			token,
			verifyingToken,
			isHome,
			theme,
			rightChildren
		} = this.props;
		const { isAccountMenu } = this.state;

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
							? <Link to="/quick-trade">
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
				{isAccountMenu && <div className="app-bar-account-menu">
					<div className="d-flex app-bar-account-menu-list">
						<div className="app-bar-account-content mr-2">
							<ReactSVG path={ICONS.SIDEBAR_ACCOUNT_INACTIVE} wrapperClassName="app-bar-account-list-icon" />
							<div className="app-bar-account-notification">2</div>
						</div>
						<div>{STRINGS.ACCOUNT_TEXT}</div>
					</div>
					<div className="app-bar-account-menu-list d-flex">
						<ReactSVG path={ICONS.TAB_SUMMARY} wrapperClassName="app-bar-account-list-icon" />
						{STRINGS.ACCOUNTS.TAB_SUMMARY}
					</div>
					<div className="app-bar-account-menu-list d-flex">
						<ReactSVG path={ICONS.TAB_WALLET} wrapperClassName="app-bar-account-list-icon" />
						{STRINGS.ACCOUNTS.TAB_WALLET}
					</div>
					<div className={classnames('app-bar-account-menu-list d-flex', { 'notification': true })}>
						<div className="app-bar-account-list-notification">1</div>
						<ReactSVG path={ICONS.TAB_SECURITY} wrapperClassName="app-bar-account-list-icon" />
						{STRINGS.ACCOUNTS.TAB_SECURITY}
					</div>
					<div className={classnames('app-bar-account-menu-list d-flex', { 'notification': true })}>
						<div className="app-bar-account-list-notification">2</div>
						<ReactSVG path={ICONS.TAB_VERIFY} wrapperClassName="app-bar-account-list-icon" />
						{STRINGS.ACCOUNTS.TAB_VERIFICATION}
					</div>
					<div className="app-bar-account-menu-list d-flex">
						<ReactSVG path={ICONS.TAB_SETTING} wrapperClassName="app-bar-account-list-icon" />
						{STRINGS.ACCOUNTS.TAB_SETTINGS}
					</div>
					<div className="app-bar-account-menu-list d-flex">
						<ReactSVG path={ICONS.TAB_API} wrapperClassName="app-bar-account-list-icon" />
						{STRINGS.ACCOUNTS.TAB_API}
					</div>
					<div className="app-bar-account-menu-list d-flex">
						<ReactSVG path={ICONS.TAB_SIGNOUT} wrapperClassName="app-bar-account-list-icon" />
						{STRINGS.ACCOUNTS.TAB_SIGNOUT}
					</div>
				</div>}
			</div>
		);
	}
}

AppBar.defaultProps = {
	noBorders: false,
	isHome: false
};

export default AppBar;
