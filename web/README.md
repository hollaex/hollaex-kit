# HEX Web
HEX Web is a front-end user interface for exchanges build using HEX Kit. It uses ReactJS and communicate with HEX Core server. HEX Web is open source and you are welcome to fork and create your own exchange views.  

[Demo](https://hollaex.com)

## Requirements
* NodeJS version 8 and higher
* npm version 6 and higher
* For windows users you need node-gyp installed.

## Install
HEX Web uses [create-react-app](https://github.com/facebook/create-react-app) for packaging and SASS for styling. Follow the instructions provided here to launch your web client.  

1. clone the repository
2. `cd web`
3. `npm install`

### Development
Create and copy `.env` file from `.env.example`. It is used for environment variables and certain fileds you should set for your exchange.  
Run `npm start` and the client builds and opens on your browser on port `3333` by default. It generates css files from SASS and places them in `/src` folder. During development the project listens for any updates on the code and reloads automatically. You can build css separately by running `node run build-css`.

## Production
By running `npm run build` the project gets built into `/build` folder and is ready to be deployed without any further configuration. The point of entry is `index.html`.

## Configuration
HEX Web is fully configurable and has all the constants used in the project in `/src/config/constants.js` where you can modify all variables.  
Here is a list of common items you can configure:
### Environment variables
  - `NODE_ENV`: `['production', 'development']` The build procedure automatically identifies the build so you do not need to set this.
  - `PUBLIC_URL`: `https://bitholla.com` public exchange URL used for static files and assets.
  - `REACT_APP_PUBLIC_URL`: `https://bitholla.com` Your exchange URL label. Same as above but only this is used within the project code and the other is for the assets.
  - `REACT_APP_NETWORK`: `['mainnet', 'testnet']` Mainnet referring to the main exchange and testnet to the simulating environment.
  - `REACT_APP_SERVER_ENDPOINT`: `https://api.bitholla.com` Your HEX Kit server endpoint
  - `REACT_APP_EXCHANGE_NAME`: `HEX Exchange` Exchange name
  - `REACT_APP_CAPTCHA_SITE_KEY`: `<Captcha here>` Google v3 recaptcha site key.
  - `REACT_APP_DEFAULT_LANGUAGE`: `en` default language of the exchange. Follow localization process.
  - `REACT_APP_DEFAULT_COUNTRY`: `SC` default country of the exchange. Use two letter country [ISO 3166](https://www.iban.com/country-codes)
  - `REACT_APP_BASE_CURRENCY`: `usdt` This is the coin that is used as the main coin in the exchange and has a trading pair with all the other coins.
### Localization
All strings used in the project can be found in `/src/config/localizedStrings.js` and we have two samples of `en.js` for English and `ko.js` for Korean by default.
### Images
All images and assets used are in `/public` and can be modified by uploading the new image for your own branding. Make sure you keep the file names to avoid mismatches and issues.  

### Styles
### Steps to configure white and dark theme
1. Modify colors under `colors for white theme` and `colors for dark theme` text in variables.scss file. there is also some common colors that effect in both dark and white theme.
2. Coin colors also categorized by theme in variables.scss file.
3. To apply different colors for chart element outline(slice in dount, bar in bar chart) change the `coin-${symbol}-1` and `dark-coin-${symbol}-1`.
