# hollaex
Hollaex is a Bitcoin exchange. It's using reactjs framework as the front-end javascript frametwork and uses Hollaex server.

## Development
### Requirements
You need to have nodejs and npm installed

### Installation
1. clone the repository
2. cd hollaex
3. `npm install`

### Run in your local machine
2. Hollaex uses sass for styling. You need to generate css files before running the project. `node run build-css` builds all css files from sass styles in `/src` folder.
3. `npm start` it will also listen to changes in sass files and autogenerates css files in there.

## Production
You can build the project by running `npm run build` and the projects builds the entire client in `/build` folder

## Properties to set
- Build variables:
  - NODE_ENV `['production', 'development']`
  - PUBLIC_URL `https://hollaex.com`
  - REACT_APP_NETWORK `['mainnet', 'testnet']`
  - REACT_APP_SERVER_ENDPOINT `https://api.hollaex.com`
  - REACT_APP_CAPTCHA_SITE_KEY `6LcSOUIUAAAAAEbu2RXTpm-hdvQnTcTy12qG2y86`
- ORDER PRICES
  - REACT_APP_MIN_PRICE `500`
  - REACT_APP_MAX_PRICE `50000`
  - REACT_APP_PRICE_STEP `1`
- BANK DATA (NOT USED)
  - REACT_APP_BANK_WITHDRAWAL_BASE_FEE `1`
  - REACT_APP_BANK_WITHDRAWAL_DYNAMIC_FEE_RATE `0.5`
  - REACT_APP_BANK_WITHDRAWAL_MAX_DYNAMIC_FEE `50`
