import flatten from 'flat';

const options = { safe: true, delimiter: '_' }
const nestedColors = {
  base: {
    'background': '#ffffff',
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

export const oldLight = {

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
  'app-background-color': '#ffffff',
  'app-light-background': '#F2F2F3',
  'app-sidebar-background': 'white',
  'auth-container-background': '#ffffff',
  'quick-trade-background': '#ebf3f1',
  'quick-trade-container': '#ffffff',
  'app-modal-background': '#ddddddbf',
  'app-bar-background-color': '#000000',
  'app-line-divider': '#212121',
  'box-fields': '#f0f1f1',
  'buy': '#6496AA',
  'sell': '#000000',
  'color-sell-btc-light': '#000000',
  'link': '#0000ff',
  'trade-fields': '#cccbcb',
  'trade-fields-border': '#212121',
  'trade-fill-indicator': '#000000',
  'trade-fill-indicator-text': '#878787',
  'buy-bids-text': '#000000',
  'sell-bids-text': '#ffffff',
  'app-logo-color': '#ffffff',
  'sidebar-border--color': '#797779',
  'border-color': '#777677',
  'border-main': '#212121',

  //Form field colors
  'form-color-underline-focus': '#212121',
  'form-color-underline': '#cccbcb',
  'form-color-placeholder': '#cccbcb',
  'form-arrow': '#212121',
  'form-label': '#777677',

  // tabs colors
  'tab-active': '#212121',
  'tab-inactive': '#777677',
  'sidebar-color': '#777677',
  'sidebar-color-active': '#212121',
  'info-panel-background': '#f5f5f5',
  'info-panel-text': '#777677',
  'icon-hover': '#212121',
  'icon-unhover': '#777677',
  'trade-tabs-inactive-color': '#808080',

  // theme footer
  'footer-background-color': '#000000',

  // chat color
  'chat-message-background-even': '#f0f1f1',
  'chat-message-background-odd': '#e6e6e6',
  'chat-message-color': '#4f4f4f',
  'chat-box-border': '#f0f1f1',

  // transactions history
  'history-color-buy': '#d1d4dc',
  'history-color-sell': '#000000',

  // Trading view colors used in chart config
  'tradingViewWaterMark': '#202020',
  'tradingViewAxis': '#E6ECEF',
  'tradingViewText': '#292b2c',

  'inactive-color': "#2e2f37",
}

export default color;