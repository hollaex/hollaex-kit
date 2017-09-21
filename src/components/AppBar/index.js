import React from 'react';

const AppBar = ({ goToAccountPage }) => {
  return (
    <div className="app_bar">
      <div className="app_bar-icon">icon</div>
      <div className="app_bar-main">bar</div>
      <div className="app_bar-controllers">
        <div className="app_bar-currency">Bitcoint</div>
        <div className="app_bar-user pointer" onClick={goToAccountPage}>
          <img alt="acc" src={`s`} />
        </div>
      </div>
    </div>
  )
}

export default AppBar;
