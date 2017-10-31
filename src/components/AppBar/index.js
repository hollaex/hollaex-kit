import React, { Component } from 'react';
import classnames from 'classnames';
import { CURRENCIES } from '../../config/constants';

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
        src={`${process.env.PUBLIC_URL}${iconPath}`}
      />
      <span>{name}</span>
    </div>
  );


  renderSymbolBlock = (symbol) => {
    const { name, iconPath } = CURRENCIES[symbol];
    return (
      <div className="app_bar-currency_wrapper pointer">
        <div className="app_bar-currency_display" onClick={this.toogleSymbolSelector}>
          <img
            alt={symbol}
            src={`${process.env.PUBLIC_URL}${iconPath}`}
          />
          <span>{name}</span>
        </div>
        {this.state.symbolSelectorIsOpen &&
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

  render() {
    const { title, goToAccountPage, goToDashboard, acccountIsActive, activeSymbol } = this.props;

    return (
      <div className="app_bar">
        <div className={classnames('app_bar-icon', { pointer: !!goToDashboard })} onClick={goToDashboard}>
          exir
        </div>
        <div className="app_bar-main">{title}</div>
        {activeSymbol &&
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
        }
      </div>
    );
  }

}

export default AppBar;
