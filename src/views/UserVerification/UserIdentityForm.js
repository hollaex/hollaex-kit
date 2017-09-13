import React from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import { renderText, renderTextArea, renderSelect } from './ReduxFields';
import country from './Country';

const validate = (values) => {
  const errors = {}
  if (!values.first_name) {
    errors.first_name = 'Required'
  }
  if (!values.last_name) {
    errors.last_name = 'Required'
  }
  return errors
}

const UserIdentityForm = ({ handleSubmit, pristine, reset, submitting, fetching }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <div><h3>Personal Information</h3></div>
      <div className="mt-1">
        <span>IMPORTANT : </span>
        <span style={{fontSize:'0.7rem'}}>
          Enter your name in to the fields exactly as it appears on your indentity document (full firstname, any middle names / initials and full last name(s))
        </span>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Field
            name="first_name"
            component={ renderText }
            type="text"
            label="FIRST NAME"
            style={{width:'100%'}}
          />
        </div>
        <div className="col-lg-4">
          <Field
            name="last_name"
            component={ renderText }
            type="text"
            label="LAST NAME"
            style={{width:'100%'}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Field
            name="gender"
            component={ renderSelect }
            label="GENDER"
            options={['MALE','FEMALE']}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Field
            name="nationality"
            component={ renderText }
            type="text"
            label="NATIONALITY"
            style={{width:'100%'}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Field
              name="dob"
              component={ renderText }
              type="date"
              label="DATE OF BIRTH"
              style={{width:'100%'}}
            />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Field
              name="countryReside"
              component={ renderSelect }
              label="COUNTRY YOU RESIDE"
              options={country}
            />
        </div>
        <div className="col-lg-4">
          <Field
              name="address"
              component={ renderText }
              type="text"
              label="ADDRESS"
              style={{width:'100%'}}
            />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Field
            name="city"
            component={ renderText }
            type="text"
            label="CITY"
            style={{width:'100%'}}
          />
        </div>
        <div className="col-lg-4">
          <Field
            name="postal code"
            component={ renderText }
            type="text"
            label="POSTAL CODE"
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
      <div className="mt-3">
        Are you a business? <Link to='/dashboard/support'>Contact customer support</Link> for a coporate account.
      </div>
    </div>
  </form>
)

const UserForm = reduxForm({
  form: 'userIdentityForm',
  validate,
})(UserIdentityForm)

const UserFormFromState = connect(
  (state) => ({
    initialValues: state.user.userData,
  })
)(UserForm)

export default UserFormFromState;
