# Elastic RUM Implementation for HollaEx Web

## Overview

This implementation adds comprehensive Real User Monitoring (RUM) capabilities to the HollaEx web application using Elastic APM. The integration provides real-time performance monitoring, error tracking, and user experience analytics.

## What's Been Implemented

### 1. Core Configuration (`src/config/elastic-rum.js`)

- Environment-based configuration
- Automatic initialization with proper error handling
- Configurable sampling rates for production vs development
- Support for authentication tokens
- Performance thresholds and monitoring settings

### 2. React Integration (`src/components/ElasticRumProvider/`)

- React context provider for Elastic RUM
- Automatic route change tracking
- Global error boundary integration
- Core Web Vitals monitoring
- Navigation event tracking

### 3. Utility Functions (`src/utils/elastic-rum.js`)

- Redux middleware for action tracking
- API call wrapper with performance monitoring
- User interaction tracking
- Custom event tracking
- WebSocket connection monitoring
- Form submission tracking
- Performance measurement utilities

### 4. Redux Integration

- Middleware automatically tracks all Redux actions
- Performance metrics for action execution
- Error handling for failed actions
- Action payload tracking

### 5. Example Component (`src/components/ElasticRumExample/`)

- Demonstrates all Elastic RUM features
- Shows proper usage patterns
- Includes error handling examples
- Performance monitoring examples

## Features

### Automatic Monitoring

- ✅ Page load performance (with descriptive page names)
- ✅ Route navigation tracking (with path-based transaction names)
- ✅ Redux action monitoring
- ✅ Global error capture
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ API call performance
- ✅ Unhandled promise rejections

### Enhanced Page Tracking

- ✅ **Descriptive Transaction Names**: Instead of generic "page-load", transactions now show actual page names (e.g., "Page: dashboard", "Page: trading")
- ✅ **Path Analysis**: Tracks page sections, full paths, and URL segments
- ✅ **Navigation Context**: Captures referrer information and navigation types
- ✅ **Route Change Detection**: Automatically tracks SPA route changes with proper transaction naming

### Manual Tracking

- ✅ User interactions
- ✅ Custom events
- ✅ Form submissions
- ✅ WebSocket connections
- ✅ Performance-critical operations
- ✅ Error tracking with context

### Configuration

- ✅ Environment-based settings
- ✅ Production vs development modes
- ✅ Sampling rate control
- ✅ Authentication support
- ✅ Custom labels and context

## Quick Start

### 1. Environment Configuration

Add these variables to your `.env` file:

```bash
# Enable Elastic RUM
REACT_APP_ELASTIC_APM_ENABLED=true

# APM Server Configuration
REACT_APP_ELASTIC_APM_SERVER_URL=http://localhost:8200
REACT_APP_ELASTIC_APM_SERVICE_NAME=hollaex-web
REACT_APP_ELASTIC_APM_SERVICE_VERSION=1.0.0
REACT_APP_ELASTIC_APM_ENVIRONMENT=development
```

### 2. Basic Usage

The Elastic RUM agent is automatically initialized when the app starts. You can use it in any component:

```javascript
import { useElasticRum } from 'components/ElasticRumProvider';

const MyComponent = () => {
	const { setUserContext, addLabels, captureError } = useElasticRum();

	// Set user context when user logs in
	useEffect(() => {
		if (user) {
			setUserContext(user);
		}
	}, [user]);

	// Track custom events
	const handleClick = () => {
		addLabels({
			buttonClicked: 'submit',
			userId: user.id,
		});
	};

	return <button onClick={handleClick}>Submit</button>;
};
```

### 3. API Call Tracking

```javascript
import { withElasticRumTracking } from 'utils/elastic-rum';

const apiCall = async (data) => {
	const response = await fetch('/api/endpoint', {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return response.json();
};

// Wrap with tracking
const trackedApiCall = withElasticRumTracking(apiCall, {
	name: 'Submit Form Data',
});

// Use normally
const result = await trackedApiCall(formData);
```

### 4. Error Tracking

```javascript
import { trackError } from 'utils/elastic-rum';

try {
	// Your code here
} catch (error) {
	trackError(error, {
		context: 'user-action',
		userId: user.id,
		action: 'submit-form',
	});
}
```

## File Structure

