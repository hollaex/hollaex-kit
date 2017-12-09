import React from 'react';

export const NotificationWraper = ({ icon, title, children }) => (
  <div className="notification-content-wrapper">
    {icon && <img src={icon} alt="" className="notification-content-icon" />}
    <div className="font-weight-bold">{title}</div>
    {children}
  </div>
);

export const NotificationContent = ({ children }) => (
  <div className="notification-content-information">
    {children}
  </div>
)
