import React from 'react';
import './index.css';

const renderStatus = (status) => {
  let src;
  switch (status) {
    case 'completed':
      src = '/assets/icons/111-05.png'
      break;
    case 'pending':
      src = '/assets/icons/111-04.png'
      break;
    default:
      return undefined;
  }
  return <img alt={status} src={`${process.env.PUBLIC_URL}${src}`} className="check_title-img" />;
}

const CheckTitle = ({ title, status }) => {
  return (
    <div className="check_title-container">
      <div className="check_title-label">{title}</div>
      <div className="check_title-icon">
        {renderStatus(status)}
      </div>
    </div>
  )
}

CheckTitle.defaultProps = {
  title: 'Title',
  status: '',
}
export default CheckTitle;
