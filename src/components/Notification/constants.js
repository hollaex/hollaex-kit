import { fiatSymbol } from '../../utils/currency';
import { CURRENCIES } from '../../config/constants';

export const NEED_HELP = 'NEED HELP';

export const DEPOSITS = {
  fiat: {
    TITLE: 'Deposit receieved',
    SUBTITLE: 'You’ve receieved your United States Dollar deposit',
    INFORMATION_PENDING: [],
    INFORMATION_COMPLETE: [],
  },
  btc: (name) => ({
    TITLE: `Incoming ${name}`,
    SUBTITLE: `You have incoming ${name}`,
    INFORMATION_PENDING: [
      `Your ${name} require 3 confirmations before you can begin trading.`,
      `This may take 20-40 minutes. We will send an email once your ${name} have completed Confirming.`
    ],
    INFORMATION_COMPLETE: [],
  })
}

export const getDepositTexts = (currency, status) => {
  let texts = {};
  if (currency === fiatSymbol) {
    texts = DEPOSITS[fiatSymbol];
  } else {
    const { name } = CURRENCIES[currency];
    texts = DEPOSITS[currency](name);
  }
  return {
    title: texts.TITLE,
    subtitle: texts.SUBTITLE,
    information: status ? texts.INFORMATION_COMPLETE : texts.INFORMATION_PENDING,
  }
}
