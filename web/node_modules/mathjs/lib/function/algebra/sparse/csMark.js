'use strict';

function factory(type, config, load) {
  var csFlip = load(require('./csFlip'));
  /**
   * Marks the node at w[j]
   *
   * @param {Array}   w               The array
   * @param {Number}  j               The array index
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */

  var csMark = function csMark(w, j) {
    // mark w[j]
    w[j] = csFlip(w[j]);
  };

  return csMark;
}

exports.name = 'csMark';
exports.path = 'algebra.sparse';
exports.factory = factory;