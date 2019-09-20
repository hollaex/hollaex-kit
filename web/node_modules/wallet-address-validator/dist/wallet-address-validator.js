(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WAValidator = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var Buffer = require('safe-buffer').Buffer

module.exports = function base (ALPHABET) {
  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z)

    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
    ALPHABET_MAP[x] = z
  }

  function encode (source) {
    if (source.length === 0) return ''

    var digits = [0]
    for (var i = 0; i < source.length; ++i) {
      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    var string = ''

    // deal with leading zeros
    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += LEADER
    // convert digits to a string
    for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]]

    return string
  }

  function decodeUnsafe (string) {
    if (typeof string !== 'string') throw new TypeError('Expected String')
    if (string.length === 0) return Buffer.allocUnsafe(0)

    var bytes = [0]
    for (var i = 0; i < string.length; i++) {
      var value = ALPHABET_MAP[string[i]]
      if (value === undefined) return

      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * BASE
        bytes[j] = carry & 0xff
        carry >>= 8
      }

      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    // deal with leading zeros
    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0)
    }

    return Buffer.from(bytes.reverse())
  }

  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) return buffer

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}

},{"safe-buffer":7}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (ArrayBuffer.isView(buf)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":4}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(I){function w(c,a,d){var l=0,b=[],g=0,f,n,k,e,h,q,y,p,m=!1,t=[],r=[],u,z=!1;d=d||{};f=d.encoding||"UTF8";u=d.numRounds||1;if(u!==parseInt(u,10)||1>u)throw Error("numRounds must a integer >= 1");if(0===c.lastIndexOf("SHA-",0))if(q=function(b,a){return A(b,a,c)},y=function(b,a,l,f){var g,e;if("SHA-224"===c||"SHA-256"===c)g=(a+65>>>9<<4)+15,e=16;else throw Error("Unexpected error in SHA-2 implementation");for(;b.length<=g;)b.push(0);b[a>>>5]|=128<<24-a%32;a=a+l;b[g]=a&4294967295;
b[g-1]=a/4294967296|0;l=b.length;for(a=0;a<l;a+=e)f=A(b.slice(a,a+e),f,c);if("SHA-224"===c)b=[f[0],f[1],f[2],f[3],f[4],f[5],f[6]];else if("SHA-256"===c)b=f;else throw Error("Unexpected error in SHA-2 implementation");return b},p=function(b){return b.slice()},"SHA-224"===c)h=512,e=224;else if("SHA-256"===c)h=512,e=256;else throw Error("Chosen SHA variant is not supported");else throw Error("Chosen SHA variant is not supported");k=B(a,f);n=x(c);this.setHMACKey=function(b,a,g){var e;if(!0===m)throw Error("HMAC key already set");
if(!0===z)throw Error("Cannot set HMAC key after calling update");f=(g||{}).encoding||"UTF8";a=B(a,f)(b);b=a.binLen;a=a.value;e=h>>>3;g=e/4-1;if(e<b/8){for(a=y(a,b,0,x(c));a.length<=g;)a.push(0);a[g]&=4294967040}else if(e>b/8){for(;a.length<=g;)a.push(0);a[g]&=4294967040}for(b=0;b<=g;b+=1)t[b]=a[b]^909522486,r[b]=a[b]^1549556828;n=q(t,n);l=h;m=!0};this.update=function(a){var c,f,e,d=0,p=h>>>5;c=k(a,b,g);a=c.binLen;f=c.value;c=a>>>5;for(e=0;e<c;e+=p)d+h<=a&&(n=q(f.slice(e,e+p),n),d+=h);l+=d;b=f.slice(d>>>
5);g=a%h;z=!0};this.getHash=function(a,f){var d,h,k,q;if(!0===m)throw Error("Cannot call getHash after setting HMAC key");k=C(f);switch(a){case "HEX":d=function(a){return D(a,e,k)};break;case "B64":d=function(a){return E(a,e,k)};break;case "BYTES":d=function(a){return F(a,e)};break;case "ARRAYBUFFER":try{h=new ArrayBuffer(0)}catch(v){throw Error("ARRAYBUFFER not supported by this environment");}d=function(a){return G(a,e)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
}q=y(b.slice(),g,l,p(n));for(h=1;h<u;h+=1)q=y(q,e,0,x(c));return d(q)};this.getHMAC=function(a,f){var d,k,t,u;if(!1===m)throw Error("Cannot call getHMAC without first setting HMAC key");t=C(f);switch(a){case "HEX":d=function(a){return D(a,e,t)};break;case "B64":d=function(a){return E(a,e,t)};break;case "BYTES":d=function(a){return F(a,e)};break;case "ARRAYBUFFER":try{d=new ArrayBuffer(0)}catch(v){throw Error("ARRAYBUFFER not supported by this environment");}d=function(a){return G(a,e)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
}k=y(b.slice(),g,l,p(n));u=q(r,x(c));u=y(k,e,h,u);return d(u)}}function m(){}function D(c,a,d){var l="";a/=8;var b,g;for(b=0;b<a;b+=1)g=c[b>>>2]>>>8*(3+b%4*-1),l+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15);return d.outputUpper?l.toUpperCase():l}function E(c,a,d){var l="",b=a/8,g,f,n;for(g=0;g<b;g+=3)for(f=g+1<b?c[g+1>>>2]:0,n=g+2<b?c[g+2>>>2]:0,n=(c[g>>>2]>>>8*(3+g%4*-1)&255)<<16|(f>>>8*(3+(g+1)%4*-1)&255)<<8|n>>>8*(3+(g+2)%4*-1)&255,f=0;4>f;f+=1)8*g+6*f<=a?l+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n>>>
6*(3-f)&63):l+=d.b64Pad;return l}function F(c,a){var d="",l=a/8,b,g;for(b=0;b<l;b+=1)g=c[b>>>2]>>>8*(3+b%4*-1)&255,d+=String.fromCharCode(g);return d}function G(c,a){var d=a/8,l,b=new ArrayBuffer(d),g;g=new Uint8Array(b);for(l=0;l<d;l+=1)g[l]=c[l>>>2]>>>8*(3+l%4*-1)&255;return b}function C(c){var a={outputUpper:!1,b64Pad:"=",shakeLen:-1};c=c||{};a.outputUpper=c.outputUpper||!1;!0===c.hasOwnProperty("b64Pad")&&(a.b64Pad=c.b64Pad);if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");
if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function B(c,a){var d;switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(c){case "HEX":d=function(a,b,c){var f=a.length,d,k,e,h,q;if(0!==f%2)throw Error("String of HEX type must be in byte increments");b=b||[0];c=c||0;q=c>>>3;for(d=0;d<f;d+=2){k=parseInt(a.substr(d,2),16);if(isNaN(k))throw Error("String of HEX type contains invalid characters");
h=(d>>>1)+q;for(e=h>>>2;b.length<=e;)b.push(0);b[e]|=k<<8*(3+h%4*-1)}return{value:b,binLen:4*f+c}};break;case "TEXT":d=function(c,b,d){var f,n,k=0,e,h,q,m,p,r;b=b||[0];d=d||0;q=d>>>3;if("UTF8"===a)for(r=3,e=0;e<c.length;e+=1)for(f=c.charCodeAt(e),n=[],128>f?n.push(f):2048>f?(n.push(192|f>>>6),n.push(128|f&63)):55296>f||57344<=f?n.push(224|f>>>12,128|f>>>6&63,128|f&63):(e+=1,f=65536+((f&1023)<<10|c.charCodeAt(e)&1023),n.push(240|f>>>18,128|f>>>12&63,128|f>>>6&63,128|f&63)),h=0;h<n.length;h+=1){p=k+
q;for(m=p>>>2;b.length<=m;)b.push(0);b[m]|=n[h]<<8*(r+p%4*-1);k+=1}else if("UTF16BE"===a||"UTF16LE"===a)for(r=2,n="UTF16LE"===a&&!0||"UTF16LE"!==a&&!1,e=0;e<c.length;e+=1){f=c.charCodeAt(e);!0===n&&(h=f&255,f=h<<8|f>>>8);p=k+q;for(m=p>>>2;b.length<=m;)b.push(0);b[m]|=f<<8*(r+p%4*-1);k+=2}return{value:b,binLen:8*k+d}};break;case "B64":d=function(a,b,c){var f=0,d,k,e,h,q,m,p;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");k=a.indexOf("=");a=a.replace(/\=/g,
"");if(-1!==k&&k<a.length)throw Error("Invalid '=' found in base-64 string");b=b||[0];c=c||0;m=c>>>3;for(k=0;k<a.length;k+=4){q=a.substr(k,4);for(e=h=0;e<q.length;e+=1)d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(q[e]),h|=d<<18-6*e;for(e=0;e<q.length-1;e+=1){p=f+m;for(d=p>>>2;b.length<=d;)b.push(0);b[d]|=(h>>>16-8*e&255)<<8*(3+p%4*-1);f+=1}}return{value:b,binLen:8*f+c}};break;case "BYTES":d=function(a,b,c){var d,n,k,e,h;b=b||[0];c=c||0;k=c>>>3;for(n=0;n<a.length;n+=
1)d=a.charCodeAt(n),h=n+k,e=h>>>2,b.length<=e&&b.push(0),b[e]|=d<<8*(3+h%4*-1);return{value:b,binLen:8*a.length+c}};break;case "ARRAYBUFFER":try{d=new ArrayBuffer(0)}catch(l){throw Error("ARRAYBUFFER not supported by this environment");}d=function(a,b,c){var d,n,k,e,h;b=b||[0];c=c||0;n=c>>>3;h=new Uint8Array(a);for(d=0;d<a.byteLength;d+=1)e=d+n,k=e>>>2,b.length<=k&&b.push(0),b[k]|=h[d]<<8*(3+e%4*-1);return{value:b,binLen:8*a.byteLength+c}};break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
}return d}function r(c,a){return c>>>a|c<<32-a}function J(c,a,d){return c&a^~c&d}function K(c,a,d){return c&a^c&d^a&d}function L(c){return r(c,2)^r(c,13)^r(c,22)}function M(c){return r(c,6)^r(c,11)^r(c,25)}function N(c){return r(c,7)^r(c,18)^c>>>3}function O(c){return r(c,17)^r(c,19)^c>>>10}function P(c,a){var d=(c&65535)+(a&65535);return((c>>>16)+(a>>>16)+(d>>>16)&65535)<<16|d&65535}function Q(c,a,d,l){var b=(c&65535)+(a&65535)+(d&65535)+(l&65535);return((c>>>16)+(a>>>16)+(d>>>16)+(l>>>16)+(b>>>
16)&65535)<<16|b&65535}function R(c,a,d,l,b){var g=(c&65535)+(a&65535)+(d&65535)+(l&65535)+(b&65535);return((c>>>16)+(a>>>16)+(d>>>16)+(l>>>16)+(b>>>16)+(g>>>16)&65535)<<16|g&65535}function x(c){var a=[],d;if(0===c.lastIndexOf("SHA-",0))switch(a=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],d=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],c){case "SHA-224":break;case "SHA-256":a=d;break;case "SHA-384":a=[new m,new m,
new m,new m,new m,new m,new m,new m];break;case "SHA-512":a=[new m,new m,new m,new m,new m,new m,new m,new m];break;default:throw Error("Unknown SHA variant");}else throw Error("No SHA variants supported");return a}function A(c,a,d){var l,b,g,f,n,k,e,h,m,r,p,w,t,x,u,z,A,B,C,D,E,F,v=[],G;if("SHA-224"===d||"SHA-256"===d)r=64,w=1,F=Number,t=P,x=Q,u=R,z=N,A=O,B=L,C=M,E=K,D=J,G=H;else throw Error("Unexpected error in SHA-2 implementation");d=a[0];l=a[1];b=a[2];g=a[3];f=a[4];n=a[5];k=a[6];e=a[7];for(p=
0;p<r;p+=1)16>p?(m=p*w,h=c.length<=m?0:c[m],m=c.length<=m+1?0:c[m+1],v[p]=new F(h,m)):v[p]=x(A(v[p-2]),v[p-7],z(v[p-15]),v[p-16]),h=u(e,C(f),D(f,n,k),G[p],v[p]),m=t(B(d),E(d,l,b)),e=k,k=n,n=f,f=t(g,h),g=b,b=l,l=d,d=t(h,m);a[0]=t(d,a[0]);a[1]=t(l,a[1]);a[2]=t(b,a[2]);a[3]=t(g,a[3]);a[4]=t(f,a[4]);a[5]=t(n,a[5]);a[6]=t(k,a[6]);a[7]=t(e,a[7]);return a}var H;H=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,
2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,
2756734187,3204031479,3329325298];"function"===typeof define&&define.amd?define(function(){return w}):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=w),exports=w):I.jsSHA=w})(this);

},{}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":3}],8:[function(require,module,exports){
var base58 = require('./crypto/base58');
var segwit = require('./crypto/segwit_addr');
var cryptoUtils = require('./crypto/utils');

var DEFAULT_NETWORK_TYPE = 'prod';

function getDecoded(address) {
    try {
        return base58.decode(address);
    } catch (e) {
        // if decoding fails, assume invalid address
        return null;
    }
}

function getChecksum(hashFunction, payload) {
    // Each currency may implement different hashing algorithm
    switch (hashFunction) {
        case 'blake256':
            return cryptoUtils.blake256Checksum(payload);
            break;
        case 'sha256':
        default:
            return cryptoUtils.sha256Checksum(payload);
    }
}

