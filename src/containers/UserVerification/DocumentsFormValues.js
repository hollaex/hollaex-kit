import React from 'react';
import moment from 'moment';
import { TEXTS } from './constants';
import { requiredWithCustomMessage, isBefore } from '../../components/Form/validations';

const { ID_DOCUMENTS_FORM } = TEXTS;
const { FORM_FIELDS, VALIDATIONS, INFORMATION } = ID_DOCUMENTS_FORM;

const ERROR_MESSAGE_TYPE = VALIDATIONS.ID_TYPE;
const ERROR_MESSAGE_NUMBER = VALIDATIONS.ID_NUMBER;
const ERROR_MESSAGE_ISSUED_DATE = VALIDATIONS.ISSUED_DATE;
const ERROR_MESSAGE_EXPIRATION_DATE = VALIDATIONS.EXPIRATION_DATE;
const ERROR_MESSAGE_FRONT = VALIDATIONS.FRONT;
const ERROR_MESSAGE_PROOF_OF_RESIDENCY = VALIDATIONS.PROOF_OF_RESIDENCY;

export const generateFormValues = (language) => ({
  id: {
    type: {
      type: 'select',
      label: FORM_FIELDS.TYPE_LABEL,
      placeholder: FORM_FIELDS.TYPE_PLACEHOLDER,
      options: [
        { value: 'id', label: FORM_FIELDS.TYPE_OPTIONS.ID },
        { value: 'passport', label: FORM_FIELDS.TYPE_OPTIONS.OPTIONS },
      ],
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_TYPE)],
    },
    number: {
      type: 'text',
      label: FORM_FIELDS.ID_NUMBER_LABEL,
      placeholder: FORM_FIELDS.ID_NUMBER_PLACEHOLDER,
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_NUMBER)],
    },
    issued_date: {
      type: 'date-dropdown',
      label: FORM_FIELDS.ISSUED_DATE_LABEL,
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_ISSUED_DATE), isBefore()],
      endDate: moment().add(1, 'days'),
      language,
    },
    expiration_date: {
      type: 'date-dropdown',
      label: FORM_FIELDS.EXPIRATION_DATE_PLACEHOLDER,
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_EXPIRATION_DATE), isBefore()],
      endDate: moment().add(1, 'days'),
      language,
    },
    front: {
      type: 'file',
      label: FORM_FIELDS.FRONT_LABEL,
      placeholder: FORM_FIELDS.FRONT_PLACEHOLDER,
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_FRONT)],
    },
    back: {
      type: 'file',
      label: FORM_FIELDS.BACK_LABEL,
      placeholder: FORM_FIELDS.BACK_PLACEHOLDER,
    },
  },
  proofOfResidence: {
    proofOfResidency: {
      type: 'file',
      label: FORM_FIELDS.POR_LABEL,
      placeholder: FORM_FIELDS.POR_PLACEHOLDER,
      validate: [requiredWithCustomMessage(ERROR_MESSAGE_PROOF_OF_RESIDENCY)],
    },
  },
})

const InformationSection = ({ title, children}) => (
  <div className="information_section">
    <span className="information_section_title">{title}</span>
    {children}
  </div>
);

export const information = {
  phone: <InformationSection title="Phone" />,
  id: (
    <InformationSection title="Identity Document">
      <div>
        {INFORMATION.ID_SECTION.TITLE}
        <ul>
          <li>{INFORMATION.ID_SECTION.LIST_ITEM_1}</li>
          <li>{INFORMATION.ID_SECTION.LIST_ITEM_2}</li>
          <li>{INFORMATION.ID_SECTION.LIST_ITEM_3}</li>
        </ul>
      </div>
      <div>
        <div className="warning_text">{INFORMATION.ID_SECTION.WARNING_1}</div>
        <div>{INFORMATION.ID_SECTION.WARNING_2}</div>
      </div>
    </InformationSection>
  ),
  proofOfResidence: (
    <InformationSection title="Proof of residence">
      <div>
        {INFORMATION.POR.SECTION_1_TEXT_1}<br />
        {INFORMATION.POR.SECTION_1_TEXT_2}<br />
        {INFORMATION.POR.SECTION_1_TEXT_3}<br />
        {INFORMATION.POR.SECTION_1_TEXT_4}
      </div>
      <div>
        {INFORMATION.POR.SECTION_2_TITLE}
        <ul>
          <li>{INFORMATION.POR.SECTION_2_LIST_ITEM_1}</li>
          <li>{INFORMATION.POR.SECTION_2_LIST_ITEM_2}</li>
          <li>{INFORMATION.POR.SECTION_2_LIST_ITEM_3}</li>
        </ul>
      </div>
      <div className="warning_text">{INFORMATION.POR.WARNING}</div>
    </InformationSection>
  ),
}
