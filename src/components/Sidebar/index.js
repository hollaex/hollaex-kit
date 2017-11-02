import React from 'react';
import Section from './Section';
import { NotificationsList, Button, Wallet } from '../';
import { ICONS } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency'

const Sidebar = ({
  goToWalletPage, goToTradePage, active, activePath, logout, notifications, symbol
}) => {
  return (
    <div className="sidebar-container">
      <div className={`sidebar-actions ${active ? 'active' : ''}`}>
        <Section
          title="Wallet"
          goToSection={goToWalletPage}
          active={activePath === 'wallet'}
        >
          <Wallet

          />
        </Section>
        {symbol !== fiatSymbol &&
          <Section
            title="Trading Mod"
            active={activePath === 'trade'}
          >
            <div className="sidebar-container-trade d-flex">
              <Button
                label="Quick Trade"
                disabled={true}
              />
              <Button
                label="Pro Trade"
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
          logout
        </div>
        <div onClick={logout} className="sidebar-logout-right pointer">
          <img src={ICONS.LOGOUT} alt="logout" />
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
