import React, { useEffect, useState } from 'react';
import { IconTitle, PanelInformationRow } from 'hollaex-web-lib';
import { withKit } from 'components/KitContext';
import Title from 'components/Title';
import axios from 'axios';

const Form = ({
  strings: STRINGS,
  icons: ICONS,
  generateId,
  plugin_url: PLUGIN_URL
}) => {

  const [info, setInfo] = useState();

  useEffect(() => {
    axios.get(`${PLUGIN_URL}/plugins/hello-exchange/info`).then(({ data: { exchange_info = {} }}) => {
      setInfo(exchange_info);
    })
  }, [])

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
            <Title />
            <div className="py-4">
              {info ? Object.entries(info).map(([key, value]) => (
                <PanelInformationRow
                  key={key}
                  label={key}
                  information={value}
                  className="title-font"
                  disable
                />
              )) : (
                <div className="pt-4">Loading ...</div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

const mapContextToProps = ({ strings, activeLanguage, icons, generateId, plugin_url }) => ({
  strings,
  activeLanguage,
  icons,
  generateId,
  plugin_url
});

export default withKit(mapContextToProps)(Form);