function getAddressType(address, currency) {
    currency = currency || {};
    // should be 25 bytes per btc address spec and 26 decred
    var expectedLength = currency.expectedLength || 25;
    var hashFunction = currency.hashFunction || 'sha256';
    var decoded = getDecoded(address);

    if (decoded) {
        var length = decoded.length;

        if (length !== expectedLength) {
            return null;
        }

        var checksum = cryptoUtils.toHex(decoded.slice(length - 4, length)),
            body = cryptoUtils.toHex(decoded.slice(0, length - 4)),
            goodChecksum = getChecksum(hashFunction, body);

        return checksum === goodChecksum ? cryptoUtils.toHex(decoded.slice(0, expectedLength - 24)) : null;
    }

    return null;
}

function isValidP2PKHandP2SHAddress(address, currency, networkType) {
    networkType = networkType || DEFAULT_NETWORK_TYPE;

    var correctAddressTypes;
    var addressType = getAddressType(address, currency);

    if (addressType) {
        if (networkType === 'prod' || networkType === 'testnet') {
            correctAddressTypes = currency.addressTypes[networkType]
        } else {
            correctAddressTypes = currency.addressTypes.prod.concat(currency.addressTypes.testnet);
        }

        return correctAddressTypes.indexOf(addressType) >= 0;
    }

    return false;
}

module.exports = {
    isValidAddress: function (address, currency, networkType) {
        return isValidP2PKHandP2SHAddress(address, currency, networkType) || segwit.isValidAddress(address, currency.segwitHrp);
    }
};

},{"./crypto/base58":9,"./crypto/segwit_addr":15,"./crypto/utils":17}],9:[function(require,module,exports){
// Base58 encoding/decoding
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var ALPHABET_MAP = {};
for (var i = 0; i < ALPHABET.length; ++i) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}
var BASE = ALPHABET.length;

module.exports = {
    decode: function(string) {
        if (string.length === 0) return [];

        var i, j, bytes = [0];
        for (i = 0; i < string.length; ++i) {
            var c = string[i];
            if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');

            for (j = 0; j < bytes.length; ++j) bytes[j] *= BASE
            bytes[0] += ALPHABET_MAP[c];

            var carry = 0;
            for (j = 0; j < bytes.length; ++j) {
                bytes[j] += carry;
                carry = bytes[j] >> 8;
                bytes[j] &= 0xff
            }

            while (carry) {
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
        }
        // deal with leading zeros
        for (i = 0; string[i] === '1' && i < string.length - 1; ++i){
            bytes.push(0);
        }

        return bytes.reverse();
    }
};

},{}],10:[function(require,module,exports){
// Copyright (c) 2017 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
var GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

module.exports = {
  decode: decode,
  encode: encode,
};


function polymod (values) {
  var chk = 1;
  for (var p = 0; p < values.length; ++p) {
    var top = chk >> 25;
    chk = (chk & 0x1ffffff) << 5 ^ values[p];
    for (var i = 0; i < 5; ++i) {
      if ((top >> i) & 1) {
        chk ^= GENERATOR[i];
      }
    }
  }
  return chk;
}

function hrpExpand (hrp) {
  var ret = [];
  var p;
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) >> 5);
  }
  ret.push(0);
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) & 31);
  }
  return ret;
}

function verifyChecksum (hrp, data) {
  return polymod(hrpExpand(hrp).concat(data)) === 1;
}

function createChecksum (hrp, data) {
  var values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
  var mod = polymod(values) ^ 1;
  var ret = [];
  for (var p = 0; p < 6; ++p) {
    ret.push((mod >> 5 * (5 - p)) & 31);
  }
  return ret;
}

function encode (hrp, data) {
  var combined = data.concat(createChecksum(hrp, data));
  var ret = hrp + '1';
  for (var p = 0; p < combined.length; ++p) {
    ret += CHARSET.charAt(combined[p]);
  }
  return ret;
}

