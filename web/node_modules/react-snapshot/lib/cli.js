'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _Server = require('./Server');

var _Server2 = _interopRequireDefault(_Server);

var _Crawler = require('./Crawler');

var _Crawler2 = _interopRequireDefault(_Crawler);

var _Writer = require('./Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _safeCommander = require('safe-commander');

var _safeCommander2 = _interopRequireDefault(_safeCommander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  _safeCommander2.default.version(require('../package.json').version).option('--build-dir <directory>', 'Specify where the JS app lives. Defaults to \'build\'').option('--domain <domain>', 'The local domain to use for scraping. Defaults to \'localhost\'').option('--output-dir <directory>', 'Where to write the snapshots. Defaults to in-place (i.e. same as build-dir)').parse(process.argv);

  var _program$optsObj = _safeCommander2.default.optsObj,
      _program$optsObj$buil = _program$optsObj.buildDir,
      buildDir = _program$optsObj$buil === undefined ? 'build' : _program$optsObj$buil,
      _program$optsObj$doma = _program$optsObj.domain,
      domain = _program$optsObj$doma === undefined ? 'localhost' : _program$optsObj$doma,
      _program$optsObj$outp = _program$optsObj.outputDir,
      outputDir = _program$optsObj$outp === undefined ? buildDir : _program$optsObj$outp;


  var pkg = JSON.parse(_fs2.default.readFileSync(_path2.default.join(process.cwd(), 'package.json')));
  var basename = function (p) {
    return p.endsWith('/') ? p : p + '/';
  }(pkg.homepage ? _url2.default.parse(pkg.homepage).pathname : '');

  var options = Object.assign({
    include: [],
    exclude: [],
    snapshotDelay: 50
  }, pkg['react-snapshot'] || pkg.reactSnapshot || {});

  options.exclude = options.exclude.map(function (p) {
    return _path2.default.join(basename, p).replace(/\\/g, '/');
  });
  options.include = options.include.map(function (p) {
    return _path2.default.join(basename, p).replace(/\\/g, '/');
  });
  options.include.unshift(basename);

  var buildDirPath = _path2.default.resolve('./' + buildDir);
  var outputDirPath = _path2.default.resolve('./' + outputDir);
  if (!_fs2.default.existsSync(buildDir)) throw new Error('No build directory exists at: ' + buildDirPath);
  var writer = new _Writer2.default(buildDirPath, outputDirPath);
  writer.move('index.html', '200.html');

  var server = new _Server2.default(buildDirPath, basename, 0, pkg.proxy);
  server.start().then(function () {
    var crawler = new _Crawler2.default('http://' + domain + ':' + server.port() + basename, options.snapshotDelay, options);
    return crawler.crawl(function (_ref) {
      var urlPath = _ref.urlPath,
          html = _ref.html;

      if (!urlPath.startsWith(basename)) {
        console.log('\u2757 Refusing to crawl ' + urlPath + ' because it is outside of the ' + basename + ' sub-folder');
        return;
      }
      urlPath = urlPath.replace(basename, '/');
      var filename = urlPath;
      if (urlPath.endsWith('/')) {
        filename = urlPath + 'index.html';
      } else if (_path2.default.extname(urlPath) == '') {
        filename = urlPath + '.html';
      }
      console.log('\u270F\uFE0F   Saving ' + urlPath + ' as ' + filename);
      writer.write(filename, html);
    });
  }).then(function () {
    return server.stop();
  }, function (err) {
    return console.log('\uD83D\uDD25 ' + err);
  });
};

module.exports = exports['default'];