import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { Paginator, SearchBox } from '../../components';
import { HOLLAEX_LOGO, HOLLAEX_LOGO_BLACK } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { formatPercentage } from '../../utils/currency';

class AddTradeTab extends Component {
    state = {
        page: 0,
        pageSize: 9,
        data: [],
        count: 0
    };

    componentDidMount() {
        this.goToPage(this.props.pairs, this.props.tickers, this.state.page);
    }

    componentWillReceiveProps(nextProps) {
        if ((JSON.stringify(this.props.pairs) !== JSON.stringify(nextProps.pairs)
            || (JSON.stringify(this.props.tickers) !== JSON.stringify(nextProps.tickers)))) {
            this.goToPage(nextProps.pairs, nextProps.tickers, this.state.page);
        }
    }

    goToPage = (pairs, tickers, page) => {
        
        const { pageSize } = this.state;
        const pairKeys = Object.keys(pairs).sort((a, b) => {
            let tickA = tickers[a] || {};
            let tickB = tickers[b] || {};
            return tickB.volume - tickA.volume;
        });
        const count = pairKeys.length;
        const initItem = page * pageSize;
        if (initItem < count) {
            const data = pairKeys.slice(initItem, initItem + pageSize);
            this.setState({ data, page, count });
        }
    };

    goToPreviousPage = () => {
        this.goToPage(
            this.props.pairs,
            this.props.tickers,
            this.state.page - 1
        );
    };

    goToNextPage = () => {
        this.goToPage(
            this.props.pairs,
            this.props.tickers,
            this.state.page + 1
        );
    };

    handleTabSearch = () => {
    };

    render() {
        const { activeTheme, pairs, tickers } = this.props;
        const { page, pageSize, count, data } = this.state;
        return (
            <div className="trade_tabs-container">
                <div className="mb-5">
                    <img
                        src={activeTheme === 'dark' ? HOLLAEX_LOGO : HOLLAEX_LOGO_BLACK}
                        alt="app logo"
                        className="app-icon d-flex" />
                    <div className="text-center">{STRINGS.APP_SUB_TITLE.toUpperCase()}</div>
                </div>
                <div className="trade_tabs-content">
                    <div className="d-flex justify-content-end">
                        <span className="trade_tabs-link link-separator">
                            <Link to="/quick-trade/btc-eur">{STRINGS.QUICK_TRADE}</Link>
                        </span>
                        <span className="trade_tabs-link link-separator">
                            <Link to="/account">{STRINGS.ACCOUNTS.TITLE}</Link>
                        </span>
                        <span className="trade_tabs-link">
                            <Link to="/wallet">{STRINGS.WALLET_TITLE}</Link>
                        </span>
                    </div>
                    <div >
                        <SearchBox
                            name={STRINGS.SEARCH_ASSETS}
                            className="trade_tabs-search-field"
                            placeHolder={`${STRINGS.SEARCH_ASSETS}...`}
                            handleSearch={this.handleTabSearch}
                        />
                    </div>
                    <div className="d-flex flex-wrap p-3 my-3">
                        {data.map((key, index) => {
                            let pair = pairs[key];
                            let ticker = tickers[key] || {};
                            const priceDifference = ticker.close - ticker.open;
                            const priceDifferencePercent = formatPercentage((ticker.close - ticker.open) / ticker.open);
                            return (
                                <div key={index} className={classnames("d-flex", "trade-tab-list", { "active-tab": index === 0 })}>
                                    <div className="px-2">
                                        <ReactSVG path={ICONS[`${pair.pair_base.toUpperCase()}_ICON`]} wrapperClassName="trade_tab-icons" />
                                    </div>
                                    <div className="tabs-pair-details">
                                        <div className="trade_tab-pair-title">
                                            {STRINGS[`${pair.pair_base.toUpperCase()}_SHORTNAME`]}/{STRINGS[`${pair.pair_2.toUpperCase()}_SHORTNAME`]}
                                        </div>
                                        <div>
                                            {STRINGS[`${pair.pair_base.toUpperCase()}_FULLNAME`]}/{STRINGS[`${pair.pair_2.toUpperCase()}_FULLNAME`]}
                                        </div>
                                        <div>{STRINGS.PRICE}:<span className="title-font ml-1">{`T ${ticker.close}`}</span></div>
                                        <div className="d-flex">
                                            <div className={priceDifference < 0 ? "price-diff-down trade-tab-price_diff_down" : "trade-tab-price_diff_up price-diff-up"}>
                                                {priceDifference}
                                            </div>
                                            <div
                                                className={priceDifference < 0
                                                    ? "title-font ml-1 price-diff-down" : "title-font ml-1 price-diff-up"}>
                                                {`(${priceDifferencePercent})`}
                                            </div>
                                        </div>
                                        <div>{`${STRINGS.CHART_TEXTS.v}: ${ticker.volume} ${STRINGS.BTC_SHORTNAME}`}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <Paginator
                        currentPage={page + 1}
                        pageSize={pageSize}
                        count={count}
                        goToPreviousPage={this.goToPreviousPage}
                        goToNextPage={this.goToNextPage}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store) => ({
    activeTheme: store.app.theme,
    pairs: store.app.pairs,
    tickers: store.app.tickers
});

export default connect(mapStateToProps)(AddTradeTab);