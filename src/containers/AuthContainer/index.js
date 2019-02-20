import React from 'react';
import classnames from 'classnames';
import { isBrowser, isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';

const updateThemeToBody = (theme = 'white') => {
	const themeName = theme === 'dark' ? 'dark-auth-body' : 'light-auth-body';
	if (document.body) {
		// document.body.className = themeName;
	}
};

const AuthContainer = ({ activeLanguage, activeTheme, children }) => {
	const languageClasses = getClasesForLanguage(activeLanguage);
	const childWithLanguageClasses = React.Children.map(children, (child) =>
		React.cloneElement(child, { activeLanguage, languageClasses })
	);
	updateThemeToBody(activeTheme);
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
