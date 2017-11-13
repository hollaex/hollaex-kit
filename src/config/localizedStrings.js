import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
 en: {
   APP_TITLE: 'exir-exchange',
   APP_NAME: 'exir',
   FIAT_NAME: 'Dollar',
   FIAT_FULLNAME: 'United States Dollar',
   FIAT_SHORTNAME: 'USD',
   FIAT_CURRENCY_SYMBOL: '$',
   BTC_NAME: 'Bitcoin',
   BTC_FULLNAME: 'Bitcoin',
   BTC_SHORTNAME: 'BTC',
   TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss A',
   HOUR_FORMAT: 'HH:mm:ss A',
   LOGIN: 'Login',
   SIGNUP: 'Sign Up',
   REGISTER: 'Register',
   HOME: {
     SECTION_1_TITLE: 'Buy & sell cryptocurrencies',
     SECTION_1_TEXT_1: 'EXIR is a cryptocurrency exchange where you can buy and sell bitcoins and other digital currencies.',
     SECTION_1_TEXT_2: 'We strive to bring the digital enconomy forward through afforable and simple access to future currencies.',
     SECTION_1_BUTTON_1: 'Learn more',
     SECTION_3_TITLE: 'Features',
     SECTION_3_CARD_1_TITLE: 'PAYMENT OPTIONS',
     SECTION_3_CARD_1_TEXT: 'Most popular methods: Visa, MasterCard, bank transfer (SWIFT, SEPA), cryptocurrency',
     SECTION_3_CARD_2_TITLE: 'ADVANCED REPORTING',
     SECTION_3_CARD_2_TEXT: 'Downloadable reports, real-time balance, transaction history with transparent fees',
     SECTION_3_CARD_3_TITLE: 'STRONG SECURITY',
     SECTION_3_CARD_3_TEXT: 'Protection against DDoS attacks, full data encryption, compliant with PCI DSS standard',
     SECTION_3_CARD_4_TITLE: 'MARGIN TRADING',
     SECTION_3_CARD_4_TEXT: '1:2 and 1:3 leverages, automatic funds borrowing, no extra accounts needed, negative balance protection.',
     SECTION_3_CARD_5_TITLE: 'HIGH LIQUIDITY',
     SECTION_3_CARD_5_TEXT: 'Fast order execution, low spread, access to high liquidity orderbook for top currency pairs',
     SECTION_3_CARD_6_TITLE: 'LEGAL COMPLIANCE',
     SECTION_3_CARD_6_TEXT: 'Registration in UK, MSB status in FinCEN, essential licenses and strong relations with banks',
     SECTION_3_BUTTON_1: 'View Demo',
   },
   FOOTER: {
     FOOTER_LEGAL: [
       'Registration on or use of this site constitutes acceptance of our',
       'Terms of Service and Privacy Policy.',
       'Disclaimer Commerce Policy Made in NYC',
       'Stock quotes by finanzen.net',
     ],
     FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
     FOOTER_LANGUAGE_LANGUAGES: [
       { key: 'en', label: 'ENGLISH' },
       { key: 'es', label: 'SPANISH' },
     ],
     FOOTER_COPYRIGHT: 'COPYRIGHT 2017',
     SECTIONS: {
       SECTION_1_TITLE: 'SERVICES',
       SECTION_1_LINK_1: 'Buy Bitcoins',
       SECTION_1_LINK_2: 'Buy Ethereum',
       SECTION_1_LINK_3: 'Sell Bitcoins',
       SECTION_1_LINK_4: 'Bitcoin Trading',
       SECTION_1_LINK_5: 'Margin Trading',
       SECTION_2_TITLE: 'INFORMATION',
       SECTION_2_LINK_1: 'Payment Options',
       SECTION_2_LINK_2: 'Fee Schedule',
       SECTION_2_LINK_3: 'Getting Started',
       SECTION_2_LINK_4: 'Identity Verification Guide',
       SECTION_2_LINK_5: 'Card Verification Guide',
       SECTION_3_TITLE: 'TOOLS',
       SECTION_3_LINK_1: 'API',
       SECTION_3_LINK_2: 'Bitcoin Calculator',
       SECTION_3_LINK_3: 'Bitcoin Price Widget',
       SECTION_3_LINK_4: 'Mobile App',
       SECTION_3_LINK_5: 'Affiliate Program',
       SECTION_3_LINK_6: 'Donations',
       SECTION_4_TITLE: 'ABOUT',
       SECTION_4_LINK_1: 'About Us',
       SECTION_4_LINK_2: 'Legal & Security',
       SECTION_4_LINK_3: 'Terms of Use',
       SECTION_4_LINK_4: 'Refund Policy',
       SECTION_4_LINK_5: 'Press',
       SECTION_4_LINK_6: 'Blog',
       SECTION_4_LINK_7: 'Help Center',
     }
   }
 },
});

export default strings;

const la = strings.getLanguage();
const inL = strings.getInterfaceLanguage();
