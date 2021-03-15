import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'react-modal';
import { isLoggedIn } from '../../utils/token';
import { MobileBarBack } from '../';
import { getClasesForLanguage, getLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';
import { ICONS } from '../../config/constants';
import { ReactSVG } from 'react-svg';

const CompressedContent = ({ children, onClose }) => {
	return (
		<div className="dialog-compressed-wrapper d-flex">
			<div className="dialog-compressed-content f-1">{children}</div>
			<div className="dialog-compressed-close f-0 d-flex justify-content-center align-items-center">
				<div className="close-dialog pointer" onClick={onClose}>
					<ReactSVG src={ICONS.CANCEL_CROSS_ACTIVE} className="bar-icon-back" />
				</div>
			</div>
		</div>
	);
};

const RegularContent = ({ showBar, onBackClick, children }) => {
	return (
		<div className="dialog-regular-content">
			{showBar && (
				<MobileBarBack
					onBackClick={onBackClick}
					wrapperClassName="dialog-svg"
				/>
			)}
			<div className="dialog-mobile-content">{children}</div>
		</div>
	);
};

class Dialog extends PureComponent {
	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		label: PropTypes.string.isRequired,
		closeButton: PropTypes.func,
		onCloseDialog: PropTypes.func,
		children: PropTypes.node.isRequired,
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
			showBar = true,
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
						'dialog_full-screen': useFullScreen,
						LogoutModal: !isLoggedIn(),
					}
				)}
			>
				{compressed ? (
					<CompressedContent onClose={this.onRequestClose}>
						{children}
					</CompressedContent>
				) : (
					<RegularContent showBar={showBar} onBackClick={this.onRequestClose}>
						{children}
					</RegularContent>
				)}
			</Modal>
		);
	}
}

Modal.setAppElement('#root');

Dialog.defaultProps = {
	shouldCloseOnOverlayClick: true,
	showCloseText: true,
	theme: '',
	className: '',
};

export default Dialog;
