import React from 'react';
import { Button, Editable as EditWrapper } from 'hollaex-web-lib';
import { withKit } from 'components/KitContext';

export const PLUGIN_NAME = 'bank';

const Form = ({ setActivePageContent, strings: STRINGS, generateId }) => {
    return (
      <div>
        <div className="secondary-text d-flex content-center m-4">
          {STRINGS.formatString(STRINGS[generateId('home-content')], STRINGS[generateId('title')])}
        </div>
        <div className="my-2 btn-wrapper">
          <div className="holla-verification-button pt-4">
            <EditWrapper stringId={generateId('go_to_tab')} />
            <Button
              label={STRINGS.formatString(STRINGS[generateId('go_to_tab')], STRINGS[generateId('title')])}
              onClick={() => setActivePageContent(PLUGIN_NAME)}
            />
          </div>
        </div>
      </div>
    )
}

const mapContextToProps = ({ setActivePageContent, strings, generateId }) => ({
  setActivePageContent,
  strings,
  generateId
});

export default  withKit(mapContextToProps)(Form);