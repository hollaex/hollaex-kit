import React from 'react';
import './index.css';

const renderUserName = (user) => {
  if (user.first_name) {
    return `${user.first_name}${user.last_name && ` ${user.last_name}`}`;
  }
  return user.email;
}
const AppBar = ({ user, logout }) => {
  return (
    <div className="app_bar">
      <div>icon</div>
      <div>bar</div>
      <div>{renderUserName(user)}</div>
      <div onClick={logout}>logout</div>
    </div>
  )
}

export default AppBar;
