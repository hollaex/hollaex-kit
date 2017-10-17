import React from 'react';
import classnames from 'classnames';

const getClassNames = (status) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'information':
      return 'info';
    default:
      return '';
  }
}

const ActionNotification = ({ text, status, onClick, iconPath, className }) => (
  <div
    className={classnames('action_notification-wrapper', {
      'pointer': !!onClick,
    }, className)}
    onClick={onClick}
  >
    <div className={classnames('action_notification-text', getClassNames(status))}>
      {text}
    </div>
    {iconPath && <img src={iconPath} alt={text} className="action_notification-image" />}
  </div>
);

ActionNotification.defaultProps = {
  text: '',
  status: '',
  iconPath: '',
  className: '',
  onClick: () => {},
}
export default ActionNotification;