function decode (bechString) {
  var p;
  var has_lower = false;
  var has_upper = false;
  for (p = 0; p < bechString.length; ++p) {
    if (bechString.charCodeAt(p) < 33 || bechString.charCodeAt(p) > 126) {
      return null;
    }
    if (bechString.charCodeAt(p) >= 97 && bechString.charCodeAt(p) <= 122) {
        has_lower = true;
    }
    if (bechString.charCodeAt(p) >= 65 && bechString.charCodeAt(p) <= 90) {
        has_upper = true;
    }
  }
  if (has_lower && has_upper) {
    return null;
  }
  bechString = bechString.toLowerCase();
  var pos = bechString.lastIndexOf('1');
  if (pos < 1 || pos + 7 > bechString.length || bechString.length > 90) {
    return null;
  }
  var hrp = bechString.substring(0, pos);
  var data = [];
  for (p = pos + 1; p < bechString.length; ++p) {
    var d = CHARSET.indexOf(bechString.charAt(p));
    if (d === -1) {
      return null;
    }
    data.push(d);
  }
  if (!verifyChecksum(hrp, data)) {
    return null;
  }
  return {hrp: hrp, data: data.slice(0, data.length - 6)};
}

},{}],11:[function(require,module,exports){
/*
	JavaScript BigInteger library version 0.9.1
	http://silentmatt.com/biginteger/
	Copyright (c) 2009 Matthew Crumley <email@matthewcrumley.com>
	Copyright (c) 2010,2011 by John Tobey <John.Tobey@gmail.com>
	Licensed under the MIT license.
	Support for arbitrary internal representation base was added by
	Vitaly Magerya.
*/

/*
	File: biginteger.js
	Exports:
		<BigInteger>
*/
(function(exports) {
    "use strict";
    /*
        Class: BigInteger
        An arbitrarily-large integer.
        <BigInteger> objects should be considered immutable. None of the "built-in"
        methods modify *this* or their arguments. All properties should be
        considered private.
        All the methods of <BigInteger> instances can be called "statically". The
        static versions are convenient if you don't already have a <BigInteger>
        object.
        As an example, these calls are equivalent.
        > BigInteger(4).multiply(5); // returns BigInteger(20);
        > BigInteger.multiply(4, 5); // returns BigInteger(20);
        > var a = 42;
        > var a = BigInteger.toJSValue("0b101010"); // Not completely useless...
    */
    
    var CONSTRUCT = {}; // Unique token to call "private" version of constructor
    
    /*
        Constructor: BigInteger()
        Convert a value to a <BigInteger>.
        Although <BigInteger()> is the constructor for <BigInteger> objects, it is
        best not to call it as a constructor. If *n* is a <BigInteger> object, it is
        simply returned as-is. Otherwise, <BigInteger()> is equivalent to <parse>
        without a radix argument.
        > var n0 = BigInteger();      // Same as <BigInteger.ZERO>
        > var n1 = BigInteger("123"); // Create a new <BigInteger> with value 123
        > var n2 = BigInteger(123);   // Create a new <BigInteger> with value 123
        > var n3 = BigInteger(n2);    // Return n2, unchanged
        The constructor form only takes an array and a sign. *n* must be an
        array of numbers in little-endian order, where each digit is between 0
        and BigInteger.base.  The second parameter sets the sign: -1 for
        negative, +1 for positive, or 0 for zero. The array is *not copied and
        may be modified*. If the array contains only zeros, the sign parameter
        is ignored and is forced to zero.
        > new BigInteger([5], -1): create a new BigInteger with value -5
        Parameters:
            n - Value to convert to a <BigInteger>.
        Returns:
            A <BigInteger> value.
        See Also:
            <parse>, <BigInteger>
    */
    function BigInteger(n, s, token) {
        
        if (token !== CONSTRUCT) {
            if (n instanceof BigInteger) {
                return n;
            }
            else if (typeof n === "undefined") {
                return ZERO;
            }
            return BigInteger.parse(n);
        }
    
        n = n || [];  // Provide the nullary constructor for subclasses.
        while (n.length && !n[n.length - 1]) {
            --n.length;
        }
        this._d = n;
        this._s = n.length ? (s || 1) : 0;
    }
    
    BigInteger._construct = function(n, s) {
        return new BigInteger(n, s, CONSTRUCT);
    };
    
    // Base-10 speedup hacks in parse, toString, exp10 and log functions
    // require base to be a power of 10. 10^7 is the largest such power
    // that won't cause a precision loss when digits are multiplied.
    var BigInteger_base = 10000000;
    var BigInteger_base_log10 = 7;
    
    BigInteger.base = BigInteger_base;
    BigInteger.base_log10 = BigInteger_base_log10;
    
    var ZERO = new BigInteger([], 0, CONSTRUCT);
    // Constant: ZERO
    // <BigInteger> 0.
    BigInteger.ZERO = ZERO;
    
    var ONE = new BigInteger([1], 1, CONSTRUCT);
    // Constant: ONE
    // <BigInteger> 1.
    BigInteger.ONE = ONE;
    
    var M_ONE = new BigInteger(ONE._d, -1, CONSTRUCT);
    // Constant: M_ONE
    // <BigInteger> -1.
    BigInteger.M_ONE = M_ONE;
    
    // Constant: _0
    // Shortcut for <ZERO>.
    BigInteger._0 = ZERO;
    
    // Constant: _1
    // Shortcut for <ONE>.
    BigInteger._1 = ONE;
    
    /*
        Constant: small
        Array of <BigIntegers> from 0 to 36.
        These are used internally for parsing, but useful when you need a "small"
        <BigInteger>.
        See Also:
            <ZERO>, <ONE>, <_0>, <_1>
    */
    BigInteger.small = [
        ZERO,
        ONE,
        /* Assuming BigInteger_base > 36 */
        new BigInteger( [2], 1, CONSTRUCT),
        new BigInteger( [3], 1, CONSTRUCT),
        new BigInteger( [4], 1, CONSTRUCT),
        new BigInteger( [5], 1, CONSTRUCT),
        new BigInteger( [6], 1, CONSTRUCT),
        new BigInteger( [7], 1, CONSTRUCT),
        new BigInteger( [8], 1, CONSTRUCT),
        new BigInteger( [9], 1, CONSTRUCT),
        new BigInteger([10], 1, CONSTRUCT),
        new BigInteger([11], 1, CONSTRUCT),
        new BigInteger([12], 1, CONSTRUCT),
        new BigInteger([13], 1, CONSTRUCT),
        new BigInteger([14], 1, CONSTRUCT),
        new BigInteger([15], 1, CONSTRUCT),
        new BigInteger([16], 1, CONSTRUCT),
        new BigInteger([17], 1, CONSTRUCT),
        new BigInteger([18], 1, CONSTRUCT),
        new BigInteger([19], 1, CONSTRUCT),
        new BigInteger([20], 1, CONSTRUCT),
        new BigInteger([21], 1, CONSTRUCT),
        new BigInteger([22], 1, CONSTRUCT),
        new BigInteger([23], 1, CONSTRUCT),
        new BigInteger([24], 1, CONSTRUCT),
        new BigInteger([25], 1, CONSTRUCT),
        new BigInteger([26], 1, CONSTRUCT),
        new BigInteger([27], 1, CONSTRUCT),
        new BigInteger([28], 1, CONSTRUCT),
        new BigInteger([29], 1, CONSTRUCT),
        new BigInteger([30], 1, CONSTRUCT),
        new BigInteger([31], 1, CONSTRUCT),
        new BigInteger([32], 1, CONSTRUCT),
        new BigInteger([33], 1, CONSTRUCT),
        new BigInteger([34], 1, CONSTRUCT),
        new BigInteger([35], 1, CONSTRUCT),
        new BigInteger([36], 1, CONSTRUCT)
    ];
    
    // Used for parsing/radix conversion
    BigInteger.digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    /*
        Method: toString
        Convert a <BigInteger> to a string.
        When *base* is greater than 10, letters are upper case.
        Parameters:
            base - Optional base to represent the number in (default is base 10).
                   Must be between 2 and 36 inclusive, or an Error will be thrown.
        Returns:
            The string representation of the <BigInteger>.
    */
    BigInteger.prototype.toString = function(base) {
        base = +base || 10;
        if (base < 2 || base > 36) {
            throw new Error("illegal radix " + base + ".");
        }
        if (this._s === 0) {
            return "0";
        }
        if (base === 10) {
            var str = this._s < 0 ? "-" : "";
            str += this._d[this._d.length - 1].toString();
            for (var i = this._d.length - 2; i >= 0; i--) {
                var group = this._d[i].toString();
                while (group.length < BigInteger_base_log10) group = '0' + group;
                str += group;
            }
            return str;
        }
        else {
            var numerals = BigInteger.digits;
            base = BigInteger.small[base];
            var sign = this._s;
    
            var n = this.abs();
            var digits = [];
            var digit;
    
            while (n._s !== 0) {
                var divmod = n.divRem(base);
                n = divmod[0];
                digit = divmod[1];
                // TODO: This could be changed to unshift instead of reversing at the end.
                // Benchmark both to compare speeds.
                digits.push(numerals[digit.valueOf()]);
            }
            return (sign < 0 ? "-" : "") + digits.reverse().join("");
        }
    };
    
    // Verify strings for parsing
    BigInteger.radixRegex = [
        /^$/,
        /^$/,
        /^[01]*$/,
        /^[012]*$/,
        /^[0-3]*$/,
        /^[0-4]*$/,
        /^[0-5]*$/,
        /^[0-6]*$/,
        /^[0-7]*$/,
        /^[0-8]*$/,
        /^[0-9]*$/,
        /^[0-9aA]*$/,
        /^[0-9abAB]*$/,
        /^[0-9abcABC]*$/,
        /^[0-9a-dA-D]*$/,
        /^[0-9a-eA-E]*$/,
        /^[0-9a-fA-F]*$/,
        /^[0-9a-gA-G]*$/,
        /^[0-9a-hA-H]*$/,
        /^[0-9a-iA-I]*$/,
        /^[0-9a-jA-J]*$/,
        /^[0-9a-kA-K]*$/,
        /^[0-9a-lA-L]*$/,
        /^[0-9a-mA-M]*$/,
        /^[0-9a-nA-N]*$/,
        /^[0-9a-oA-O]*$/,
        /^[0-9a-pA-P]*$/,
        /^[0-9a-qA-Q]*$/,
        /^[0-9a-rA-R]*$/,
        /^[0-9a-sA-S]*$/,
        /^[0-9a-tA-T]*$/,
        /^[0-9a-uA-U]*$/,
        /^[0-9a-vA-V]*$/,
        /^[0-9a-wA-W]*$/,
        /^[0-9a-xA-X]*$/,
        /^[0-9a-yA-Y]*$/,
        /^[0-9a-zA-Z]*$/
    ];
    
    /*
        Function: parse
        Parse a string into a <BigInteger>.
        *base* is optional but, if provided, must be from 2 to 36 inclusive. If
        *base* is not provided, it will be guessed based on the leading characters
        of *s* as follows:
        - "0x" or "0X": *base* = 16
        - "0c" or "0C": *base* = 8
        - "0b" or "0B": *base* = 2
        - else: *base* = 10
        If no base is provided, or *base* is 10, the number can be in exponential
        form. For example, these are all valid:
        > BigInteger.parse("1e9");              // Same as "1000000000"
        > BigInteger.parse("1.234*10^3");       // Same as 1234
        > BigInteger.parse("56789 * 10 ** -2"); // Same as 567
        If any characters fall outside the range defined by the radix, an exception
        will be thrown.
        Parameters:
            s - The string to parse.
            base - Optional radix (default is to guess based on *s*).
        Returns:
            a <BigInteger> instance.
    */
    BigInteger.parse = function(s, base) {
        // Expands a number in exponential form to decimal form.
        // expandExponential("-13.441*10^5") === "1344100";
        // expandExponential("1.12300e-1") === "0.112300";
        // expandExponential(1000000000000000000000000000000) === "1000000000000000000000000000000";
        function expandExponential(str) {
            str = str.replace(/\s*[*xX]\s*10\s*(\^|\*\*)\s*/, "e");
    
            return str.replace(/^([+\-])?(\d+)\.?(\d*)[eE]([+\-]?\d+)$/, function(x, s, n, f, c) {
                c = +c;
                var l = c < 0;
                var i = n.length + c;
                x = (l ? n : f).length;
                c = ((c = Math.abs(c)) >= x ? c - x + l : 0);
                var z = (new Array(c + 1)).join("0");
                var r = n + f;
                return (s || "") + (l ? r = z + r : r += z).substr(0, i += l ? z.length : 0) + (i < r.length ? "." + r.substr(i) : "");
            });
        }
    
        s = s.toString();
        if (typeof base === "undefined" || +base === 10) {
            s = expandExponential(s);
        }
    
        var prefixRE;
        if (typeof base === "undefined") {
            prefixRE = '0[xcb]';
        }
        else if (base == 16) {
            prefixRE = '0x';
        }
        else if (base == 8) {
            prefixRE = '0c';
        }
        else if (base == 2) {
            prefixRE = '0b';
        }
        else {
            prefixRE = '';
        }
        var parts = new RegExp('^([+\\-]?)(' + prefixRE + ')?([0-9a-z]*)(?:\\.\\d*)?$', 'i').exec(s);
        if (parts) {
            var sign = parts[1] || "+";
            var baseSection = parts[2] || "";
            var digits = parts[3] || "";
    
            if (typeof base === "undefined") {
                // Guess base
                if (baseSection === "0x" || baseSection === "0X") { // Hex
                    base = 16;
                }
                else if (baseSection === "0c" || baseSection === "0C") { // Octal
                    base = 8;
                }
                else if (baseSection === "0b" || baseSection === "0B") { // Binary
                    base = 2;
                }
                else {
                    base = 10;
                }
            }
            else if (base < 2 || base > 36) {
                throw new Error("Illegal radix " + base + ".");
            }
    
            base = +base;
    
            // Check for digits outside the range
            if (!(BigInteger.radixRegex[base].test(digits))) {
                throw new Error("Bad digit for radix " + base);
            }
    
            // Strip leading zeros, and convert to array
            digits = digits.replace(/^0+/, "").split("");
            if (digits.length === 0) {
                return ZERO;
            }
    
            // Get the sign (we know it's not zero)
            sign = (sign === "-") ? -1 : 1;
    
            // Optimize 10
            if (base == 10) {
                var d = [];
                while (digits.length >= BigInteger_base_log10) {
                    d.push(parseInt(digits.splice(digits.length-BigInteger.base_log10, BigInteger.base_log10).join(''), 10));
                }
                d.push(parseInt(digits.join(''), 10));
                return new BigInteger(d, sign, CONSTRUCT);
            }
    
            // Do the conversion
            var d = ZERO;
            base = BigInteger.small[base];
            var small = BigInteger.small;
            for (var i = 0; i < digits.length; i++) {
                d = d.multiply(base).add(small[parseInt(digits[i], 36)]);
            }
            return new BigInteger(d._d, sign, CONSTRUCT);
        }
        else {
            throw new Error("Invalid BigInteger format: " + s);
        }
    };
    
    /*
        Function: add
        Add two <BigIntegers>.
        Parameters:
            n - The number to add to *this*. Will be converted to a <BigInteger>.
        Returns:
            The numbers added together.
        See Also:
            <subtract>, <multiply>, <quotient>, <next>
    */
    BigInteger.prototype.add = function(n) {
        if (this._s === 0) {
            return BigInteger(n);
        }
    
        n = BigInteger(n);
        if (n._s === 0) {
            return this;
        }
        if (this._s !== n._s) {
            n = n.negate();
            return this.subtract(n);
        }
    
        var a = this._d;
        var b = n._d;
        var al = a.length;
        var bl = b.length;
        var sum = new Array(Math.max(al, bl) + 1);
        var size = Math.min(al, bl);
        var carry = 0;
        var digit;
    
        for (var i = 0; i < size; i++) {
            digit = a[i] + b[i] + carry;
            sum[i] = digit % BigInteger_base;
            carry = (digit / BigInteger_base) | 0;
        }
        if (bl > al) {
            a = b;
            al = bl;
        }
        for (i = size; carry && i < al; i++) {
            digit = a[i] + carry;
            sum[i] = digit % BigInteger_base;
            carry = (digit / BigInteger_base) | 0;
        }
        if (carry) {
            sum[i] = carry;
        }
    
        for ( ; i < al; i++) {
            sum[i] = a[i];
        }
    
        return new BigInteger(sum, this._s, CONSTRUCT);
    };
    
    /*
        Function: negate
        Get the additive inverse of a <BigInteger>.
        Returns:
            A <BigInteger> with the same magnatude, but with the opposite sign.
        See Also:
            <abs>
    */
    BigInteger.prototype.negate = function() {
        return new BigInteger(this._d, (-this._s) | 0, CONSTRUCT);
    };
    
    /*
        Function: abs
        Get the absolute value of a <BigInteger>.
        Returns:
            A <BigInteger> with the same magnatude, but always positive (or zero).
        See Also:
            <negate>
    */
    BigInteger.prototype.abs = function() {
        return (this._s < 0) ? this.negate() : this;
    };
    
    /*
        Function: subtract
        Subtract two <BigIntegers>.
        Parameters:
            n - The number to subtract from *this*. Will be converted to a <BigInteger>.
        Returns:
            The *n* subtracted from *this*.
        See Also:
            <add>, <multiply>, <quotient>, <prev>
    */
    BigInteger.prototype.subtract = function(n) {
        if (this._s === 0) {
            return BigInteger(n).negate();
        }
    
        n = BigInteger(n);
        if (n._s === 0) {
            return this;
        }
        if (this._s !== n._s) {
            n = n.negate();
            return this.add(n);
        }
    
        var m = this;
        // negative - negative => -|a| - -|b| => -|a| + |b| => |b| - |a|
        if (this._s < 0) {
            m = new BigInteger(n._d, 1, CONSTRUCT);
            n = new BigInteger(this._d, 1, CONSTRUCT);
        }
    
        // Both are positive => a - b
        var sign = m.compareAbs(n);
        if (sign === 0) {
            return ZERO;
        }
        else if (sign < 0) {
            // swap m and n
            var t = n;
            n = m;
            m = t;
        }
    
        // a > b
        var a = m._d;
        var b = n._d;
        var al = a.length;
        var bl = b.length;
        var diff = new Array(al); // al >= bl since a > b
        var borrow = 0;
        var i;
        var digit;
    
        for (i = 0; i < bl; i++) {
            digit = a[i] - borrow - b[i];
            if (digit < 0) {
                digit += BigInteger_base;
                borrow = 1;
            }
            else {
                borrow = 0;
            }
            diff[i] = digit;
        }
        for (i = bl; i < al; i++) {
            digit = a[i] - borrow;
            if (digit < 0) {
                digit += BigInteger_base;
            }
            else {
                diff[i++] = digit;
                break;
            }
            diff[i] = digit;
        }
        for ( ; i < al; i++) {
            diff[i] = a[i];
        }
    
        return new BigInteger(diff, sign, CONSTRUCT);
    };
    
    (function() {
        function addOne(n, sign) {
            var a = n._d;
            var sum = a.slice();
            var carry = true;
            var i = 0;
    
            while (true) {
                var digit = (a[i] || 0) + 1;
                sum[i] = digit % BigInteger_base;
                if (digit <= BigInteger_base - 1) {
                    break;
                }
                ++i;
            }
    
            return new BigInteger(sum, sign, CONSTRUCT);
        }
    
        function subtractOne(n, sign) {
            var a = n._d;
            var sum = a.slice();
            var borrow = true;
            var i = 0;
    
            while (true) {
                var digit = (a[i] || 0) - 1;
                if (digit < 0) {
                    sum[i] = digit + BigInteger_base;
                }
                else {
                    sum[i] = digit;
                    break;
                }
                ++i;
            }
    
            return new BigInteger(sum, sign, CONSTRUCT);
        }
    
        /*
            Function: next
            Get the next <BigInteger> (add one).
            Returns:
                *this* + 1.
            See Also:
                <add>, <prev>
        */
        BigInteger.prototype.next = function() {
            switch (this._s) {
            case 0:
                return ONE;
            case -1:
                return subtractOne(this, -1);
            // case 1:
            default:
                return addOne(this, 1);
            }
        };
    
        /*
            Function: prev
            Get the previous <BigInteger> (subtract one).
            Returns:
                *this* - 1.
            See Also:
                <next>, <subtract>
        */
        BigInteger.prototype.prev = function() {
            switch (this._s) {
            case 0:
                return M_ONE;
            case -1:
                return addOne(this, -1);
            // case 1:
            default:
                return subtractOne(this, 1);
            }
        };
    })();
    
    /*
        Function: compareAbs
        Compare the absolute value of two <BigIntegers>.
        Calling <compareAbs> is faster than calling <abs> twice, then <compare>.
        Parameters:
            n - The number to compare to *this*. Will be converted to a <BigInteger>.
        Returns:
            -1, 0, or +1 if *|this|* is less than, equal to, or greater than *|n|*.
        See Also:
            <compare>, <abs>
    */
    BigInteger.prototype.compareAbs = function(n) {
        if (this === n) {
            return 0;
        }
    
        if (!(n instanceof BigInteger)) {
            if (!isFinite(n)) {
                return(isNaN(n) ? n : -1);
            }
            n = BigInteger(n);
        }
    
        if (this._s === 0) {
            return (n._s !== 0) ? -1 : 0;
        }
        if (n._s === 0) {
            return 1;
        }
    
        var l = this._d.length;
        var nl = n._d.length;
        if (l < nl) {
            return -1;
        }
        else if (l > nl) {
            return 1;
        }
    
        var a = this._d;
        var b = n._d;
        for (var i = l-1; i >= 0; i--) {
            if (a[i] !== b[i]) {
                return a[i] < b[i] ? -1 : 1;
            }
        }
    
        return 0;
    };
    
    /*
        Function: compare
        Compare two <BigIntegers>.
        Parameters:
            n - The number to compare to *this*. Will be converted to a <BigInteger>.
        Returns:
            -1, 0, or +1 if *this* is less than, equal to, or greater than *n*.
        See Also:
            <compareAbs>, <isPositive>, <isNegative>, <isUnit>
    */
    BigInteger.prototype.compare = function(n) {
        if (this === n) {
            return 0;
        }
    
        n = BigInteger(n);
    
        if (this._s === 0) {
            return -n._s;
        }
    
        if (this._s === n._s) { // both positive or both negative
            var cmp = this.compareAbs(n);
            return cmp * this._s;
        }
        else {
            return this._s;
        }
    };
    
    /*
        Function: isUnit
        Return true iff *this* is either 1 or -1.
        Returns:
            true if *this* compares equal to <BigInteger.ONE> or <BigInteger.M_ONE>.
        See Also:
            <isZero>, <isNegative>, <isPositive>, <compareAbs>, <compare>,
            <BigInteger.ONE>, <BigInteger.M_ONE>
    */
    BigInteger.prototype.isUnit = function() {
        return this === ONE ||
            this === M_ONE ||
            (this._d.length === 1 && this._d[0] === 1);
    };
    
    /*
        Function: multiply
        Multiply two <BigIntegers>.
        Parameters:
            n - The number to multiply *this* by. Will be converted to a
            <BigInteger>.
        Returns:
            The numbers multiplied together.
        See Also:
            <add>, <subtract>, <quotient>, <square>
    */
    BigInteger.prototype.multiply = function(n) {
        // TODO: Consider adding Karatsuba multiplication for large numbers
        if (this._s === 0) {
            return ZERO;
        }
    
        n = BigInteger(n);
        if (n._s === 0) {
            return ZERO;
        }
        if (this.isUnit()) {
            if (this._s < 0) {
                return n.negate();
            }
            return n;
        }
        if (n.isUnit()) {
            if (n._s < 0) {
                return this.negate();
            }
            return this;
        }
        if (this === n) {
            return this.square();
        }
    
        var r = (this._d.length >= n._d.length);
        var a = (r ? this : n)._d; // a will be longer than b
        var b = (r ? n : this)._d;
        var al = a.length;
        var bl = b.length;
    
        var pl = al + bl;
        var partial = new Array(pl);
        var i;
        for (i = 0; i < pl; i++) {
            partial[i] = 0;
        }
    
        for (i = 0; i < bl; i++) {
            var carry = 0;
            var bi = b[i];
            var jlimit = al + i;
            var digit;
            for (var j = i; j < jlimit; j++) {
                digit = partial[j] + bi * a[j - i] + carry;
                carry = (digit / BigInteger_base) | 0;
                partial[j] = (digit % BigInteger_base) | 0;
            }
            if (carry) {
                digit = partial[j] + carry;
                carry = (digit / BigInteger_base) | 0;
                partial[j] = digit % BigInteger_base;
            }
        }
        return new BigInteger(partial, this._s * n._s, CONSTRUCT);
    };
    
    // Multiply a BigInteger by a single-digit native number
    // Assumes that this and n are >= 0
    // This is not really intended to be used outside the library itself
    BigInteger.prototype.multiplySingleDigit = function(n) {
        if (n === 0 || this._s === 0) {
            return ZERO;
        }
        if (n === 1) {
            return this;
        }
    
        var digit;
        if (this._d.length === 1) {
            digit = this._d[0] * n;
            if (digit >= BigInteger_base) {
                return new BigInteger([(digit % BigInteger_base)|0,
                        (digit / BigInteger_base)|0], 1, CONSTRUCT);
            }
            return new BigInteger([digit], 1, CONSTRUCT);
        }
    
        if (n === 2) {
            return this.add(this);
        }
        if (this.isUnit()) {
            return new BigInteger([n], 1, CONSTRUCT);
        }
    
        var a = this._d;
        var al = a.length;
    
        var pl = al + 1;
        var partial = new Array(pl);
        for (var i = 0; i < pl; i++) {
            partial[i] = 0;
        }
    
        var carry = 0;
        for (var j = 0; j < al; j++) {
            digit = n * a[j] + carry;
            carry = (digit / BigInteger_base) | 0;
            partial[j] = (digit % BigInteger_base) | 0;
        }
        if (carry) {
            partial[j] = carry;
        }
    
        return new BigInteger(partial, 1, CONSTRUCT);
    };
    
    /*
        Function: square
        Multiply a <BigInteger> by itself.
        This is slightly faster than regular multiplication, since it removes the
        duplicated multiplcations.
        Returns:
            > this.multiply(this)
        See Also:
            <multiply>
    */
    BigInteger.prototype.square = function() {
        // Normally, squaring a 10-digit number would take 100 multiplications.
        // Of these 10 are unique diagonals, of the remaining 90 (100-10), 45 are repeated.
        // This procedure saves (N*(N-1))/2 multiplications, (e.g., 45 of 100 multiplies).
        // Based on code by Gary Darby, Intellitech Systems Inc., www.DelphiForFun.org
    
        if (this._s === 0) {
            return ZERO;
        }
        if (this.isUnit()) {
            return ONE;
        }
    
        var digits = this._d;
        var length = digits.length;
        var imult1 = new Array(length + length + 1);
        var product, carry, k;
        var i;
    
        // Calculate diagonal
        for (i = 0; i < length; i++) {
            k = i * 2;
            product = digits[i] * digits[i];
            carry = (product / BigInteger_base) | 0;
            imult1[k] = product % BigInteger_base;
            imult1[k + 1] = carry;
        }
    
        // Calculate repeating part
        for (i = 0; i < length; i++) {
            carry = 0;
            k = i * 2 + 1;
            for (var j = i + 1; j < length; j++, k++) {
                product = digits[j] * digits[i] * 2 + imult1[k] + carry;
                carry = (product / BigInteger_base) | 0;
                imult1[k] = product % BigInteger_base;
            }
            k = length + i;
            var digit = carry + imult1[k];
            carry = (digit / BigInteger_base) | 0;
            imult1[k] = digit % BigInteger_base;
            imult1[k + 1] += carry;
        }
    
        return new BigInteger(imult1, 1, CONSTRUCT);
    };
    
    /*
        Function: quotient
        Divide two <BigIntegers> and truncate towards zero.
        <quotient> throws an exception if *n* is zero.
        Parameters:
            n - The number to divide *this* by. Will be converted to a <BigInteger>.
        Returns:
            The *this* / *n*, truncated to an integer.
        See Also:
            <add>, <subtract>, <multiply>, <divRem>, <remainder>
    */
    BigInteger.prototype.quotient = function(n) {
        return this.divRem(n)[0];
    };
    
    /*
        Function: divide
        Deprecated synonym for <quotient>.
    */
    BigInteger.prototype.divide = BigInteger.prototype.quotient;
    
    /*
        Function: remainder
        Calculate the remainder of two <BigIntegers>.
        <remainder> throws an exception if *n* is zero.
        Parameters:
            n - The remainder after *this* is divided *this* by *n*. Will be
                converted to a <BigInteger>.
        Returns:
            *this* % *n*.
        See Also:
            <divRem>, <quotient>
    */
    BigInteger.prototype.remainder = function(n) {
        return this.divRem(n)[1];
    };
    
    /*
        Function: divRem
        Calculate the integer quotient and remainder of two <BigIntegers>.
        <divRem> throws an exception if *n* is zero.
        Parameters:
            n - The number to divide *this* by. Will be converted to a <BigInteger>.
        Returns:
            A two-element array containing the quotient and the remainder.
            > a.divRem(b)
            is exactly equivalent to
            > [a.quotient(b), a.remainder(b)]
            except it is faster, because they are calculated at the same time.
        See Also:
            <quotient>, <remainder>
    */
    BigInteger.prototype.divRem = function(n) {
        n = BigInteger(n);
        if (n._s === 0) {
            throw new Error("Divide by zero");
        }
        if (this._s === 0) {
            return [ZERO, ZERO];
        }
        if (n._d.length === 1) {
            return this.divRemSmall(n._s * n._d[0]);
        }
    
        // Test for easy cases -- |n1| <= |n2|
        switch (this.compareAbs(n)) {
        case 0: // n1 == n2
            return [this._s === n._s ? ONE : M_ONE, ZERO];
        case -1: // |n1| < |n2|
            return [ZERO, this];
        }
    
        var sign = this._s * n._s;
        var a = n.abs();
        var b_digits = this._d;
        var b_index = b_digits.length;
        var digits = n._d.length;
        var quot = [];
        var guess;
    
        var part = new BigInteger([], 0, CONSTRUCT);
    
        while (b_index) {
            part._d.unshift(b_digits[--b_index]);
            part = new BigInteger(part._d, 1, CONSTRUCT);
    
            if (part.compareAbs(n) < 0) {
                quot.push(0);
                continue;
            }
            if (part._s === 0) {
                guess = 0;
            }
            else {
                var xlen = part._d.length, ylen = a._d.length;
                var highx = part._d[xlen-1]*BigInteger_base + part._d[xlen-2];
                var highy = a._d[ylen-1]*BigInteger_base + a._d[ylen-2];
                if (part._d.length > a._d.length) {
                    // The length of part._d can either match a._d length,
                    // or exceed it by one.
                    highx = (highx+1)*BigInteger_base;
                }
                guess = Math.ceil(highx/highy);
            }
            do {
                var check = a.multiplySingleDigit(guess);
                if (check.compareAbs(part) <= 0) {
                    break;
                }
                guess--;
            } while (guess);
    
            quot.push(guess);
            if (!guess) {
                continue;
            }
            var diff = part.subtract(check);
            part._d = diff._d.slice();
        }
    
        return [new BigInteger(quot.reverse(), sign, CONSTRUCT),
               new BigInteger(part._d, this._s, CONSTRUCT)];
    };
    
    // Throws an exception if n is outside of (-BigInteger.base, -1] or
    // [1, BigInteger.base).  It's not necessary to call this, since the
    // other division functions will call it if they are able to.
    BigInteger.prototype.divRemSmall = function(n) {
        var r;
        n = +n;
        if (n === 0) {
            throw new Error("Divide by zero");
        }
    
        var n_s = n < 0 ? -1 : 1;
        var sign = this._s * n_s;
        n = Math.abs(n);
    
        if (n < 1 || n >= BigInteger_base) {
            throw new Error("Argument out of range");
        }
    
        if (this._s === 0) {
            return [ZERO, ZERO];
        }
    
        if (n === 1 || n === -1) {
            return [(sign === 1) ? this.abs() : new BigInteger(this._d, sign, CONSTRUCT), ZERO];
        }
    
        // 2 <= n < BigInteger_base
    
        // divide a single digit by a single digit
        if (this._d.length === 1) {
            var q = new BigInteger([(this._d[0] / n) | 0], 1, CONSTRUCT);
            r = new BigInteger([(this._d[0] % n) | 0], 1, CONSTRUCT);
            if (sign < 0) {
                q = q.negate();
            }
            if (this._s < 0) {
                r = r.negate();
            }
            return [q, r];
        }
    
        var digits = this._d.slice();
        var quot = new Array(digits.length);
        var part = 0;
        var diff = 0;
        var i = 0;
        var guess;
    
        while (digits.length) {
            part = part * BigInteger_base + digits[digits.length - 1];
            if (part < n) {
                quot[i++] = 0;
                digits.pop();
                diff = BigInteger_base * diff + part;
                continue;
            }
            if (part === 0) {
                guess = 0;
            }
            else {
                guess = (part / n) | 0;
            }
    
            var check = n * guess;
            diff = part - check;
            quot[i++] = guess;
            if (!guess) {
                digits.pop();
                continue;
            }
    
            digits.pop();
            part = diff;
        }
    
        r = new BigInteger([diff], 1, CONSTRUCT);
        if (this._s < 0) {
            r = r.negate();
        }
        return [new BigInteger(quot.reverse(), sign, CONSTRUCT), r];
    };
    
    /*
        Function: isEven
        Return true iff *this* is divisible by two.
        Note that <BigInteger.ZERO> is even.
        Returns:
            true if *this* is even, false otherwise.
        See Also:
            <isOdd>
    */
    BigInteger.prototype.isEven = function() {
        var digits = this._d;
        return this._s === 0 || digits.length === 0 || (digits[0] % 2) === 0;
    };
    
    /*
        Function: isOdd
        Return true iff *this* is not divisible by two.
        Returns:
            true if *this* is odd, false otherwise.
        See Also:
            <isEven>
    */
    BigInteger.prototype.isOdd = function() {
        return !this.isEven();
    };
    
    /*
        Function: sign
        Get the sign of a <BigInteger>.
        Returns:
            * -1 if *this* < 0
            * 0 if *this* == 0
            * +1 if *this* > 0
        See Also:
            <isZero>, <isPositive>, <isNegative>, <compare>, <BigInteger.ZERO>
    */
    BigInteger.prototype.sign = function() {
        return this._s;
    };
    
    /*
        Function: isPositive
        Return true iff *this* > 0.
        Returns:
            true if *this*.compare(<BigInteger.ZERO>) == 1.
        See Also:
            <sign>, <isZero>, <isNegative>, <isUnit>, <compare>, <BigInteger.ZERO>
    */
    BigInteger.prototype.isPositive = function() {
        return this._s > 0;
    };
    
    /*
        Function: isNegative
        Return true iff *this* < 0.
        Returns:
            true if *this*.compare(<BigInteger.ZERO>) == -1.
        See Also:
            <sign>, <isPositive>, <isZero>, <isUnit>, <compare>, <BigInteger.ZERO>
    */
    BigInteger.prototype.isNegative = function() {
        return this._s < 0;
    };
    
    /*
        Function: isZero
        Return true iff *this* == 0.
        Returns:
            true if *this*.compare(<BigInteger.ZERO>) == 0.
        See Also:
            <sign>, <isPositive>, <isNegative>, <isUnit>, <BigInteger.ZERO>
    */
    BigInteger.prototype.isZero = function() {
        return this._s === 0;
    };
    
    /*
        Function: exp10
        Multiply a <BigInteger> by a power of 10.
        This is equivalent to, but faster than
        > if (n >= 0) {
        >     return this.multiply(BigInteger("1e" + n));
        > }
        > else { // n <= 0
        >     return this.quotient(BigInteger("1e" + -n));
        > }
        Parameters:
            n - The power of 10 to multiply *this* by. *n* is converted to a
            javascipt number and must be no greater than <BigInteger.MAX_EXP>
            (0x7FFFFFFF), or an exception will be thrown.
        Returns:
            *this* * (10 ** *n*), truncated to an integer if necessary.
        See Also:
            <pow>, <multiply>
    */
    BigInteger.prototype.exp10 = function(n) {
        n = +n;
        if (n === 0) {
            return this;
        }
        if (Math.abs(n) > Number(MAX_EXP)) {
            throw new Error("exponent too large in BigInteger.exp10");
        }
        // Optimization for this == 0. This also keeps us from having to trim zeros in the positive n case
        if (this._s === 0) {
            return ZERO;
        }
        if (n > 0) {
            var k = new BigInteger(this._d.slice(), this._s, CONSTRUCT);
    
            for (; n >= BigInteger_base_log10; n -= BigInteger_base_log10) {
                k._d.unshift(0);
            }
            if (n == 0)
                return k;
            k._s = 1;
            k = k.multiplySingleDigit(Math.pow(10, n));
            return (this._s < 0 ? k.negate() : k);
        } else if (-n >= this._d.length*BigInteger_base_log10) {
            return ZERO;
        } else {
            var k = new BigInteger(this._d.slice(), this._s, CONSTRUCT);
    
            for (n = -n; n >= BigInteger_base_log10; n -= BigInteger_base_log10) {
                k._d.shift();
            }
            return (n == 0) ? k : k.divRemSmall(Math.pow(10, n))[0];
        }
    };
    
    /*
        Function: pow
        Raise a <BigInteger> to a power.
        In this implementation, 0**0 is 1.
        Parameters:
            n - The exponent to raise *this* by. *n* must be no greater than
            <BigInteger.MAX_EXP> (0x7FFFFFFF), or an exception will be thrown.
        Returns:
            *this* raised to the *nth* power.
        See Also:
            <modPow>
    */
    BigInteger.prototype.pow = function(n) {
        if (this.isUnit()) {
            if (this._s > 0) {
                return this;
            }
            else {
                return BigInteger(n).isOdd() ? this : this.negate();
            }
        }
    
        n = BigInteger(n);
        if (n._s === 0) {
            return ONE;
        }
        else if (n._s < 0) {
            if (this._s === 0) {
                throw new Error("Divide by zero");
            }
            else {
                return ZERO;
            }
        }
        if (this._s === 0) {
            return ZERO;
        }
        if (n.isUnit()) {
            return this;
        }
    
        if (n.compareAbs(MAX_EXP) > 0) {
            throw new Error("exponent too large in BigInteger.pow");
        }
        var x = this;
        var aux = ONE;
        var two = BigInteger.small[2];
    
        while (n.isPositive()) {
            if (n.isOdd()) {
                aux = aux.multiply(x);
                if (n.isUnit()) {
                    return aux;
                }
            }
            x = x.square();
            n = n.quotient(two);
        }
    
        return aux;
    };
    
    /*
        Function: modPow
        Raise a <BigInteger> to a power (mod m).
        Because it is reduced by a modulus, <modPow> is not limited by
        <BigInteger.MAX_EXP> like <pow>.
        Parameters:
            exponent - The exponent to raise *this* by. Must be positive.
            modulus - The modulus.
        Returns:
            *this* ^ *exponent* (mod *modulus*).
        See Also:
            <pow>, <mod>
    */
    BigInteger.prototype.modPow = function(exponent, modulus) {
        var result = ONE;
        var base = this;
    
        while (exponent.isPositive()) {
            if (exponent.isOdd()) {
                result = result.multiply(base).remainder(modulus);
            }
    
            exponent = exponent.quotient(BigInteger.small[2]);
            if (exponent.isPositive()) {
                base = base.square().remainder(modulus);
            }
        }
    
        return result;
    };
    
    /*
        Function: log
        Get the natural logarithm of a <BigInteger> as a native JavaScript number.
        This is equivalent to
        > Math.log(this.toJSValue())
        but handles values outside of the native number range.
        Returns:
            log( *this* )
        See Also:
            <toJSValue>
    */
    BigInteger.prototype.log = function() {
        switch (this._s) {
        case 0:	 return -Infinity;
        case -1: return NaN;
        default: // Fall through.
        }
    
        var l = this._d.length;
    
        if (l*BigInteger_base_log10 < 30) {
            return Math.log(this.valueOf());
        }
    
        var N = Math.ceil(30/BigInteger_base_log10);
        var firstNdigits = this._d.slice(l - N);
        return Math.log((new BigInteger(firstNdigits, 1, CONSTRUCT)).valueOf()) + (l - N) * Math.log(BigInteger_base);
    };
    
    /*
        Function: valueOf
        Convert a <BigInteger> to a native JavaScript integer.
        This is called automatically by JavaScipt to convert a <BigInteger> to a
        native value.
        Returns:
            > parseInt(this.toString(), 10)
        See Also:
            <toString>, <toJSValue>
    */
    BigInteger.prototype.valueOf = function() {
        return parseInt(this.toString(), 10);
    };
    
    /*
        Function: toJSValue
        Convert a <BigInteger> to a native JavaScript integer.
        This is the same as valueOf, but more explicitly named.
        Returns:
            > parseInt(this.toString(), 10)
        See Also:
            <toString>, <valueOf>
    */
    BigInteger.prototype.toJSValue = function() {
        return parseInt(this.toString(), 10);
    };
    
    
    /*
     Function: lowVal
     Author: Lucas Jones
     */
    BigInteger.prototype.lowVal = function () {
        return this._d[0] || 0;
    };
    
    var MAX_EXP = BigInteger(0x7FFFFFFF);
    // Constant: MAX_EXP
    // The largest exponent allowed in <pow> and <exp10> (0x7FFFFFFF or 2147483647).
    BigInteger.MAX_EXP = MAX_EXP;
    
    (function() {
        function makeUnary(fn) {
            return function(a) {
                return fn.call(BigInteger(a));
            };
        }
    
        function makeBinary(fn) {
            return function(a, b) {
                return fn.call(BigInteger(a), BigInteger(b));
            };
        }
    
        function makeTrinary(fn) {
            return function(a, b, c) {
                return fn.call(BigInteger(a), BigInteger(b), BigInteger(c));
            };
        }
    
        (function() {
            var i, fn;
            var unary = "toJSValue,isEven,isOdd,sign,isZero,isNegative,abs,isUnit,square,negate,isPositive,toString,next,prev,log".split(",");
            var binary = "compare,remainder,divRem,subtract,add,quotient,divide,multiply,pow,compareAbs".split(",");
            var trinary = ["modPow"];
    
            for (i = 0; i < unary.length; i++) {
                fn = unary[i];
                BigInteger[fn] = makeUnary(BigInteger.prototype[fn]);
            }
    
            for (i = 0; i < binary.length; i++) {
                fn = binary[i];
                BigInteger[fn] = makeBinary(BigInteger.prototype[fn]);
            }
    
            for (i = 0; i < trinary.length; i++) {
                fn = trinary[i];
                BigInteger[fn] = makeTrinary(BigInteger.prototype[fn]);
            }
    
            BigInteger.exp10 = function(x, n) {
                return BigInteger(x).exp10(n);
            };
        })();
    })();
    
    exports.JSBigInt = BigInteger; // exports.BigInteger changed to exports.JSBigInt
    })(typeof exports !== 'undefined' ? exports : this);
},{}],12:[function(require,module,exports){
(function (Buffer){
'use strict';

/**
 * Credits to https://github.com/cryptocoinjs/blake-hash
 */
Blake256.sigma = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
    [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
    [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
    [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
    [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
    [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
    [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
    [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
    [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
    [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
    [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
    [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
    [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9]
]

Blake256.u256 = [
    0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344,
    0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89,
    0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c,
    0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917
]

Blake256.padding = new Buffer([
    0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
])

Blake256.prototype._length_carry = function (arr) {
    for (var j = 0; j < arr.length; ++j) {
        if (arr[j] < 0x0100000000) break
        arr[j] -= 0x0100000000
        arr[j + 1] += 1
    }
}

Blake256.prototype.update = function (data, encoding) {
    data = new Buffer(data, encoding);
    var block = this._block
    var offset = 0

    while (this._blockOffset + data.length - offset >= block.length) {
        for (var i = this._blockOffset; i < block.length;) block[i++] = data[offset++]

        this._length[0] += block.length * 8
        this._length_carry(this._length)

        this._compress()
        this._blockOffset = 0
    }

    while (offset < data.length) block[this._blockOffset++] = data[offset++]
    return this;
}

var zo = new Buffer([0x01])
var oo = new Buffer([0x81])

function rot (x, n) {
    return ((x << (32 - n)) | (x >>> n)) >>> 0
}

function g (v, m, i, a, b, c, d, e) {
    var sigma = Blake256.sigma
    var u256 = Blake256.u256

    v[a] = (v[a] + ((m[sigma[i][e]] ^ u256[sigma[i][e + 1]]) >>> 0) + v[b]) >>> 0
    v[d] = rot(v[d] ^ v[a], 16)
    v[c] = (v[c] + v[d]) >>> 0
    v[b] = rot(v[b] ^ v[c], 12)
    v[a] = (v[a] + ((m[sigma[i][e + 1]] ^ u256[sigma[i][e]]) >>> 0) + v[b]) >>> 0
    v[d] = rot(v[d] ^ v[a], 8)
    v[c] = (v[c] + v[d]) >>> 0
    v[b] = rot(v[b] ^ v[c], 7)
}

function Blake256 () {
    this._h = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]

    this._s = [0, 0, 0, 0]

    this._block = new Buffer(64)
    this._blockOffset = 0
    this._length = [0, 0]

    this._nullt = false

    this._zo = zo
    this._oo = oo
}

Blake256.prototype._compress = function () {
    var u256 = Blake256.u256
    var v = new Array(16)
    var m = new Array(16)
    var i

    for (i = 0; i < 16; ++i) m[i] = this._block.readUInt32BE(i * 4)
    for (i = 0; i < 8; ++i) v[i] = this._h[i] >>> 0
    for (i = 8; i < 12; ++i) v[i] = (this._s[i - 8] ^ u256[i - 8]) >>> 0
    for (i = 12; i < 16; ++i) v[i] = u256[i - 8]

    if (!this._nullt) {
        v[12] = (v[12] ^ this._length[0]) >>> 0
        v[13] = (v[13] ^ this._length[0]) >>> 0
        v[14] = (v[14] ^ this._length[1]) >>> 0
        v[15] = (v[15] ^ this._length[1]) >>> 0
    }

    for (i = 0; i < 14; ++i) {
        /* column step */
        g(v, m, i, 0, 4, 8, 12, 0)
        g(v, m, i, 1, 5, 9, 13, 2)
        g(v, m, i, 2, 6, 10, 14, 4)
        g(v, m, i, 3, 7, 11, 15, 6)
        /* diagonal step */
        g(v, m, i, 0, 5, 10, 15, 8)
        g(v, m, i, 1, 6, 11, 12, 10)
        g(v, m, i, 2, 7, 8, 13, 12)
        g(v, m, i, 3, 4, 9, 14, 14)
    }

    for (i = 0; i < 16; ++i) this._h[i % 8] = (this._h[i % 8] ^ v[i]) >>> 0
    for (i = 0; i < 8; ++i) this._h[i] = (this._h[i] ^ this._s[i % 4]) >>> 0
}

Blake256.prototype._padding = function () {
    var lo = this._length[0] + this._blockOffset * 8
    var hi = this._length[1]
    if (lo >= 0x0100000000) {
        lo -= 0x0100000000
        hi += 1
    }

    var msglen = new Buffer(8)
    msglen.writeUInt32BE(hi, 0)
    msglen.writeUInt32BE(lo, 4)

    if (this._blockOffset === 55) {
        this._length[0] -= 8
        this.update(this._oo)
    } else {
        if (this._blockOffset < 55) {
            if (this._blockOffset === 0) this._nullt = true
            this._length[0] -= (55 - this._blockOffset) * 8
            this.update(Blake256.padding.slice(0, 55 - this._blockOffset))
        } else {
            this._length[0] -= (64 - this._blockOffset) * 8
            this.update(Blake256.padding.slice(0, 64 - this._blockOffset))
            this._length[0] -= 55 * 8
            this.update(Blake256.padding.slice(1, 1 + 55))
            this._nullt = true
        }

        this.update(this._zo)
        this._length[0] -= 8
    }

    this._length[0] -= 64
    this.update(msglen)
}

Blake256.prototype.digest = function (encoding) {
    this._padding()

    var buffer = new Buffer(32)
    for (var i = 0; i < 8; ++i) buffer.writeUInt32BE(this._h[i], i * 4)
    return buffer.toString(encoding);
}

module.exports = Blake256;
}).call(this,require("buffer").Buffer)
},{"buffer":3}],13:[function(require,module,exports){
'use strict';

/**
 * Credits to https://github.com/emilbayes/blake2b
 *
 * Copyright (c) 2017, Emil Bay github@tixz.dk
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA (v, a, b) {
  var o0 = v[a] + v[b]
  var o1 = v[a + 1] + v[b + 1]
  if (o0 >= 0x100000000) {
    o1++
  }
  v[a] = o0
  v[a + 1] = o1
}

// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC (v, a, b0, b1) {
  var o0 = v[a] + b0
  if (b0 < 0) {
    o0 += 0x100000000
  }
  var o1 = v[a + 1] + b1
  if (o0 >= 0x100000000) {
    o1++
  }
  v[a] = o0
  v[a + 1] = o1
}

// Little-endian byte access
function B2B_GET32 (arr, i) {
  return (arr[i] ^
  (arr[i + 1] << 8) ^
  (arr[i + 2] << 16) ^
  (arr[i + 3] << 24))
}

// G Mixing function
// The ROTRs are inlined for speed
function B2B_G (a, b, c, d, ix, iy) {
  var x0 = m[ix]
  var x1 = m[ix + 1]
  var y0 = m[iy]
  var y1 = m[iy + 1]

  ADD64AA(v, a, b) // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
  ADD64AC(v, a, x0, x1) // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

  // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
  var xor0 = v[d] ^ v[a]
  var xor1 = v[d + 1] ^ v[a + 1]
  v[d] = xor1
  v[d + 1] = xor0

  ADD64AA(v, c, d)

  // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
  xor0 = v[b] ^ v[c]
  xor1 = v[b + 1] ^ v[c + 1]
  v[b] = (xor0 >>> 24) ^ (xor1 << 8)
  v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8)

  ADD64AA(v, a, b)
  ADD64AC(v, a, y0, y1)

  // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
  xor0 = v[d] ^ v[a]
  xor1 = v[d + 1] ^ v[a + 1]
  v[d] = (xor0 >>> 16) ^ (xor1 << 16)
  v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16)

  ADD64AA(v, c, d)

  // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
  xor0 = v[b] ^ v[c]
  xor1 = v[b + 1] ^ v[c + 1]
  v[b] = (xor1 >>> 31) ^ (xor0 << 1)
  v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1)
}

// Initialization Vector
var BLAKE2B_IV32 = new Uint32Array([
  0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
  0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
  0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
  0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
])

var SIGMA8 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
  11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
  7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
  9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
  2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
  12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
  13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
  6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
  10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
]

// These are offsets into a uint64 buffer.
// Multiply them all by 2 to make them offsets into a uint32 buffer,
// because this is Javascript and we don't have uint64s
var SIGMA82 = new Uint8Array(SIGMA8.map(function (x) { return x * 2 }))

// Compression function. 'last' flag indicates last block.
// Note we're representing 16 uint64s as 32 uint32s
var v = new Uint32Array(32)
var m = new Uint32Array(32)
function blake2bCompress (ctx, last) {
  var i = 0

  // init work variables
  for (i = 0; i < 16; i++) {
    v[i] = ctx.h[i]
    v[i + 16] = BLAKE2B_IV32[i]
  }

  // low 64 bits of offset
  v[24] = v[24] ^ ctx.t
  v[25] = v[25] ^ (ctx.t / 0x100000000)
  // high 64 bits not supported, offset may not be higher than 2**53-1

  // last block flag set ?
  if (last) {
    v[28] = ~v[28]
    v[29] = ~v[29]
  }

  // get little-endian words
  for (i = 0; i < 32; i++) {
    m[i] = B2B_GET32(ctx.b, 4 * i)
  }

  // twelve rounds of mixing
  for (i = 0; i < 12; i++) {
    B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1])
    B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3])
    B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5])
    B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7])
    B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9])
    B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11])
    B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13])
    B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15])
  }

  for (i = 0; i < 16; i++) {
    ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16]
  }
}

// reusable parameter_block
var parameter_block = new Uint8Array([
  0, 0, 0, 0,      //  0: outlen, keylen, fanout, depth
  0, 0, 0, 0,      //  4: leaf length, sequential mode
  0, 0, 0, 0,      //  8: node offset
  0, 0, 0, 0,      // 12: node offset
  0, 0, 0, 0,      // 16: node depth, inner length, rfu
  0, 0, 0, 0,      // 20: rfu
  0, 0, 0, 0,      // 24: rfu
  0, 0, 0, 0,      // 28: rfu
  0, 0, 0, 0,      // 32: salt
  0, 0, 0, 0,      // 36: salt
  0, 0, 0, 0,      // 40: salt
  0, 0, 0, 0,      // 44: salt
  0, 0, 0, 0,      // 48: personal
  0, 0, 0, 0,      // 52: personal
  0, 0, 0, 0,      // 56: personal
  0, 0, 0, 0       // 60: personal
])

// Creates a BLAKE2b hashing context
// Requires an output length between 1 and 64 bytes
// Takes an optional Uint8Array key
function Blake2b (outlen, key, salt, personal) {
  // zero out parameter_block before usage
  parameter_block.fill(0)
  // state, 'param block'

  this.b = new Uint8Array(128)
  this.h = new Uint32Array(16)
  this.t = 0 // input count
  this.c = 0 // pointer within buffer
  this.outlen = outlen // output length in bytes

  parameter_block[0] = outlen
  if (key) parameter_block[1] = key.length
  parameter_block[2] = 1 // fanout
  parameter_block[3] = 1 // depth

  if (salt) parameter_block.set(salt, 32)
  if (personal) parameter_block.set(personal, 48)

  // initialize hash state
  for (var i = 0; i < 16; i++) {
    this.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameter_block, i * 4)
  }

  // key the hash, if applicable
  if (key) {
    blake2bUpdate(this, key)
    // at the end
    this.c = 128
  }
}

Blake2b.prototype.update = function (input) {
  blake2bUpdate(this, input)
  return this
}

Blake2b.prototype.digest = function (out) {
  var buf = (!out || out === 'binary' || out === 'hex') ? new Uint8Array(this.outlen) : out
  blake2bFinal(this, buf)
  if (out === 'hex') return hexSlice(buf)
  return buf
}

Blake2b.prototype.final = Blake2b.prototype.digest

// Updates a BLAKE2b streaming hash
// Requires hash context and Uint8Array (byte array)
function blake2bUpdate (ctx, input) {
  for (var i = 0; i < input.length; i++) {
    if (ctx.c === 128) { // buffer full ?
      ctx.t += ctx.c // add counters
      blake2bCompress(ctx, false) // compress (not last)
      ctx.c = 0 // counter to zero
    }
    ctx.b[ctx.c++] = input[i]
  }
}

// Completes a BLAKE2b streaming hash
// Returns a Uint8Array containing the message digest
function blake2bFinal (ctx, out) {
  ctx.t += ctx.c // mark last block offset

  while (ctx.c < 128) { // fill up with zeros
    ctx.b[ctx.c++] = 0
  }
  blake2bCompress(ctx, true) // final block flag = 1

  for (var i = 0; i < ctx.outlen; i++) {
    out[i] = ctx.h[i >> 2] >> (8 * (i & 3))
  }
  return out
}

function hexSlice (buf) {
  var str = ''
  for (var i = 0; i < buf.length; i++) str += toHex(buf[i])
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

module.exports = Blake2b;
},{}],14:[function(require,module,exports){
var JSBigInt = require('./biginteger')['JSBigInt'];

/**
Copyright (c) 2017, moneroexamples

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
may be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Parts of the project are originally copyright (c) 2014-2017, MyMonero.com
*/

var cnBase58 = (function () {
    var b58 = {};

    var alphabet_str = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var alphabet = [];
    for (var i = 0; i < alphabet_str.length; i++) {
        alphabet.push(alphabet_str.charCodeAt(i));
    }
    var encoded_block_sizes = [0, 2, 3, 5, 6, 7, 9, 10, 11];

    var alphabet_size = alphabet.length;
    var full_block_size = 8;
    var full_encoded_block_size = 11;

    var UINT64_MAX = new JSBigInt(2).pow(64);

    function hextobin(hex) {
        if (hex.length % 2 !== 0) throw "Hex string has invalid length!";
        var res = new Uint8Array(hex.length / 2);
        for (var i = 0; i < hex.length / 2; ++i) {
            res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        }
        return res;
    }

    function bintohex(bin) {
        var out = [];
        for (var i = 0; i < bin.length; ++i) {
            out.push(("0" + bin[i].toString(16)).slice(-2));
        }
        return out.join("");
    }

    function strtobin(str) {
        var res = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            res[i] = str.charCodeAt(i);
        }
        return res;
    }

    function bintostr(bin) {
        var out = [];
        for (var i = 0; i < bin.length; i++) {
            out.push(String.fromCharCode(bin[i]));
        }
        return out.join("");
    }

    function uint8_be_to_64(data) {
        if (data.length < 1 || data.length > 8) {
            throw "Invalid input length";
        }
        var res = JSBigInt.ZERO;
        var twopow8 = new JSBigInt(2).pow(8);
        var i = 0;
        switch (9 - data.length) {
        case 1:
            res = res.add(data[i++]);
        case 2:
            res = res.multiply(twopow8).add(data[i++]);
        case 3:
            res = res.multiply(twopow8).add(data[i++]);
        case 4:
            res = res.multiply(twopow8).add(data[i++]);
        case 5:
            res = res.multiply(twopow8).add(data[i++]);
        case 6:
            res = res.multiply(twopow8).add(data[i++]);
        case 7:
            res = res.multiply(twopow8).add(data[i++]);
        case 8:
            res = res.multiply(twopow8).add(data[i++]);
            break;
        default:
            throw "Impossible condition";
        }
        return res;
    }

    function uint64_to_8be(num, size) {
        var res = new Uint8Array(size);
        if (size < 1 || size > 8) {
            throw "Invalid input length";
        }
        var twopow8 = new JSBigInt(2).pow(8);
        for (var i = size - 1; i >= 0; i--) {
            res[i] = num.remainder(twopow8).toJSValue();
            num = num.divide(twopow8);
        }
        return res;
    }

    b58.encode_block = function (data, buf, index) {
        if (data.length < 1 || data.length > full_encoded_block_size) {
            throw "Invalid block length: " + data.length;
        }
        var num = uint8_be_to_64(data);
        var i = encoded_block_sizes[data.length] - 1;
        // while num > 0
        while (num.compare(0) === 1) {
            var div = num.divRem(alphabet_size);
            // remainder = num % alphabet_size
            var remainder = div[1];
            // num = num / alphabet_size
            num = div[0];
            buf[index + i] = alphabet[remainder.toJSValue()];
            i--;
        }
        return buf;
    };

    b58.encode = function (hex) {
        var data = hextobin(hex);
        if (data.length === 0) {
            return "";
        }
        var full_block_count = Math.floor(data.length / full_block_size);
        var last_block_size = data.length % full_block_size;
        var res_size = full_block_count * full_encoded_block_size + encoded_block_sizes[last_block_size];

        var res = new Uint8Array(res_size);
        var i;
        for (i = 0; i < res_size; ++i) {
            res[i] = alphabet[0];
        }
        for (i = 0; i < full_block_count; i++) {
            res = b58.encode_block(data.subarray(i * full_block_size, i * full_block_size + full_block_size), res, i * full_encoded_block_size);
        }
        if (last_block_size > 0) {
            res = b58.encode_block(data.subarray(full_block_count * full_block_size, full_block_count * full_block_size + last_block_size), res, full_block_count * full_encoded_block_size)
        }
        return bintostr(res);
    };

    b58.decode_block = function (data, buf, index) {
        if (data.length < 1 || data.length > full_encoded_block_size) {
            throw "Invalid block length: " + data.length;
        }

        var res_size = encoded_block_sizes.indexOf(data.length);
        if (res_size <= 0) {
            throw "Invalid block size";
        }
        var res_num = new JSBigInt(0);
        var order = new JSBigInt(1);
        for (var i = data.length - 1; i >= 0; i--) {
            var digit = alphabet.indexOf(data[i]);
            if (digit < 0) {
                throw "Invalid symbol";
            }
            var product = order.multiply(digit).add(res_num);
            // if product > UINT64_MAX
            if (product.compare(UINT64_MAX) === 1) {
                throw "Overflow";
            }
            res_num = product;
            order = order.multiply(alphabet_size);
        }
        if (res_size < full_block_size && (new JSBigInt(2).pow(8 * res_size).compare(res_num) <= 0)) {
            throw "Overflow 2";
        }
        buf.set(uint64_to_8be(res_num, res_size), index);
        return buf;
    };

    b58.decode = function (enc) {
        enc = strtobin(enc);
        if (enc.length === 0) {
            return "";
        }
        var full_block_count = Math.floor(enc.length / full_encoded_block_size);
        var last_block_size = enc.length % full_encoded_block_size;
        var last_block_decoded_size = encoded_block_sizes.indexOf(last_block_size);
        if (last_block_decoded_size < 0) {
            throw "Invalid encoded length";
        }
        var data_size = full_block_count * full_block_size + last_block_decoded_size;
        var data = new Uint8Array(data_size);
        for (var i = 0; i < full_block_count; i++) {
            data = b58.decode_block(enc.subarray(i * full_encoded_block_size, i * full_encoded_block_size + full_encoded_block_size), data, i * full_block_size);
        }
        if (last_block_size > 0) {
            data = b58.decode_block(enc.subarray(full_block_count * full_encoded_block_size, full_block_count * full_encoded_block_size + last_block_size), data, full_block_count * full_block_size);
        }
        return bintohex(data);
    };

    return b58;
})();
module.exports = cnBase58;
},{"./biginteger":11}],15:[function(require,module,exports){
// Copyright (c) 2017 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var bech32 = require('./bech32');

function convertbits (data, frombits, tobits, pad) {
  var acc = 0;
  var bits = 0;
  var ret = [];
  var maxv = (1 << tobits) - 1;
  for (var p = 0; p < data.length; ++p) {
    var value = data[p];
    if (value < 0 || (value >> frombits) !== 0) {
      return null;
    }
    acc = (acc << frombits) | value;
    bits += frombits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) {
      ret.push((acc << (tobits - bits)) & maxv);
    }
  } else if (bits >= frombits || ((acc << (tobits - bits)) & maxv)) {
    return null;
  }
  return ret;
}

function decode (hrp, addr) {
  var dec = bech32.decode(addr);
  if (dec === null || dec.hrp !== hrp || dec.data.length < 1 || dec.data[0] > 16) {
    return null;
  }
  var res = convertbits(dec.data.slice(1), 5, 8, false);
  if (res === null || res.length < 2 || res.length > 40) {
    return null;
  }
  if (dec.data[0] === 0 && res.length !== 20 && res.length !== 32) {
    return null;
  }
  return {version: dec.data[0], program: res};
}

function encode (hrp, version, program) {
  var ret = bech32.encode(hrp, [version].concat(convertbits(program, 8, 5, true)));
  if (decode(hrp, ret) === null) {
    return null;
  }
  return ret;
}

function isValidAddress(address, hrp) {
    var hrp = hrp || 'bc';
    var ret = decode(hrp, address);

    if (ret === null) {
        hrp = 'tb';
        ret = decode(hrp, address);
    }

    if (ret === null) {
        return false;
    }

    var recreate = encode(hrp, ret.version, ret.program);
    return recreate === address.toLowerCase();
}

module.exports = {
    encode: encode,
    decode: decode,
    isValidAddress: isValidAddress,
};

},{"./bech32":10}],16:[function(require,module,exports){
(function (process,global){
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.7.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2017
 * @license MIT
 */
/*jslint bitwise: true */
'use strict';

var ERROR = 'input is invalid type';
var WINDOW = typeof window === 'object';
var root = WINDOW ? window : {};
if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
}
var WEB_WORKER = !WINDOW && typeof self === 'object';
var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
if (NODE_JS) {
    root = global;
} else if (WEB_WORKER) {
    root = self;
}
var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
var HEX_CHARS = '0123456789abcdef'.split('');
var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
var KECCAK_PADDING = [1, 256, 65536, 16777216];
var PADDING = [6, 1536, 393216, 100663296];
var SHIFT = [0, 8, 16, 24];
var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
var BITS = [224, 256, 384, 512];
var SHAKE_BITS = [128, 256];
var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
};

if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}

if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
}

var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
        return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
};

var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
        return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
};

var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
        return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
};

var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
        return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
};

var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createMethod(bits, padding, type);
    }
    return method;
};

var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
        return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
        return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
};

