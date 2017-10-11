import React, { Component } from 'react';
import classnames from 'classnames';
import { ICONS } from '../../../config/constants';

class FieldWrapper extends Component {
  render() {
    const {
      children,
      label,
      meta: { active = false, error, touched = false, invalid },
      focused = false,
      fullWidth = false,
    } = this.props;
    
    const displayError = !(active || focused) && touched && error;
    return (
      <div className={classnames('field-wrapper', { error: displayError, inline: !fullWidth })}>
        <div className={classnames('field-content')}>
          <div className="field-label">{label}</div>
          <div className={classnames('field-children', { valid: !invalid })}>
            {children}
            {!invalid && <img src={ICONS.BLACK_CHECK} alt="valid" className="field-valid" />}
          </div>
          <span className={classnames('field-content-outline', {
            'focused': active || focused,
          })}></span>
        </div>
        <div
          className={classnames('field-error-content', {
            'field-error-hidden': !displayError,
          })}
        >
          <img src={ICONS.RED_WARNING} className="field-error-icon" alt="error" />
          <span className="field-error-text">{error}</span>
        </div>
      </div>
    );
  }
}

export default FieldWrapper;
