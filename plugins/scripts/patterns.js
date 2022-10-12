const PLUGINS_PATH = 'https://bitholla.s3.ap-northeast-2.amazonaws.com/scripts/plugins';

const PATTERNS = {
  BUNDLES: "dist/**.js",
  JSONS: "json/**.json",
  PLUGINS: "src/plugins/*",
  VIEW: "views/**/index.js"
};

const FILES = {
  SCRIPT: 'script.js',
  ADMIN_VIEW: 'admin_view.html',
  WEB_VIEW: 'web_view.json',
  CONFIG: 'config.json',
  STRINGS: "strings.json",
  ICONS: "icons.json",
  VIEW: "view.json",
};

const PATHS = {
  ROOT: 'src/plugins',
  SERVER: 'server',
  BUNDLES: 'bundles',
  ASSETS: 'assets',
};

const TEMPLATES = {
  RAW: {
    type: 'raw',
    template: {
      VIEW: "src/templates/view",
      ASSETS: "src/templates/assets",
    },
  },
  PAGE: {
    type: 'page',
    template: 'src/templates/new-page',
  },
  VERIFICATION_TAB: {
    type: 'verification-tab',
    template: 'src/templates/verification-tab',
  },
  FIAT_WALLET: {
    type: 'fiat-wallet',
    template: 'src/templates/fiat-wallet',
  },
  KYC: {
    type: 'kyc',
    template: 'src/templates/kyc-verification',
  },
  BANK: {
    type: 'bank',
    template: 'src/templates/bank-verification',
  },
  ONRAMP: {
    type: 'onramp',
    template: 'src/templates/onramp',
  },
  APP: {
    type: 'app',
    template: 'src/templates/app',
  },
  SERVER: {
    type: 'server',
  }
};

module.exports = {
  PLUGINS_PATH,
  FILES,
  TEMPLATES,
  PATHS,
  PATTERNS,
}