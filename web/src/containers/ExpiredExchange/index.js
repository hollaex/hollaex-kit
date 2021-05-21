import React, { Component } from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { getThemeClass } from '../../utils/theme';

import { FLEX_CENTER_CLASSES, EXCHANGE_URL } from '../../config/constants';
import { getExchangeInfo } from '../../actions/appActions';
import { logout } from '../../actions/authAction';
import STRINGS from '../../config/localizedStrings';
import { Button } from '../../components';

import withConfig from 'components/ConfigProvider/withConfig';

class Expired extends Component {
	componentDidMount() {
		this.props.getExchangeInfo();
	}

	componentDidUpdate(prevProps) {
		if (JSON.stringify(this.props.info) !== JSON.stringify(prevProps.info)) {
			this.checkExchangeExpiry(this.props.info);
		}
	}

	checkExchangeExpiry = (info = {}) => {
		if (info.status) {
			if (info.is_trial) {
				if (info.active) {
					if (info.expiry && moment().isBefore(info.expiry, 'second')) {
						this.goToAccount();
					}
				}
			} else {
				this.goToAccount();
			}
		}
	};

	goToAccount = () => this.props.router.replace('/account');

	render() {
		const { activeTheme, icons: ICONS } = this.props;
		return (
			<div
				className={classnames(
					getThemeClass(activeTheme),
					'app_container',
					'w-100',
					'h-100'
				)}
			>
				<div
					className={classnames(
						'expired_exchange_wrapper',
						'h-100',
						'flex-column',
						...FLEX_CENTER_CLASSES
					)}
				>
					<div>
						<ReactSVG
							src={ICONS['EXPIRED_ICON']}
							className="expired_img_icon"
						/>
					</div>
					<div className="expired_text mt-5">{STRINGS['EXPIRED_INFO_1']}</div>
					<div className="expired_text">{STRINGS['EXPIRED_INFO_2']}</div>
					<div className="expired_button">
						<a
							href={EXCHANGE_URL}
							target="blank"
							className="holla-button mdc-button mdc-button--unelevated holla-button-font"
						>
							<Button label={STRINGS['EXPIRED_BUTTON_TXT']} />
						</a>
					</div>
					<div
						className="blue-link pointer"
						onClick={() => this.props.logout('Exchange expired')}
					>
						{STRINGS['SIGN_UP.GOTO_LOGIN']}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	info: store.app.info,
	activeTheme: store.app.theme,
});

const mapDispatchToProps = (dispatch) => ({
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch),
	logout: bindActionCreators(logout, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Expired));
