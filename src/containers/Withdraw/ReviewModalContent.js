import React from 'react';
import { Button } from '../../components';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';
import { CURRENCIES, ICONS } from '../../config/constants';

const MESSAGE_ABOUT_SEND = 'You are about to send';
const MESSAGE_WARNING_1 = 'Please ensure the accuracy of this address since';
const MESSAGE_WARNING_2 = 'transfers are irreversible';
const renderButtons = (onClickAccept, onClickCancel) => {
  return (
    <div className="d-flex buttons-row">
      <Button
        label="X"
        onClick={onClickCancel}
        className="button-fail"
      />
      <Button
        label="V"
        onClick={onClickAccept}
        className="button-success"
      />
    </div>
  )
}

const ReviewModalContent = ({ symbol, data, onClickAccept, onClickCancel }) => {
  const { shortName, name, formatToCurrency } = CURRENCIES[symbol];
  return (
    <div className="d-flex flex-column review-wrapper">
      <img src={ICONS.SQUARE_DOTS} alt="review" className="review-icon" />
      {symbol === fiatSymbol ?
        (
          <div>
            Review USD
            {JSON.stringify(data)}
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center review-info_container">
            <div className="review-info_message">{MESSAGE_ABOUT_SEND}</div>
            <div className="review-crypto-amount">{`${formatToCurrency(data.amount)} ${shortName}`}</div>
            <div className="review-warning_arrow"></div>
            <div className="review-crypto-address">{data.address}</div>
            <div className="warning_text review-info_message">{`${MESSAGE_WARNING_1} ${name} ${MESSAGE_WARNING_2}`}</div>
          </div>
        )
      }
      {renderButtons(onClickAccept, onClickCancel)}
    </div>
  );
}

ReviewModalContent.defaultProps = {
  data: {},
  onClickAccept: () => {},
  onClickCancel: () => {},
}

export default ReviewModalContent;