var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
        return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
        return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
};

var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
        if (!n && !s) {
            return methods['shake' + bits].create(outputBits);
        } else {
            return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
        }
    };
    method.update = function (message, outputBits, n, s) {
        return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
};

var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
        return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
        return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
};

var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
];

var methods = {}, methodNames = [];

for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
        var methodName = algorithm.name + '_' + bits[j];
        methodNames.push(methodName);
        methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
        if (algorithm.name !== 'sha3') {
            var newMethodName = algorithm.name + bits[j];
            methodNames.push(newMethodName);
            methods[newMethodName] = methods[methodName];
        }
    }
}

function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
        this.s[i] = 0;
    }
}

Keccak.prototype.update = function (message) {
    if (this.finalized) {
        return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
        if (type === 'object') {
            if (message === null) {
                throw ERROR;
            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
            } else if (!Array.isArray(message)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                    throw ERROR;
                }
            }
        } else {
            throw ERROR;
        }
        notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
        blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
        if (this.reset) {
            this.reset = false;
            blocks[0] = this.block;
            for (i = 1; i < blockCount + 1; ++i) {
                blocks[i] = 0;
            }
        }
        if (notString) {
            for (i = this.start; index < length && i < byteCount; ++index) {
                blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }
        } else {
            for (i = this.start; index < length && i < byteCount; ++index) {
                code = message.charCodeAt(index);
                if (code < 0x80) {
                    blocks[i >> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 0x800) {
                    blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                } else if (code < 0xd800 || code >= 0xe000) {
                    blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                } else {
                    code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                    blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                }
            }
        }
        this.lastByteIndex = i;
        if (i >= byteCount) {
            this.start = i - byteCount;
            this.block = blocks[blockCount];
            for (i = 0; i < blockCount; ++i) {
                s[i] ^= blocks[i];
            }
            f(s);
            this.reset = true;
        } else {
            this.start = i;
        }
    }
    return this;
};

Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
        bytes.unshift(o);
        x = x >> 8;
        o = x & 255;
        ++n;
    }
    if (right) {
        bytes.push(n);
    } else {
        bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
};

Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
        if (type === 'object') {
            if (str === null) {
                throw ERROR;
            } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
                str = new Uint8Array(str);
            } else if (!Array.isArray(str)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
                    throw ERROR;
                }
            }
        } else {
            throw ERROR;
        }
        notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
        bytes = length;
    } else {
        for (var i = 0; i < str.length; ++i) {
            var code = str.charCodeAt(i);
            if (code < 0x80) {
                bytes += 1;
            } else if (code < 0x800) {
                bytes += 2;
            } else if (code < 0xd800 || code >= 0xe000) {
                bytes += 3;
            } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
                bytes += 4;
            }
        }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
};

Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
        bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
};

