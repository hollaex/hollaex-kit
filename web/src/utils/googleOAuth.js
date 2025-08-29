import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { message } from 'antd';

import strings from 'config/localizedStrings';

const GoogleOAuthLogin = ({ onLoginSuccess, googleOAuth }) => {
	const handleCredentialResponse = (response) => {
		try {
			const credential = response?.credential;
			if (onLoginSuccess) onLoginSuccess(credential);
		} catch (err) {
			console.error(err);
		}
	};

	const handleError = (error) => {
		message.error(
			error?.error || error?.message || error || strings['P2P.ERROR_MESSAGE']
		);
	};

	if (!googleOAuth?.client_id) return null;

	return (
		<GoogleOAuthProvider clientId={googleOAuth?.client_id}>
			<div id="google-oauth-container">
				<GoogleLogin
					onSuccess={handleCredentialResponse}
					onError={handleError}
					text="continue_with"
					size="large"
					theme="outline"
				/>
			</div>
		</GoogleOAuthProvider>
	);
};

export default GoogleOAuthLogin;
