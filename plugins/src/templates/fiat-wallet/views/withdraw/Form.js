import React from 'react';
import { Image } from 'hollaex-web-lib';
import { withKit } from 'components/KitContext';


const Form = ({ icons: ICONS, currency, titleSection }) => {
    return (
      <div className="withdraw-form-wrapper">
        <div className="withdraw-form">
          <Image
            icon={ICONS[`${currency.toUpperCase()}_ICON`]}
            wrapperClassName="form_currency-ball"
          />
          {titleSection}
        </div>
      </div>
    )
}

const mapContextToProps = ({ icons, currency, titleSection }) => ({
  icons,
  currency,
  titleSection,
})

export default withKit(mapContextToProps)(Form);