// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/performance';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Check if Firebase is enabled via environment variable
const isFirebaseEnabled =
	String(process.env.REACT_APP_FIREBASE_ENABLED || '').toLowerCase() === 'true';

// Get Firebase configuration from environment variables
const getFirebaseConfig = () => {
	const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
	const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
	const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
	const storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
	const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
	const appId = process.env.REACT_APP_FIREBASE_APP_ID;
	const measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;

	// Check if all required config values are present
	if (
		!apiKey ||
		!authDomain ||
		!projectId ||
		!storageBucket ||
		!messagingSenderId ||
		!appId
	) {
		return null;
	}

	return {
		apiKey,
		authDomain,
		projectId,
		storageBucket,
		messagingSenderId,
		appId,
		...(measurementId && { measurementId }),
	};
};

// Initialize Firebase only if enabled and config is available
let app = null;
let analytics = null;
let performance = null;

if (isFirebaseEnabled && typeof window !== 'undefined') {
	const firebaseConfig = getFirebaseConfig();
	if (firebaseConfig) {
		try {
			// Initialize Firebase
			app =
				firebase.apps.length === 0
					? firebase.initializeApp(firebaseConfig)
					: firebase.app();

			// Initialize Analytics (only in browser environment)
			if (firebase.analytics) {
				analytics = firebase.analytics();
			}

			// Initialize Performance Monitoring (only in browser environment)
			if (firebase.performance) {
				performance = firebase.performance();
			}
		} catch (error) {
			console.warn('Failed to initialize Firebase:', error);
		}
	} else if (isFirebaseEnabled) {
		console.warn(
			'Firebase is enabled but configuration is incomplete. Please check your environment variables.'
		);
	}
}

// Route trace management for SPA route tracking
let currentRouteTrace = null;

/**
 * Start a new route trace and stop the previous one
 * @param {string} pathname - The route pathname (e.g., "/wallet", "/account")
 */
export const startRouteTrace = (pathname) => {
	if (!performance || typeof window === 'undefined') {
		return;
	}

	// Stop previous trace if exists
	if (currentRouteTrace) {
		try {
			currentRouteTrace.stop();
		} catch (e) {
			// Ignore errors when stopping trace
		}
	}

	// Start new trace with pathname as trace name
	try {
		// Use pathname directly, or "/" for root
		const traceName = pathname || '/';
		currentRouteTrace = performance.trace(traceName);
		currentRouteTrace.start();
	} catch (e) {
		console.warn('Failed to start Firebase Performance trace:', e);
	}
};

/**
 * Generate trace name from URL in format: (domain)/(path)
 * @param {string} url - Full URL (e.g., "https://api.example.com/v2/kit")
 * @returns {string} Trace name (e.g., "api.example.com/v2/kit")
 */
const generateNetworkTraceName = (url) => {
	try {
		const urlObj = new URL(url);
		const domain = urlObj.hostname;
		const path = urlObj.pathname;
		// Remove leading slash from path
		const cleanPath = path.startsWith('/') ? path.substring(1) : path;
		// Format: domain.com/path
		return cleanPath ? `${domain}/${cleanPath}` : domain;
	} catch (e) {
		// Fallback: try to extract domain and path manually
		try {
			const match = url.match(/https?:\/\/([^/]+)(\/.*)?/);
			if (match) {
				const domain = match[1];
				const path = match[2] || '';
				const cleanPath = path.startsWith('/') ? path.substring(1) : path;
				return cleanPath ? `${domain}/${cleanPath}` : domain;
			}
		} catch (e2) {
			// If all else fails, return the URL as-is (truncated if too long)
			return url.length > 100 ? url.substring(0, 100) : url;
		}
		return url;
	}
};

/**
 * Start a network request trace
 * @param {string} url - Full URL of the request
 * @returns {object|null} Trace object or null if performance is not available
 */
export const startNetworkTrace = (url) => {
	if (!performance || typeof window === 'undefined') {
		return null;
	}

	try {
		const traceName = generateNetworkTraceName(url);
		const trace = performance.trace(traceName);
		trace.start();
		return trace;
	} catch (e) {
		console.warn('Failed to start Firebase Performance network trace:', e);
		return null;
	}
};

/**
 * Stop a network request trace
 * @param {object} trace - Trace object returned from startNetworkTrace
 */
export const stopNetworkTrace = (trace) => {
	if (!trace) {
		return;
	}

	try {
		trace.stop();
	} catch (e) {
		// Ignore errors when stopping trace
	}
};

export { app, analytics, performance };
