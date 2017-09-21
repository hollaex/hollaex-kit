import React from 'react';

const Footer = ({ logout }) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-wallet">
        wallet
      </div>
      <div className="sidebar-notifications">
        Notifications
      </div>
      <div onClick={logout} className="sidebar-logout pointer">logout</div>
    </div>
  )
}

export default Footer;
