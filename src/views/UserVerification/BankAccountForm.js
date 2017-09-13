import React from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import { renderText, renderTextArea, renderSelect } from './ReduxFields';
import country from './Country';

const validate = (values) => {
  const errors = {};
  if (!values.bank_name) {
    errors.bank_name = 'Required field';
  }
  if (!values.bank_account_number) {
    errors.bank_account_number = 'Required field';
  }
  return errors;
}

const BankAccountForm = ({ handleSubmit, pristine, reset, submitting, fetching }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <div><h3>Bank Information</h3></div>
      <div className="row">
        <div className="col-lg-4">
          <Field
            name="bank_name"
            component={ renderText }
            type="text"
            label="Bank name"
            style={{width:'100%'}}
          />
        </div>
        <div className="col-lg-4">
          <Field
            name="bank_account_number"
            component={ renderText }
            type="text"
            label="Account number"
            style={{width:'100%'}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Field
            name="account_owner"
            component={ renderText }
            type="text"
            label="Account owner"
            style={{width:'100%'}}
          />
        </div>
        <div className="col-lg-4">
          <Field
            name="bsb"
            component={ renderText }
            type="text"
            label="BSB"
            style={{width:'100%'}}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className={`${fetching || pristine ? '' : 'activeButton'} mt-4`}
          style={{width:'30%'}}
          disabled={fetching || pristine}
        >
          { !fetching ? 'Update Data' : 'Submitting' }
        </button>
      </div>
    </div>
  </form>
)

const BankAccount = reduxForm({
  form: 'bankAccountForm',
  validate,
})(BankAccountForm)

const BankAccountFormFromState = connect(
  (state) => ({
    initialValues: state.user.userData,
  })
)(BankAccount)

export default BankAccountFormFromState;
