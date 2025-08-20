import React, { useEffect } from 'react';
import strings from 'config/localizedStrings';

const GoogleOAuthLogin = ({ onLoginSuccess, googleOAuth }) => {
	const handleCredentialResponse = (response) => {
		try {
			if (onLoginSuccess) onLoginSuccess(response?.credential);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (!googleOAuth?.client_id) return;
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		script.onload = () => {
			if (window.google?.accounts?.id) {
				window.google.accounts.id.initialize({
					client_id: googleOAuth?.client_id,
					callback: handleCredentialResponse,
				});

				window.google.accounts.id.renderButton(
					document.getElementById('google-oauth-container'),
					{
						theme: 'outline',
						size: 'large',
						text: 'signin_with',
						shape: 'rectangular',
					}
				);

				const btn = document.querySelector(
					'#google-oauth-container div div span'
				);
				if (btn) btn.innerText = strings['LOGIN.CONTINUE_WITH_GOOGLE'];
			}
		};

		return () => {
			document.body.removeChild(script);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [googleOAuth?.client_id]);

	return <div id="google-oauth-container"></div>;
};

export default GoogleOAuthLogin;
