import STRINGS from '../../config/localizedStrings';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

export const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

const { QUICK_TRADE_COMPONENT } = STRINGS;

export const TEXTS = {
  TITLE: QUICK_TRADE_COMPONENT.TITLE,
  TOTAL_COST: QUICK_TRADE_COMPONENT.TOTAL_COST,
  BUTTON: (side) => {
    const buttonText = STRINGS.formatString(QUICK_TRADE_COMPONENT.BUTTON, side)
    return buttonText.join(' ');
  },
  INPUT: (name, side) => STRINGS.formatString(QUICK_TRADE_COMPONENT.INPUT, name, side),
}

export const SIDES = QUICK_TRADE_COMPONENT.SIDES;
export const DECIMALS = 4;

export const DEFAULT_SYMBOL = 'btc';
