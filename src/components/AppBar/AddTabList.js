import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { ICONS, CURRENCIES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { formatPercentage } from '../../utils/currency';
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
        const { symbols, pairs, selectedTabs, selectedTabMenu, searchValue, searchResult, tickers = {}, onAddTabClick, handleSearch } = this.props;
        let tabMenu = {};
        if (searchValue) {
            tabMenu = { ...searchResult };
        } else {
            Object.keys(pairs).map(key => {
                let temp = pairs[key];
                if (temp && temp.pair_base === selectedTabMenu){
                    tabMenu[key] = temp;
                }
                return key;
            });
        }
        const selectedtabPairs = Object.keys(selectedTabs);
    
        return (
            <div id="add-tab-list-menu" className={classnames("app-bar-add-tab-menu", { "tab-menu-left": !selectedtabPairs.length })}>
                <div className="app-bar-tab-menu d-flex justify-content-between">
                    <div className="d-flex">
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
                            let menu = tabMenu[pair];
                            let ticker = tickers[pair];
                            let { formatToCurrency } = CURRENCIES[menu.pair_base];
                            const priceDifference = ticker.close - ticker.open;
                            const priceDifferencePercent = formatPercentage((ticker.close - ticker.open) / ticker.open);
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
                                    <ReactSVG path={ICONS[`${menu.pair_base.toUpperCase()}_ICON`]} wrapperClassName="app-bar-add-tab-icons" />
                                    <div className="app_bar-pair-font">
                                        {STRINGS[`${menu.pair_base.toUpperCase()}_SHORTNAME`]}/{STRINGS[`${menu.pair_2.toUpperCase()}_SHORTNAME`]}:
                                    </div>
                                    <div className="title-font ml-1">{`${STRINGS[`${menu.pair_2.toUpperCase()}_CURRENCY_SYMBOL`]} ${formatToCurrency(ticker.close)}`}</div>
                                    <div className={priceDifference < 0 ? "app-price-diff-down app-bar-price_diff_down" : "app-bar-price_diff_up app-price-diff-up"}>
                                        {formatToCurrency(priceDifference)}
                                    </div>
                                    <div
                                        className={priceDifference < 0
                                            ? "title-font ml-1 app-price-diff-down" : "title-font ml-1 app-price-diff-up"}>
                                        {`(${priceDifferencePercent})`}
                                    </div>
                                </div>
                            )}
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