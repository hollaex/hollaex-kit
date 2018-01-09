import React, { Component } from 'react';
import classnames from 'classnames';
import { EXIR_BLUE_LOGO } from '../../config/constants';
import { LinkButton } from './LinkButton';
import { LanguageSelector } from '../';

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
				<LinkButton path="/account" text={STRINGS.LOGIN_TEXT} />
				<LinkButton
					path="/signup"
					text={STRINGS.SIGNUP_TEXT}
					buttonClassName="contrast"
				/>
			</div>
		);
	};

	render() {
		const {
			goToDashboard,
			noBorders,
			token,
			verifyingToken,
			isHome,
			rightChildren
		} = this.props;

		return (
			<div className={classnames('app_bar', { 'no-borders': noBorders })}>
				<div
					className={classnames('app_bar-icon', 'text-uppercase', {
						contrast: !isHome,
						pointer: !!goToDashboard
					})}
					onClick={goToDashboard}
				>
					{isHome ? (
						<img
							src={EXIR_BLUE_LOGO}
							alt={STRINGS.APP_NAME}
							className="app_bar-icon-logo"
						/>
					) : (
						STRINGS.APP_NAME
					)}
				</div>
				<div className="app_bar-main d-flex justify-content-between">
					<div>{!isHome && STRINGS.APP_TITLE}</div>
					<LanguageSelector />
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
