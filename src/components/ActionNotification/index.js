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

const ActionNotification = ({
  text, status, onClick, iconPath, className, reverseImage, textPosition, iconPosition,
}) => (
  <div
    className={classnames('action_notification-wrapper', {
      pointer: !!onClick,
      left: textPosition === 'left',
      right: textPosition === 'right',
      'icon_on-right': iconPosition === 'right',
      'icon_on-left': iconPosition === 'left',
    }, className)}
    onClick={onClick}
  >
    <div className={classnames('action_notification-text', getClassNames(status))}>
      {text}
    </div>
    {iconPath &&
      <img
        src={iconPath}
        alt={text}
        className={
          classnames(
            'action_notification-image',
            { reverse: reverseImage }
          )
        }
      />
    }
  </div>
);

ActionNotification.defaultProps = {
  text: '',
  status: 'information',
  iconPath: '',
  className: '',
  reverseImage: false,
  textPosition: 'right',
  iconPosition: 'right',
}
export default ActionNotification;
