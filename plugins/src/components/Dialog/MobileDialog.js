import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'react-modal';

const RegularContent = ({ children }) => {
	return (
		<div className="dialog-regular-content">
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
		const {
			isOpen,
			children,
			label,
			dialogId,
			className,
			useFullScreen = false,
			compressed = false,
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
					'layout-mobile',
					{
						compressed,
						'dialog_full-screen': useFullScreen,
					}
				)}
			>
				<RegularContent onBackClick={this.onRequestClose}>
          {children}
				</RegularContent>
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
