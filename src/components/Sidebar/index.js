import React from 'react';
import Section from './Section';
import { NotificationsList, Button, Wallet } from '../';
import { ICONS } from '../../config/constants';

const prepareNotification = (notification) => ({
  title: notification.type,
  text: notification.message,
  timestamp: new Date(notification.timestamp).toString(),
});

const Sidebar = ({ goToWalletPage, goToTradePage, active, activePath, logout, notifications }) => {
  return (
    <div className="sidebar-container">
      <div className={`sidebar-actions ${active ? 'active' : ''}`}>
        <Section
          title="Wallet"
          goToSection={goToWalletPage}
          goToSectionText="see details"
          active={activePath === 'wallet'}
        >
          <Wallet

          />
        </Section>
        <Section
          title="Trading Mod"
          goToSection={goToTradePage}
          goToSectionText="see details"
          active={activePath === 'trade'}
        >
          <div className="sidebar-container-trade d-flex">
            <Button
              label="Quick Trade"
              disabled={true}
            />
            <div className="sidebar-container-trade-space"></div>
            <Button
              label="Pro Trade"
              disabled={true}
            />
          </div>
        </Section>
      </div>
      <div className="sidebar-notifications">
        <NotificationsList notifications={notifications.map(prepareNotification)} />
      </div>
      <div className="sidebar-logout">
        <div onClick={logout} className="sidebar-logout-left text-uppercase pointer">
          logout
        </div>
        <div onClick={logout} className="sidebar-logout-right pointer">
          <img src={ICONS.LOGOUT} />
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
