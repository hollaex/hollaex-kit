import React from 'react';
import classnames from 'classnames';
import { Button } from '../../components';

import STRINGS from '../../config/localizedStrings';

import { generateFiatInformation } from './utils';
import {
  renderBankInformation,
} from '../Wallet/components';

import { BANK_INFORMATION, BANK_PAYMENT_LINK } from '../../config/constants';

const ReviewBankDeposit = ({ data, onClickPay }) => {
  const { deposit_id } = data;
  return (
    <div className="d-flex flex-column review-wrapper">
      <div className="review-section">
        <div className="review-title">{STRINGS.formatString(STRINGS.DEPOSIT_METHOD, 1)}: {STRINGS.DEPOSIT_METHOD_DIRECT_PAYMENT}</div>
        <p>{STRINGS.DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1}</p>
        <p>{STRINGS.DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2}</p>
        <div className="d-flex justify-content-center">
          <a
            href={`${BANK_PAYMENT_LINK}${deposit_id}`}
            className="review-link"
          >
            <Button
              label={STRINGS.DEPOSIT_PROCEED_PAYMENT}
              onClick={onClickPay}
            />
          </a>
        </div>
      </div>
      {/*
        <div className="separator" />
        <div className="review-section">
          <div className="review-title">{STRINGS.formatString(STRINGS.DEPOSIT_METHOD, 2)}: {STRINGS.DEPOSIT_METHOD_MANUAL_TRANSFER}</div>
          {generateFiatInformation(deposit_id)}
          {renderBankInformation(BANK_INFORMATION, true)}
        </div>
        */}
    </div>
  );
}

export default ReviewBankDeposit;
