import React from 'react';
import { AdminHocForm } from '../../../components';
import { getPluginsForm } from './Utils';

const Form = AdminHocForm('PLUGINFORM_FORM', 'pluginform-form');

export const S3Form = ({ handleSubmitVault }) => {
  return (
    <div className="mb-4">
      <Form
        onSubmit={handleSubmitVault}
        buttonText="Submit"
        fields={getPluginsForm('s3')}
      />
    </div>
  );
}
export const SNSForm = ({ handleSubmitVault }) => {
  return (
    <div className="mb-4">
      <Form
        onSubmit={handleSubmitVault}
        buttonText="Submit"
        fields={getPluginsForm('sns')}
      />
    </div>
  );
}
export const Freshdesk = ({ handleSubmitVault }) => {
  return (
    <div className="mb-4">
      <Form
        onSubmit={handleSubmitVault}
        buttonText="Submit"
        fields={getPluginsForm('freshdesk')}
      />
    </div>
  );
}


