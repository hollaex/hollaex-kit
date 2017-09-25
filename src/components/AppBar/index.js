import React from 'react';
import classnames from 'classnames'
const AppBar = ({ title, goToAccountPage, goToDashboard, acccountIsActive }) => {
  return (
    <div className="app_bar">
      <div className="app_bar-icon pointer" onClick={goToDashboard}>
        exir
      </div>
      <div className="app_bar-main">{title}</div>
      <div className="app_bar-controllers">
        <div className="app_bar-currency">
          <img
            alt="currency"
            src={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-14.png`}
          />
          <span>Bitcoin</span>
        </div>
        <div className="app_bar-user pointer" onClick={goToAccountPage}>
          <img
            alt="account"
            src={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-${acccountIsActive ? '15' : '12'}.png`}
            className={classnames('pointer', {
              'active': acccountIsActive,
            })}
          />
        </div>
      </div>
    </div>
  )
}

export default AppBar;
