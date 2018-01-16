import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { getClasesForLanguage } from '../../utils/string';

const AuthContainer = ({ activeLanguage, children }) => {
	const languageClasses = getClasesForLanguage(activeLanguage);
	const childWithLanguageClasses = React.Children.map(children, (child) =>
		React.cloneElement(child, { activeLanguage, languageClasses })
	);
	return (
		<div
			className={classnames(
				'auth-wrapper',
				'w-100',
				'h-100',
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
	activeLanguage: store.app.language
});

export default connect(mapStateToProps)(AuthContainer);
