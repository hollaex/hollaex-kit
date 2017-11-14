import STRINGS from '../../config/localizedStrings';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

export const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

const { QUICK_TRADE } = STRINGS;


export const TEXTS = {
  TITLE: QUICK_TRADE.TITLE,
  TOTAL_COST: QUICK_TRADE.TOTAL_COST,
  BUTTON: (side) => {
    const buttonText = STRINGS.formatString(QUICK_TRADE.BUTTON, side)
    return buttonText.join(' ');
  },
  INPUT: (name, side) => STRINGS.formatString(QUICK_TRADE.INPUT, name, side),
}

export const SIDES = QUICK_TRADE.SIDES;
export const DECIMALS = 4;

export const DEFAULT_SYMBOL = 'btc';
