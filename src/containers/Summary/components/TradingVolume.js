import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import STRINGS from '../../../config/localizedStrings';
import { getTradeVolume } from '../../../actions/userAction';
import { BarChart } from '../../../components';
import { calculatePrice, formatCurrency } from '../../../utils/currency';

const monthObj = [
    { key: 1, value: 'Jan' },
    { key: 2, value: 'Feb' },
    { key: 3, value: 'Mar' },
    { key: 4, value: 'Apr' },
    { key: 5, value: 'May' },
    { key: 6, value: 'Jun' },
    { key: 7, value: 'Jul' },
    { key: 8, value: 'Aug' },
    { key: 9, value: 'Sep' },
    { key: 10, value: 'Oct' },
    { key: 11, value: 'Nov' },
    { key: 12, value: 'Dec' },
];

class TradingVolume extends Component {
    state = {
        chartData: []
    };

    componentDidMount() {
        this.props.getTradeVolume();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.tradeVolumes) !== JSON.stringify(nextProps.tradeVolumes)) {
            this.constructData(nextProps.tradeVolumes.data);
        }
    }

    constructData = tradeValues => {
        const { pairs, prices } = this.props;
        const chartData = [];
        if (Object.keys(tradeValues).length) {
            monthObj.map((obj, key) => {
                let trade = tradeValues[obj.key];
                let data = {
                    key: obj.key,
                    month: obj.value
                }
                if (trade) {
                    let total = 0;
                    Object.keys(trade).map((pair) => {
                        let pairValue = pairs[pair];
                        let volumeObj = trade[pair];
                        let pairPrice = calculatePrice(volumeObj.volume, prices[pairValue.pair_base]);
                        data[pairValue.pair_base] = pairPrice;
                        total += pairPrice;
                    });
                    data.total = total;
                } else {
                    data.total = 0;
                }
                chartData.push(data);
            });
            this.setState({ chartData });
        }
    };

    render() {
        return (
            <div className="summary-section_2">
                <div className="summary-content-txt">
                    <div>{STRINGS.SUMMARY.TRADING_VOLUME_TXT_1}</div>
                    <div>{STRINGS.SUMMARY.TRADING_VOLUME_TXT_2}</div>
                </div>
                <div style={{ height: '35rem' }} className="w-100">
                    <BarChart chartData={this.state.chartData} />
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    tradeVolumes: state.user.tradeVolumes,
    pairs: state.app.pairs,
    prices: state.orderbook.prices
});

const mapDispatchToProps = dispatch => ({
    getTradeVolume: bindActionCreators(getTradeVolume, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TradingVolume);
