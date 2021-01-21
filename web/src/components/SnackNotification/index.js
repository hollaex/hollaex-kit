import React, { Component } from 'react';
import { ReactSVG } from 'react-svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';

import { closeSnackNotification } from '../../actions/appActions';

let timeout = '';
let closeTimeOut = '';
class SnackNotification extends Component {
	state = {
		closeSnack: false,
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			this.props.snackProps.showSnack !== nextProps.snackProps.showSnack &&
			nextProps.snackProps.showSnack
		) {
			this.setState({ closeSnack: false });
			closeTimeOut = setTimeout(() => {
				this.setState({ closeSnack: true });
			}, 1200);
			timeout = setTimeout(() => {
				this.props.closeSnackNotification();
			}, 2000);
		}
	}

	componentWillUnmount() {
		if (timeout) clearTimeout(timeout);
		if (closeTimeOut) clearTimeout(closeTimeOut);
	}

	render() {
		const { snackProps } = this.props;
		if (!snackProps.showSnack) {
			return null;
		}
		return (
			<div
				className={classnames(
					'snack_notification-wrapper',
					'd-flex',
					'align-items-center',
					{
						'mobile-notification': isMobile,
						snack_open: snackProps.showSnack,
						snack_close: this.state.closeSnack,
					}
				)}
			>
				<div>
					{snackProps.icon ? (
						snackProps.useSvg ? (
							<ReactSVG
								src={snackProps.icon}
								className="notification-icon mx-2"
							/>
						) : (
							<img
								src={snackProps.icon}
								className="notification-icon mx-2"
								alt="notification-icon"
							/>
						)
					) : null}
				</div>
				<div className="notification-text mx-3">{snackProps.content}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	snackProps: state.app.snackNotification,
});

const mapDispatchToProps = (dispatch) => ({
	closeSnackNotification: bindActionCreators(closeSnackNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SnackNotification);
