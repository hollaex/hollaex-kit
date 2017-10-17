import React from 'react';
import { required, requiredBoolean, isBefore } from '../../components/Form/validations';
import countries from '../../utils/countries';
import { ICONS } from '../../config/constants';
import { getFormattedDate } from '../../utils/string';
import moment from 'moment';

const COUNTRIES_OPTIONS = countries.map((country) => ({
  label: country.name,
  value: country.value,
  icon: country.flag,
}));

const PHONE_OPTIONS = countries.map((country) => ({
  label: `${country.name} (${country.phoneCode})`,
  value: country.phoneCode,
  icon: country.flag,
}));

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
      options: [
        { value: false, label: 'Man', icon: ICONS.GENDER_M },
        { value: true, label: 'Woman', icon: ICONS.GENDER_F },
      ],
      validate: [requiredBoolean],
    },
    nationality: {
      type: 'autocomplete',
      label: 'Nationality',
      placeholder: 'Type what nationality is on your identity document',
      options: COUNTRIES_OPTIONS,
      validate: [required],
    },
    dob: {
      type: 'date',
      label: 'Date of birth',
      validate: [required, isBefore()],
      endDate: moment().add(1, 'days'),
      pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}'
    },
    country: {
      type: 'autocomplete',
      label: 'Country you reside',
      placeholder: 'Select the country you reside in currently',
      options: COUNTRIES_OPTIONS,
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
      type: 'autocomplete',
      label: 'Country',
      placeholder: 'Select the country your phone is connected to',
      options: PHONE_OPTIONS,
      validate: [required],
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

export const prepareInitialValues = ({ id_data, bank_account, address, ...rest, timestamp }) => {
  const initialValues = {
    ...rest,
    ...address,
  };
  return initialValues;
}

export default fields;
