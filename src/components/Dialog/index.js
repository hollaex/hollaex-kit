import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Button } from '../';

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
    const { isOpen, children, label, closeButton } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={label}
        onRequestClose={this.onRequestClose}
      >
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

export default Dialog;
