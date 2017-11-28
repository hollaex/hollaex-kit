import React from 'react';

const Header = ({ icon, text }) => (
  <div className="notification-title-wrapper d-flex flex-column">
    <div className="notification-title-icon f-1 d-flex justify-content-center align-items-center">
      <img src={icon} alt="" className=""/>
    </div>
    <div className="notification-title-text">{text}</div>
  </div>
);

export default Header;
