'use strict';

const { createServer } = require('http');
var SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
var YAML = require('yamljs');
var swaggerDoc = YAML.load('./api/swagger/swagger.yaml');
const { logEntryRequest, stream, logger } = require('./config/logger');
const { domainMiddleware, helmetMiddleware } = require('./config/middleware');
var app = require('express')();
const toolsLib = require('hollaex-tools-lib');
const { checkStatus } = require('./init');
const { API_HOST, CUSTOM_CSS } = require('./constants');

checkStatus();
// listen through pubsub for configuration/init

//init runs, populates configuration/secrets

const PORT = process.env.PORT || 10010;

const server = createServer(app);

module.exports = app; // for testing

app.use(logEntryRequest);

app.use(domainMiddleware);
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
				if (pathContent[method].hasOwnProperty('tags')) {
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
	customSiteTitle: 'HollaEx Kit API Explorer',
	customfavIcon:
		'https://rm-content.s3.amazonaws.com/5aead825bb456c005e2322dd/upload-c116da40-ebd2-11e8-9c84-e32cc39c32d1_57.png'
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	server.listen(PORT, () => {
		logger.info(`Server running on port: ${PORT}`);
	});
});
