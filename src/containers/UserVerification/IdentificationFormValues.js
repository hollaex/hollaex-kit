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
      validate: [required],
    },
    nationality: {
      type: 'select',
      label: 'Nationality',
      placeholder: 'Type what nationality is on your identity document',
      options: countries,
      validate: [required],
    },
    dob: {
      type: 'date',
      label: 'Date of birth',
      validate: [required],
    },
    country: {
      type: 'select',
      label: 'Country you reside',
      placeholder: 'Select the country you reside in currently',
      options: countries,
      validate: [required],
    },
    city: {
      type: 'text',
      label: 'City',
      placeholder: 'Type the city you live in',
      validate: [required],
    },
    address: {
      type: 'text',
      label: 'Address',
      placeholder: 'Type the address you are currently living',
      validate: [required],
    },
    postal_code: {
      type: 'text',
      label: 'Postal code',
      placeholder: 'Type your postal code',
      validate: [required],
    },
  },
  phone: {
    phone_country: {
      type: 'select',
      label: 'Country',
      placeholder: 'Select the country your phone is connected to',
      options: countries,
    },
    phone_number: {
      type: 'text',
      label: 'Phone number',
      placeholder: 'Type your phone number',
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
}

export default fields;
