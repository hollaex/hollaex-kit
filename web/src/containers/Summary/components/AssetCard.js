import React from 'react';
import ReactSVG from "react-svg";
import classnames from "classnames";

import {
  BASE_CURRENCY,
  ICONS,
  FLEX_CENTER_CLASSES,
} from "config/constants";
import { formatAverage } from "utils/currency";

const AssetCard = ({ value, currencyBalance, symbol }) => {
    return (
      <div className="price-content text-center">
        <div
          className={classnames(
            "coin-price-container",
            FLEX_CENTER_CLASSES
          )}
        >
          <ReactSVG
            path={
              ICONS[`${value.symbol.toUpperCase()}_ICON`]
                ? ICONS[`${value.symbol.toUpperCase()}_ICON`]
                : ICONS.DEFAULT_ICON}
            wrapperClassName="coin-price"
          />
        </div>
        <div className="price-text">
          {`${symbol.toUpperCase()} ${formatAverage(currencyBalance)}`}
        </div>
        {value.symbol !== BASE_CURRENCY && (
          <div className="price-text">{`~${formatAverage(value.balanceFormat)}`}</div>
        )}
      </div>
    )
}

export default AssetCard;