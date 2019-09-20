'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Simple wrapper around fs so I can concentrate on what's going on */


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Writer = function () {
  function Writer(baseDir, outputDir) {
    _classCallCheck(this, Writer);

    this.baseDir = baseDir;
    if (outputDir !== baseDir) {
      (0, _mkdirp.sync)(outputDir);
    }
    this.outputDir = outputDir;
  }

  _createClass(Writer, [{
    key: 'move',
    value: function move(from, to) {
      /* Only do this if we still have an index.html
      (i.e. this is the first run post build) */
      var fromPath = _path2.default.resolve(this.baseDir, from);
      if (_fs2.default.existsSync(fromPath)) {
        /* This _must_ be in the BUILD directory, not the OUTPUT directory, since
         * that's how our Server is configured. */
        _fs2.default.renameSync(fromPath, _path2.default.resolve(this.baseDir, to));
      }
    }
  }, {
    key: 'write',
    value: function write(filename, content) {
      var newPath = _path2.default.join(this.outputDir, filename);
      var dirName = _path2.default.dirname(newPath);
      (0, _mkdirp.sync)(dirName);
      _fs2.default.writeFileSync(newPath, content);
    }
  }]);

  return Writer;
}();

exports.default = Writer;
module.exports = exports['default'];