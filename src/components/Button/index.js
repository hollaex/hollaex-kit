import React, { Component} from 'react';
import PropTypes from 'prop-types';

import '@material/button/dist/mdc.button.css';

const Button = ({ label, onClick, type }) => (
  <button
    type={type}
    onClick={onClick}
    className="exir-button mdc-button mdc-button--unelevated"
  >{label}</button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string
};

Button.defaultProps = {
  type: 'submit',
}

export default Button;
