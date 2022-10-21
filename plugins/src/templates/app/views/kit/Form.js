import React from 'react';
import { withKit } from 'components/KitContext';

const Form = ({
  strings: STRINGS,
  generateId
}) => {

    return (
      <div className="presentation_container apply_rtl verification_container">
        <form className="d-flex flex-column w-100 verification_content-form-wrapper">
          <div className="verification-form-panel mt-3 mb-5">
            <div className="my-4 py-4">
              {STRINGS.formatString(STRINGS[generateId('content')], STRINGS[generateId('title')])}
            </div>
          </div>
        </form>
      </div>
    )
}

const mapContextToProps = ({ strings, activeLanguage, generateId }) => ({
  strings,
  activeLanguage,
  generateId,
});

export default withKit(mapContextToProps)(Form);