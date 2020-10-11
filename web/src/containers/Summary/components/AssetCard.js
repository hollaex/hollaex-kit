import React from 'react';
import ReactSVG from "react-svg";
import classnames from "classnames";
import { EditWrapper } from 'components';

import { BASE_CURRENCY, FLEX_CENTER_CLASSES } from "config/constants";
import { formatAverage } from "utils/currency";
import withConfig from 'components/ConfigProvider/withConfig';

const AssetCard = ({ value, currencyBalance, symbol, icons: ICONS }) => {
    return (
      <div className="price-content text-center">
        <div
          className={classnames(
            "coin-price-container",
            FLEX_CENTER_CLASSES
          )}
        >
          <EditWrapper iconId={
            ICONS[`${value.symbol.toUpperCase()}_ICON`]
              ? `${value.symbol.toUpperCase()}_ICON`
              : "DEFAULT_ICON"
          }>
            <ReactSVG
              path={
                ICONS[`${value.symbol.toUpperCase()}_ICON`]
                  ? ICONS[`${value.symbol.toUpperCase()}_ICON`]
                  : ICONS["DEFAULT_ICON"]}
              wrapperClassName="coin-price"
            />
          </EditWrapper>
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

export default withConfig(AssetCard);