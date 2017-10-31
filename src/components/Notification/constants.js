import { fiatSymbol } from '../../utils/currency';
import { CURRENCIES } from '../../config/constants';


export const NEED_HELP = 'NEED HELP';

export const DEPOSITS = {
  fiat: {
    TITLE: `${CURRENCIES.fiat.shortName} Deposit receieved`,
    SUBTITLE: `You’ve receieved your ${CURRENCIES.fiat.fullName} deposit`,
    INFORMATION_PENDING: [],
    INFORMATION_COMPLETE: [],
  },
  btc: (status) => {
    const { shortName, name, fullName } = CURRENCIES.btc;
    return {
      TITLE: status ? `${shortName} Deposit receieved` : `Incoming ${fullName}`,
      SUBTITLE: status ? `You’ve receieved your ${fullName} deposit` : `You have incoming ${fullName}`,
      INFORMATION_PENDING: [
        `Your ${name} require 3 confirmations before you can begin trading.`,
        `This may take 20-40 minutes. We will send an email once your ${name} have completed Confirming.`
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
    const { name } = CURRENCIES[currency];
    texts = DEPOSITS[currency](status);
  }
  return {
    title: texts.TITLE,
    subtitle: texts.SUBTITLE,
    information: status ? texts.INFORMATION_COMPLETE : texts.INFORMATION_PENDING,
  }
}


export const BUTTON_TEXTS = {
  OKAY: 'okay',
  START_TRADING: 'start trading',
  SEE_HISTORY: 'see history',
}
