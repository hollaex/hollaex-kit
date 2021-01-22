import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import ThemeBuilder from 'helpers/themeBuilder';
import withConfig from 'components/ConfigProvider/withConfig';

const ThemeProvider = ({ color: themes, theme, coins, ...rest }) => {
	useEffect(() => {
		ThemeBuilder(theme, themes, coins);
	}, [theme, themes, coins]);
	return <Fragment>{rest.children}</Fragment>;
};

const mapStateToProps = ({ app: { theme, coins } }) => ({
	theme,
	coins,
});

export default connect(mapStateToProps)(withConfig(ThemeProvider));
