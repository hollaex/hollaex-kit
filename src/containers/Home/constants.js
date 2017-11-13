import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';

export const TEXTS = {
  SECTION_1: {
    TITLE: 'Buy & sell cryptocurrencies',
    TEXT_1: 'EXIR is a cryptocurrency exchange where you can buy and sell bitcoins and other digital currencies.',
    TEXT_2: 'We strive to bring the digital enconomy forward through afforable and simple access to future currencies.',
    BUTTON_1: 'learn more',
    BUTTON_2: 'register',
  },
  SECTION_3 : {
    TITLE: 'Features',
    CARDS: [
      {
        icon: ICONS.CHECK,
        title: 'PAYMENT OPTIONS',
        text: 'Most popular methods: Visa, MasterCard, bank transfer (SWIFT, SEPA), cryptocurrency',
      },
      {
        icon: ICONS.CHECK,
        title: 'ADVANCED REPORTING',
        text: 'Downloadable reports, real-time balance, transaction history with transparent fees',
      },
      {
        icon: ICONS.CHECK,
        title: 'STRONG SECURITY',
        text: 'Protection against DDoS attacks, full data encryption, compliant with PCI DSS standar',
      },
      {
        icon: ICONS.CHECK,
        title: 'MARGIN TRADING',
        text: '1:2 and 1:3 leverages, automatic funds borrowing, no extra accounts needed, negative balance protection.',
      },
      {
        icon: ICONS.CHECK,
        title: 'HIGH LIQUIDITY',
        text: 'Fast order execution, low spread, access to high liquidity orderbook for top currency pairs',
      },
      {
        icon: ICONS.CHECK,
        title: 'LEGAL COMPLIANCE',
        text: 'Registration in UK, MSB status in FinCEN, essential licenses and strong relations with banks',
      },
    ],
    BUTTON_1: 'view demo',
    BUTTON_2: 'register',
  }
}

export const BUTTONS_CLASSES = ['buttons-section--button', ...FLEX_CENTER_CLASSES];
