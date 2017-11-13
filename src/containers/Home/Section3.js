import React from 'react';
import classnames from 'classnames';

import {
  FLEX_CENTER_CLASSES,
} from '../../config/constants';

import { TEXTS, BUTTONS_CLASSES } from './constants';

const { SECTION_3 } = TEXTS;

const Card = ({ icon, title, text }) => (
  <div className={classnames(...FLEX_CENTER_CLASSES, 'home-card-container')}>
    <img src={icon} alt="" className="home-card-icon"/>
    <div className={classnames('d-flex', 'flex-column', 'f-1', 'home-card-text-container')}>
      <div className="home-card-title f-0">{title}</div>
      <div className="home-card-text f-1">{text}</div>
    </div>
  </div>
);

const Section = ({
  style,
  onClickDemo,
  onClickRegister,
  token,
}) => (
  <div
    className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'features-container')}
    style={style}
  >
    <div className="text-center features-title">{SECTION_3.TITLE}</div>
    <div className="features-card_container d-flex flex-wrap justify-content-center">
      {SECTION_3.CARDS.map((card, index) => <Card {...card} key={index} />)}
    </div>
    <div className={classnames('buttons-section', ...FLEX_CENTER_CLASSES)}>
      <div
        className={classnames(...BUTTONS_CLASSES, { pointer: onClickDemo })}
        onClick={onClickDemo}
      >
        {SECTION_3.BUTTON_1}
      </div>
      {!token && <div
        className={classnames(...BUTTONS_CLASSES, 'contrast', { pointer: onClickRegister })}
        onClick={onClickRegister}
      >
        {SECTION_3.BUTTON_2}
      </div>}
    </div>
  </div>
);

export default Section;
