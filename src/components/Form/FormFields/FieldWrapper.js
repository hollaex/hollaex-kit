import React, { Component } from 'react';
import classnames from 'classnames';
import { ICONS } from '../../../config/constants';

export const FieldContent = ({
  label = '',
  valid = false,
  hasValue = false,
  focused = false,
  children,
  hideUnderline = false,
  contentClassName = '',
}) => {
  return (
    <div className={classnames('field-content')}>
      {label && <div className="field-label">{label}</div>}
      <div className={classnames('field-children', { valid, custom: hideUnderline }, contentClassName)}>
        {children}
        {valid && hasValue && <img src={ICONS.BLACK_CHECK} alt="valid" className="field-valid" />}
      </div>
      { !hideUnderline && <span className={classnames('field-content-outline', {
        focused,
      })}></span>}
    </div>
  )
}

export const FieldError = ({ error, displayError }) => (
  <div
    className={classnames('field-error-content', {
      'field-error-hidden': !displayError,
    })}
  >
    <img src={ICONS.RED_WARNING} className="field-error-icon" alt="error" />
    <span className="field-error-text">{error}</span>
  </div>
);

class FieldWrapper extends Component {
  render() {
    const {
      children,
      label,
      input: { value },
      meta: { active = false, error = '', touched = false, invalid = false },
      focused = false,
      fullWidth = false,
      visited = false,
      hideUnderline = false,
      className = '',
    } = this.props;

    const displayError = !(active || focused) && (visited || touched) && error;
    const hasValue = value || value === false;
    return (
      <div className={classnames('field-wrapper', { error: displayError, inline: !fullWidth }, className)}>
        <FieldContent
          label={label}
          valid={!invalid}
          hasValue={hasValue}
          focused={active || focused}
          hideUnderline={hideUnderline}
        >
          {children}
        </FieldContent>
        <FieldError
          displayError={displayError}
          error={error}
        />
      </div>
    );
  }
}

FieldWrapper.defaultProps = {
  meta: {},
  input: {
    value: '',
  }
}

export default FieldWrapper;
