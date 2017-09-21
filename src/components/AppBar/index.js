import React from 'react';

const AppBar = ({ title, goToAccountPage, goToDashboard }) => {
  return (
    <div className="app_bar">
      <div className="app_bar-icon pointer" onClick={goToDashboard}>
        icon
      </div>
      <div className="app_bar-main">{title}</div>
      <div className="app_bar-controllers">
        <div className="app_bar-currency">Bitcoint</div>
        <div className="app_bar-user pointer" onClick={goToAccountPage}>
          <img alt="acc" src={`s`} className="pointer"/>
        </div>
      </div>
    </div>
  )
}

export default AppBar;