```
src/
├── config/
│   └── elastic-rum.js              # Core configuration
├── components/
│   ├── ElasticRumProvider/         # React context provider
│   │   └── index.js
│   └── ElasticRumExample/          # Example component
│       └── index.js
├── utils/
│   └── elastic-rum.js              # Utility functions
├── store.js                        # Redux store with middleware
└── index.js                        # App entry point with provider
```

## Configuration Options

### Development vs Production

The configuration automatically adjusts based on the environment:

- **Development**: Full sampling (100%), debug logging, detailed error tracking
- **Production**: Reduced sampling (10%), optimized performance, minimal logging

### Sampling Rates

```javascript
// Development
transactionSampleRate: 1.0,  // 100% of transactions
errorSampleRate: 1.0,        // 100% of errors

// Production
transactionSampleRate: 0.1,  // 10% of transactions
errorSampleRate: 0.1,        // 10% of errors
```

### Performance Thresholds

```javascript
performanceThresholds: {
  transactionDuration: 1000,        // 1 second
  transactionDurationThreshold: 5000, // 5 seconds
}
```

## Monitoring Dashboard

Once configured, you can view data in your Elastic APM dashboard:

### Transactions

- Page load performance
- API call response times
- User interaction delays
- Redux action execution times

### Errors

- JavaScript errors with stack traces
- API call failures
- Unhandled promise rejections
- React component errors

### User Experience

- Core Web Vitals metrics
- Navigation timing
- User interaction patterns
- Performance bottlenecks

### Services

- API performance monitoring
- Dependency tracking
- Service health metrics

## Best Practices

### 1. User Context

Always set user context when users log in:

```javascript
const { setUserContext } = useElasticRum();

useEffect(() => {
	if (user) {
		setUserContext({
			id: user.id,
			email: user.email,
			username: user.username,
		});
	}
}, [user]);
```

### 2. Custom Labels

Use custom labels to add business context:

```javascript
const { addLabels } = useElasticRum();

addLabels({
	userType: user.type,
	userCountry: user.country,
	feature: 'trading',
	action: 'place-order',
});
```

### 3. Error Handling

Always provide context when tracking errors:

```javascript
const { captureError } = useElasticRum();

try {
	// Your code
} catch (error) {
	captureError(error, {
		context: 'trading-operation',
		userId: user.id,
		pair: tradingPair,
		amount: orderAmount,
	});
}
```

### 4. Performance Monitoring

Monitor performance-critical operations:

```javascript
import { monitorPerformance } from 'utils/elastic-rum';

const expensiveOperation = monitorPerformance.measureFunction(
	'order-calculation',
	async (orderData) => {
		// Your expensive operation
		return result;
	}
);
```

## Troubleshooting

### Common Issues

1. **RUM not initializing**

   - Check `REACT_APP_ELASTIC_APM_ENABLED` is set to `true`
   - Verify server URL is accessible
   - Check browser console for errors

2. **No data in Elastic APM**

   - Verify authentication tokens
   - Check CORS settings on APM server
   - Ensure server URL is correct

3. **High data volume**

   - Reduce sampling rates in production
   - Filter unnecessary transactions
   - Optimize custom labels

4. **Performance impact**
   - Monitor RUM overhead
   - Use sampling in production
   - Optimize custom tracking

### Debug Mode

Enable debug mode in development:

```javascript
// In elastic-rum.js config
if (isDevelopment) {
	config.logLevel = 'debug';
}
```

### Testing

Test the implementation:

```javascript
// Check if RUM is active
console.log('Elastic RUM:', window.elasticRum);

// Test error tracking
window.elasticRum?.captureError(new Error('Test error'));

// Test custom event
window.elasticRum?.addLabels({ test: 'event' });
```

## Security Considerations

1. **Token Management**

   - Store tokens securely
   - Rotate tokens regularly
   - Use environment variables

2. **Data Privacy**

   - Avoid sending sensitive user data
   - Sanitize error messages
   - Use sampling to reduce data volume

3. **Network Security**
   - Use HTTPS in production
   - Configure CORS properly
   - Monitor network requests

## Support

For issues with the Elastic RUM implementation:

1. Check the browser console for error messages
2. Verify environment variable configuration
3. Test with the example component
4. Review the Elastic APM documentation
5. Check server logs for connection issues

## Dependencies

- `@elastic/apm-rum`: ^5.15.0
- React 16.13.1+
- Redux 4.0.1+

## License

This implementation is part of the HollaEx Kit and follows the same licensing terms.
