import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isBrowser, isMobile } from 'react-device-detect';

import STRINGS from '../../config/localizedStrings';
import { FLEX_CENTER_CLASSES, HOLLAEX_LOGO, HOLLAEX_LOGO_BLACK } from '../../config/constants';
import { ButtonLink, AppFooter } from '../../components';
import MobilePosts from '../Trade/MobilePosts';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';
import { isLoggedIn } from '../../utils/token';

class Home extends Component {
	render() {
		const { activeTheme, activeLanguage } = this.props;
		return (
			<div className={classnames(
				'app_container',
				'home_container-mobile',
				getClasesForLanguage(activeLanguage),
				getThemeClass(activeTheme),
				{
					'layout-mobile': isMobile,
					'layout-desktop': isBrowser
				}
			)}>
				<div className="p-5">
					{!isLoggedIn()
						? <div className={classnames(FLEX_CENTER_CLASSES, 'my-5', 'flex-column')}>
							<div className="my-5 f-1">
								<img
									src={activeTheme === 'dark' ? HOLLAEX_LOGO : HOLLAEX_LOGO_BLACK}
									alt="app logo"
									className="app-icon d-flex" />
								<div className="text-center trade-tab-app-title">{STRINGS.APP_SUB_TITLE.toUpperCase()}</div>
							</div>
							<div className="w-100">
								<div className="mt-3 mb-5">
									<ButtonLink
										link={'/trade/hex-usdt'}
										type="button"
										className="market-button"
										label={STRINGS.VIEW_MARKET.toUpperCase()}
									/>
								</div>
								<div className="my-5">
									<ButtonLink
										link={'/signup'}
										type="button"
										label={STRINGS.SIGNUP_TEXT}
									/>
								</div>
								<div className="text-center">
									{STRINGS.SIGN_UP.HAVE_ACCOUNT}
									<Link to="/login" className="blue-link">
										{STRINGS.SIGN_UP.GOTO_LOGIN}
									</Link>
								</div>
							</div>
						</div>
						: null
					}
					<div className="post-wrapper">
						<MobilePosts />
					</div>
				</div>
				<div>
					<AppFooter theme={activeTheme} />
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	activeTheme: state.app.theme,
	activeLanguage: state.app.language
});

export default connect(mapStateToProps)(Home);
