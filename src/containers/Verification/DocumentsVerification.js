import React, { Component } from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import { requiredWithCustomMessage } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import HeaderSection, { IdentificationFormSection, PORSection } from './HeaderSection';
import { getErrorLocalized } from '../../utils/errors';
import { updateDocuments } from '../../actions/userAction';

const FORM_NAME = 'DocumentsVerification';

class DocumentsVerification extends Component {
  state = {
    formFields: {},
  }

  componentDidMount() {
    this.generateFormFields(this.props.nationality);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeLanguage !== this.props.activeLanguage) {
      this.generateFormFields(nextProps.nationality);
    }
  }

  generateFormFields = (nationality) => {
    const formFields = {
      id: {
        type: {
          type: 'select',
          label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.TYPE_LABEL,
          placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.TYPE_PLACEHOLDER,
          disabled: true,
          options: [
            { value: 'id', label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.TYPE_OPTIONS.ID },
            { value: 'passport', label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.TYPE_OPTIONS.PASSPORT },
          ],
          validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.ID_TYPE)],
        },
        front: {
          type: 'file',
          label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.FRONT_LABEL,
          placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.FRONT_PLACEHOLDER,
          validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.FRONT)],
        },
      },
      proofOfResidence: {
        proofOfResidency: {
          type: 'file',
          label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.POR_LABEL,
          placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.POR_PLACEHOLDER,
          validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.PROOF_OF_RESIDENCY)],
        },
      },
    };

    if (nationality === 'IR') {
      formFields.id.back = {
        back: {
          type: 'file',
          label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.BACK_LABEL,
          placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.BACK_PLACEHOLDER,
          validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.FRONT)],
        },
      }
    }
    this.setState({ formFields });
  }

  handleSubmit = (values) => {
    return updateDocuments(values)
      .then(({ data }) => {
        this.props.moveToNextStep('documents');
      })
      .catch((err) => {
        const error = { _error: err.message };
        if (err.response && err.response.data) {
          error._error = err.response.data.message
        }
        throw new SubmissionError(error)
      });
  }

  render() {
    const { handleSubmit, pristine, submitting, valid, error, skip, openContactForm } = this.props;
    const { formFields } = this.state;
    return (
      <form
        className="d-flex flex-column w-100 verification_content-form-wrapper"
        onSubmit={this.handleSubmit}
      >
        <HeaderSection
          title={STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.IDENTITY_DOCUMENT}
          openContactForm={openContactForm}
        >
          <IdentificationFormSection />
        </HeaderSection>
        {formFields.id && renderFields(formFields.id)}
        <HeaderSection
          title={STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.PROOF_OF_RESIDENCY}
          openContactForm={openContactForm}
        >
          <PORSection />
        </HeaderSection>
        {formFields.proofOfResidence && renderFields(formFields.proofOfResidence)}
        {error && <div className="warning_text">{getErrorLocalized(error)}</div>}

        <div className="d-flex verification-buttons-wrapper">
          <Button
            type="button"
            onClick={skip}
            label={STRINGS.SKIP_FOR_NOW}
            disabled={submitting}
          />
          <div className="separator"></div>
          <Button
            type="button"
            onClick={handleSubmit(this.handleSubmit)}
            label={STRINGS.SUBMIT}
            disabled={pristine || submitting || !valid || !!error}
          />
        </div>
      </form>
    );
  }
}

const DocumentsVerificationForm = reduxForm({
  form: FORM_NAME,
})(DocumentsVerification);

export default DocumentsVerificationForm;
