import React, { Component } from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import { requiredWithCustomMessage } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import HeaderSection, { IdentificationFormSection, PORSection } from './HeaderSection';
import { getErrorLocalized } from '../../utils/errors';
import { updateDocuments } from '../../actions/userAction';
import { NATIONAL_COUNTRY_VALUE } from '../../utils/countries';

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

  generateFormFields = (nationality = NATIONAL_COUNTRY_VALUE) => {
    const FRONT_TYPE = nationality === NATIONAL_COUNTRY_VALUE ? 'FRONT' : 'PASSPORT';
    const formFields = {
      id: {
        type: {
          type: 'hidden',
        },
        front: {
          type: 'file',
          label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS[`${FRONT_TYPE}_LABEL`],
          placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS[`${FRONT_TYPE}_PLACEHOLDER`],
          validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.FRONT)],
        },
      },
    };

    if (nationality === NATIONAL_COUNTRY_VALUE) {
      formFields.id.back = {
        type: 'file',
        label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.BACK_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.BACK_PLACEHOLDER,
        validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.FRONT)],
      }
    } else { // nationality !== NATIONAL_COUNTRY_VALUE
      formFields.proofOfResidence = {
        proofOfResidency: {
          type: 'file',
          label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.POR_LABEL,
          placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.POR_PLACEHOLDER,
          validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.PROOF_OF_RESIDENCY)],
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
        {renderFields(formFields.id)}

        {formFields.proofOfResidence && (
          <div>
            <HeaderSection
              title={STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.PROOF_OF_RESIDENCY}
              openContactForm={openContactForm}
            >
              <PORSection />
            </HeaderSection>
            {renderFields(formFields.proofOfResidence)}
          </div>
        )}
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
