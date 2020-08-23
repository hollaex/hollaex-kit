import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import { Link } from 'react-router';

import { Slider } from 'components';
import { ICONS, BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { donutFormatPercentage, formatToCurrency } from 'utils/currency';
import SearchBox from './SearchBox';

class AddTabList extends Component {

    componentDidMount() {
        document.addEventListener('click', this.onOutsideClick);
    }

    onOutsideClick = event => {
        const element = document.getElementById('add-tab-list-menu');
        if (element &&
            event.target !== element &&
            !element.contains(event.target)) {
                this.props.closeAddTabMenu();
        }
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.onOutsideClick);
    }

    tabListMenuItems = () => {
      const { symbols, selectedTabMenu, onAddTabClick } = this.props;
      return symbols.map((symbol, index) =>
      <div
        key={index}
        className={classnames(
          "app-bar-tab-menu-list",
          "d-flex",
          "align-items-center",
          { 'active-tab': symbol === selectedTabMenu })}
        onClick={() => onAddTabClick(symbol)}
      >
        {symbol.toUpperCase()}
      </div>
    )}

    render() {
        const {
            pairs,
            coins = {},
            selectedTabs,
            selectedTabMenu,
            searchValue,
            searchResult,
            tickers = {},
            handleSearch,
            addTradePairTab,
            closeAddTabMenu
        } = this.props;

        let tabMenu = {};
        if (searchValue) {
            tabMenu = { ...searchResult };
        } else if ( selectedTabMenu === 'all') {
          Object.keys(pairs).map(key => {
            let temp = pairs[key];
            if (temp) {
              tabMenu[key] = temp;
            }
            return key;
          });
        } else {
            Object.keys(pairs).map(key => {
                let temp = pairs[key];
                if (temp && temp.pair_2 === selectedTabMenu) {
                    tabMenu[key] = temp;
                }
                return key;
            });
        }

        const tabMenuLength = Object.keys(tabMenu).length;
        const hasTabMenu = tabMenuLength !== 0;

        let processedTabMenu = [];
        if (hasTabMenu) {
          processedTabMenu = Object.keys(tabMenu)
            .map((pair) => {
              let menu = tabMenu[pair] || {};
              let ticker = tickers[pair] || {};
              let { symbol = '' } = coins[menu.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
              let pairTwo = coins[menu.pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
              const { increment_price } = menu;
              const priceDifference = ticker.open === 0 ? 0 : ((ticker.close || 0) - (ticker.open || 0));
              const tickerPercent = priceDifference === 0 || ticker.open === 0 ? 0 : ((priceDifference / ticker.open) * 100);
              const priceDifferencePercent = isNaN(tickerPercent)
                ? donutFormatPercentage(0)
                : donutFormatPercentage(tickerPercent);
              return ({
                pair,
                symbol,
                menu,
                pairTwo,
                ticker,
                increment_price,
                priceDifference,
                priceDifferencePercent
              })
            })
            .sort((a, b) => {
              const { volume: volumeA = 0 } = tickers[a.pair] || {};
              const { volume: volumeB = 0 } = tickers[b.pair] || {};
              return volumeB - volumeA;
            })
            .slice(0, Math.min(tabMenuLength, 10))
        }

        const selectedtabPairs = Object.keys(selectedTabs);

        return (
            <div id="add-tab-list-menu" className={classnames("app-bar-add-tab-menu", { "tab-menu-left": selectedtabPairs.length <= 1 })}>
                <div className="app-bar-tab-menu">
                    <Slider small>
                      {this.tabListMenuItems()}
                    </Slider>
                    {/*<div className="d-flex align-items-center mr-2">*/}
                      {/*<ReactSVG*/}
                        {/*path={ICONS.TAB_SETTING}*/}
                        {/*wrapperClassName="app-bar-tab-setting"*/}
                      {/*/>*/}
                    {/*</div>*/}
                </div>
                <div className="app-bar-add-tab-content">
                    <div className="app-bar-add-tab-search">
                        <SearchBox
                            name={STRINGS.SEARCH_TXT}
                            placeHolder={`${STRINGS.SEARCH_TXT}...`}
                            className='app-bar-search-field'
                            handleSearch={handleSearch} />
                    </div>
                    {hasTabMenu
                        ? processedTabMenu.map(({ pair, symbol, menu, pairTwo, ticker, increment_price, priceDifference, priceDifferencePercent }, index) => {
                            return (
                                <div
                                    key={index}
                                    className="app-bar-add-tab-content-list d-flex align-items-center justify-content-between"
                                    onClick={() => addTradePairTab(pair)}
                                >
                                    <div className="d-flex align-items-center">
                                        <ReactSVG
                                          path={
                                            ICONS[`${menu.pair_base.toUpperCase()}_ICON`]
                                              ? ICONS[`${menu.pair_base.toUpperCase()}_ICON`]
                                              : ICONS.DEFAULT_ICON
                                          }
                                          wrapperClassName="app-bar-add-tab-icons" />
                                        <div className="app_bar-pair-font">
                                          {symbol.toUpperCase()}/{pairTwo.symbol.toUpperCase()}:
                                        </div>
                                        <div className="title-font ml-1 app-bar_add-tab-price">
                                          {formatToCurrency(ticker.close, increment_price)}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mr-4">
                                        <div
                                          className={
                                            priceDifference < 0
                                              ? "app-price-diff-down app-bar-price_diff_down"
                                              : "app-bar-price_diff_up app-price-diff-up"
                                          }>
                                          {/* {formatAverage(formatToCurrency(priceDifference, increment_price))} */}
                                        </div>
                                        <div
                                          className={priceDifference < 0
                                            ? "title-font app-price-diff-down" : "title-font app-price-diff-up"}>
                                          {priceDifferencePercent}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        )
                        : <div className="app-bar-add-tab-content-list d-flex align-items-center">
                            No data...
                        </div>
                    }
                    <div className="d-flex justify-content-center app_bar-link">
                        <Link to="/trade/add/tabs" onClick={() => closeAddTabMenu()}>
                          {`view markets`}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
};

export default AddTabList;