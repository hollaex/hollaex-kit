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

const getIconPath = (status) => {
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
const ActionNotification = (props) => {
  const { text, status, onClick, iconPath } = props;

  return (
    <div
      className="action_notification-wrapper pointer"
      onClick={onClick}
    >
      <div className={classnames('action_notification-text', getClassNames(status))}>
        {text}
      </div>
      {iconPath && <img src={iconPath} alt={text} className="action_notification-image" />}
    </div>
  );
}

ActionNotification.defaultProps = {
  text: '',
  status: '',
  iconPath: '',
  onClick: () => {}
}
export default ActionNotification;
