import React from 'react';

const CheckTitle = ({ title, icon, notification }) => {
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
        {notification &&
          <div className="check_title-notification">!</div>
        }
      </div>
    </div>
  )
}

CheckTitle.defaultProps = {
  title: 'Title',
  status: '',
}
export default CheckTitle;
