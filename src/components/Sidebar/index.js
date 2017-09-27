import React from 'react';
import Section from './Section';
import { NotificationsList } from '../';

const NOTIFICATIONS = [
  { title: '1', text: 'text 4', timestamp: new Date().toString() },
  { title: '2', text: 'text 4', timestamp: new Date().toString() },
  { title: '3', text: 'text2 3', timestamp: new Date().toString() },
  { title: '4', text: 'text 2', timestamp: new Date().toString() },
  { title: '5', text: 'text 1', timestamp: new Date().toString() },
  { title: '61', text: 'text 4', timestamp: new Date().toString() },
  { title: '22', text: 'text 4', timestamp: new Date().toString() },
  { title: '31', text: 'text2 3', timestamp: new Date().toString() },
  { title: '42', text: 'text 2', timestamp: new Date().toString() },
  { title: '53', text: 'text 1', timestamp: new Date().toString() },
];

const Sidebar = ({ goToWalletPage, goToTradePage, active, activePath, logout }) => {
  return (
    <div className="sidebar-container">
      <div className={`sidebar-actions ${active ? 'active' : ''}`}>
        <Section
          title="Wallet"
          goToSection={goToWalletPage}
          goToSectionText="see details"
          active={activePath === 'wallet'}
        >
          wallet content
        </Section>
        <Section
          title="Trading Mod"
          goToSection={goToTradePage}
          goToSectionText="see details"
          active={activePath === 'trade'}
        >
          Tradings content
        </Section>
      </div>
      <div className="sidebar-notifications">
        <NotificationsList notifications={NOTIFICATIONS} />
      </div>
      <div className="sidebar-logout">
        <div onClick={logout} className="sidebar-logout-left pointer">logout</div>
        <div onClick={logout} className="sidebar-logout-right pointer">icon</div>
      </div>
    </div>
  )
}

Sidebar.defaultProps = {
  active: false,
  activePath: '',
}

export default Sidebar;