Keccak.prototype.finalize = function () {
    if (this.finalized) {
        return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
        blocks[0] = blocks[blockCount];
        for (i = 1; i < blockCount + 1; ++i) {
            blocks[i] = 0;
        }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
        s[i] ^= blocks[i];
    }
    f(s);
};

Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
            block = s[i];
            hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
                HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
                HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
                HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
        }
        if (j % blockCount === 0) {
            f(s);
            i = 0;
        }
    }
    if (extraBytes) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
        if (extraBytes > 1) {
            hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
        }
        if (extraBytes > 2) {
            hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
        }
    }
    return hex;
};

Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
        buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
        buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
            array[j] = s[i];
        }
        if (j % blockCount === 0) {
            f(s);
        }
    }
    if (extraBytes) {
        array[i] = s[i];
        buffer = buffer.slice(0, bytes);
    }
    return buffer;
};

Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
            offset = j << 2;
            block = s[i];
            array[offset] = block & 0xFF;
            array[offset + 1] = (block >> 8) & 0xFF;
            array[offset + 2] = (block >> 16) & 0xFF;
            array[offset + 3] = (block >> 24) & 0xFF;
        }
        if (j % blockCount === 0) {
            f(s);
        }
    }
    if (extraBytes) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        if (extraBytes > 1) {
            array[offset + 1] = (block >> 8) & 0xFF;
        }
        if (extraBytes > 2) {
            array[offset + 2] = (block >> 16) & 0xFF;
        }
    }
    return array;
};

