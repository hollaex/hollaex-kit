'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var baseX = _interopDefault(require('base-x'));
var bech32 = _interopDefault(require('bech32'));
var hashSha256 = _interopDefault(require('hash.js/lib/hash/sha/256'));
var buffer = require('buffer');

const base58 = baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');

const sha256 = payload => buffer.Buffer.from(hashSha256().update(payload).digest());

const addressTypes = {
  0x00: {
    type: 'p2pkh',
    testnet: false
  },

  0x6f: {
    type: 'p2pkh',
    testnet: true
  },

  0x05: {
    type: 'p2sh',
    testnet: false
  },

  0xc4: {
    type: 'p2sh',
    testnet: true
  }
};

const validateBech32 = (address) => {
  let decoded;

  try {
    decoded = bech32.decode(address);
  } catch (error) {
    return false;
  }

  if (!['bc', 'tb', 'bcrt'].includes(decoded.prefix)) {
    return false;
  }

  const witnessVersion = decoded.words[0];

  if (witnessVersion < 0 || witnessVersion > 16) {
    return false;
  }

  const data = bech32.fromWords(decoded.words.slice(1));

  let type;

  if (data.length === 20) {
    type = 'p2wpkh';
  } else if (data.length === 32) {
    type = 'p2wsh';
  }

  return {
    bech32: true,
    testnet: decoded.prefix !== 'bc',
    address,
    type
  };
};

const validateBtcAddress = (address) => {
  if (!address) {
    return false;
  }

  let decoded;
  let prefix = address.substr(0, 2);

  if (prefix === 'bc' || prefix == 'tb') {
    return validateBech32(address);
  }

  try {
    decoded = base58.decode(address);
  } catch (error) {
    return false;
  }

  const { length } = decoded;

  if (length !== 25) {
    return false;
  }

  const version = decoded.readUInt8(0);

  const checksum = decoded.slice(length - 4, length);
  const body = decoded.slice(0, length - 4);

  const expectedChecksum = sha256(sha256(body)).slice(0, 4);

  if (!checksum.equals(expectedChecksum)) {
    return false;
  }

  return addressTypes[version] ? Object.assign({ address, bech32: false }, addressTypes[version]) : false;
};

module.exports = validateBtcAddress;
