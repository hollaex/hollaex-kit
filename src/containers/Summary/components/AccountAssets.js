import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DonutChart } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { CURRENCIES, BASE_CURRENCY } from '../../../config/constants';
import { formatFiatAmount, calculateBalancePrice, formatPercentage, calculatePrice, calculatePricePercentage } from '../../../utils/currency';

class AccountAssets extends Component {
    state = {
        chartData: [],
        totalAssets: '',
        chartBalance: [],
        allData: {}
    }

    componentDidMount() {
        const { user_id, symbol, price } = this.props;
        if (user_id && symbol && price) {
            this.calculateSections(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.user_id !== this.props.user_id ||
            nextProps.price !== this.props.price ||
            nextProps.orders.length !== this.props.orders.length ||
            nextProps.balance.timestamp !== this.props.balance.timestamp ||
            nextProps.activeLanguage !== this.props.activeLanguage
        ) {
            this.calculateSections(nextProps);
        }
    }

    calculateSections = ({ price, balance, orders, prices }) => {
        const data = [];
        const chartBalance = [];

        const totalAssets = calculateBalancePrice(balance, prices);
        Object.keys(CURRENCIES).forEach((currency) => {
            const { symbol, formatToCurrency } = CURRENCIES[currency];
            const currencyBalance = calculatePrice(balance[`${symbol}_balance`], prices[currency]);
            const balancePercent = calculatePricePercentage(currencyBalance, totalAssets);
            chartBalance.push(balancePercent);
            data.push({
                ...CURRENCIES[currency],
                balance: formatToCurrency(currencyBalance),
                balancePercentage: formatPercentage(balancePercent),
            });
        });

        this.setState({ chartData: data, totalAssets: formatFiatAmount(totalAssets), chartBalance });
    };

    render() {
        const { chartData, chartBalance, totalAssets } = this.state;
        return (
            <div className="summary-section_2">
                <div className="summary-content-txt assets-description">
                    <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_1}</div>
                    <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_2}</div>
                </div>
                <div className="w-100 h-100">
                    {BASE_CURRENCY && <DonutChart data={chartBalance} chartData={chartData} />}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    balance: state.user.balance,
    prices: state.orderbook.prices,
    symbol: state.orderbook.symbol,
    price: state.orderbook.price,
    orders: state.order.activeOrders,
    user_id: state.user.id,
    activeLanguage: state.app.language,
    pairs: state.app.pairs
});

export default connect(mapStateToProps)(AccountAssets);