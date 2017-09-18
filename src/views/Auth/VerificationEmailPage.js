import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderInput } from './Login';

const validate = (values) => !values.email ? { email: 'Required email' } : {};

const VerificationEmail = ({
  handleSubmit, checkVerification, data, pristine
}) => {
  const { fetching, error } = data;
  if (data.fetched) {
    return <div>Check your email to verify your account</div>
  } else if (fetching) {
    return <div className='text-center'>Loading</div>
  }

  return (
    <div  className='col-lg-4 offset-4'>
      <form className='pt-5' onSubmit={handleSubmit((values) => checkVerification({ ...values, resend: true }))}>
        <div className='row'>
          <div className='col-lg-6 text-right'>Request verification email</div>
        </div>
        <div className='row'>
          <Field
            name="email"
            component={ renderInput }
            type="email"
            label="Email"
          />
        </div>
        {error && <div className='text-center'>{error}</div>}
        <button disabled={pristine || fetching}>Submit</button>
      </form>
    </div>
  )
}

export default reduxForm({
  form: 'VerificationEmailRequest',
  validate,
})(VerificationEmail);
