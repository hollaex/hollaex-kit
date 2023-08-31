import React from 'react';
import { IconTitle, Button } from 'hollaex-web-lib';
import { withKit } from 'components/KitContext';

const Form = ({
  strings: STRINGS,
  icons: ICONS,
  generateId,
  balance,
  coins,
  router,
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
              <table className="table-wrapper">
                <thead>
                  <tr className="border-bottom">
                    <th>
                      {STRINGS['CURRENCY']}
                    </th>
                    <th />
                    <th>
                      {STRINGS['AMOUNT']}
                    </th>
                    <th />
                    <th />
                    <th />
                  </tr>
                </thead>

                <tbody>
                {
                  Object.entries(coins).map(([key, { display_name, allow_deposit, allow_withdrawal, fullname }]) => {
                    return (
                      <tr key={key} className="border-bottom" >
                        <td className="bold">{display_name}</td>
                        <td className="secondary-text">{fullname}</td>
                        <td>{balance[`${key.toLowerCase()}_available`] || 0}</td>
                        <td />
                        <td>
                          <div>
                            <Button
                              label={STRINGS['WALLET_BUTTON_BASE_DEPOSIT']}
                              onClick={() => router.push(`wallet/${key}/deposit`)}
                              disabled={!allow_deposit}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <Button
                              label={STRINGS['WALLET_BUTTON_BASE_WITHDRAW']}
                              onClick={() => router.push(`wallet/${key}/withdraw`)}
                              disabled={!allow_withdrawal}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    )
}

const mapContextToProps = ({ strings, activeLanguage, icons, generateId, balance, coins, router }) => ({
  strings,
  activeLanguage,
  icons,
  generateId,
  balance,
  coins,
  router,
});

export default withKit(mapContextToProps)(Form);