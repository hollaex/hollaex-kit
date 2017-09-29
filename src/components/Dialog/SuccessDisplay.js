import React from 'react';
import { Button } from '../';
import { ICONS } from '../../config/constants';

const SuccessDisplay = ({ text, onClick, buttonLabel = 'Close', success = true }) => (
  <div className="success_display-wrapper d-flex align-content-between flex-wrap flex-column">
    <div className="success_display-content d-flex flex-column align-self-center flex-wrap justify-content-center align-items-center">
      <img src={success ? ICONS.CHECK : ICONS.RED_WARNING} alt={text} className="success_display-content-image" />
      <div className="success_display-content-text">{text}</div>
    </div>
    <Button
      label={buttonLabel}
      onClick={onClick}
    />
  </div>
);

export default SuccessDisplay;
