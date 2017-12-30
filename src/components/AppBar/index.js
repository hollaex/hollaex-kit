import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { CURRENCIES, FLEX_CENTER_CLASSES, EXIR_BLUE_LOGO } from '../../config/constants';
import { LanguageSelector } from '../';

import STRINGS from '../../config/localizedStrings';

class AppBar extends Component {
  state = {
    symbolSelectorIsOpen: false,
  }

  toogleSymbolSelector = () => {
    this.setState({ symbolSelectorIsOpen: !this.state.symbolSelectorIsOpen })
  }

  onChangeSymbol = (symbol) => {
    this.props.changeSymbol(symbol)
    this.toogleSymbolSelector();
  }

  renderSymbolOption = ({ symbol, name, currencySymbol, iconPath}, index) => (
    <div key={index} className="app_bar-currency_option" onClick={() => this.onChangeSymbol(symbol)}>
      <img
        alt={symbol}
        src={iconPath}
        className="app_bar-currency_display-icon"
      />
      <span>{STRINGS[`${symbol.toUpperCase()}_NAME`]}</span>
    </div>
  );


  renderSymbolBlock = (symbol) => {
    const { iconPath } = CURRENCIES[symbol];
    const name = STRINGS[`${symbol.toUpperCase()}_NAME`]
    const { symbolSelectorIsOpen } = this.state;
    return (
      <div className="app_bar-currency_wrapper pointer">
        <div className={classnames('app_bar-currency_display', 'd-flex', { 'is_open': symbolSelectorIsOpen, 'is_close': !symbolSelectorIsOpen })} onClick={this.toogleSymbolSelector}>
          <img
            alt={symbol}
            src={iconPath}
            className="app_bar-currency_display-icon"
          />
          <div className="app_bar-currency_display-selector d-flex align-items-center">{name}</div>
        </div>
        {symbolSelectorIsOpen &&
          <div className="app_bar-currency_list">
            {Object.entries(CURRENCIES)
              .filter(([key, currency]) => currency.symbol !== symbol)
              .map(([key, currency], index) => this.renderSymbolOption(currency, index))
            }
          </div>
        }
      </div>
    );
  }

  renderAppActions = (activeSymbol, acccountIsActive, goToAccountPage) => {
    return (
      <div className="app_bar-controllers">
        {this.renderSymbolBlock(activeSymbol)}
        <div className="app_bar-user pointer" onClick={goToAccountPage}>
          <img
            alt="account"
            src={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-${acccountIsActive ? '15' : '12'}.png`}
            className={classnames('pointer', {
              'active': acccountIsActive,
            })}
          />
        </div>
      </div>
    );
  }

  renderSplashActions = (token, verifyingToken) => {
    if (verifyingToken) {
      return <div></div>
    }
    const COMMON_CLASSES = ['text-uppercase', 'action_button', 'pointer', ...FLEX_CENTER_CLASSES];
    const WRAPPER_CLASSES = ['app_bar-controllers-splash', 'd-flex'];
    return token ? (
      <div className={classnames(...WRAPPER_CLASSES)}>
        <div className={classnames(...COMMON_CLASSES, 'contrast')}>
          <Link to='/account'>{STRINGS.ACCOUNT_TEXT}</Link>
        </div>
      </div>
    ) : (
      <div className={classnames(...WRAPPER_CLASSES)}>
        <Link to='/login' className="d-flex f-1 h-100">
          <div className={classnames(...COMMON_CLASSES)}>
            {STRINGS.LOGIN_TEXT}
          </div>
        </Link>
        <Link to='/signup' className="d-flex f-1 h-100">
          <div className={classnames(...COMMON_CLASSES, 'contrast')}>
            {STRINGS.SIGNUP_TEXT}
          </div>
        </Link>
      </div>
    );
  }

  render() {
    const {
      goToAccountPage, goToDashboard, acccountIsActive, activeSymbol, noBorders, token, verifyingToken, isHome, rightChildren,
    } = this.props;

    return (
      <div className={classnames('app_bar', { 'no-borders': noBorders })}>
        <div className={classnames('app_bar-icon', 'text-uppercase', { contrast: !isHome, pointer: !!goToDashboard })} onClick={goToDashboard}>
          {isHome ?
            <img src={EXIR_BLUE_LOGO} alt={STRINGS.APP_NAME} className="app_bar-icon-logo" /> :
            STRINGS.APP_NAME
          }
        </div>
        <div className="app_bar-main d-flex justify-content-between">
          <div>{!isHome && STRINGS.APP_TITLE}</div>
          <LanguageSelector />
        </div>
        {rightChildren ?
          rightChildren :
          (activeSymbol ?
            this.renderAppActions(activeSymbol, acccountIsActive, goToAccountPage) :
            this.renderSplashActions(token, verifyingToken)
          )
        }
      </div>
    );
  }

}

AppBar.defaultProps = {
  noBorders: false,
  isHome: false,
}
export default AppBar;
