import React from 'react';
import classnames from 'classnames';
import { Button } from '../';
import { NOTIFICATIONS } from '../../actions/appActions';
import { ICONS } from '../../config/constants';
import { getDepositTexts } from './constants';
import {
  fiatSymbol,
} from '../../utils/currency';

import STRINGS from '../../config/localizedStrings';

import Header from './Header';
import DepositContent from './Deposit';
import WithdrawContent from './Withdraw';

const generateNotificationContent = ({ type, data, onClose, goToPage, openContactForm }) => {
  const content = {};
  switch (type) {
    case NOTIFICATIONS.DEPOSIT: {
        const depositTexts = getDepositTexts(data.currency, data.status);

        content.header = {
          text: depositTexts.title,
          icon: data.currency === 'fiat' ?
            ICONS.DEPOSIT_FIAT_COMPLETE:
            ICONS.DEPOSIT_RECEIVED_BITCOIN,
        }
        const childrenProps = {
          symbol: data.currency,
          amount: data.amount,
          information: depositTexts.subtitle,
          price: data.price || 1,
          content: (
            <div>
              {depositTexts.information && depositTexts.information.join('\n')}
            </div>
          ),
          openContactForm: () => {
            onClose();
            openContactForm()
          },
        };
        content.children = <DepositContent {...childrenProps} />;
        content.buttons = (
          <div className="notification-buttons-wrapper d-flex">
            <Button
              label={STRINGS.NOTIFICATIONS.BUTTONS.OKAY}
              onClick={onClose}
            />
            <div className="separator" />
            <Button
              className={classnames(`button-${data.currency}`)}
              label={data.currency === fiatSymbol ? STRINGS.NOTIFICATIONS.BUTTONS.START_TRADING : STRINGS.NOTIFICATIONS.BUTTONS.SEE_HISTORY }
              onClick={() => {
                goToPage(data.currency === fiatSymbol ? 'trade' : 'transactions');
                onClose();
              }}
            />
          </div>
        );
        break;
    }
    case NOTIFICATIONS.WITHDRAWAL: {
      const childrenProps = {
        content: (
          <div>
            <h3>{type}</h3>
            <div>{JSON.stringify(data, null, 2)}</div>
          </div>
        ),
      }
      content.children = <WithdrawContent {...childrenProps} />;
      break;
    }
    case NOTIFICATIONS.ORDERS:
    case NOTIFICATIONS.TRADES:
    default:
      content.children = (
        <div>
          <h3>{type}</h3>
          <div>{JSON.stringify(data, null, 2)}</div>
        </div>
      )
      break;
  }

  return content;
}


const Notification = (props) => {
  const content = generateNotificationContent(props);
  return (
    <div
      className={classnames(
        'notification-wrapper',
        'd-flex',
        'flex-column'
      )}
    >
      {content.header && <Header {...content.header} />}
      {content.children}
      {content.buttons}
    </div>
  )
};

Notification.defaultProps = {
  type: '',
  data: {},
}

export default Notification;
