import React, { Component } from 'react';
import classnames from 'classnames';
import { isBrowser, isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { loadReCaptcha } from 'react-recaptcha-v3';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { AppFooter } from '../../components';
import { FLEX_CENTER_CLASSES, CAPTCHA_SITEKEY, DEFAULT_CAPTCHA_SITEKEY } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';
import { getExchangeInfo } from '../../actions/appActions';
import ThemeProvider from '../ThemeProvider';

const checkPath = (path) => {
	const sheet = document.createElement('style');
	if ((path === '/login') || (path === '/signup')
		|| (path === '/reset-password') || path.includes('/withdraw')
		|| path.includes('/init')
	) {
		sheet.innerHTML = ".grecaptcha-badge { visibility: visible !important;}";
		sheet.id = 'addCap'
		if (document.getElementById('rmvCap') !== null) {
			document.body.removeChild(document.getElementById('rmvCap'));
		}
	} else {
		sheet.innerHTML = ".grecaptcha-badge { visibility: hidden !important;}";
		sheet.id = 'rmvCap'
		if (document.getElementById('addCap') !== null) {
			document.body.removeChild(document.getElementById('addCap'));
		}
	}
	document.body.appendChild(sheet);
}

class AuthContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isExpired: false,
			isTrial: false
		}
	}

	componentDidMount() {
		this.props.getExchangeInfo();
	}

	checkExchangeExpiry = () => {
		const { info = {} } = this.props;
		let is_expired = false;
		let is_warning = false;
		let daysLeft = 0;
		if (info.status) {
			if (info.is_trial) {
				if (info.active) {
					if (info.expiry && moment().isBefore(info.expiry, 'second')) {
						is_warning = true;
						daysLeft = moment(info.expiry).diff(moment(), 'days');
					} else if (info.expiry && moment().isAfter(info.expiry, 'second')) {
						is_warning = true;
						is_expired = true;
					}
				} else {
					is_warning = true;
					is_expired = true;
				}
			} else {
				is_expired = false;
				is_warning = false;
			}
		} else {
			is_warning = true;
			is_expired = true;
		}
		return {
			is_expired,
			is_warning,
			daysLeft
		}
	};

	render() {
		const { activeLanguage, activeTheme, children, info, constants = { captcha: {} }, ...rest } = this.props;
		const languageClasses = getClasesForLanguage(activeLanguage);
		const childWithLanguageClasses = React.Children.map(children, (child) =>
			React.cloneElement(child, { activeLanguage, languageClasses })
		);
		let siteKey = DEFAULT_CAPTCHA_SITEKEY;
		if (CAPTCHA_SITEKEY) {
			siteKey = CAPTCHA_SITEKEY;
		} else if (constants.captcha && constants.captcha.site_key) {
			siteKey = constants.captcha.site_key;
		}
		loadReCaptcha(siteKey);
		const expiryData = this.checkExchangeExpiry();
		let isWarning = false;
		if (rest.location && rest.location.pathname) {
			checkPath(rest.location.pathname);
			isWarning = ((rest.location.pathname === '/login' || rest.location.pathname === '/signup')
				&& expiryData.is_warning);
		};
		return (
			<ThemeProvider>
				<div className="w-100 h-100">
					{isWarning
						? <div className={classnames(
							'exchange-warning',
							'p-1',
							...FLEX_CENTER_CLASSES,
							{
								'exchange-trial': isWarning,
								'exchange-expired': expiryData.is_expired,
							}
						)}>
							{expiryData.is_expired
								? STRINGS["EXPIRY_EXCHANGE_MSG"]
								: STRINGS.formatString(
									STRINGS["TRIAL_EXCHANGE_MSG"],
									constants.api_name || '',
									expiryData.daysLeft
								)
							}
						</div>
						: null
					}
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
					{!isMobile
						? (
							<div className={classnames('footer-wrapper', getThemeClass(activeTheme))}>
								<AppFooter theme={activeTheme} constants={constants} />
							</div>
						)
						: null
					}
				</div>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (store) => ({
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	info: store.app.info,
	constants: store.app.constants
});

const mapDispatchToProps = dispatch => ({
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
