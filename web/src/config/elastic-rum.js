import { init as initApm } from '@elastic/apm-rum';
import store from 'store';

// Elastic RUM Configuration
const getElasticRumConfig = () => {
	const getExchangeName = store?.getState()?.app.constants?.api_name;
	const isProduction = process.env.NODE_ENV === 'production';
	const isDevelopment = process.env.NODE_ENV === 'development';

	// Get configuration from environment variables
	const serverUrl =
		process.env.REACT_APP_ELASTIC_APM_SERVER_URL || 'http://localhost:8200';
	const serviceName =
		process.env.REACT_APP_ELASTIC_APM_SERVICE_NAME || 'hollaex-web';
	const serviceVersion =
		process.env.REACT_APP_ELASTIC_APM_SERVICE_VERSION || '1.0.0';
	const environment =
		process.env.REACT_APP_ELASTIC_APM_ENVIRONMENT ||
		process.env.NODE_ENV ||
		'development';
	const secretToken = process.env.REACT_APP_ELASTIC_APM_SECRET_TOKEN;
	const publicToken = process.env.REACT_APP_ELASTIC_APM_PUBLIC_TOKEN;

	// Base configuration
	const config = {
		serviceName,
		serviceVersion,
		environment,
		serverUrl,
		active:
			String(process.env.REACT_APP_ELASTIC_APM_ENABLED || '').toLowerCase() ===
			'true',
		distributedTracing: true,
		distributedTracingOrigins: ['*'],
		captureErrors: true,
		captureUnhandledRejections: true,
		// User experience monitoring
		pageLoadTransactionName: 'page-load',
		pageLoadTransactionUsePathAsName: true, // default behavior
		userContext: {
			user: null, // Will be set dynamically
		},
		labels: {
			app: getExchangeName || 'hollaex-web',
			platform: 'web',
		},
		transactionSampleRate: isProduction ? 0.1 : 1.0, // 10% in production, 100% in development
		errorSampleRate: isProduction ? 0.1 : 1.0,
		performanceThresholds: {
			transactionDuration: 1000, // 1 second
			transactionDurationThreshold: 5000, // 5 seconds
		},
	};

	if (secretToken) {
		config.secretToken = secretToken;
	}
	if (publicToken) {
		config.publicToken = publicToken;
	}

	if (isDevelopment) {
		config.logLevel = 'debug';
		config.transactionSampleRate = 1.0;
		config.errorSampleRate = 1.0;
	}

	return config;
};

let apm = null;

export const initializeElasticRum = () => {
	const getExchangeName = store.getState()?.app.constants?.api_name;
	try {
		const config = getElasticRumConfig();
		if (config?.active) {
			apm = initApm(config);

			// Add custom context
			apm.setCustomContext({
				app: getExchangeName || 'hollaex-exchange',
				version: config?.serviceVersion,
				environment: config?.environment,
			});

			const setUserContext = (user) => {
				if (apm && user) {
					apm.setUserContext({
						id: user?.id || user?.user_id,
						email: user?.email,
						username: user?.username || user?.full_name,
					});
				}
			};

			const setTransactionContext = (name, type = 'custom') => {
				if (apm) {
					apm.startTransaction(name, type);
				}
			};

			const addLabels = (labels) => {
				if (apm) {
					apm.addLabels(labels);
				}
			};

			const captureError = (error, context = {}) => {
				if (apm) {
					apm.captureError(error, context);
				}
			};

			const addSpan = (
				name,
				type = 'custom',
				subtype = null,
				action = null
			) => {
				if (apm) {
					return apm.startSpan(name, type, subtype, action);
				}
				return null;
			};

			window.elasticRum = {
				apm,
				setUserContext,
				setTransactionContext,
				addLabels,
				captureError,
				addSpan,
			};
		}
	} catch (error) {
		console.error('Failed to initialize Elastic RUM:', error);
	}
};

export const getApm = () => apm;

export const setUserContext = (user) => {
	if (window?.elasticRum) {
		window.elasticRum.setUserContext(user);
	}
};

export const setTransactionContext = (name, type) => {
	if (window?.elasticRum) {
		window.elasticRum.setTransactionContext(name, type);
	}
};

export const addLabels = (labels) => {
	if (window?.elasticRum) {
		window.elasticRum.addLabels(labels);
	}
};

export const captureError = (error, context) => {
	if (window?.elasticRum) {
		window.elasticRum.captureError(error, context);
	}
};

export const addSpan = (name, type, subtype, action) => {
	if (window?.elasticRum) {
		return window.elasticRum.addSpan(name, type, subtype, action);
	}
	return null;
};

export default {
	initializeElasticRum,
	getApm,
	setUserContext,
	setTransactionContext,
	addLabels,
	captureError,
	addSpan,
};
