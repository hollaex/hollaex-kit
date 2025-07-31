import React, { useState, useEffect } from 'react';
import { useElasticRum } from '../ElasticRumProvider';
import {
	trackUserInteraction,
	trackCustomEvent,
	trackError,
	withElasticRumTracking,
	monitorPerformance,
} from '../../utils/elastic-rum';

// Example API call with tracking
const exampleApiCall = async (data) => {
	const response = await fetch('/api/example', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error(`API call failed: ${response.status}`);
	}

	return response.json();
};

// Wrapped API call with Elastic RUM tracking
const trackedApiCall = withElasticRumTracking(exampleApiCall, {
	name: 'Example API Call',
});

// Performance monitored function
const expensiveCalculation = monitorPerformance.measureFunction(
	'expensive-calculation',
	async (data) => {
		// Simulate expensive operation
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return { result: data * 2 };
	}
);

const ElasticRumExample = () => {
	const { setUserContext, addLabels, captureError } = useElasticRum();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);

	// Set user context when user changes
	useEffect(() => {
		if (user) {
			setUserContext(user);
			addLabels({
				userType: user.type,
				userCountry: user.country,
			});
		}
	}, [user, setUserContext, addLabels]);

	// Simulate user login
	const handleLogin = () => {
		const mockUser = {
			id: '12345',
			email: 'user@example.com',
			username: 'testuser',
			type: 'premium',
			country: 'US',
		};

		setUser(mockUser);

		// Track login event
		trackCustomEvent('user-login', {
			userId: mockUser.id,
			userType: mockUser.type,
		});
	};

	// Example of tracking user interaction
	const handleButtonClick = () => {
		const span = trackUserInteraction('button-click', {
			buttonId: 'example-button',
			page: 'elastic-rum-example',
		});

		// Simulate some work
		setTimeout(() => {
			if (span) {
				span.end();
			}
		}, 500);
	};

	// Example of API call with error handling
	const handleApiCall = async () => {
		setLoading(true);

		try {
			const data = await trackedApiCall({ test: 'data' });
			setResult(data);

			// Add success labels
			addLabels({
				apiCallSuccess: true,
				resultType: typeof data,
			});
		} catch (error) {
			// Capture error with context
			captureError(error, {
				context: 'api-call-example',
				userId: user?.id,
				action: 'handle-api-call',
			});

			// Track error event
			trackCustomEvent('api-call-error', {
				error: error.message,
				userId: user?.id,
			});
		} finally {
			setLoading(false);
		}
	};

	// Example of performance monitoring
	const handleExpensiveOperation = async () => {
		try {
			const data = await expensiveCalculation(42);
			setResult(data);
		} catch (error) {
			trackError(error, {
				context: 'expensive-operation',
				input: 42,
			});
		}
	};

	// Example of manual error tracking
	const handleManualError = () => {
		try {
			// Simulate an error
			throw new Error('This is a manual test error');
		} catch (error) {
			trackError(error, {
				context: 'manual-error-test',
				userId: user?.id,
				timestamp: new Date().toISOString(),
			});
		}
	};

	// Example of form submission tracking
	const handleFormSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const data = Object.fromEntries(formData);

		// Track form submission
		const span = trackUserInteraction('form-submit', {
			formName: 'example-form',
			fields: Object.keys(data),
		});

		// Simulate form processing
		setTimeout(() => {
			if (span) {
				span.end();
			}

			// Track success
			trackCustomEvent('form-submit-success', {
				formName: 'example-form',
				userId: user?.id,
			});
		}, 1000);
	};

	return (
		<div className="elastic-rum-example">
			<h2>Elastic RUM Example Component</h2>

			<div className="section">
				<h3>User Context</h3>
				{user ? (
					<div>
						<p>Logged in as: {user.username}</p>
						<p>User ID: {user.id}</p>
						<p>Type: {user.type}</p>
					</div>
				) : (
					<button onClick={handleLogin}>Simulate Login</button>
				)}
			</div>

			<div className="section">
				<h3>User Interactions</h3>
				<button onClick={handleButtonClick}>Track Button Click</button>
			</div>

			<div className="section">
				<h3>API Calls</h3>
				<button onClick={handleApiCall} disabled={loading}>
					{loading ? 'Loading...' : 'Test API Call'}
				</button>
			</div>

			<div className="section">
				<h3>Performance Monitoring</h3>
				<button onClick={handleExpensiveOperation}>
					Test Expensive Operation
				</button>
			</div>

			<div className="section">
				<h3>Error Tracking</h3>
				<button onClick={handleManualError}>Test Error Tracking</button>
			</div>

			<div className="section">
				<h3>Form Tracking</h3>
				<form onSubmit={handleFormSubmit}>
					<input name="name" placeholder="Name" defaultValue="Test User" />
					<input
						name="email"
						placeholder="Email"
						defaultValue="test@example.com"
					/>
					<button type="submit">Submit Form</button>
				</form>
			</div>

			{result && (
				<div className="section">
					<h3>Result</h3>
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}

			<div className="section">
				<h3>Debug Information</h3>
				<p>Elastic RUM Status: {window.elasticRum ? 'Active' : 'Inactive'}</p>
				<p>
					Environment:{' '}
					{process.env.REACT_APP_ELASTIC_APM_ENVIRONMENT || 'development'}
				</p>
				<p>
					Service Name:{' '}
					{process.env.REACT_APP_ELASTIC_APM_SERVICE_NAME || 'hollaex-web'}
				</p>
			</div>
		</div>
	);
};

export default ElasticRumExample;
