import moment from 'moment';
import { calculatePrice } from '../../../utils/currency';

export const getTradeVolumeTotal = (tradeData, prices, pairs) => {
    let totalVolume = 0;
    Object.keys(tradeData).map((month) => {
        let trade = tradeData[month];
        if (trade) {
            let total = 0;
            Object.keys(trade).map((pair) => {
                let pairValue = pairs[pair] || {};
                let volumeObj = trade[pair] || {};
                let pairPrice = calculatePrice(volumeObj.volume, prices[pairValue.pair_base]);
                total += pairPrice;
                return total;
            });
            totalVolume += total;
        }
        return month;
    })
    return totalVolume;
};

export const getLastMonthVolume = (tradeData = {}, prices = {}, pairs = {}) => {
    const month = moment().subtract(1, 'month').format('M');
    const trade = tradeData[month];
    let total = 0;
    if (trade) {
        Object.keys(trade).map((pair) => {
            let pairValue = pairs[pair] || {};
            let volumeObj = trade[pair] || {};
            let pairPrice = calculatePrice(volumeObj.volume, prices[pairValue.pair_base]);
            total += pairPrice;
            return total;
        });
    }
    return total;
};