function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
}

Kmac.prototype = new Keccak();

Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
};

var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
        b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
        b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
        b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
        c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
        c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
        c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
        c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
        c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
        c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
        c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
        c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
        c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
        c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

        h = c8 ^ ((c2 << 1) | (c3 >>> 31));
        l = c9 ^ ((c3 << 1) | (c2 >>> 31));
        s[0] ^= h;
        s[1] ^= l;
        s[10] ^= h;
        s[11] ^= l;
        s[20] ^= h;
        s[21] ^= l;
        s[30] ^= h;
        s[31] ^= l;
        s[40] ^= h;
        s[41] ^= l;
        h = c0 ^ ((c4 << 1) | (c5 >>> 31));
        l = c1 ^ ((c5 << 1) | (c4 >>> 31));
        s[2] ^= h;
        s[3] ^= l;
        s[12] ^= h;
        s[13] ^= l;
        s[22] ^= h;
        s[23] ^= l;
        s[32] ^= h;
        s[33] ^= l;
        s[42] ^= h;
        s[43] ^= l;
        h = c2 ^ ((c6 << 1) | (c7 >>> 31));
        l = c3 ^ ((c7 << 1) | (c6 >>> 31));
        s[4] ^= h;
        s[5] ^= l;
        s[14] ^= h;
        s[15] ^= l;
        s[24] ^= h;
        s[25] ^= l;
        s[34] ^= h;
        s[35] ^= l;
        s[44] ^= h;
        s[45] ^= l;
        h = c4 ^ ((c8 << 1) | (c9 >>> 31));
        l = c5 ^ ((c9 << 1) | (c8 >>> 31));
        s[6] ^= h;
        s[7] ^= l;
        s[16] ^= h;
        s[17] ^= l;
        s[26] ^= h;
        s[27] ^= l;
        s[36] ^= h;
        s[37] ^= l;
        s[46] ^= h;
        s[47] ^= l;
        h = c6 ^ ((c0 << 1) | (c1 >>> 31));
        l = c7 ^ ((c1 << 1) | (c0 >>> 31));
        s[8] ^= h;
        s[9] ^= l;
        s[18] ^= h;
        s[19] ^= l;
        s[28] ^= h;
        s[29] ^= l;
        s[38] ^= h;
        s[39] ^= l;
        s[48] ^= h;
        s[49] ^= l;

        b0 = s[0];
        b1 = s[1];
        b32 = (s[11] << 4) | (s[10] >>> 28);
        b33 = (s[10] << 4) | (s[11] >>> 28);
        b14 = (s[20] << 3) | (s[21] >>> 29);
        b15 = (s[21] << 3) | (s[20] >>> 29);
        b46 = (s[31] << 9) | (s[30] >>> 23);
        b47 = (s[30] << 9) | (s[31] >>> 23);
        b28 = (s[40] << 18) | (s[41] >>> 14);
        b29 = (s[41] << 18) | (s[40] >>> 14);
        b20 = (s[2] << 1) | (s[3] >>> 31);
        b21 = (s[3] << 1) | (s[2] >>> 31);
        b2 = (s[13] << 12) | (s[12] >>> 20);
        b3 = (s[12] << 12) | (s[13] >>> 20);
        b34 = (s[22] << 10) | (s[23] >>> 22);
        b35 = (s[23] << 10) | (s[22] >>> 22);
        b16 = (s[33] << 13) | (s[32] >>> 19);
        b17 = (s[32] << 13) | (s[33] >>> 19);
        b48 = (s[42] << 2) | (s[43] >>> 30);
        b49 = (s[43] << 2) | (s[42] >>> 30);
        b40 = (s[5] << 30) | (s[4] >>> 2);
        b41 = (s[4] << 30) | (s[5] >>> 2);
        b22 = (s[14] << 6) | (s[15] >>> 26);
        b23 = (s[15] << 6) | (s[14] >>> 26);
        b4 = (s[25] << 11) | (s[24] >>> 21);
        b5 = (s[24] << 11) | (s[25] >>> 21);
        b36 = (s[34] << 15) | (s[35] >>> 17);
        b37 = (s[35] << 15) | (s[34] >>> 17);
        b18 = (s[45] << 29) | (s[44] >>> 3);
        b19 = (s[44] << 29) | (s[45] >>> 3);
        b10 = (s[6] << 28) | (s[7] >>> 4);
        b11 = (s[7] << 28) | (s[6] >>> 4);
        b42 = (s[17] << 23) | (s[16] >>> 9);
        b43 = (s[16] << 23) | (s[17] >>> 9);
        b24 = (s[26] << 25) | (s[27] >>> 7);
        b25 = (s[27] << 25) | (s[26] >>> 7);
        b6 = (s[36] << 21) | (s[37] >>> 11);
        b7 = (s[37] << 21) | (s[36] >>> 11);
        b38 = (s[47] << 24) | (s[46] >>> 8);
        b39 = (s[46] << 24) | (s[47] >>> 8);
        b30 = (s[8] << 27) | (s[9] >>> 5);
        b31 = (s[9] << 27) | (s[8] >>> 5);
        b12 = (s[18] << 20) | (s[19] >>> 12);
        b13 = (s[19] << 20) | (s[18] >>> 12);
        b44 = (s[29] << 7) | (s[28] >>> 25);
        b45 = (s[28] << 7) | (s[29] >>> 25);
        b26 = (s[38] << 8) | (s[39] >>> 24);
        b27 = (s[39] << 8) | (s[38] >>> 24);
        b8 = (s[48] << 14) | (s[49] >>> 18);
        b9 = (s[49] << 14) | (s[48] >>> 18);

        s[0] = b0 ^ (~b2 & b4);
        s[1] = b1 ^ (~b3 & b5);
        s[10] = b10 ^ (~b12 & b14);
        s[11] = b11 ^ (~b13 & b15);
        s[20] = b20 ^ (~b22 & b24);
        s[21] = b21 ^ (~b23 & b25);
        s[30] = b30 ^ (~b32 & b34);
        s[31] = b31 ^ (~b33 & b35);
        s[40] = b40 ^ (~b42 & b44);
        s[41] = b41 ^ (~b43 & b45);
        s[2] = b2 ^ (~b4 & b6);
        s[3] = b3 ^ (~b5 & b7);
        s[12] = b12 ^ (~b14 & b16);
        s[13] = b13 ^ (~b15 & b17);
        s[22] = b22 ^ (~b24 & b26);
        s[23] = b23 ^ (~b25 & b27);
        s[32] = b32 ^ (~b34 & b36);
        s[33] = b33 ^ (~b35 & b37);
        s[42] = b42 ^ (~b44 & b46);
        s[43] = b43 ^ (~b45 & b47);
        s[4] = b4 ^ (~b6 & b8);
        s[5] = b5 ^ (~b7 & b9);
        s[14] = b14 ^ (~b16 & b18);
        s[15] = b15 ^ (~b17 & b19);
        s[24] = b24 ^ (~b26 & b28);
        s[25] = b25 ^ (~b27 & b29);
        s[34] = b34 ^ (~b36 & b38);
        s[35] = b35 ^ (~b37 & b39);
        s[44] = b44 ^ (~b46 & b48);
        s[45] = b45 ^ (~b47 & b49);
        s[6] = b6 ^ (~b8 & b0);
        s[7] = b7 ^ (~b9 & b1);
        s[16] = b16 ^ (~b18 & b10);
        s[17] = b17 ^ (~b19 & b11);
        s[26] = b26 ^ (~b28 & b20);
        s[27] = b27 ^ (~b29 & b21);
        s[36] = b36 ^ (~b38 & b30);
        s[37] = b37 ^ (~b39 & b31);
        s[46] = b46 ^ (~b48 & b40);
        s[47] = b47 ^ (~b49 & b41);
        s[8] = b8 ^ (~b0 & b2);
        s[9] = b9 ^ (~b1 & b3);
        s[18] = b18 ^ (~b10 & b12);
        s[19] = b19 ^ (~b11 & b13);
        s[28] = b28 ^ (~b20 & b22);
        s[29] = b29 ^ (~b21 & b23);
        s[38] = b38 ^ (~b30 & b32);
        s[39] = b39 ^ (~b31 & b33);
        s[48] = b48 ^ (~b40 & b42);
        s[49] = b49 ^ (~b41 & b43);

        s[0] ^= RC[n];
        s[1] ^= RC[n + 1];
    }
};

