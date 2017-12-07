import React, { Component } from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';
import { ActionNotification } from '../../';
import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

class EditableInputField extends Component {
  state = {
    isEditable: false,
  }

  toogleEditable = () => {
    this.setState({ isEditable: !this.state.isEditable });
  }

  render() {
    const { isEditable } = this.state;
    const {
      input,
      type,
      placeholder,
      meta: { touched, error, active },
      onClick,
      fullWidth = false,
      inputType,
      ...rest,
    } = this.props;
    const displayError = touched && error && !active;

    return (
      <FieldWrapper {...this.props}>
        <input
          placeholder={placeholder}
          className={classnames('input_field-input', {
            error: displayError,
            cursor_disabled: !isEditable,
          })}
          type={inputType}
          {...input}
          {...rest}
          disabled={!isEditable}
        />
        <ActionNotification
          text={STRINGS.EDIT_TEXT}
          status="information"
          iconPath={ICONS.BLUE_CLIP}
          className="file_upload_icon"
          onClick={this.toogleEditable}
        />
      </FieldWrapper>
    );
  }
}

export default EditableInputField;
