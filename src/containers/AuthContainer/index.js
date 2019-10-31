import React from 'react';
import classnames from 'classnames';
import { isBrowser, isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { FLEX_CENTER_CLASSES, CAPTCHA_SITEKEY } from '../../config/constants';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';
import { loadReCaptcha } from 'react-recaptcha-v3'

const updateThemeToBody = (theme = 'white') => {
	// const themeName = theme === 'dark' ? 'dark-auth-body' : 'light-auth-body';
	if (document.body) {
		// document.body.className = themeName;
	}
};

const checkPath = (path) => {
	var sheet = document.createElement('style')
	if ((path === '/login') || (path === '/signup')) {
		sheet.innerHTML = ".grecaptcha-badge { display: unset !important;}";
		sheet.id = 'addCap'
		if (document.getElementById('rmvCap') !== null) {
			document.body.removeChild(document.getElementById('rmvCap'));
		}
	}
	else {
		sheet.innerHTML = ".grecaptcha-badge { display: none !important;}";
		sheet.id = 'rmvCap'
		if (document.getElementById('addCap') !== null) {
			document.body.removeChild(document.getElementById('addCap'));
		}
	}
	document.body.appendChild(sheet);
};

const AuthContainer = ({ activeLanguage, activeTheme, children, ...rest }) => {
	const languageClasses = getClasesForLanguage(activeLanguage);
	const childWithLanguageClasses = React.Children.map(children, (child) =>
		React.cloneElement(child, { activeLanguage, languageClasses })
	);
	loadReCaptcha(CAPTCHA_SITEKEY);
	updateThemeToBody(activeTheme);
	if (rest.location && rest.location.pathname) {
		checkPath(rest.location.pathname);
	};
	return (
		<div
			className={classnames(
				'auth-wrapper',
				'w-100',
				'h-100',
				getThemeClass(activeTheme),
				{
					'layout-mobile': isMobile,
					'layout-desktop': isBrowser
				},
				...FLEX_CENTER_CLASSES
			)}
		>
			<div className={classnames('auth-container', 'f-1', languageClasses)}>
				{childWithLanguageClasses}
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	activeLanguage: store.app.language,
	activeTheme: store.app.theme
});

export default connect(mapStateToProps)(AuthContainer);
