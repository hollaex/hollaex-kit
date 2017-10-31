import React from 'react';
import { requiredWithCustomMessage } from '../../components/Form/validations';

const ERROR_MESSAGE_TYPE = 'Please select a type of identity document';
const ERROR_MESSAGE_NUMBER = 'Please type your documents number';
const ERROR_MESSAGE_ISSUED_DATE = 'Please select the date in which your document was issued';
const ERROR_MESSAGE_EXPIRATION_DATE = 'Please select the date when your document will expire';
const ERROR_MESSAGE_FRONT = 'Please upload a scan of your photo identity document';
const ERROR_MESSAGE_PROOF_OF_RESIDENCY = 'Please upload a scan of document proving the address you current reside';

const fields = {
  id: {
    type: {
      type: 'select',
      label: 'ID Document Type:',
      placeholder: 'Select Type of identity document',
      options: [
        { value: 'id', label: 'ID' },
        { value: 'passport', label: 'Passport' },
      ],
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_TYPE)],
    },
    number: {
      type: 'text',
      label: 'ID Document Number',
      placeholder: 'Type the documents number',
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_NUMBER)],
    },
    issued_date: {
      type: 'date',
      label: 'ID Document Issue Date',
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_ISSUED_DATE)],
    },
    expiration_date: {
      type: 'date',
      label: 'ID Document Expiration Date',
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_EXPIRATION_DATE)],
    },
    front: {
      type: 'file',
      label: 'Photo ID Document',
      placeholder: 'Add a copy of your photo ID document',
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_FRONT)],
    },
    back: {
      type: 'file',
      label: 'Back Side of Photo ID Document',
      placeholder: 'Add a copy of the backside of your ID document',
    },
  },
  proofOfResidence: {
    proofOfResidency: {
      type: 'file',
      label: 'Document proving your address',
      placeholder: 'Add a copy of a document that proves your address',
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_PROOF_OF_RESIDENCY)],
    },
  },
};

const InformationSection = ({ title, children}) => (
  <div className="information_section">
    <span className="information_section_title">{title}</span>
    {children}
  </div>
)

export const information = {
  phone: <InformationSection title="Phone" />,
  id: (
    <InformationSection title="Identity Document">
      <div>
        Please make sure that your submitted documents are:
        <ul>
          <li>HIGH QUALITY (colour images, 300dpi resolution or higher).</li>
          <li>VISIBLE IN THEIR ENTIRETY (watermarks are permitted).</li>
          <li>VALID, with the expiry date clearly visible.</li>
        </ul>
      </div>
      <div>
        <div className="warning_text">Please do not submit the identity document as your proof of residence.</div>
        <div>Only a valid government-issued identification document; high quality photos or scanned images of these documents are acceptable:</div>
      </div>
    </InformationSection>
  ),
  proofOfResidence: (
    <InformationSection title="Proof of residence">
      <div>
        To avoid delays when verifying your account, please make sure:
        Your NAME, ADDRESS, ISSUE DATE and ISSUER are clearly visible.
        The submitted proof of residence document is NOT OLDER THAN THREE MONTHS.
        You submit color photographs or scanned images in HIGH QUALITY (at least 300 DPI)
      </div>
      <div>
        AN ACCEPTABLE PROOF OF RESIDENCE IS:
        <ul>
          <li>A bank account statement.</li>
          <li>A utility bill (electricity, water, internet, etc.).</li>
          <li>A government-issued document (tax statement, certificate of residency, etc.).</li>
        </ul>
      </div>
      <div className="warning_text">We cannot accept the address on your submitted identity document as a valid proof of residence.</div>
    </InformationSection>
  ),
}

export default fields;
