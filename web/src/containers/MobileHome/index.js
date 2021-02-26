import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isBrowser, isMobile } from 'react-device-detect';

import STRINGS from '../../config/localizedStrings';
import { AppFooter, NotificationsList } from '../../components';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';

class Home extends Component {
	render() {
		const {
			activeTheme,
			activeLanguage,
			constants,
			enabledPlugins,
		} = this.props;
		return (
			<div
				className={classnames(
					'app_container',
					'home_container-mobile',
					getClasesForLanguage(activeLanguage),
					getThemeClass(activeTheme),
					{
						'layout-mobile': isMobile,
						'layout-desktop': isBrowser,
					}
				)}
			>
				<div className="p-5">
					{/* {!isLoggedIn() ?
						<div className="w-100">
							<div className="mt-3 mb-5">
								<ButtonLink
									link={'/trade/xht-usdt'}
									type="button"
									className="market-button"
									label={STRINGS["VIEW_MARKET"].toUpperCase()}
								/>
							</div>
							<div className="my-5">
								<ButtonLink
									link={'/signup'}
									type="button"
									label={STRINGS["SIGNUP_TEXT"]}
								/>
							</div>
							<div className="text-center">
								{STRINGS["SIGN_UP.HAVE_ACCOUNT"]}
								<Link to="/login" className="blue-link">
									&nbsp;{STRINGS["SIGN_UP.GOTO_LOGIN"]}
								</Link>
							</div>
						</div>

						:
						<div className="w-100">
							<div className="mt-3 mb-3">
								<ButtonLink
									link={'/trade/xht-usdt'}
									type="button"
									label={STRINGS["GO_TRADE"].toUpperCase()}
								/>
							</div>
							<div className='d-flex flex-row mt-5'>
								<div className="mr-3 w-50">
									<ButtonLink
										link={'/account'}
										type="button"
										className="market-button"
										label={STRINGS["ACCOUNTS.TITLE"]}
									/>
								</div>
								<div className="w-50" >
									<ButtonLink
										link={'/wallet'}
										type="button"
										className="market-button"
										label={STRINGS["WALLET_TITLE"]}
									/>
								</div>
							</div>
							<div className="text-center mt-5">
								{STRINGS["NEED_HELP_TEXT"]}
								<a href="https://info.hollaex.com" target="_blank" className="blue-link" rel="noopener noreferrer">
									&nbsp;{STRINGS["VIEW_INFO"]}
								</a>
							</div>
						</div>
					} */}
					<div className="post-wrapper mt-4 mx-3">
						<div className="post-title mb-3">{STRINGS['TRADE_TAB_POSTS']}</div>
						{enabledPlugins.includes('announcements') ? (
							<NotificationsList />
						) : null}
					</div>
				</div>
				<div>
					<AppFooter theme={activeTheme} constants={constants} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	activeTheme: state.app.theme,
	activeLanguage: state.app.language,
	constants: state.app.constants,
	enabledPlugins: state.app.enabledPlugins,
});

export default connect(mapStateToProps)(Home);
