# HollaEx Web
HollaEx Web is a front-end user interface for HollaEx Kit exchanges. It uses React, HTML and SASS and uses REST API and Websocket channels to communicate with HollaEx Core server.

HollaEx Web is open source and you are welcome to fork and create your own customized exchange interface.  

[Demo](https://hollaex.com)

## Requirements
* NodeJS version 8 and higher
* npm version 6 and higher
* For windows users you need node-gyp installed.

## Install
HollaEx Web uses [create-react-app](https://github.com/facebook/create-react-app) for packaging and SASS for styling. You can either build and run HollaEx Web through HollaEx CLI or build it independandly on your own.

Read more about HollaEx Web, its installation and deployment as well as customization on our [docs](https://docs.bitholla.com).

For independant install and project deployment follow the instructions provided here to launch your web client.

1. clone the repository
2. `cd web`
3. `npm install`

### Development
Create and copy `.env` file from `.env.example`. It is used for environment variables and certain fileds you should set for your exchange.  
Run `npm start` and the client builds and opens on your browser on port `3333` by default. It generates css files from SASS and places them in `/src` folder. During development the project listens for any updates on the code and reloads automatically. You can build css separately by running `node run build-css`.

## Production
By running `npm run build` the project gets built into `/build` folder and is ready to be deployed without any further configuration. The point of entry is `index.html`.