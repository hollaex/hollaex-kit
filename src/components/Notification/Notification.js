import React from 'react';
import classnames from 'classnames';

export const NotificationWraper = ({ icon, title, children, className = '' }) => (
  <div className={classnames('notification-content-wrapper', className)}>
    {icon && <img src={icon} alt="" className="notification-content-icon" />}
    <div className="font-weight-bold">{title}</div>
    {children}
  </div>
);

export const NotificationContent = ({ children, className = '' }) => (
  <div className={classnames('notification-content-information', className)}>
    {children}
  </div>
);

export const InformationRow = ({ label, value }) => (
  <div className="d-flex">
    <div className="f-1 text_disabled">{label}:</div>
    <div className="f-1">{value}</div>
  </div>
);
