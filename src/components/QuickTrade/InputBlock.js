import React from 'react';
import classnames from 'classnames';
import NumericInput from 'react-numeric-input';

import { CurrencyBall } from '../../components';

import { FLEX_CENTER_CLASSES, CURRENCIES, LIMIT_VALUES } from '../../config/constants';
import { fiatShortName, fiatFormatToCurrency, fiatSymbol } from '../../utils/currency';

const InputBlock = ({ value, onChange, text, symbol, inputStyle, format, className }) => {
  const { shortName } = CURRENCIES[symbol];
  return (
    <div
      className={classnames('input_block-wrapper', ...FLEX_CENTER_CLASSES, 'flex-column', className, symbol)}
    >
      {text && <div className="font-weight-bold">{text}</div>}
      <div className={classnames('input_block-input-wrapper', ...FLEX_CENTER_CLASSES)}>
        <CurrencyBall
          symbol={symbol}
          name={shortName}
          size="s"
          className="input_block-currency_ball"
        />
        <NumericInput
          className="input_block-inputbox"
          onChange={onChange}
          placeholder={0.00}
          type="number"
          step={0.0001}
          value={value}
          min={LIMIT_VALUES.SIZE.MIN}
          max={LIMIT_VALUES.SIZE.MAX}
          style={inputStyle}
          format={format}
          snap
        />
      </div>
    </div>
  )
}

export default InputBlock;
