import React from 'react';
import { Button, IconTitle, Editable as EditWrapper } from 'hollaex-web-lib';
import { withKit } from 'components/KitContext';
import { PLUGIN_NAME } from '../home/Form';

const Form = ({
  strings: STRINGS,
  handleBack,
  generateId,
  setActivePageContent,
}) => {

  const onGoBack = () => {
    setActivePageContent('email');
    handleBack(PLUGIN_NAME);
  };

    return (
      <div className="presentation_container apply_rtl verification_container">
        <IconTitle
          stringId={generateId('title')}
          text={STRINGS[generateId('title')]}
          textType="title"
        />
        <form className="d-flex flex-column w-100 verification_content-form-wrapper">
          <div className="verification-form-panel mt-3 mb-5">
            <div className="my-4 py-4">
              {STRINGS.formatString(STRINGS[generateId('content')], STRINGS[generateId('title')])}
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2">
            <div className="f-1 d-flex justify-content-end verification-buttons-wrapper">
              <EditWrapper stringId="USER_VERIFICATION.GO_BACK" />
              <Button
                label={STRINGS['USER_VERIFICATION.GO_BACK']}
                onClick={onGoBack}
              />
            </div>
          </div>
        </form>
      </div>
    )
}

const mapContextToProps = ({ strings, handleBack, activeLanguage, icons, generateId, setActivePageContent }) => ({
  strings,
  handleBack,
  activeLanguage,
  icons,
  generateId,
  setActivePageContent,
});

export default withKit(mapContextToProps)(Form);