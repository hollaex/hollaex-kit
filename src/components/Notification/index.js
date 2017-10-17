import React from 'react';

const Notification = ({ title, text, timestamp }) => {
  return (
    <div className="notification-container">
      {title && <div className="notification-title">{title}</div>}
      {text && <div className="notification-text">{text}</div>}
      {timestamp && <div className="notification-timestamp">{timestamp}</div>}
    </div>
  )
}

Notification.defaultProps = {
  title: '',
  text: '',
  timestamp: undefined
}

export default Notification;
