import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import {
	HOLLAEX_LOGO_BLACK,
	IS_PRO_VERSION,
	PRO_URL,
	ICONS,
	DEFAULT_VERSION_REDIRECT
} from '../../config/constants';
import { LinkButton } from './LinkButton';

import STRINGS from '../../config/localizedStrings';

class AppBar extends Component {
	state = {
		symbolSelectorIsOpen: false
	};

	toogleSymbolSelector = () => {
		this.setState({ symbolSelectorIsOpen: !this.state.symbolSelectorIsOpen });
	};

	onChangeSymbol = (symbol) => {
		this.props.changeSymbol(symbol);
		this.toogleSymbolSelector();
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
			<div className={classnames(...WRAPPER_CLASSES)}>
				<LinkButton
					path="/account"
					text={STRINGS.ACCOUNT_TEXT}
					buttonClassName="contrast"
				/>
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
				className={classnames('app_bar-icon', 'text-uppercase', {
					contrast: !isHome
				})}
			>
				{isHome ? (
					<img
						src={HOLLAEX_LOGO_BLACK}
						alt={STRINGS.APP_NAME}
						className="app_bar-icon-logo"
					/>
				) : (
					<Link href={IS_PRO_VERSION ? PRO_URL : DEFAULT_VERSION_REDIRECT}>
						{STRINGS.APP_NAME}
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

		return (
			<div className={classnames('app_bar', { 'no-borders': noBorders })}>
				{this.renderIcon(isHome, theme)}
				<div className="app_bar-main d-flex justify-content-between">
					<div>{!isHome && STRINGS.APP_TITLE}</div>
				</div>
				{rightChildren
					? rightChildren
					: isHome && this.renderSplashActions(token, verifyingToken)}
			</div>
		);
	}
}

AppBar.defaultProps = {
	noBorders: false,
	isHome: false
};
export default AppBar;
