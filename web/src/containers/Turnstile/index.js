import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';

import CloudflareTurnstile from 'components/CloudflareTurnstile';
import { getExchangeInfo } from 'actions/appActions';

const isSafeRedirectUri = (value = '') => {
	if (!value || typeof value !== 'string') return false;
	const trimmed = value.trim();
	// Disallow dangerous schemes.
	if (/^(javascript|data):/i.test(trimmed)) return false;
	// Allow any non-dangerous scheme (custom app schemes included) and absolute/relative URLs.
	return (
		/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ||
		trimmed.startsWith('/') ||
		trimmed.startsWith('.')
	);
};

const buildRedirect = (redirectUri, token, state) => {
	const base = redirectUri;
	const parts = [];
	parts.push(`turnstile_token=${encodeURIComponent(token)}`);
	if (state) parts.push(`state=${encodeURIComponent(state)}`);

	// Use fragment so the token isn't sent to servers via query logs.
	const sep = base.includes('#') ? '&' : '#';
	return `${base}${sep}${parts.join('&')}`;
};

const Turnstile = ({
	constants = {},
	activeTheme,
	location,
	getExchangeInfo,
}) => {
	const siteKey = constants?.cloudflare_turnstile?.site_key;
	const turnstileEnabled = !!siteKey && siteKey !== 'null';

	// Ensure constants are loaded even when this page is mounted outside of AuthContainer.
	useEffect(() => {
		if (!constants || Object.keys(constants).length === 0) {
			getExchangeInfo();
		}
	}, [constants, getExchangeInfo]);

	const query = useMemo(() => {
		if (location?.query) return location.query;
		return querystring.parse(
			location?.search ||
				(typeof window !== 'undefined' ? window.location.search : '')
		);
	}, [location]);

	const redirectUri = query?.redirect_uri || query?.redirectUri;
	const state = query?.state;
	const autoClose = query?.autoclose === '1' || query?.autoclose === 'true';

	const [token, setToken] = useState('');
	const [sent, setSent] = useState(false);

	useEffect(() => {
		if (!token) {
			setSent(false);
			return;
		}
		if (sent) return;

		const payload = {
			type: 'turnstile',
			token,
			state: state || null,
			timestamp: Date.now(),
		};

		// React Native WebView
		if (
			typeof window !== 'undefined' &&
			window.ReactNativeWebView?.postMessage
		) {
			window.ReactNativeWebView.postMessage(JSON.stringify(payload));
		}

		// Standard browser postMessage (optional; helps debugging in an iframe)
		if (
			typeof window !== 'undefined' &&
			window.parent &&
			window.parent !== window
		) {
			try {
				window.parent.postMessage(payload, '*');
			} catch (e) {
				// ignore
			}
		}

		// Optional redirect handoff (custom scheme supported)
		if (redirectUri && isSafeRedirectUri(redirectUri)) {
			try {
				window.location.href = buildRedirect(redirectUri, token, state);
			} catch (e) {
				// ignore
			}
		}

		if (autoClose) {
			try {
				window.close();
			} catch (e) {
				// ignore
			}
		}

		setSent(true);
	}, [token, sent, redirectUri, state, autoClose]);

	const onCopy = async () => {
		if (!token) return;
		try {
			await navigator.clipboard.writeText(token);
		} catch (e) {
			// ignore
		}
	};

	return (
		<div style={{ maxWidth: 520, margin: '24px auto', padding: '0 16px' }}>
			<h2 style={{ marginBottom: 8 }}>Captcha Verification</h2>
			<div style={{ marginBottom: 16, opacity: 0.8, fontSize: 14 }}>
				Complete the captcha to generate a token. This page will send the token
				back to your app via WebView postMessage.
			</div>

			{turnstileEnabled ? (
				<div style={{ marginBottom: 16 }}>
					<CloudflareTurnstile
						siteKey={siteKey}
						theme={activeTheme}
						onToken={(t) => setToken(t || '')}
					/>
				</div>
			) : (
				<div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
					Turnstile is not enabled for this exchange.
				</div>
			)}

			<div style={{ marginTop: 12 }}>
				<div style={{ marginBottom: 6, fontSize: 12, opacity: 0.7 }}>Token</div>
				<textarea
					value={token}
					readOnly
					rows={4}
					style={{
						width: '100%',
						resize: 'none',
						padding: 10,
						borderRadius: 6,
						border: '1px solid #ddd',
						fontFamily: 'monospace',
						fontSize: 12,
					}}
				/>
				<div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
					<button
						type="button"
						onClick={onCopy}
						disabled={!token}
						style={{
							padding: '8px 10px',
							borderRadius: 6,
							border: '1px solid #ccc',
							background: token ? '#fff' : '#f5f5f5',
							cursor: token ? 'pointer' : 'not-allowed',
						}}
					>
						Copy token
					</button>
					{sent ? (
						<div style={{ alignSelf: 'center', fontSize: 12, opacity: 0.7 }}>
							Token sent to app
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
	constants: store.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	getExchangeInfo: () => dispatch(getExchangeInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Turnstile);
