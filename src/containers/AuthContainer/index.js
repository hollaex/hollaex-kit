import React from 'react';
import classnames from 'classnames';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

const AuthContainer = ({ children }) => {
  return (
    <div className={classnames('auth-wrapper', 'w-100', 'h-100', ...FLEX_CENTER_CLASSES, 'app_background')}>
      <div className={classnames('auth-container', 'f-1')}>
        {children}
      </div>
    </div>
  );
}

export default AuthContainer;
