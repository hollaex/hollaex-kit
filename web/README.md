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

To change the API URL for `PRODUCTION` or `DEVELOPMENT` you can configure `/web/src/config/index.js`. In development mode it connects to https://api.sandbox.hollaex.com by default.
