'use strict';

const { createServer } = require('http');
var SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
var YAML = require('yamljs');
var swaggerDoc = YAML.load('./api/swagger/swagger.yaml');
const { logEntryRequest, stream, logger } = require('./config/logger');
const { domainMiddleware, helmetMiddleware, rateLimitMiddleware } = require('./config/middleware');
const toolsLib = require('hollaex-tools-lib');
const { checkStatus } = require('./init');
const { API_HOST, CUSTOM_CSS } = require('./constants');

checkStatus()
	.then(() => {
		logger.info(
			'app.js Initializing API Server'
		);

		var app = require('express')();

		// listen through pubsub for configuration/init

		//init runs, populates configuration/secrets

		const PORT = process.env.PORT || 10010;

		const server = createServer(app);

		module.exports = app; // for testing

		app.use(logEntryRequest);
		app.use(domainMiddleware);
		rateLimitMiddleware(app);
		helmetMiddleware(app);

		const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
		app.use(morgan(morganType, { stream }));

		var config = {
			appRoot: './', // required config
			swaggerSecurityHandlers: {
				Bearer: toolsLib.security.verifyBearerTokenMiddleware,
				HmacKey: toolsLib.security.verifyHmacTokenMiddleware
			}
		};

		swaggerDoc.host = API_HOST;
		if (process.env.NODE_ENV === 'production') {
			swaggerDoc.schemes = ['https'];
			Object.entries(swaggerDoc.paths).forEach(([path, pathContent], index) => {
				Object.keys(pathContent).forEach((method) => {
					if (method.indexOf('swagger') === -1) {
						if (Object.prototype.hasOwnProperty.call(pathContent[method], 'tags')) {
							const tags = pathContent[method].tags;
							const index = tags.findIndex((value) => value === 'Admin' || value === 'Notification');
							if (index > -1) {
								delete pathContent[method];
							}
						}
					}
				});
			});
		}

		var options = {
			customCss: CUSTOM_CSS,
			customSiteTitle: 'API Explorer'
		};

		app.get('/', (req, res) => {
			res.redirect('/v2/health');
		});

		app.use('/api/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));

		SwaggerExpress.create(config, function(err, swaggerExpress) {
			if (err) { throw err; }

			// install middleware
			swaggerExpress.register(app);

			server.listen(PORT, () => {
				logger.info(`Server running on port: ${PORT}`);
			});
		});
	})
	.catch((err) => {
		let message = 'API Initialization failed';
		if (err.message) {
			message = err.message;
		}
		if (err.statusCode && err.statusCode === 402) {
			message = err.error.message;
		}
		logger.error('app/checkStatus Error ', message);
		setTimeout(() => { process.exit(1); }, 60 * 1000 * 5);
	});
