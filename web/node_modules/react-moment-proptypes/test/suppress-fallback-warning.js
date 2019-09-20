var moment = require('moment');

moment.createFromInputFallback = function(config) {
  config._d = new Date(NaN);
};
