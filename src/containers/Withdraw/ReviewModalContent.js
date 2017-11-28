import React from 'react';
import { Button } from '../../components';
import { fiatSymbol } from '../../utils/currency';
import { CURRENCIES, ICONS } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

const ButtonSection = ({ onClickAccept, onClickCancel }) => {
  return (
    <div className="d-flex">
      <Button
        label="X"
        onClick={onClickCancel}
        className="button-fail"
      />
      <div className="button-separator" />
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
          <div className="d-flex flex-column align-items-center review-info_container">
            <div className="review-info_message">{STRINGS.WITHDRAW_PAGE.MESSAGE_ABOUT_WITHDRAW}</div>
            <div className="review-crypto-amount">{`${formatToCurrency(data.amount)} ${shortName}`}</div>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center review-info_container">
            <div className="review-info_message">{STRINGS.WITHDRAW_PAGE.MESSAGE_ABOUT_SEND}</div>
            <div className="review-crypto-amount">{`${formatToCurrency(data.amount)} ${shortName}`}</div>
            <div className="review-warning_arrow"></div>
            <div className="review-crypto-address">{data.address}</div>
            <div className="warning_text review-info_message">{STRINGS.formatString(STRINGS.WITHDRAW_PAGE.MESSAGE_BTC_WARNING, name)}</div>
          </div>
        )
      }
      <ButtonSection
        onClickAccept={onClickAccept}
        onClickCancel={onClickCancel}
      />
    </div>
  );
}

ReviewModalContent.defaultProps = {
  data: {},
  onClickAccept: () => {},
  onClickCancel: () => {},
}

export default ReviewModalContent;
