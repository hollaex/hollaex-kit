import { fiatSymbol } from '../../utils/currency';
import { CURRENCIES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const { NOTIFICATIONS, NEED_HELP_TEXT } = STRINGS;
const { FIAT, BTC } = NOTIFICATIONS.DEPOSITS;

export const NEED_HELP = NEED_HELP_TEXT;

export const DEPOSITS = {
  fiat: {
    TITLE: STRINGS.formatString(FIAT.TITLE, CURRENCIES.fiat.shortName),
    SUBTITLE: STRINGS.formatString(FIAT.SUBTITLE, CURRENCIES.fiat.fullName),
    INFORMATION_PENDING: [],
    INFORMATION_COMPLETE: [],
  },
  btc: (status) => {
    const { shortName, name, fullName } = CURRENCIES.btc;
    return {
      TITLE: status ? STRINGS.formatString(BTC.TITLE_RECEIVED, shortName) : STRINGS.formatString(BTC.TITLE_INCOMING, fullName),
      SUBTITLE: STRINGS.formatString(status ? BTC.SUBTITLE_RECEIVED : BTC.SUBTITLE_INCOMING, fullName),
      INFORMATION_PENDING: [
        STRINGS.formatString(BTC.INFORMATION_PENDING_1, name),
        STRINGS.formatString(BTC.INFORMATION_PENDING_2, name),
      ],
      INFORMATION_COMPLETE: [],
    }
  }
}

export const getDepositTexts = (currency, status = false) => {
  let texts = {};
  if (currency === fiatSymbol) {
    texts = DEPOSITS[fiatSymbol];
  } else {
    texts = DEPOSITS[currency](status);
  }
  return {
    title: texts.TITLE,
    subtitle: texts.SUBTITLE,
    information: status ? texts.INFORMATION_COMPLETE : texts.INFORMATION_PENDING,
  }
}


export const BUTTON_TEXTS = NOTIFICATIONS.BUTTONS;
