import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Button, ActionNotification } from '../';

const CLOSE_TEXT = "CLOSE";

class Dialog extends PureComponent {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    closeButton: PropTypes.func,
    onCloseDialog: PropTypes.func,
    children: PropTypes.node.isRequired,
  }

  onRequestClose = (e) => {
    if (this.props.onCloseDialog) {
      this.props.onCloseDialog(e);
    }
  }

  render() {
    const { isOpen, children, label, closeButton, shouldCloseOnOverlayClick, showCloseText, dialogId } = this.props;

    return (
      <Modal
        id={dialogId}
        isOpen={isOpen}
        contentLabel={label}
        onRequestClose={this.onRequestClose}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      >
        {!shouldCloseOnOverlayClick && showCloseText &&
          <ActionNotification
            text={CLOSE_TEXT}
            status="information"
            onClick={this.onRequestClose}
            className="close-button"
          />
        }
        {children}
        {closeButton &&
          <div>
            {closeButton && <Button onClick={closeButton} label="Close" />}
          </div>
        }
      </Modal>
    );
  }
}

Dialog.defaultProps = {
  shouldCloseOnOverlayClick: true,
  showCloseText: false,
}

export default Dialog;
