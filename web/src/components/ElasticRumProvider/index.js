import React, { useEffect, useContext, createContext } from 'react';
import { withRouter } from 'react-router';
import {
	initializeElasticRum,
	setUserContext,
	setTransactionContext,
	addLabels,
	captureError,
} from '../../config/elastic-rum';
import { trackPageWithPath } from '../../utils/elastic-rum';

// Create context for Elastic RUM
const ElasticRumContext = createContext();

// Provider component
const ElasticRumProvider = ({ children, location, history }) => {
	useEffect(() => {
		// Initialize Elastic RUM on component mount
		initializeElasticRum();

		// Track initial page load with enhanced path tracking
		if (window.elasticRum) {
			// Create a custom page load transaction
			const pathSegments = window.location?.pathname
				?.split('/')
				?.filter(Boolean);
			const pageName =
				pathSegments?.length > 0
					? pathSegments[pathSegments?.length - 1]
					: 'home';
			const transactionName = `Page: ${pageName}`;

			const transaction = window?.elasticRum?.apm?.startTransaction(
				transactionName,
				'page-load'
			);

			// Add page load specific labels
			addLabels({
				pageName,
				pageLoad: true,
				initialLoad: true,
				pathSegments: pathSegments?.join(','),
				fullPath: window.location?.pathname,
				url: window.location?.href,
				referrer: document.referrer,
			});

			// End transaction after page load is complete
			window.addEventListener('load', () => {
				if (transaction) {
					transaction.end();
				}
			});
		}
	}, []);

	// Intercept DOMContentLoaded to create custom page load transaction
	useEffect(() => {
		const handleDOMContentLoaded = () => {
			if (window?.elasticRum && !window.elasticRum?.pageLoadTracked) {
				const pathSegments = window.location?.pathname
					?.split('/')
					?.filter(Boolean);
				const pageName =
					pathSegments?.length > 0
						? pathSegments[pathSegments?.length - 1]
						: 'home';
				const transactionName = `Page: ${pageName}`;

				const transaction = window?.elasticRum?.apm?.startTransaction(
					transactionName,
					'page-load'
				);

				addLabels({
					pageName,
					pageLoad: true,
					domContentLoaded: true,
					pathSegments: pathSegments?.join(','),
					fullPath: window.location?.pathname,
					url: window.location?.href,
				});

				// Mark as tracked to avoid duplicates
				window.elasticRum.pageLoadTracked = true;

				// End transaction after a delay to capture page load metrics
				setTimeout(() => {
					if (transaction) {
						transaction.end();
					}
				}, 1000);
			}
		};

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
		} else {
			handleDOMContentLoaded();
		}

		return () => {
			document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
		};
	}, []);

	useEffect(() => {
		// Track route changes as transactions
		if (window.elasticRum && location) {
			// Use enhanced page tracking for route changes
			const transaction = trackPageWithPath();

			// Add additional route-specific labels
			addLabels({
				routeChange: true,
				search: location?.search,
				hash: location?.hash,
			});

			// End the transaction when component unmounts or route changes
			return () => {
				if (transaction) {
					transaction.end();
				}
			};
		}
	}, [location]);

	// Listen for navigation events
	useEffect(() => {
		if (!history || !window?.elasticRum) return;

		const unlisten = history.listen((location, action) => {
			if (window?.elasticRum) {
				// Create descriptive navigation transaction name
				const pathSegments = location.pathname?.split('/')?.filter(Boolean);
				const pageName =
					pathSegments?.length > 0
						? pathSegments[pathSegments?.length - 1]
						: 'home';
				const transactionName = `Navigation: ${action} to ${pageName}`;

				// Start navigation transaction
				const transaction = window?.elasticRum?.apm?.startTransaction(
					transactionName,
					'navigation'
				);

				addLabels({
					action,
					route: location?.pathname,
					pageName: pageName,
					pathSegments: pathSegments?.join(','),
					search: location?.search,
					navigationType: action,
				});

				// End transaction after a short delay to capture navigation completion
				setTimeout(() => {
					if (transaction) {
						transaction.end();
					}
				}, 100);
			}
		});

		return () => {
			unlisten();
		};
	}, [history]);

	// Global error boundary for Elastic RUM
	useEffect(() => {
		const handleGlobalError = (event) => {
			if (window?.elasticRum) {
				captureError(event?.error || event, {
					context: 'global-error',
					url: window.location?.href,
					userAgent: navigator.userAgent,
				});
			}
		};

		const handleUnhandledRejection = (event) => {
			if (window?.elasticRum) {
				captureError(event?.reason, {
					context: 'unhandled-rejection',
					url: window.location?.href,
					promise: event?.promise,
				});
			}
		};

		// Add global error listeners
		window.addEventListener('error', handleGlobalError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		return () => {
			window.removeEventListener('error', handleGlobalError);
			window.removeEventListener(
				'unhandledrejection',
				handleUnhandledRejection
			);
		};
	}, []);

	// Performance monitoring
	useEffect(() => {
		if (!window?.elasticRum) return;

		// Monitor Core Web Vitals
		const observer = new PerformanceObserver((list) => {
			for (const entry of list?.getEntries()) {
				if (window?.elasticRum) {
					addLabels({
						metric: entry?.name,
						value: entry?.value,
						entryType: entry?.entryType,
					});
				}
			}
		});

		// Observe Core Web Vitals
		observer.observe({
			entryTypes: [
				'navigation',
				'paint',
				'largest-contentful-paint',
				'first-input',
			],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	const contextValue = {
		setUserContext,
		setTransactionContext,
		addLabels,
		captureError,
		getApm: () => window.elasticRum?.apm,
	};

	return (
		<ElasticRumContext.Provider value={contextValue}>
			{children}
		</ElasticRumContext.Provider>
	);
};

// Hook to use Elastic RUM context
export const useElasticRum = () => {
	const context = useContext(ElasticRumContext);
	if (!context) {
		throw new Error('useElasticRum must be used within an ElasticRumProvider');
	}
	return context;
};

// HOC to wrap components with Elastic RUM tracking
export const withElasticRum = (WrappedComponent, options = {}) => {
	const WithElasticRum = (props) => {
		const elasticRum = useElasticRum();

		useEffect(() => {
			if (elasticRum && options?.trackComponent) {
				const transactionName =
					options?.transactionName ||
					`Component: ${
						WrappedComponent?.displayName || WrappedComponent?.name
					}`;
				elasticRum.setTransactionContext(transactionName, 'component');

				if (options?.labels) {
					elasticRum.addLabels(options?.labels);
				}
			}
		}, [elasticRum]);

		return <WrappedComponent {...props} elasticRum={elasticRum} />;
	};

	WithElasticRum.displayName = `withElasticRum(${
		WrappedComponent?.displayName || WrappedComponent?.name
	})`;
	return WithElasticRum;
};

export default withRouter(ElasticRumProvider);
