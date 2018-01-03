import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'react-modal';
import { Button, ActionNotification } from '../';
import STRINGS from '../../config/localizedStrings';
import { getClasesForLanguage, getLanguage } from '../../utils/string';

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
			closeButton,
			shouldCloseOnOverlayClick,
			showCloseText,
			dialogId,
			className
		} = this.props;

		return (
			<Modal
				id={dialogId}
				isOpen={isOpen}
				contentLabel={label}
				onRequestClose={this.onRequestClose}
				shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
				portalClassName={classnames(className, languageClasses)}
			>
				{!shouldCloseOnOverlayClick &&
					showCloseText && (
						<ActionNotification
							text={STRINGS.CLOSE_TEXT}
							status="information"
							onClick={this.onRequestClose}
							className="close-button"
						/>
					)}
				{children}
				{closeButton && (
					<div>
						{closeButton && (
							<Button onClick={closeButton} label={STRINGS.CLOSE_TEXT} />
						)}
					</div>
				)}
			</Modal>
		);
	}
}

Dialog.defaultProps = {
	shouldCloseOnOverlayClick: true,
	showCloseText: false,
	className: ''
};

export default Dialog;
