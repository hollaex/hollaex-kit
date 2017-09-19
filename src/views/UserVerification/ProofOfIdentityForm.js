import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { renderText, renderSelect, renderInputFile } from './ReduxFields';

const validate = (fields) => {
  const errors = {};

  if (!fields.front) {
    errors.front = 'Required field';
  }

  if (!fields.back) {
    errors.back = 'Required field';
  }

  if (!fields.proofOfResidency) {
    errors.proofOfResidency = 'Required field';
  }
  return errors;
}

const ProofOfIdentityForm = ({ handleSubmit, pristine, submitting, fetching }) => (
  <form onSubmit={handleSubmit}>
    <div className="mt-3"><h3>ID Document</h3></div>
    <div className="mt-3" style={{fontSize:'0.8rem'}}>
       Please make sure that your submitted documents are:
        <li>HIGH QUALITY(color images,300dpi resolution or higher).</li>
        <li>VISIBLE IN THEIR ENTIRITY(Watermarks are permitted).</li>
        <li>VALID, with the expiry date clearly visible</li>
       <div className="mt-3" >
        <span style={{color:'#bf2932',backgroundColor:'#f1dbde'}}>
          Please do not submit the identity document as your proof of residense.
        </span>
       </div>
       <div style={{fontSize:'0.7rem'}}>
        Only a valid goverment-issued identification document;
        high quality photos or scanned images of these documents are acceptable:
       </div>
    </div>

    <div className="mt-4">
      <Field
        name="front"
        component={ renderInputFile }
        label="Front Side Photo ID Document:"
        style={{width:'100%'}}
      />
    </div>

    <div className="mt-4">
      <Field
        name="back"
        component={ renderInputFile }
        label="Back Side Photo ID Document:"
        style={{width:'100%'}}
      />
    </div>

    <div className="row">
      <div className="col-lg-4">
        <Field
          name="issue"
          component={ renderText }
          type="date"
          label="ID Document Issue Date"
          style={{width:'100%'}}
        />
      </div>
      <div className="col-lg-4">
        <Field
          name="expiration"
          component={ renderText }
          type="date"
          label="ID Document Expiration Date"
          style={{width:'100%'}}
        />
      </div>
    </div>

    <div className="row">
      <div className="col-lg-4 row" >
        <div className="col-lg-6">
          <Field
            name="id_number"
            component={ renderText }
            type="text"
            label="ID Document Number"
            style={{width:'118%'}}
          />
        </div>
        <div className="col-lg-6">
          <Field
            name="id_type"
            component={ renderSelect }
            label="ID Document Type"
            options={['PASSPORT','NATIONAL ID','DRIVERS LICENCE','OTHER']}
            style={{width:'120%'}}
          />
        </div>
      </div>
    </div>

    <div className="mt-3">
      <div><h3>PROOF OF RECIDENCE DOCUMENT</h3></div>
      <div style={{fontSize:'0.7rem'}} className="mt-3">
        <div>To avoid delays when verifying your account,please make sure:</div>
        <div>Your NAME, ADDRESS, ISSUE DATE and ISSUER are clearly visible.</div>
        <div>The submitted proof of residence document is NOT OLDER THAN THREE MONTHS.</div>
        <div>You submit color photographs scanned images in HIGH QUALITY (at least 300DPI)</div>
        <div className="mt-3">
          AN ACCEPTABLE PROOF OF RECIDENCE IS:
          <li>A bank account statement</li>
          <li>A utility bill(electricity,water,internet,etc.).</li>
          <li>A goverment-issued document(tax statement, certificate of recidency,etc.).</li>
        </div>
      </div>

       <div className="mt-3" >
        <span style={{color:'#bf2932',backgroundColor:'#f1dbde'}}>
           We cannot accept the address on your submitted identity document as a valid proof of recidence.
        </span>
       </div>

       <div className="mt-4">
         <Field
           name="proofOfResidency"
           component={ renderInputFile }
           style={{width:'100%'}}
         />
      </div>

      <div>
        <button
          type="submit"
          className={`${fetching || pristine ? '' : 'activeButton'} mt-4`}
          style={{width:'30%'}}
          disabled={fetching || pristine}
        >
          { !fetching ? 'SUBMIT VERIFICATION REQUEST' : 'Submitting' }
        </button>
      </div>
    </div>
  </form>
)

const ProofOfIdentity = reduxForm({
  form: 'proofOfIdentityForm',
  validate,
})(ProofOfIdentityForm)

export default ProofOfIdentity
