import React, { Component} from 'react';
import PropTypes from 'prop-types';

import '@material/button/dist/mdc.button.css';

const Button = ({ label, onClick, type, disabled }) => (
  <button
    type={type}
    onClick={onClick}
    className="exir-button mdc-button mdc-button--unelevated"
    disabled={disabled}
  >{label}</button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'submit',
  disabled: false,
}

export default Button;
