import React, { Fragment } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import { oneOfType, arrayOf, shape, array, object, number, string, func } from 'prop-types';

import { Paginator } from 'components';
import STRINGS from 'config/localizedStrings';
import {
  formatAverage,
  formatToCurrency
} from 'utils/currency';
import withConfig from 'components/ConfigProvider/withConfig';

const MarketCards = ({ page, pageSize, count, handleClick, goToPreviousPage, goToNextPage, markets, icons: ICONS }) => {

    return (
        <Fragment>
          <div className="d-flex flex-wrap p-3 my-5">
            {markets.map((market, index) => {
              const {
                key,
                pair,
                symbol,
                pairTwo,
                fullname,
                ticker,
                increment_price,
                priceDifference,
                priceDifferencePercent,
              } = market;

              return (
                <div
                  key={index}
                  className={classnames('d-flex', 'trade-tab-list', 'pointer', {
                    'active-tab': index === 0
                  })}
                  onClick={() => handleClick(key)}
                >
                  <div className="px-2">
                    <ReactSVG
                      path={
                        ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
                          ? ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
                          : ICONS["DEFAULT_ICON"]
                      }
                      wrapperClassName="trade_tab-icons"
                    />
                  </div>
                  <div className="tabs-pair-details">
                    <div className="trade_tab-pair-title">
                      {symbol.toUpperCase()}/
                      {pairTwo.symbol ? pairTwo.symbol.toUpperCase() : ''}
                    </div>
                    <div>
                      {fullname}/{pairTwo.fullname}
                    </div>
                    <div>
                      {STRINGS["PRICE"]}:
                      <span className="title-font ml-1">
												{formatToCurrency(ticker.close, increment_price)}
											</span>
                    </div>
                    <div className="d-flex">
                      <div
                        className={
                          priceDifference < 0
                            ? 'price-diff-down trade-tab-price_diff_down'
                            : 'trade-tab-price_diff_up price-diff-up'
                        }
                      >
                        {formatAverage(formatToCurrency(priceDifference, increment_price))}
                      </div>
                      <div
                        className={
                          priceDifference < 0
                            ? 'title-font ml-1 price-diff-down'
                            : 'title-font ml-1 price-diff-up'
                        }
                      >
                        {`(${priceDifferencePercent})`}
                      </div>
                    </div>
                    <div>{`${STRINGS["CHART_TEXTS.v"]}: ${
                      ticker.volume
                      } ${symbol.toUpperCase()}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Paginator
            currentPage={page + 1}
            pageSize={pageSize}
            count={count}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
          />
        </Fragment>
    )
}

MarketCards.propTypes = {
  markets: oneOfType([
    arrayOf(shape({
      key: string,
      pair: object,
      symbol: string,
      pairTwo: object,
      fullname: string,
      ticker: object,
      increment_price: number,
      priceDifference: number,
      priceDifferencePercent: string,
    })),
    array
  ]).isRequired,
  handleClick: func.isRequired,
  goToPreviousPage: func.isRequired,
  goToNextPage: func.isRequired,
  page: number.isRequired,
  pageSize: number.isRequired,
  count: number.isRequired,
};

export default withConfig(MarketCards);