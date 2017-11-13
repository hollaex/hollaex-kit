import React, { Component } from 'react';
import classnames from 'classnames';

import { FLEX_CENTER_CLASSES } from '../../config/constants';


const ToogleButton = ({ onToogle, values, selected }) => (
  <div className={classnames('toogle_button-wrapper', 'd-flex')}>
    <div className="toogle-side_line f-1"></div>
    <div className={classnames(
      'toogle-content', 'f-0', ...FLEX_CENTER_CLASSES,
    )}>
      <div className={classnames({ selected: values[0] === selected })}>{values[0]}</div>
      <div
        onClick={onToogle}
        className={classnames(
          'toogle-action_button',
          {
            left: values[0] === selected,
            right: values[1] === selected,
          }
        )}
      >
        <div className="toogle-action_button-display"></div>
      </div>
      <div className={classnames({ selected: values[1] === selected })}>{values[1]}</div>
    </div>
    <div className="toogle-side_line f-1"></div>
  </div>
);

export default ToogleButton;
