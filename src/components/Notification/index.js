import React from 'react';

const Notification = ({ title, text, timestamp }) => {
  return (
    <div className="notification-container">
      <div className="notification-title">{title}</div>
      <div className="notification-text">{text}</div>
      {timestamp && <div className="notification-timestamp">{timestamp}</div>}
    </div>
  )
}

Notification.defaultProps = {
  title: 'Title',
  text: 'Text',
  timestamp: undefined
}

export default Notification;
