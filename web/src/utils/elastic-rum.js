import React from 'react';
import { captureError, addLabels, addSpan } from '../config/elastic-rum';

// Redux middleware for Elastic RUM
export const elasticRumMiddleware = (store) => (next) => (action) => {
	const startTime = performance.now();

	// Start a span for the action
	const span = addSpan(`Redux Action: ${action.type}`, 'redux', 'action');

	try {
		// Add action-specific labels
		if (window.elasticRum) {
			addLabels({
				actionType: action.type,
				actionPayload: JSON.stringify(action.payload || {}),
				reduxAction: true,
			});
		}

		// Execute the action
		const result = next(action);

		// End the span
		if (span) {
			span.end();
		}

		// Track action duration
		const duration = performance.now() - startTime;
		if (window.elasticRum) {
			addLabels({
				actionDuration: duration,
				actionSuccess: true,
			});
		}

		return result;
	} catch (error) {
		// End the span with error
		if (span) {
			span.end();
		}

		// Capture the error
		captureError(error, {
			context: 'redux-action',
			actionType: action.type,
			actionPayload: action.payload,
		});

		// Re-throw the error
		throw error;
	}
};

// API call wrapper for Elastic RUM
export const withElasticRumTracking = (apiCall, options = {}) => {
	return async (...args) => {
		const startTime = performance.now();
		const operationName = options.name || 'API Call';

		// Start a span for the API call
		const span = addSpan(operationName, 'http', 'request');

		try {
			// Add API call labels
			if (window.elasticRum) {
				addLabels({
					apiOperation: operationName,
					apiArgs: JSON.stringify(args),
					apiCall: true,
				});
			}

			// Execute the API call
			const result = await apiCall(...args);

			// End the span
			if (span) {
				span.end();
			}

			// Track API call duration
			const duration = performance.now() - startTime;
			if (window.elasticRum) {
				addLabels({
					apiDuration: duration,
					apiSuccess: true,
					apiResult: JSON.stringify(result),
				});
			}

			return result;
		} catch (error) {
			// End the span with error
			if (span) {
				span.end();
			}

			// Capture the error
			captureError(error, {
				context: 'api-call',
				operationName,
				args,
				duration: performance.now() - startTime,
			});

			// Re-throw the error
			throw error;
		}
	};
};

// User interaction tracking
export const trackUserInteraction = (interactionName, details = {}) => {
	if (window.elasticRum) {
		const span = addSpan(
			`User Interaction: ${interactionName}`,
			'user',
			'interaction'
		);

		addLabels({
			interactionName,
			interactionDetails: JSON.stringify(details),
			userInteraction: true,
		});

		return span;
	}
	return null;
};

// Performance tracking for specific operations
export const trackPerformance = (operationName, operation) => {
	return async (...args) => {
		const startTime = performance.now();
		const span = addSpan(
			`Performance: ${operationName}`,
			'performance',
			'operation'
		);

		try {
			addLabels({
				operationName,
				performanceTracking: true,
			});

			const result = await operation(...args);

			const duration = performance.now() - startTime;
			addLabels({
				operationDuration: duration,
				operationSuccess: true,
			});

			if (span) {
				span.end();
			}

			return result;
		} catch (error) {
			if (span) {
				span.end();
			}

			captureError(error, {
				context: 'performance-operation',
				operationName,
				duration: performance.now() - startTime,
			});

			throw error;
		}
	};
};

// WebSocket connection tracking
export const trackWebSocketConnection = (url, options = {}) => {
	if (window.elasticRum) {
		const span = addSpan(`WebSocket: ${url}`, 'websocket', 'connection');

		addLabels({
			websocketUrl: url,
			websocketOptions: JSON.stringify(options),
			websocketConnection: true,
		});

		return {
			span,
			onMessage: (message) => {
				addLabels({
					websocketMessage: JSON.stringify(message),
				});
			},
			onError: (error) => {
				captureError(error, {
					context: 'websocket-error',
					url,
				});
			},
			onClose: () => {
				if (span) {
					span.end();
				}
			},
		};
	}
	return null;
};

// Form submission tracking
export const trackFormSubmission = (formName, formData = {}) => {
	if (window.elasticRum) {
		const span = addSpan(`Form Submission: ${formName}`, 'form', 'submission');

		addLabels({
			formName,
			formData: JSON.stringify(formData),
			formSubmission: true,
		});

		return span;
	}
	return null;
};

// Page load tracking
export const trackPageLoad = (pageName) => {
	if (window.elasticRum) {
		const span = addSpan(`Page Load: ${pageName}`, 'page', 'load');

		addLabels({
			pageName,
			pageLoad: true,
			url: window.location.href,
		});

		return span;
	}
	return null;
};

// Enhanced page tracking with path analysis
export const trackPageWithPath = () => {
	if (window.elasticRum) {
		const pathSegments = window.location.pathname.split('/').filter(Boolean);
		const pageName =
			pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'home';
		const section = pathSegments.length > 1 ? pathSegments[0] : 'main';

		const transactionName = `Page: ${pageName}`;
		const transaction = window.elasticRum.apm.startTransaction(
			transactionName,
			'page-load'
		);

		addLabels({
			pageName,
			section,
			pathSegments: pathSegments.join(','),
			fullPath: window.location.pathname,
			url: window.location.href,
			referrer: document.referrer,
		});

		return transaction;
	}
	return null;
};

// Custom event tracking
export const trackCustomEvent = (eventName, eventData = {}) => {
	if (window.elasticRum) {
		const span = addSpan(`Custom Event: ${eventName}`, 'custom', 'event');

		addLabels({
			eventName,
			eventData: JSON.stringify(eventData),
			customEvent: true,
		});

		return span;
	}
	return null;
};

// Error tracking with context
export const trackError = (error, context = {}) => {
	captureError(error, {
		...context,
		url: window.location.href,
		userAgent: navigator.userAgent,
		timestamp: new Date().toISOString(),
	});
};

// Performance monitoring utilities
export const monitorPerformance = {
	// Monitor function execution time
	measureFunction: (functionName, fn) => {
		return async (...args) => {
			const startTime = performance.now();
			const span = addSpan(
				`Function: ${functionName}`,
				'function',
				'execution'
			);

			try {
				const result = await fn(...args);
				const duration = performance.now() - startTime;

				addLabels({
					functionName,
					functionDuration: duration,
					functionSuccess: true,
				});

				if (span) {
					span.end();
				}

				return result;
			} catch (error) {
				if (span) {
					span.end();
				}

				trackError(error, {
					context: 'function-execution',
					functionName,
					duration: performance.now() - startTime,
				});

				throw error;
			}
		};
	},

	// Monitor component render time
	measureComponent: (componentName) => {
		return (WrappedComponent) => {
			return class extends React.Component {
				componentDidMount() {
					if (window.elasticRum) {
						addLabels({
							componentName,
							componentMounted: true,
						});
					}
				}

				componentDidUpdate() {
					if (window.elasticRum) {
						addLabels({
							componentName,
							componentUpdated: true,
						});
					}
				}

				render() {
					return <WrappedComponent {...this.props} />;
				}
			};
		};
	},
};

export default {
	elasticRumMiddleware,
	withElasticRumTracking,
	trackUserInteraction,
	trackPerformance,
	trackWebSocketConnection,
	trackFormSubmission,
	trackPageLoad,
	trackPageWithPath,
	trackCustomEvent,
	trackError,
	monitorPerformance,
};
