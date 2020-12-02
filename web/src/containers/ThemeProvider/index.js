import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import ThemeBuilder from 'helpers/themeBuilder';
import withConfig from 'components/ConfigProvider/withConfig';

const ThemeProvider = ({ color: themes, theme, ...rest }) => {
	useEffect(() => {
		ThemeBuilder(theme, themes);
	}, [theme, themes]);
	return <Fragment>{rest.children}</Fragment>;
};

const mapStateToProps = ({ app: { theme } }) => ({
	theme,
});

export default connect(mapStateToProps)(withConfig(ThemeProvider));
