'use strict';
const { getOrderbook, getKitPairsConfig } = require('./hollaex-tools-lib/tools/common');
const math = require('mathjs');
const getDecimals = (value = 0) => {
    if (Math.floor(value) === value) return 0;

    let str = value.toString();
    if (str.indexOf('.') !== -1 && str.indexOf('-') !== -1) {
        return str.split('-')[1] || 0;
    } else if (str.indexOf('.') !== -1) {
        return str.split('.')[1].length || 0;
    }
    return str.split('-')[1] || 0;
};
const sumQuantities = (orders) =>
    orders.reduce((total, [, size]) => math.add(total, size), 0);

const sumOrderTotal = (orders) =>
    orders.reduce(
        (total, [price, size]) =>
            math.add(
                total,
                math.number(math.multiply(math.fraction(size), math.fraction(price)))
            ),
        0
    );

const roundNumber = (number = 0, decimals = 4) => {
    if (number === 0 || number === Infinity || isNaN(number)) {
        return 0;
    } else if (decimals > 0) {
        const multipliedNumber = math.multiply(
            math.fraction(number),
            math.pow(10, decimals)
        );
        const dividedNumber = math.divide(
            math.floor(multipliedNumber),
            math.pow(10, decimals)
        );
        return math.number(dividedNumber);
    } else {
        return math.floor(number);
    }
};
const estimatedQuickTradePriceSelector = ({ pairsOrders, pair, side, size, isFirstAsset }) => {
    const { [side === 'buy' ? 'asks' : 'bids']: orders = [] } =
        pairsOrders[pair] || {};

    let totalOrders = sumQuantities(orders);
    if (!isFirstAsset) {
        totalOrders = sumOrderTotal(orders);
    }
    if (math.larger(size, totalOrders)) {
        return [0, size];
    } else if (!isFirstAsset) {
        const [priceValue, sizeValue] = calculateMarketPriceByTotal(size, orders);
        return [priceValue / sizeValue, sizeValue];
    } else {
        const [priceValue, sizeValue] = calculateMarketPrice(size, orders);
        return [priceValue / sizeValue, sizeValue];
    }
}

const setPriceEssentials = async (priceEssentials, opts) => {
    const pairsOrders = await getOrderbook(priceEssentials.pair, opts);

    const pair = priceEssentials.pair;
    const side = priceEssentials.side;
    const isSourceChanged = priceEssentials.isSourceChanged;
    const pairData = getKitPairsConfig()[pair] || {};
    let priceValues = {};

    const decimalPoint = getDecimals(pairData.increment_size);
    let [estimatedPrice] = estimatedQuickTradePriceSelector({
        pairsOrders,
        pair,
        side,
        size: priceEssentials.size,
        isFirstAsset: side === 'buy' ? !isSourceChanged : isSourceChanged,
    });
    let sourceAmount = priceEssentials.sourceAmount;
    let targetAmount = priceEssentials.targetAmount;
    if (side === 'buy') {
        if (estimatedPrice) {
            if (isSourceChanged) {
                targetAmount = roundNumber(
                    sourceAmount / estimatedPrice,
                    decimalPoint
                );
            } else {
                sourceAmount = roundNumber(
                    targetAmount * estimatedPrice,
                    decimalPoint
                );
            }
        }
        priceValues = {
            ...priceValues,
            sourceAmount,
            targetAmount,
            estimatedPrice,
        };
    } else {
        if (estimatedPrice) {
            if (isSourceChanged) {
                targetAmount = roundNumber(
                    sourceAmount * estimatedPrice,
                    decimalPoint
                );
            } else {
                sourceAmount = roundNumber(
                    targetAmount / estimatedPrice,
                    decimalPoint
                );
            }
        }
        priceValues = {
            ...priceValues,
            sourceAmount,
            targetAmount,
            estimatedPrice,
        };
    }

    const responsePayload = {
        ...priceEssentials,
        side,
        isSourceChanged,
        ...priceValues,
    }

    return responsePayload;
};

const calculateMarketPriceByTotal = (orderSize = 0, orders = []) =>
    orders.reduce(
        ([accumulatedPrice, accumulatedSize], [price = 0, size = 0]) => {
            if (math.larger(orderSize, accumulatedPrice)) {
                let currentTotal = math.multiply(size, price);
                const remainingSize = math.subtract(orderSize, accumulatedPrice);
                if (math.largerEq(remainingSize, currentTotal)) {
                    return [
                        math.sum(accumulatedPrice, currentTotal),
                        math.sum(accumulatedSize, size),
                    ];
                } else {
                    let remainingBaseSize = math.divide(remainingSize, price);
                    return [
                        math.sum(accumulatedPrice, math.multiply(remainingBaseSize, price)),
                        math.sum(accumulatedSize, remainingBaseSize),
                    ];
                }
            } else {
                return [accumulatedPrice, accumulatedSize];
            }
        },
        [0, 0]
    );

const calculateMarketPrice = (orderSize = 0, orders = []) =>
    orders.reduce(
        ([accumulatedPrice, accumulatedSize], [price = 0, size = 0]) => {
            if (math.larger(orderSize, accumulatedSize)) {
                const remainingSize = math.subtract(orderSize, accumulatedSize);
                if (math.largerEq(remainingSize, size)) {
                    return [
                        math.sum(accumulatedPrice, math.multiply(size, price)),
                        math.sum(accumulatedSize, size),
                    ];
                } else {
                    return [
                        math.sum(accumulatedPrice, math.multiply(remainingSize, price)),
                        math.sum(accumulatedSize, remainingSize),
                    ];
                }
            } else {
                return [accumulatedPrice, accumulatedSize];
            }
        },
        [0, 0]
    );
module.exports = {
    getDecimals,
    sumQuantities,
    sumOrderTotal,
    estimatedQuickTradePriceSelector,
    setPriceEssentials,
    calculateMarketPriceByTotal,
    calculateMarketPrice,
};
