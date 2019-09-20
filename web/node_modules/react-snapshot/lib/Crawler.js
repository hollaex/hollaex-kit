'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Loads a URL then starts looking for links.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Emits a full page whenever a new link is found. */


var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _globToRegexp = require('glob-to-regexp');

var _globToRegexp2 = _interopRequireDefault(_globToRegexp);

var _snapshot = require('./snapshot');

var _snapshot2 = _interopRequireDefault(_snapshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Crawler = function () {
  function Crawler(baseUrl, snapshotDelay, options) {
    _classCallCheck(this, Crawler);

    this.baseUrl = baseUrl;

    var _url$parse = _url2.default.parse(baseUrl),
        protocol = _url$parse.protocol,
        host = _url$parse.host;

    this.protocol = protocol;
    this.host = host;
    this.paths = [].concat(_toConsumableArray(options.include));
    this.exclude = options.exclude.map(function (g) {
      return (0, _globToRegexp2.default)(g, { extended: true, globstar: true });
    });
    this.stripJS = options.stripJS;
    this.processed = {};
    this.snapshotDelay = snapshotDelay;
  }

  _createClass(Crawler, [{
    key: 'crawl',
    value: function crawl(handler) {
      this.handler = handler;
      console.log('\uD83D\uDD77   Starting crawling ' + this.baseUrl);
      return this.snap().then(function () {
        return console.log('\uD83D\uDD78   Finished crawling.');
      });
    }
  }, {
    key: 'snap',
    value: function snap() {
      var _this = this;

      var urlPath = this.paths.shift();
      if (!urlPath) return Promise.resolve();
      urlPath = _url2.default.resolve('/', urlPath); // Resolve removes trailing slashes
      if (this.processed[urlPath]) {
        return this.snap();
      } else {
        this.processed[urlPath] = true;
      }
      return (0, _snapshot2.default)(this.protocol, this.host, urlPath, this.snapshotDelay).then(function (window) {
        if (_this.stripJS) {
          var strip = new RegExp(_this.stripJS);
          Array.from(window.document.querySelectorAll('script')).forEach(function (script) {
            if (strip.exec(_url2.default.parse(script.src).path)) script.remove();
          });
        }
        if (Boolean(window.react_snapshot_state)) {
          var stateJSON = JSON.stringify(window.react_snapshot_state);
          var script = window.document.createElement('script');
          script.innerHTML = 'window.react_snapshot_state = JSON.parse(\'' + stateJSON + '\');';
          window.document.head.appendChild(script);
        }
        var html = _jsdom2.default.serializeDocument(window.document);
        _this.extractNewLinks(window, urlPath);
        _this.handler({ urlPath: urlPath, html: html });
        window.close(); // Release resources used by jsdom
        return _this.snap();
      }, function (err) {
        console.log('\uD83D\uDD25 ' + err);
      });
    }
  }, {
    key: 'extractNewLinks',
    value: function extractNewLinks(window, currentPath) {
      var _this2 = this;

      var document = window.document;
      var tagAttributeMap = {
        'a': 'href',
        'iframe': 'src'
      };

      Object.keys(tagAttributeMap).forEach(function (tagName) {
        var urlAttribute = tagAttributeMap[tagName];
        Array.from(document.querySelectorAll(tagName + '[' + urlAttribute + ']')).forEach(function (element) {
          if (element.getAttribute('target') === '_blank') return;
          var href = _url2.default.parse(element.getAttribute(urlAttribute));
          if (href.protocol || href.host || href.path === null) return;
          var relativePath = _url2.default.resolve(currentPath, href.path);
          if (_path2.default.extname(relativePath) !== '.html' && _path2.default.extname(relativePath) !== '') return;
          if (_this2.processed[relativePath]) return;
          if (_this2.exclude.filter(function (regex) {
            return regex.test(relativePath);
          }).length > 0) return;
          _this2.paths.push(relativePath);
        });
      });
    }
  }]);

  return Crawler;
}();

exports.default = Crawler;
module.exports = exports['default'];