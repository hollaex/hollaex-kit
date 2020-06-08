import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { ICONS, BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { donutFormatPercentage, formatToCurrency } from '../../utils/currency';
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

    handleChange = pair => {
        this.props.onTabChange(pair);
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.onOutsideClick);
    }

    render() {
        const { symbols, pairs, coins = {}, selectedTabs, selectedTabMenu, searchValue, searchResult, tickers = {}, onAddTabClick, handleSearch } = this.props;
        let tabMenu = {};
        if (searchValue) {
            tabMenu = { ...searchResult };
        } else {
            Object.keys(pairs).map(key => {
                let temp = pairs[key];
                if (temp && temp.pair_base === selectedTabMenu) {
                    tabMenu[key] = temp;
                }
                return key;
            });
        }
        const selectedtabPairs = Object.keys(selectedTabs);

        return (
            <div id="add-tab-list-menu" className={classnames("app-bar-add-tab-menu", { "tab-menu-left": !selectedtabPairs.length })}>
                <div className="app-bar-tab-menu d-flex justify-content-between">
                    <div className="d-flex overflow-x">
                        {symbols.map((symbol, index) =>
                            <div
                                key={index}
                                className={classnames(
                                    "app-bar-tab-menu-list",
                                    "d-flex",
                                    "align-items-center",
                                    { 'active-tab': symbol === selectedTabMenu })}
                                onClick={() => onAddTabClick(symbol)}>
                                {symbol.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="d-flex align-items-center mr-2">
                        {/* <ReactSVG
                            path={ICONS.TAB_SETTING}
                            wrapperClassName="app-bar-tab-setting" /> */}
                    </div>
                </div>
                <div className="app-bar-add-tab-content">
                    <div className="app-bar-add-tab-search">
                        <SearchBox
                            name={STRINGS.SEARCH_TXT}
                            placeHolder={`${STRINGS.SEARCH_TXT}...`}
                            className='app-bar-search-field'
                            handleSearch={handleSearch} />
                    </div>
                    {Object.keys(tabMenu).length
                        ? Object.keys(tabMenu).map((pair, index) => {
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
                            return (
                                <div
                                    key={index}
                                    className="app-bar-add-tab-content-list d-flex align-items-center"
                                    onClick={() => this.handleChange(pair)}>
                                    <div>
                                        {selectedTabs[pair]
                                            ? <ReactSVG path={ICONS.TAB_MINUS} wrapperClassName="app-bar-tab-setting" />
                                            : <ReactSVG path={ICONS.TAB_PLUS} wrapperClassName="app-bar-tab-setting" />
                                        }
                                    </div>
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
                                    <div className="title-font ml-1">
                                        {formatToCurrency(ticker.close, increment_price)}
                                    </div>
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
                            )
                        }
                        )
                        : <div className="app-bar-add-tab-content-list d-flex align-items-center">
                            No data...
                        </div>
                    }
                </div>
            </div>
        );
    }
};

export default AddTabList;