import React, { Component } from 'react';
import classnames from 'classnames';
import { isBrowser, isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withConfig from 'components/ConfigProvider/withConfig';

import { AppFooter, Dialog } from 'components';
import { HelpfulResourcesForm } from 'containers';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';
import {
	getExchangeInfo,
	closeNotification,
	HELPFUL_RESOURCES_FORM,
} from 'actions/appActions';
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
			dialogIsOpen: false,
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.activeNotification.timestamp !==
			this.props.activeNotification.timestamp
		) {
			if (nextProps.activeNotification.type === HELPFUL_RESOURCES_FORM) {
				this.onOpenDialog();
			} else {
				this.onCloseDialog();
			}
		} else if (
			!nextProps.activeNotification.timestamp &&
			this.state.dialogIsOpen
		) {
			this.onCloseDialog();
		}
	}

	componentDidMount() {
		this.props.getExchangeInfo();
	}

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
	};

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false });
		this.props.closeNotification();
	};

	render() {
		const { dialogIsOpen } = this.state;
		const {
			activeLanguage,
			activeTheme,
			children,
			constants = { captcha: {} },
			icons: ICONS = {},
			activeNotification,
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
					<Dialog
						isOpen={dialogIsOpen}
						label="hollaex-modal"
						className="app-dialog"
						onCloseDialog={this.onCloseDialog}
						shouldCloseOnOverlayClick={false}
						theme={activeTheme}
						showCloseText={false}
						compressed={false}
						style={{ 'z-index': 100 }}
					>
						{dialogIsOpen &&
							activeNotification.type === HELPFUL_RESOURCES_FORM && (
								<HelpfulResourcesForm
									onSubmitSuccess={this.onCloseDialog}
									onClose={this.onCloseDialog}
									data={activeNotification.data}
								/>
							)}
					</Dialog>
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
	activeNotification: store.app.activeNotification,
});

const mapDispatchToProps = (dispatch) => ({
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
	closeNotification: bindActionCreators(closeNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AuthContainer));