module.exports = methods;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":6}],17:[function(require,module,exports){
var jsSHA = require('jssha/src/sha256');
var Blake256 = require('./blake256');
var keccak256 = require('./sha3')['keccak256'];
var Blake2B = require('./blake2b');

function numberToHex (number) {
    var hex = Math.round(number).toString(16);
    if(hex.length === 1) {
        hex = '0' + hex;
    }
    return hex;
}

function hexToUint8(hexString) {
    var arr = [];
    for (var i = 0; i < hexString.length; i += 2) {
        arr.push(parseInt(hexString.substr(i, 2), 16));
    }

    return new Uint8Array(arr);
}

module.exports = {
    toHex: function (arrayOfBytes) {
        var hex = '';
        for(var i = 0; i < arrayOfBytes.length; i++) {
            hex += numberToHex(arrayOfBytes[i]);
        }
        return hex;
    },
    sha256: function (hexString) {
        var sha = new jsSHA('SHA-256', 'HEX');
        sha.update(hexString);
        return sha.getHash('HEX');
    },
    sha256Checksum: function (payload) {
        return this.sha256(this.sha256(payload)).substr(0, 8);
    },
    blake256: function (hexString) {
        return new Blake256().update(hexString, 'hex').digest('hex');
    },
    blake256Checksum: function (payload) {
        return this.blake256(this.blake256(payload)).substr(0, 8);
    },
    blake2b: function (hexString, outlen) {
        return new Blake2B(outlen).update(hexToUint8(hexString)).digest('hex');
    },
    keccak256: function (hexString) {
        return keccak256(hexString);
    },
    keccak256Checksum: function (payload) {
        return keccak256(payload).toString().substr(0, 8);
    }
};

},{"./blake256":12,"./blake2b":13,"./sha3":16,"jssha/src/sha256":5}],18:[function(require,module,exports){
var XRPValidator = require('./ripple_validator');
var ETHValidator = require('./ethereum_validator');
var BTCValidator = require('./bitcoin_validator');
var XMRValidator = require('./monero_validator');
var NANOValidator = require('./nano_validator');

// defines P2PKH and P2SH address types for standard (prod) and testnet networks
var CURRENCIES = [{
    name: 'bitcoin',
    symbol: 'btc',
    addressTypes: {prod: ['00', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'bitcoincash',
    symbol: 'bch',
    addressTypes: {prod: ['00', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'litecoin',
    symbol: 'ltc',
    addressTypes: {prod: ['30', '05', '32'], testnet: ['6f', 'c4', '3a']},
    validator: BTCValidator
},{
    name: 'peercoin',
    symbol: 'ppc',
    addressTypes: {prod: ['37', '75'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'dogecoin',
    symbol: 'doge',
    addressTypes: {prod: ['1e', '16'], testnet: ['71', 'c4']},
    validator: BTCValidator
},{
    name: 'beavercoin',
    symbol: 'bvc',
    addressTypes: {prod: ['19', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator,
},{
    name: 'freicoin',
    symbol: 'frc',
    addressTypes: {prod: ['00', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'protoshares',
    symbol: 'pts',
    addressTypes: {prod: ['38', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'megacoin',
    symbol: 'mec',
    addressTypes: {prod: ['32', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'primecoin',
    symbol: 'xpm',
    addressTypes: {prod: ['17', '53'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'auroracoin',
    symbol: 'aur',
    addressTypes: {prod: ['17', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'namecoin',
    symbol: 'nmc',
    addressTypes: {prod: ['34'], testnet: []},
    validator: BTCValidator
},{
    name: 'biocoin',
    symbol: 'bio',
    addressTypes: {prod: ['19', '14'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'garlicoin',
    symbol: 'grlc',
    addressTypes: {prod: ['26', '05'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'vertcoin',
    symbol: 'vtc',
    addressTypes: {prod: ['0x', '47'], testnet: ['6f', 'c4']},
    segwitHrp: 'vtc',
    validator: BTCValidator
},{
    name: 'bitcoingold',
    symbol: 'btg',
    addressTypes: {prod: ['26', '17'], testnet: ['6f', 'c4']},
    validator: BTCValidator
},{
    name: 'komodo',
    symbol: 'kmd',
    addressTypes: {prod: ['3c', '55'], testnet: ['0','5']},
    validator: BTCValidator
},{
    name: 'bitcoinz',
    symbol: 'btcz',
    expectedLength: 26,
    addressTypes: {prod: ['1cb8','1cbd'], testnet: ['1d25', '1cba']},
    validator: BTCValidator
},{
    name: 'bitcoinprivate',
    symbol: 'btcp',
    expectedLength: 26,
    addressTypes: {prod: ['1325','13af'], testnet: ['1957', '19e0']},
    validator: BTCValidator
},{
    name: 'hush',
    symbol: 'hush',
    expectedLength: 26,
    addressTypes: {prod: ['1cb8','1cbd'], testnet: ['1d25', '1cba']},
    validator: BTCValidator
},{
    name: 'snowgem',
    symbol: 'sng',
    expectedLength: 26,
    addressTypes: {prod: ['1c28','1c2d'], testnet: ['1d25', '1cba']},
    validator: BTCValidator
},{
    name: 'zcash',
    symbol: 'zec',
    expectedLength: 26,
    addressTypes: {prod: ['1cb8','1cbd'], testnet: ['1d25', '1cba']},
    validator: BTCValidator
},{
    name: 'zclassic',
    symbol: 'zcl',
    expectedLength: 26,
    addressTypes: {prod: ['1cb8','1cbd'], testnet: ['1d25', '1cba']},
    validator: BTCValidator
},{
    name: 'zencash',
    symbol: 'zen',
    expectedLength: 26,
    addressTypes: {prod: ['2089','2096'], testnet: ['2092','2098']},
    validator: BTCValidator
},{
    name: 'votecoin',
    symbol: 'vot',
    expectedLength: 26,
    addressTypes: {prod: ['1cb8','1cbd'], testnet: ['1d25', '1cba']},
    validator: BTCValidator
},{
    name: 'decred',
    symbol: 'dcr',
    addressTypes: {prod: ['073f', '071a'], testnet: ['0f21', '0efc']},
    hashFunction: 'blake256',
    expectedLength: 26,
    validator: BTCValidator
},{
    name: 'digibyte',
    symbol: 'dgb',
    addressTypes: {prod: ['1e'], testnet: []},
    validator: BTCValidator
},{
    name: 'ethereum',
    symbol: 'eth',
    validator: ETHValidator,
},{
    name: 'etherzero',
    symbol: 'etz',
    validator: ETHValidator,
},{
    name: 'ethereumclassic',
    symbol: 'etc',
    validator: ETHValidator,
},{
    name: 'callisto',
    symbol: 'clo',
    validator: ETHValidator,
},{
    name: 'ripple',
    symbol: 'xrp',
    validator: XRPValidator,
},{
    name: 'dash',
    symbol: 'dash',
    addressTypes: {prod: ['4c', '10'], testnet: ['8c', '13']},
    validator: BTCValidator
},{
    name: 'neo',
    symbol: 'neo',
    addressTypes: {prod: ['17'], testnet: []},
    validator: BTCValidator
},{
    name: 'neogas',
    symbol: 'gas',
    addressTypes: {prod: ['17'], testnet: []},
    validator: BTCValidator
},{
    name: 'qtum',
    symbol: 'qtum',
    addressTypes: {prod: ['3a', '32'], testnet: ['78', '6e']},
    validator: BTCValidator
},{
    name: 'bankex',
    symbol: 'bkx',
    validator: ETHValidator
},{
    name: 'monero',
    symbol: 'xmr',
    addressTypes: {prod: ['18'], testnet: ['53']},
    iAddressTypes: {prod: ['19'], testnet: ['54']},
    validator: XMRValidator
},{
    name: 'nano',
    symbol: 'nano',
    validator: NANOValidator,
},{
    name: 'raiblocks',
    symbol: 'xrb',
    validator: NANOValidator,
}];


module.exports = {
    getByNameOrSymbol: function (currencyNameOrSymbol) {
        var nameOrSymbol = currencyNameOrSymbol.toLowerCase();
        for (var i = 0; i < CURRENCIES.length; i++) {
            var currency = CURRENCIES[i];
            if(currency.name === nameOrSymbol || currency.symbol === nameOrSymbol) {
                return currency;
            }
        }
        return null;
    }
};

},{"./bitcoin_validator":8,"./ethereum_validator":19,"./monero_validator":20,"./nano_validator":21,"./ripple_validator":22}],19:[function(require,module,exports){
var cryptoUtils = require('./crypto/utils');

module.exports = {
    isValidAddress: function (address) {
        if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
            // Check if it has the basic requirements of an address
            return false;
        }

        if (/^0x[0-9a-f]{40}$/.test(address) || /^0x?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return true;
        }

        // Otherwise check each case
        return this.verifyChecksum(address);
    },
    verifyChecksum: function (address) {
        // Check each case
        address = address.replace('0x','');

        var addressHash = cryptoUtils.keccak256(address.toLowerCase());

        for (var i = 0; i < 40; i++ ) {
            // The nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
                (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }

        return true;
    }
};

},{"./crypto/utils":17}],20:[function(require,module,exports){
var cryptoUtils = require('./crypto/utils');
var cnBase58 = require('./crypto/cnBase58');

var DEFAULT_NETWORK_TYPE = 'prod';
var addressRegTest = new RegExp('^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{95}$');
var integratedAddressRegTest = new RegExp('^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{106}$');

function validateNetwork(decoded, currency, networkType, addressType){
    var network = currency.addressTypes;
    if(addressType == 'integrated'){
        network = currency.iAddressTypes;
    }

    switch(networkType){
        case 'prod':
            return parseInt(decoded.substr(0,2), 16) == network.prod[0];
        case 'testnet':
            return parseInt(decoded.substr(0,2), 16) == network.testnet[0];
        case 'both':
            return parseInt(decoded.substr(0,2), 16) == network.prod[0] || parseInt(decoded.substr(0,2), 16) == network.testnet[0];
        default:
            return false;
    }
}

function hextobin(hex) {
    if (hex.length % 2 !== 0) return null;
    var res = new Uint8Array(hex.length / 2);
    for (var i = 0; i < hex.length / 2; ++i) {
        res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return res;
}

module.exports = {
    isValidAddress: function (address, currency, networkType) {
        networkType = networkType || DEFAULT_NETWORK_TYPE;
        var addressType = 'standard';
        if(!addressRegTest.test(address)){
            if(integratedAddressRegTest.test(address)){
                addressType = 'integrated';
            }
            else{
                return false;
            }
        }

        var decodedAddrStr = cnBase58.decode(address);
        if(!decodedAddrStr)
            return false;

        if(!validateNetwork(decodedAddrStr, currency, networkType, addressType))
            return false;

        var addrChecksum = decodedAddrStr.slice(-8);
        var hashChecksum = cryptoUtils.keccak256Checksum(hextobin(decodedAddrStr.slice(0, -8)));
        
        return addrChecksum === hashChecksum;
    }
};

},{"./crypto/cnBase58":14,"./crypto/utils":17}],21:[function(require,module,exports){
var cryptoUtils = require('./crypto/utils');
var baseX = require('base-x');

var ALLOWED_CHARS = '13456789abcdefghijkmnopqrstuwxyz';

var codec = baseX(ALLOWED_CHARS);
// https://github.com/nanocurrency/raiblocks/wiki/Accounts,-Keys,-Seeds,-and-Wallet-Identifiers
var regexp = new RegExp('^(xrb|nano)_([' + ALLOWED_CHARS + ']{60})$');

module.exports = {
    isValidAddress: function (address) {
        if (regexp.test(address)) {
            return this.verifyChecksum(address);
        }

        return false;
    },

    verifyChecksum: function (address) {
        var bytes = codec.decode(regexp.exec(address)[2]).slice(-37);
        // https://github.com/nanocurrency/raiblocks/blob/master/rai/lib/numbers.cpp#L73
        var computedChecksum = cryptoUtils.blake2b(cryptoUtils.toHex(bytes.slice(0, -5)), 5);
        var checksum = cryptoUtils.toHex(bytes.slice(-5).reverse());

        return computedChecksum === checksum
    }
};

},{"./crypto/utils":17,"base-x":1}],22:[function(require,module,exports){
var cryptoUtils = require('./crypto/utils');
var baseX = require('base-x');

var ALLOWED_CHARS = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';

var codec = baseX(ALLOWED_CHARS);
var regexp = new RegExp('^r[' + ALLOWED_CHARS + ']{27,35}$');

module.exports = {
    /**
     * ripple address validation
     */
    isValidAddress: function (address) {
        if (regexp.test(address)) {
            return this.verifyChecksum(address);
        }

        return false;
    },

    verifyChecksum: function (address) {
        var bytes = codec.decode(address);
        var computedChecksum = cryptoUtils.sha256Checksum(cryptoUtils.toHex(bytes.slice(0, -4)));
        var checksum = cryptoUtils.toHex(bytes.slice(-4));

        return computedChecksum === checksum
    }
};

},{"./crypto/utils":17,"base-x":1}],23:[function(require,module,exports){
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

},{"./currencies":18}]},{},[23])(23)
});