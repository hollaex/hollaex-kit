'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Spin up a simple express server */


var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _connectHistoryApiFallback = require('connect-history-api-fallback');

var _connectHistoryApiFallback2 = _interopRequireDefault(_connectHistoryApiFallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
  function Server(baseDir, publicPath, port, proxy) {
    _classCallCheck(this, Server);

    var app = (0, _express2.default)();

    app.get('*', function (req, res, next) {
      // This makes sure the sockets close down so that
      // we can gracefully shutdown the server
      res.set('Connection', 'close');
      next();
    });

    // Yes I just copied most of this from react-scripts ¯\_(ツ)_/¯
    app.use(publicPath, (0, _connectHistoryApiFallback2.default)({
      index: '/200.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html']
    }), _express2.default.static(baseDir, { index: '200.html' }));

    if (proxy) {
      if (typeof proxy !== "string") throw new Error("Only string proxies are implemented currently.");
      app.use((0, _httpProxyMiddleware2.default)({
        target: proxy,
        onProxyReq: function onProxyReq(proxyReq) {
          if (proxyReq.getHeader('origin')) proxyReq.setHeader('origin', proxy);
        },
        changeOrigin: true,
        xfwd: true
      }));
    }

    this.start = this.start.bind(this, app, port);
  }

  _createClass(Server, [{
    key: 'start',
    value: function start(app, port) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.instance = app.listen(port, function (err) {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    }
  }, {
    key: 'port',
    value: function port() {
      return this.instance.address().port;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.instance.close();
    }
  }]);

  return Server;
}();

exports.default = Server;
module.exports = exports['default'];