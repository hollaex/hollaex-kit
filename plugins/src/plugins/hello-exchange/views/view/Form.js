import React from 'react';
import { IconTitle } from 'hollaex-web-lib';
import { withKit } from 'components/KitContext';

const Form = ({
  strings: STRINGS,
  icons: ICONS,
  generateId
}) => {

    return (
      <div className="presentation_container apply_rtl verification_container">
        <IconTitle
          stringId={generateId('title')}
          text={STRINGS[generateId('title')]}
          textType="title"
          iconPath={ICONS['SIDEBAR_HELP']}
        />
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

const mapContextToProps = ({ strings, activeLanguage, icons, generateId }) => ({
  strings,
  activeLanguage,
  icons,
  generateId,
});

export default withKit(mapContextToProps)(Form);