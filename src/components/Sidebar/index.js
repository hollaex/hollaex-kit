import React from 'react';
import Section from './Section';
import { NotificationsList, Button, Wallet } from '../';
import { ICONS } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency'
import { TEXTS } from './constants';

const Sidebar = ({
  goToWalletPage, goToTradePage, active, activePath, logout, notifications, symbol
}) => {
  return (
    <div className="sidebar-container">
      <div className={`sidebar-actions ${active ? 'active' : ''}`}>
        <Section
          title={TEXTS.WALLET_TITLE}
          goToSection={goToWalletPage}
          active={activePath === 'wallet'}
        >
          <Wallet

          />
        </Section>
        {symbol !== fiatSymbol &&
          <Section
            title={TEXTS.TRADING_MODE_TITLE}
            active={activePath === 'trade'}
          >
            <div className="sidebar-container-trade d-flex">
              <Button
                label={TEXTS.QUICK_TRADE_BUTTON}
                disabled={true}
              />
              <Button
                label={TEXTS.PRO_TRADE_BUTTON}
                onClick={goToTradePage}
                disabled={!goToTradePage}
              />
            </div>
          </Section>
        }
      </div>
      <div className="sidebar-notifications">
        <NotificationsList notifications={notifications} />
      </div>
      <div className="sidebar-logout">
        <div onClick={logout} className="sidebar-logout-left text-uppercase pointer">
          {TEXTS.LOGOUT}
        </div>
        <div onClick={logout} className="sidebar-logout-right pointer">
          <img src={TEXTS.LOGOUT_ICON} alt="logout" />
        </div>
      </div>
    </div>
  )
}

Sidebar.defaultProps = {
  active: false,
  activePath: '',
  notifications: []
}

export default Sidebar;
