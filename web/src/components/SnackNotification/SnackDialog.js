import React, { Component } from 'react';
import { ReactSVG } from 'react-svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import ICONS from 'config/icons';
import SnackDialogContent from './SnackDialogContent';
import {
	// closeSnackNotification,
	closeSnackDialog,
} from '../../actions/appActions';

let timeout = '';
let closeTimeOut = '';
let closeIconClicked = false;
class SnackDialog extends Component {
	state = {
		closeSnack: false,
		updateCloseControl: false,
	};

	componentDidMount() {
		document.addEventListener('click', this.onOutsideClick);
	}

	onOutsideClick = (event) => {
		const { snackProps, closeSnackDialog } = this.props;
		if (snackProps.isDialog) {
			const currentPopup =
				snackProps.dialogData[snackProps.dialogData.length - 1];
			if (currentPopup) {
				const temp = document.getElementById(currentPopup.id);
				if (
					temp &&
					event.target !== temp &&
					!temp.contains(event.target) &&
					!this.state.updateCloseControl
				) {
					closeSnackDialog(currentPopup.id);
				} else {
					this.setState({ updateCloseControl: false });
				}
			}
		}
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			this.props.snackProps.isDialog !== nextProps.snackProps.isDialog &&
			nextProps.snackProps.isDialog
		) {
			this.setState({ closeSnack: false });
			closeTimeOut = setTimeout(() => {
				this.setState({ closeSnack: true });
			}, 1200);
		}
		if (
			this.props.snackProps.dialogData.length !==
			nextProps.snackProps.dialogData.length
		) {
			if (closeIconClicked) {
				this.setState({ updateCloseControl: true });
				closeIconClicked = false;
			}
			const currentPopup =
				nextProps.snackProps.dialogData[
					nextProps.snackProps.dialogData.length - 1
				];
			if (currentPopup) {
				timeout = setTimeout(() => {
					this.props.closeSnackDialog(currentPopup.id);
				}, 3000);
			}
		}
	}

	closeDialog = (id, e) => {
		closeIconClicked = true;
		this.props.closeSnackDialog(id);
	};

	componentWillUnmount() {
		if (timeout) clearTimeout(timeout);
		if (closeTimeOut) clearTimeout(closeTimeOut);
	}

	render() {
		const { snackProps } = this.props;
		if (!snackProps.isDialog) {
			return null;
		}
		return snackProps.dialogData.map((data, index) => (
			<div
				id={data.id}
				key={index}
				className={classnames('snack_dialog-wrapper', 'd-flex', {
					snack_dialog_open: snackProps.isDialog,
					snack_dialog_close: this.state.closeSnack,
				})}
			>
				<SnackDialogContent {...data} />
				<div
					className="close-dialog pointer"
					onClick={(e) => this.closeDialog(data.id, e)}
				>
					<ReactSVG
						src={ICONS['CANCEL_CROSS_ACTIVE']}
						className="bar-icon-back"
					/>
				</div>
			</div>
		));
	}
}

const mapStateToProps = (state) => ({
	snackProps: state.app.snackNotification,
});

const mapDispatchToProps = (dispatch) => ({
	// closeSnackNotification: bindActionCreators(closeSnackNotification, dispatch),
	closeSnackDialog: bindActionCreators(closeSnackDialog, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SnackDialog);
