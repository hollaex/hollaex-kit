'use strict';
import { getOrderbook, getKitPairsConfig } from './hollaex-tools-lib/tools/common';
import * as math from 'mathjs'
import BigNumber from 'bignumber.js';
const sumQuantities = (orders) =>
    orders.reduce((total, [, size]) => math.add(total, size), 0);

const sumOrderTotal = (orders) =>
    orders.reduce(
        (total, [price, size]) =>
            math.add(
                total,
                // @ts-ignore
                math.number(math.multiply(math.fraction(size), math.fraction(price)))
            ),
        0
    );

const roundNumber = (number = 0, decimals = 4) => {
    if (number === 0 || number === Infinity || isNaN(number)) {
        return 0;
    } else if (decimals > 0) {
        const multipliedNumber: any = math.multiply(
            math.fraction(number),
            math.pow(10, decimals)
        );
        const dividedNumber: any = math.divide(
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

    const decimalPoint = new BigNumber(pairData.increment_size).dp();
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
                let currentTotal: any = math.multiply(size, price);
                const remainingSize = math.subtract(orderSize, accumulatedPrice);
                if (math.largerEq(remainingSize, currentTotal)) {
                    return [
                        math.sum(accumulatedPrice, currentTotal),
                        math.sum(accumulatedSize, size),
                    ];
                } else {
                    let remainingBaseSize = math.divide(remainingSize, price);
                    return [
                        // @ts-ignore
                        math.sum(accumulatedPrice, math.multiply(remainingBaseSize, price)),
                        // @ts-ignore
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
                        // @ts-ignore
                        math.sum(accumulatedPrice, math.multiply(size, price)),
                        math.sum(accumulatedSize, size),
                    ];
                } else {
                    return [
                        // @ts-ignore
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
export {
    sumQuantities,
    sumOrderTotal,
    estimatedQuickTradePriceSelector,
    setPriceEssentials,
    calculateMarketPriceByTotal,
    calculateMarketPrice,
    roundNumber,
};
