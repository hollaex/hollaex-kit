// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/performance';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyA2so5cdUx2fl4__EcvA8Cpzh7kdL4ZPS0',
	authDomain: 'sandbox-hollaex.firebaseapp.com',
	projectId: 'sandbox-hollaex',
	storageBucket: 'sandbox-hollaex.firebasestorage.app',
	messagingSenderId: '380838888620',
	appId: '1:380838888620:web:bce9556b277eb78472cb09',
	measurementId: 'G-00RTC9N4LV',
};

// Initialize Firebase
const app =
	firebase.apps.length === 0
		? firebase.initializeApp(firebaseConfig)
		: firebase.app();

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined' && firebase.analytics) {
	analytics = firebase.analytics();
}

// Initialize Performance Monitoring (only in browser environment)
let performance = null;
if (typeof window !== 'undefined' && firebase.performance) {
	performance = firebase.performance();
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
