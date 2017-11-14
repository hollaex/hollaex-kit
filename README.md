# Exir Client

Exir is a Bitcoin trading platfrom. It's using reactjs framework as the front-end javascript frametwork and uses EXIR back-end as its server.

## Development
### Requirements
You need to have nodejs and npm installed

### Installation
1. clone the repository
2. cd exir
3. `npm install`

### Run in your local machine
2. EXIR uses sass for styling. You need to generate css files before running the project. `node run build-css` builds all css files from sass styles in `/src` folder.
3. `npm start` it will also listen to changes in sass files and autogenerates css files in there.

## Production
You can build the project by running `npm run build` and the projects builds the entire client in `/build` folder

## Properties to set
- Build variables:
  - NODE_ENV `['production', 'development']`
  - REACT_APP_NETWORK `['mainnet', 'testnet']`
- Bank data for deposits
  - BANK_NAME
  - ACCOUNT_OWNER
  - ACCOUNT_NUMBER
