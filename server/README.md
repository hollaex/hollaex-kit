# Server
HollaEx Kit has a built in server based on express + swagger and provides API and Websocket communication for HollaEx Web or any other clients.

The main 3rd-party applications being used throughout the Server are:
- [HollaEx Tools Library](https://github.com/bitholla/hollaex-tools-lib)
- [HollaEx Node Library](https://github.com/bitholla/hollaex-node-lib#readme)
- [Express v4.16.2](https://expressjs.com/en/api.html)
- [SwaggerUI v2.0.0](https://swagger.io/docs/specification/2-0/basic-structure/)
- [Sequelize v4.37.7](https://sequelize.org/v4/)

To edit your own HollaEx Kit Server, you should be at least familiar with the applications above.

## API

All folders and files related to the RESTful API are in the `api` directory. The structure of this directory is:
- controllers
- helpers
- swagger

### Controllers

The files in the controllers folder hold all the functions that the endpoints connect to. The files are separated by the action that endpoints are responsible for:
- `admin.js`
- `deposit.js`
- `notification.js`
- `order.js`
- `otp.js`
- `public.js`
- `tier.js`
- `trade.js`
- `user.js`
- `withdrawal.js`

### Helpers

The files in the helpers folder hold all the helper functions used by the controller files above. Currently it is empty, but feel free to add any helper functions you need when customizing your own HollaEx Kit.

### Swagger

This folder holds the `swagger.yaml` file that contains all the endpoints for the server's RESTful API.

### Other Relevant Directories

- db
  - Contains the database functions, migration files, models, seeders, triggers, and redis clients.
  - Database used is `postgreSQL`
- mail
  - This directory holds everything relevant to emails.
  - The `strings` directory holds all the strings that contain email messages. They are separated by langauge e.g. `en.js`, `fa.js`, etc.
  - The `templates` directory holds all the email templates. They are separated by the emails being send e.g. `welcome.js`, `deposit.js`, etc.
  - The library used for emails is `Nodemailer`.
- config
  - This directory holds all the configurations for different functionalities e.g. the database, redis, and logger.

## Websocket

All websocket related files are contained in the `ws` directory. The HollaEx Kit websocket uses the following libraries:
- [HollaEx Node Library](https://github.com/bitholla/hollaex-node-lib#readme) - Used to connect to the HollaEx Network Websocket
- [ws](https://www.npmjs.com/package/ws) - Used to create the websocket server
- [ws-heartbeat](https://www.npmjs.com/package/ws-heartbeat) - Used to maintain websocket connection to the Network and also to disconnect any clients that don't send a message within 60 seconds

### Structure
- `channel.js` - Manages all the websocket channels that are connected to the Kit
- `hub.js` - Manages the Kit's connection to the HollaEx Network
- `index.js` - Handles all connections made to the Kit websocket
- `publicData.js` - Holds public orderbook and trade data received from the HollaEx Network
- `server.js` - The Kit websocket server is created here
- `sub.js` - Handles messages received from subscribers to the Kit Websocket
- `chat` - This directory holds all files related to the chat functionality of the Kit

### How it works
The HollaEx Kit websocket acts as a proxy between clients and the HollaEx Network. All it does is forward data received from the Network to connected users. Because of this nature, users will not be able to connect to your Kit's websocket if your Kit is not connected to the HollaEx Network's websocket. If the Kit's connection to the HollaEx Network disconnects, all connections to the Kit will be dropped. The hub websocket will reconnect automatically.

All clients connected to the Kit will need to send a message at least once per minute or their connection will be dropped from the Kit.

For all the events users can subscribe to, look at the [Node Library documentation](https://github.com/bitholla/hollaex-node-lib/blob/2.0/NETWORK_README.md#websocket).

## Plugins

The Kit plugins are handled within one file, `plugins.js`. The main libraries being used are:
- [eval v0.1.4](https://github.com/pierrec/node-eval) - Used to execute plugin scripts
- [Express v4.16.2](https://expressjs.com/en/api.html)

### How it works

The plugins are designed to be contained within their own process. They can be installed, updated, and uninstalled on the fly. Manipulating any plugin will not affect the actual API server. Plugins are stored in the database in the `Plugin` table.

#### Plugin structure

```json
{
    "version": 1, // Plugin version
    "name": "string", // Name of plugin, must be unique
    "author": "string", // Author of plugin
	"bio": "string", // Plugin bio
	"enabled": true, // Plugin enabled status
    "description": "string", // Plugin description
    "documentation": "string", // Plugin documentation. Will be in markdown format
    "logo": "string", // URL of plugin logo
    "icon": "string", // URL of plugin icon
    "url": "string", // URL of plugin (where it can be found)
    "meta": {}, // Variables that will be unique for each instance of this plugin
    "prescript": { // Scripts to run before installing plugin
        "run": "string",
        "install": []
    },
    "postscript": { // Scripts to run before uninstalling plugin
        "run": "string"
    },
	"script": "string", // Plugin script to run after installation
    "admin_view": "string", // Client code for admin panel
    "web_view": "string" // Client code for web view
}
```

#### Meta
The meta object is for any unique values your plugin requires. For example, if you are building a plugin using AWS S3, you will need a way to input your AWS credentials. You can use the meta object to store this values so they will be accessable in your plugin.

```javascript
{
	"meta": {
		"key": "key",
		"secret": "secret"
	}
}
```

Meta values are stored in the script as `meta`. Our `meta` values can be accessed as follows:
```javascript
const { key, secret } = meta;
```

#### Libraries

- The HollaEx Plugins can be developed using the installed libraries below. They are accessable in the script as the value in the parentheses.

  - HollaEx Tools Library (`toolsLib`)
  - Express (`app`)
  - Lodash (`lodash`)
  - Express Validator (`expressValidator`)
  - Winston logger `loggerPlugin`
  - Multer (`multer`)

If your plugin requires other libraries, add the `npm` library name to the `install` array in `prescript`.
```javascript
{
	"prescript": {
		"install": ['npm-library']
	}
}
```

Installed libraries are stored in the script as `installedLibraries`.
```javascript
const npmLibrary = installedLibraries['npm-library'];
```


#### Script
Scripts must be written in ES6+ becuase they will be minified before installation. If this minification fails, the installation will fail as well. The script is what runs after you install and enable the plugin. All endpoints created must start with the path `/plugins`.
```javascript
app.get('/plugins/say-hi', (req, res) => {
	res.send('hi');
});
```

### Endpoints

#### `GET /plugins`
  - Will return paginated data of plugins installed on Kit
  - Query parameters:
      - `limit`
      - `page`
      - `search` - Get plugins with names that match this value
#### `POST /plugins`
  - Installs a new plugin into the kit
  - Only admins can access this
  - Returns the newly created plugin and restarts plugin server if plugin is enabled
  - Body values:
      ```jsx
      {
      	name: 'string',
      	script: 'string',
      	version: 'int',
      	description: 'string',
      	author: 'string',
      	enabled: 'boolean',
      	bio: 'string', //optional
      	documentation: 'string', //optional
      	icon: 'string', //optional
      	url: 'string', //optional
      	logo: 'string', //optional
      	admin_view: 'string', //optional
      	web_view: 'string', //optional
      	prescript: { //optional
      		install: 'array',
      		run: 'string'
      	},
      	postscript: { //optional
      		run: 'string'
      	},
      	meta: { //optional
      		...any values
      	}
      }
      ```
#### `PUT /plugins`
  - Updates an existing plugin to a new version
  - Returns the updated plugin and restarts plugin server if plugin in enabled
  - Only admin can access this endpoint
  - Body values:
    ```jsx
    {
    	name: 'string',
    	version: 'int', //Version must be different from the one already installed
    	script: 'string',
    	description: 'string', //optional
    	author: 'string', //optional
    	bio: 'string', //optional
    	documentation: 'string', //optional
    	icon: 'string', //optional
    	url: 'string', //optional
    	logo: 'string', //optional
    	admin_view: 'string', //optional
    	web_view: 'string', //optional
    	prescript: { //optional
    		install: 'array',
    		run: 'string'
    	},
    	postscript: { //optional
    		run: 'string'
    	},
    	meta: { //optional
    		...any values
    	}
    }
    ```
#### `DELETE /plugins`
  - Uninstalls a plugin from the Kit and restarts the plugin server
  - Returns Success message
  - Only admins can access this
  - Query parameters:
      - `name` - name of the plugin to uninstall
#### `GET /plugins/enable`
  - Will enable a plugin if disabled
  - Only admin can access this endpoint
  - Returns a success message and restarts plugin server
  - Query parameters:
      - `name` - name of plugin to enable
#### `GET /plugins/disable`
  - Will disable a plugin if enabled
  - Only admin can access this endpoint
  - Returns a success message and restarts plugin server
  - Query parameters:
      - `name` - name of plugin to disable
#### `GET /plugins/script`
  - Will return `name`, `version`, `script`, `prescript`, `postscript`, and `admin_view` for plugin
  - Only admin can access this endpoint
  - Query parameters:
      - `name` - name of plugin
#### `GET /plugins/meta`
  - Will return the meta values for the plugin
  - Only admin can access this endpoint
  - Returns `name`, `version`, and `meta` for plugin
  - Query parameters:
      - `name` - name of plugin
#### `PUT /plugins/meta`
  - Update the meta object for a plugin. This meta object stores values used within a plugin
  - Only admin can access this endpoint
  - Returns a success message and restarts the plugin server
  - Body values:
      ```jsx
      {
      	name: 'string',
      	meta: {
      		...any values
      		// will only update values that are both in the original plugin meta
      		// and that are passed within this object. The meta object passed
      		// through this endpoint doesn't completely override the existing meta
      	}
      }
      ```

