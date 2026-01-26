import React, { Component } from 'react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-api';
let scriptPromise = null;

const loadTurnstile = () => {
	if (typeof window === 'undefined') return Promise.resolve();
	if (window.turnstile) return Promise.resolve();
	if (scriptPromise) return scriptPromise;

	scriptPromise = new Promise((resolve, reject) => {
		const existing = document.getElementById(TURNSTILE_SCRIPT_ID);
		if (existing) {
			existing.addEventListener('load', () => resolve());
			existing.addEventListener('error', () =>
				reject(new Error('Failed to load Turnstile'))
			);
			return;
		}

		const script = document.createElement('script');
		script.id = TURNSTILE_SCRIPT_ID;
		script.async = true;
		script.defer = true;
		script.src =
			'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Failed to load Turnstile'));
		document.head.appendChild(script);
	});

	return scriptPromise;
};

class CloudflareTurnstile extends Component {
	containerRef = React.createRef();
	widgetId = null;

	componentDidMount() {
		this.renderWidgetIfNeeded();
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.siteKey !== this.props.siteKey ||
			prevProps.theme !== this.props.theme
		) {
			this.removeWidget();
			this.renderWidgetIfNeeded();
		}
	}

	componentWillUnmount() {
		this.removeWidget();
	}

	removeWidget = () => {
		try {
			if (window.turnstile && this.widgetId) {
				window.turnstile.remove(this.widgetId);
			}
		} catch (e) {
			// ignore
		} finally {
			this.widgetId = null;
		}
	};

	renderWidgetIfNeeded = async () => {
		const { siteKey, onToken, theme } = this.props;

		if (!siteKey || siteKey === 'null') return;
		if (!this.containerRef.current) return;

		await loadTurnstile();

		if (!window.turnstile) return;

		this.widgetId = window.turnstile.render(this.containerRef.current, {
			sitekey: siteKey,
			theme: theme === 'dark' ? 'dark' : 'light',
			callback: (token) => onToken && onToken(token),
			'expired-callback': () => onToken && onToken(''),
			'error-callback': () => onToken && onToken(''),
		});
	};

	render() {
		const { siteKey } = this.props;
		if (!siteKey || siteKey === 'null') return null;

		return (
			<div className="w-100">
				<div ref={this.containerRef} />
			</div>
		);
	}
}

export default CloudflareTurnstile;
