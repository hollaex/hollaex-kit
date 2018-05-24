import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'react-modal';
import { MobileBarBack } from '../';
import { getClasesForLanguage, getLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';

class Dialog extends PureComponent {
	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		label: PropTypes.string.isRequired,
		closeButton: PropTypes.func,
		onCloseDialog: PropTypes.func,
		children: PropTypes.node.isRequired
	};

	onRequestClose = (e) => {
		if (this.props.onCloseDialog) {
			this.props.onCloseDialog(e);
		}
	};

	render() {
		const languageClasses = getClasesForLanguage(getLanguage());
		const {
			isOpen,
			children,
			label,
			dialogId,
			theme,
			className,
			useFullScreen = false,
			compressed = false,
			showBar = true
		} = this.props;

		return (
			<Modal
				id={dialogId}
				isOpen={isOpen}
				contentLabel={label}
				onRequestClose={this.onRequestClose}
				shouldCloseOnOverlayClick={false}
				portalClassName={classnames(
					className,
					languageClasses,
					getThemeClass(theme),
					'layout-mobile',
					{
						compressed,
						'dialog_full-screen': useFullScreen
					}
				)}
			>
				{showBar && (
					<MobileBarBack
						onBackClick={this.onRequestClose}
						wrapperClassName="dialog-svg"
					/>
				)}
				<div className="dialog-mobile-content">{children}</div>
			</Modal>
		);
	}
}

Dialog.defaultProps = {
	shouldCloseOnOverlayClick: true,
	showCloseText: true,
	theme: '',
	className: ''
};

export default Dialog;
