import React, { Component } from 'react';
import classnames from 'classnames';
import { isBrowser, isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withConfig from 'components/ConfigProvider/withConfig';

import { AppFooter } from '../../components';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';
import { getExchangeInfo } from '../../actions/appActions';
import ThemeProvider from '../ThemeProvider';

// const checkPath = (path) => {
// 	const sheet = document.createElement('style');
// 	if (
// 		path === '/login' ||
// 		path === '/signup' ||
// 		path === '/reset-password' ||
// 		path.includes('/withdraw') ||
// 		path.includes('/init')
// 	) {
// 		sheet.innerHTML = '.grecaptcha-badge { visibility: visible !important;}';
// 		sheet.id = 'addCap';
// 		if (document.getElementById('rmvCap') !== null) {
// 			document.body.removeChild(document.getElementById('rmvCap'));
// 		}
// 	} else {
// 		sheet.innerHTML = '.grecaptcha-badge { visibility: hidden !important;}';
// 		sheet.id = 'rmvCap';
// 		if (document.getElementById('addCap') !== null) {
// 			document.body.removeChild(document.getElementById('addCap'));
// 		}
// 	}
// 	document.body.appendChild(sheet);
// };

class AuthContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpired: false,
			isTrial: false,
		};
	}

	componentDidMount() {
		this.props.getExchangeInfo();
	}

	render() {
		const {
			activeLanguage,
			activeTheme,
			children,
			constants = { captcha: {} },
			icons: ICONS = {},
		} = this.props;
		const languageClasses = getClasesForLanguage(activeLanguage);
		const childWithLanguageClasses = React.Children.map(children, (child) =>
			React.cloneElement(child, { activeLanguage, languageClasses })
		);

		return (
			<ThemeProvider>
				<div className="w-100 h-100">
					<div
						className={classnames(
							'auth-wrapper',
							'w-100',
							'h-100',
							getThemeClass(activeTheme),
							{
								'layout-mobile': isMobile,
								'layout-desktop': isBrowser,
							},
							...FLEX_CENTER_CLASSES
						)}
						style={{
							background: `url(${ICONS['EXCHANGE_BOARDING_IMAGE']})`,
							backgroundSize: 'cover',
						}}
					>
						<div
							className={classnames('auth-container', 'f-1', languageClasses)}
						>
							{childWithLanguageClasses}
						</div>
					</div>
					{!isMobile ? (
						<div
							className={classnames(
								'footer-wrapper',
								getThemeClass(activeTheme)
							)}
						>
							<AppFooter theme={activeTheme} constants={constants} />
						</div>
					) : null}
				</div>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (store) => ({
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	info: store.app.info,
	constants: store.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AuthContainer));
