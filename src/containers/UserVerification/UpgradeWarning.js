import React from 'react';
import { TEXTS } from './constants';

const UpgradeWarning = () => (
  <div className="warning_text">
    <div>{TEXTS.WARNING.TEXT_1}</div>
    <ul>
      <li>{TEXTS.WARNING.LIST_ITEM_1}</li>
      <li>{TEXTS.WARNING.LIST_ITEM_2}</li>
      <li>{TEXTS.WARNING.LIST_ITEM_3}</li>
    </ul>
  </div>
);

export default UpgradeWarning;
