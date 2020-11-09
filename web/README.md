# Web Application

HollaEx Kit uses Reactjs framework as a single page application and communicates with the back-end servers through REST API and Websocket channels.

## Development

### Requirements

You need to have nodejs and npm installed

### Installation

1. clone the repository
2. `cd web`
3. `npm install`

### Run in your local machine

2. HollaEx uses sass for styling. You need to generate css files before running the project. `node run build-css` builds all css files from sass styles in `/src` folder.
3. `npm start` it will also listen to changes in sass files and autogenerates css files in there.

## Production

You can build the project by running `npm run build` and the projects builds the entire client in `/build` folder

## Properties to set

- Build variables in `.env` file:
  - NODE_ENV `['production', 'development']`
  - REACT_APP_PUBLIC_URL `https://hollaex.com`
  - REACT_APP_SERVER_ENDPOINT `https://api.hollaex.com` (or your own API server)
  - REACT_APP_CAPTCHA_SITE_KEY your Google Recaptcha key for security purposes

### Styles

### Steps to configure white and dark theme

1. Modify colors under `colors for white theme` and `colors for dark theme` text in variables.scss file. there is also some common colors that effect in both dark and white theme.
2. Coin colors also categorized by theme in variables.scss file.
3. To apply different colors for chart element outline(slice in dount, bar in bar chart) change the `coin-${symbol}-1` and `dark-coin-${symbol}-1`.
