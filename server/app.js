'use strict';

const { createServer } = require('http');
var SwaggerExpress = require('swagger-express-mw');
const morgan = require('morgan');
const { logEntryRequest, stream, logger } = require('./config/logger');
const { domainMiddleware, helmetMiddleware } = require('./config/middleware');
var app = require('express')();
// listen through pubsub for configuration/init

//init runs, populates configuration/secrets

const { verifyToken, checkHmacKey } = require('./api/helpers/auth');

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
		Bearer: verifyToken,
		HmacKey: checkHmacKey
	}
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	server.listen(PORT, () => {
		logger.info(`Server running on port: ${PORT}`);
	});
});
