import React from 'react';
import { required } from '../../components/Form/validations';
import countries from '../../utils/countries';

const fields = {
  personalInformation: {
    first_name: {
      type: 'text',
      label: 'First name',
      placeholder: 'Type your first name as it appears on your identity document',
      validate: [required],
    },
    last_name: {
      type: 'text',
      label: 'Last name',
      placeholder: 'Type your last name as it appears on your identity document',
      validate: [required],
    },
    gender: {
      type: 'select',
      label: 'Gender',
      placeholder: 'Type what gender your are',
      options: ['Man', 'Woman'],
    },
    nationality: {
      type: 'select',
      label: 'Nationality',
      placeholder: 'Type what nationality is on your identity document',
      options: countries,
    },
    dob: {
      type: 'date',
      label: 'Date of birth',
    },
    country: {
      type: 'select',
      label: 'Country you reside',
      placeholder: 'Select the country you reside in currently',
      options: countries
    },
    city: {
      type: 'text',
      label: 'City',
      placeholder: 'Type the city you live in',
    },
    address: {
      type: 'text',
      label: 'Address',
      placeholder: 'Type the address you are currently living',
    },
    postal_code: {
      type: 'text',
      label: 'Postal code',
      placeholder: 'Type your postal code',
    },
  },
  phone: {
    phone_country: {
      type: 'select',
      label: 'Country',
      placeholder: 'Select the country your phone is connected to',
      options: countries
    },
    phone_number: {
      type: 'text',
      label: 'Phone number',
      placeholder: 'Type your phone number',
    },
    sms_code: {
      type: 'text',
      label: 'Country you reside',
      placeholder: 'Select the country you reside in currently',
    },
  },
  id: {
    front: {
      type: 'file',
      label: 'Photo ID Document',
      placeholder: 'Add a copy of your photo ID document',
      validate: [required],
    },
    back: {
      type: 'file',
      label: 'Back Side of Photo ID Document',
      placeholder: 'Add a copy of the backside of your ID document',
    },
  },
  proofOfResidence: {
    proof_of_residence: {
      type: 'file',
      label: 'Document proving your address',
      placeholder: 'Add a copy of a document that proves your address',
      validate: [required],
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
  personalInformation: (
    <InformationSection title="Personal Information">
      <div>IMPORTANT: Enter your name into the fields exactly as it appears on your identity document (full first name, any middle names/initials and full last name(s))
Are you a business? Contact customer support for a corporate account.</div>
    </InformationSection>
  ),
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
