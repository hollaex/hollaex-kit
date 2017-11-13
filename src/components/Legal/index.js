import React from 'react';
import classnames from 'classnames';
import { EXIR_LOGO } from '../../config/constants';

import CONTENT from './content';

const Legal = ({ type }) => {
  const { TITLE, SUBTITLE, TEXTS } = CONTENT[type];
  return (
    <div className={classnames('d-flex', 'legal-wrapper', 'justify-content-center')}>
      <div className={classnames('d-flex', 'flex-column', 'legal-content-wrapper')}>
        <div className="legal-logo-wrapper">
          <img src={EXIR_LOGO} alt="exir" className="legal-logo" />
        </div>
        <div className="legal-title">{TITLE}</div>
        <div className="legal-subtitle">
          {SUBTITLE}
        </div>
        <div className="legal-content">
          {TEXTS.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Legal;
