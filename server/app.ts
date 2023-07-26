'use strict';

import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import swaggerDoc from './api/swagger/swagger';
import { logEntryRequest, stream, logger } from './config/logger';
import { domainMiddleware, helmetMiddleware, rateLimitMiddleware } from './config/middleware';
import toolsLib from 'hollaex-tools-lib';
import { checkStatus } from './init';
import { API_HOST, CUSTOM_CSS } from './constants';
import swaggerTools from 'swagger-tools';
import cors from 'cors';

checkStatus()
	.then(() => {
		logger.info(
			'app.js Initializing API Server'
		);

		const app = require('express')();
		app.use(cors());
		// listen through pubsub for configuration/init

		//init runs, populates configuration/secrets

		const PORT = process.env.PORT || 10010;

		const server = createServer(app);

		module.exports = app; // for testing

		app.use(logEntryRequest);
		app.use(domainMiddleware);
		if (process.env.NODE_ENV !== 'test') {
   			rateLimitMiddleware(app);
		}
		helmetMiddleware(app);

		const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
		app.use(morgan(morganType, { stream }));



		const options = {
			customCss: CUSTOM_CSS,
			customSiteTitle: 'API Explorer'
		};

		app.get('/', (req, res) => {
			res.redirect('/v2/health');
		});

		const initializeSwaggerSecurity = (middleware) => {
			return middleware.swaggerSecurity({
				Token: toolsLib.security.verifyAuthTokenMiddleware
			});
		};

		swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

			app.use(middleware.swaggerMetadata());
			app.use(initializeSwaggerSecurity(middleware));

			app.use(middleware.swaggerValidator({ validateResponse: true }));
			app.use(middleware.swaggerRouter({
				useStubs: true, controllers: './api/controllers'
			}));

			// // swaggerDoc.host = API_HOST;
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

			// Custom error handler that returns JSON
			app.use(function (err, req, res, next) {
				if (typeof err !== 'object') {
					// If the object is not an Error, create a representation that appears to be
					err = {
						message: String(err) // Coerce to string
					};
				} else {
					// Ensure that err.message is enumerable (It is not by default)
					Object.defineProperty(err, 'message', { enumerable: true });
				}
				res.statusCode = 500;
				res.json(err);
			});


			app.use('/api/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));

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
