import React from 'react';
import classnames from 'classnames';
import { IconTitle, Button, CurrencyBall, ActionNotification } from '../';
import { NOTIFICATIONS } from '../../actions/appActions';
import { ICONS, CURRENCIES } from '../../config/constants';
import { getDepositTexts, NEED_HELP, BUTTON_TEXTS } from './constants';
import {
  calculatePrice, fiatFormatToCurrency, fiatShortName, fiatSymbol,
} from '../../utils/currency';

const Header = ({ icon, text }) => (
  <div className="notification-title-wrapper d-flex flex-column">
    <div className="notification-title-icon f-1 d-flex justify-content-center align-items-center">
      <img src={icon} alt="" className=""/>
    </div>
    <div className="notification-title-text">{text}</div>
  </div>
);

const DepositContent = ({ information, content, amount, symbol, price }) => {
  const { shortName, formatToCurrency } = CURRENCIES[symbol];
  return (
    <div className="notification-content-wrapper">
      <div className="notification-content-header">
        {information}
        <ActionNotification
          text={NEED_HELP}
          status="information"
          iconPath={ICONS.BLUE_QUESTION}
        />
      </div>
      {content}
      <div className="notification-content-block_amount d-flex">
        <CurrencyBall name={shortName} symbol={symbol} size="m" />
        <div className="notification-content-block_amount-value d-flex">
          {`${formatToCurrency(amount)}`}
          {symbol !== 'fiat' &&
            <div className="notification-content-block_amount-value-fiat d-flex align-items-end">
              {` ~ ${fiatFormatToCurrency(calculatePrice(amount, price))} ${fiatShortName}`}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

const generateNotificationContent = ({ type, data, onClose, goToPage }) => {
  const content = {};
  switch (type) {
    case NOTIFICATIONS.DEPOSIT:
      const depositTexts = getDepositTexts(data.currency, data.status);

      content.header = {
        text: depositTexts.title,
        icon: ICONS.RED_WARNING,
      }
      const childrenProps = {
        symbol: data.currency,
        amount: data.amount,
        information: depositTexts.subtitle,
        price: data.price,
        content: (
          <div>
            {depositTexts.information && depositTexts.information.join('\n')}
          </div>
        )
      };
      content.children = <DepositContent {...childrenProps} />;
      content.buttons = (
        <div className="notification-buttons-wrapper d-flex">
          <Button
            label={BUTTON_TEXTS.OKAY}
            onClick={onClose}
          />
          <Button
            className={classnames(`button-${data.currency}`)}
            label={data.currency === fiatSymbol ? BUTTON_TEXTS.START_TRADING : BUTTON_TEXTS.SEE_HISTORY }
            onClick={() => {
              goToPage(data.currency === fiatSymbol ? 'trade' : 'transactions');
              onClose();
            }}
          />
        </div>
      )
    case NOTIFICATIONS.ORDERS:
    case NOTIFICATIONS.TRADES:
    case NOTIFICATIONS.WITHDRAWAL:
    default:
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
