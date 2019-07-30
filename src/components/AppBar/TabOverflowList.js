import React, { Component } from 'react';
import ReactSVG from 'react-svg';

import { ICONS, BASE_CURRENCY } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { formatToCurrency, formatPercentage, formatAverage } from '../../utils/currency';

let tickClicked = false;

class TabOverflowList extends Component {

    componentDidMount() {
        document.addEventListener('click', this.onOutsideClick);
    }

    onOutsideClick = event => {
        const element = document.getElementById('tab-overflow-list');
        if (element &&
            event.target !== element &&
            !element.contains(event.target) &&
            !tickClicked) {
                this.props.closeOverflowMenu();
        }
        if (tickClicked) {
            tickClicked = false;
        }
    };

    onOverflow = pair => {
        tickClicked = true;
        this.props.handleOverflow(pair);
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.onOutsideClick);
    }

    render() {
        const { selectedTabs, activePairTab, tickers, coins = {} } = this.props;
        return (
            <div id="tab-overflow-list" className="app-bar-add-tab-menu">
                <div className="app-bar-tab-overflow-content">
                    {Object.keys(selectedTabs).map((pair, index) => {
                        let menu = selectedTabs[pair] || {};
                        let { min } = coins[menu.pair_base || BASE_CURRENCY] || {};
                        let ticker = tickers[pair] || {};
                        let priceDifference = (ticker.close || 0) - (ticker.open || 0);
                        const tickerPercent = ((priceDifference / ticker.open) * 100);
                        let priceDifferencePercent = tickerPercent==='NaN' ? formatPercentage(tickerPercent) : formatPercentage(0);
                        return (
                            <div
                                key={index}
                                className="app-bar-add-tab-content-list d-flex align-items-center"
                                onClick={() => this.onOverflow(pair)}>
                                {pair === activePairTab
                                    ? <ReactSVG path={ICONS.BLACK_CHECK} wrapperClassName="app-bar-tab-setting" />
                                    : <div className="app-bar-tab-setting"> </div>
                                }
                                <ReactSVG path={ICONS[`${menu.pair_base.toUpperCase()}_ICON`]} wrapperClassName="app-bar-add-tab-icons" />
                                <div className="app_bar-pair-font">
                                    {STRINGS[`${menu.pair_base.toUpperCase()}_SHORTNAME`]}/{STRINGS[`${menu.pair_2.toUpperCase()}_SHORTNAME`]}:
                                </div>
                                <div className="title-font ml-1">{`${STRINGS[`${menu.pair_2.toUpperCase()}_CURRENCY_SYMBOL`]} ${formatAverage(formatToCurrency(ticker.close, min))}`}</div>
                                <div className={priceDifference < 0 ? "app-price-diff-down app-bar-price_diff_down" : "app-bar-price_diff_up app-price-diff-up"}>
                                    {formatAverage(formatToCurrency(priceDifference, min))}
                                </div>
                                <div
                                    className={priceDifference < 0
                                        ? "title-font ml-1 app-price-diff-down" : "title-font ml-1 app-price-diff-up"}>
                                    {`(${priceDifferencePercent})`}
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
        );
    }
};

export default TabOverflowList;