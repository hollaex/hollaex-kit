var currencies = require('./currencies');

var DEFAULT_CURRENCY_NAME = 'bitcoin';

module.exports = {
    validate: function (address, currencyNameOrSymbol, networkType) {
        var currency = currencies.getByNameOrSymbol(currencyNameOrSymbol || DEFAULT_CURRENCY_NAME);

        if (currency.validator) {
            return currency.validator.isValidAddress(address, currency, networkType);
        }

        throw new Error('Missing validator for currency: ' + currencyNameOrSymbol);
    },
};
