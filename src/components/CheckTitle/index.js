import React from 'react';

const CheckTitle = ({ title, icon, notifications }) => {
  return (
    <div className="check_title-container">
      <div className="check_title-label">{title}</div>
      <div className="check_title-icon">
        {icon &&
          <img
            alt={icon}
            src={icon}
            className="check_title-img"
          />
        }
        {!!notifications &&
          <div className="check_title-notification">{notifications}</div>
        }
      </div>
    </div>
  )
}

CheckTitle.defaultProps = {
  title: 'Title',
  status: '',
  notifications: '',
}

export default CheckTitle;
