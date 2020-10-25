import flatten from 'flat';

const options = { safe: true, delimiter: '_' }
const nestedColors = {
  base: {
    'background': '#202020',
    'top-bar-navigation': '#000000',
    'secondary-navigation-bar': '#2B2B2B',
    'wallet-sidebar-and-popup': '#333333',
    'footer': '#000000',
    'fields': '#191919',
    'inactive-button': '#535353',
  },

  labels: {
    'important-active-labels-text-graphics': '#000000',
    'secondary-inactive-label-text-graphics': '#808080',
  },

  trading: {
    'selling-related-elements': '#ee4036',
    'buying-related-elements': '#00a69c',
  },

  specials: {
    'buttons-links-and-highlights': '#0066b4',
    'chat-messages': '#98ccb2',
    'my-username-in-chat': '#ffff00',
    'checks-okay-done': '#008000',
    'pending-waiting-caution': '#F6921E',
    'notifications-alerts-warnings': '#ed1c24',
  }
};

const color = flatten(nestedColors, options)

export const oldDark = {

  //commonColors
  'colors-main-black': '#212121',
  'colors-white': 'white',
  'colors-black': '#000000',
  'colors-wave-phase-completed': '#808000',

  // common colors for deactivate and disabled look
  'colors-deactivate': '#797779',
  'colors-deactivate-color1': '#cccbcb',
  'colors-deactivate-color2': '#777677',
  'colors-deactivate-color3': '#f2f2f3',
  'colors-deactivate-color4': '#f1f2f2',

  //common colors for notifications and errors
  'colors-notifications-red': '#ed1c24',
  'colors-notification-inactive-red': '#e26171',
  'colors-notifications-blue': '#0000ff',
  'colors-notifications-green': '#00a651',

  //common colors for currencies
  'color-currency-eur--main': '#00a651',
  'color-currency-eur--secondary': '#52c2b8',
  'color-currency-btc--main': '#f15a29',
  'color-currency-btc--secondary': '#f7941e',
  'colors-currencies-bch': '#ec008c',
  'colors-currencies-eth': '#2e3192',
  'colors-currencies-ltc': '#58595b',
  'colors-currencies-xrp': '#2e3192',

  //common colors for terms
  'colors-terms-background': '#191919',

  // common colors for app bar
  'dark-app-bar-add-tab-menu-background': '#202020',
  'app-bar-menu-list-color': '#808080',
  'app-bar-icon-inactive': '#808080',

  // remaining dark colors
  'dark-app-background-color': '#202020',
  'dark-app-light-background': '#2b2b2b',
  'dark-app-line-divider': '#535353',
  'dark-buy': '#00A69C',
  'dark-link': '#0066B4',
  'dark-border-main': '#535353',
  'dark-inactive-color': '#2e2f37',
  'dark-font-sub-text-color': '#808080',
  'dark-font-sub-text-1-color': '#808080',
  'dark-disabled-main': '#2e2f37',
  'dark-accordion-arrow-active': '#ffffff',

  //Theme colors
  'app-background-color': '#202020',
  'app-light-background': '#2b2b2b',
  'app-sidebar-background': '#333333',
  'auth-container-background': '#333333',
  'quick-trade-background': '#202020',
  'quick-trade-container': '#333333',
  'app-modal-background': '#231f2080',
  'app-bar-background-color': '#0f1114',
  'app-line-divider': '#535353',
  'box-fields': '#353841',
  'buy': '#00A69C',
  'sell': '#EE4036',
  'color-sell-btc-light': '#EE4036',
  'link': '#0066B4',
  'trade-fields': '#191919',
  'trade-fields-border': '#2B2B2B',
  'trade-fill-indicator': '#444162',
  'trade-fill-indicator-text': '#878787',
  'buy-bids-text': '#000000',
  'sell-bids-text': '#ffffff',
  'app-logo-color': '#ffffff',
  'sidebar-border--color': '#797779',
  'border-color': '#777677',
  'border-main': '#535353',

  //Form field colors
  'form-color-underline-focus': '#ffffff',
  'form-color-underline': '#535353',
  'form-color-placeholder': '#808080',
  'form-arrow': '#535353',
  'form-label': '#ffffff',

  // tabs colors
  'tab-active': '#ffffff',
  'tab-inactive': '#808080',
  'sidebar-color': '#808080',
  'sidebar-color-active': '#ffffff',
  'info-panel-background': '#353841',
  'info-panel-text': '#808080',
  'icon-hover': '#ffffff',
  'icon-unhover': '#808080',
  'trade-tabs-inactive-color': '#808080',

  // theme footer
  'footer-background-color': '#0f1114',

  // chat color
  'chat-message-background-even': '#202020',
  'chat-message-background-odd': '#333333',
  'chat-message-color': '#98CCB2',
  'chat-box-border': '#2B2B2B',

  // transactions history
  'history-color-buy': '#d1d4dc',
  'history-color-sell': '#000000',

  // Trading view colors used in chart config
  'tradingViewWaterMark': '#808080',
  'tradingViewAxis': '#535353',
  'tradingViewText': '#808080',

  'inactive-color': "#2e2f37",
}

export default color;