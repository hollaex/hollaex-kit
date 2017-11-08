import React from 'react';
import classnames from 'classnames';

import {
  FLEX_CENTER_CLASSES,
} from '../../config/constants';

import { TEXTS, BUTTONS_CLASSES } from './constants';

const { SECTION_1 } = TEXTS;

const Section1 = ({
  style = {}, onClickScrollTo = () => {}, onClickRegister, onClickLearnMore, token
}) => (
  <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'section_1-content')} style={style}>
    <div className={classnames('f-1', ...FLEX_CENTER_CLASSES, 'flex-column')}>
      <div className="home-title">{SECTION_1.TITLE}</div>
      <div className="text-section text-center">
        <div>{SECTION_1.TEXT_1}</div>
        <div>{SECTION_1.TEXT_2}</div>
      </div>
      <div className={classnames('buttons-section', ...FLEX_CENTER_CLASSES)}>
        <div
          className={classnames(...BUTTONS_CLASSES, { pointer: onClickLearnMore })}
          onClick={onClickLearnMore}
        >
          {SECTION_1.BUTTON_1}
        </div>
        {!token && <div
          className={classnames(...BUTTONS_CLASSES, 'contrast', { pointer: onClickRegister })}
          onClick={onClickRegister}
        >
          {SECTION_1.BUTTON_2}
        </div>}
      </div>
    </div>
    <div className={classnames('pointer', 'flex-0', 'scroll-button')}  onClick={onClickScrollTo}></div>
  </div>
);

export default Section1;
