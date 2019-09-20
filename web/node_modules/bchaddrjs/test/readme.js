/***
 * @license
 * https://github.com/bitcoincashjs/bchaddr
 * Copyright (c) 2018 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

var assert = require('chai').assert
var bchaddr = require('..')

describe('Readme examples', function () {
  it('should work exactly as advertised', function () {
    var Format = bchaddr.Format
    var Network = bchaddr.Network
    var Type = bchaddr.Type
    var isLegacyAddress = bchaddr.isLegacyAddress
    var isBitpayAddress = bchaddr.isBitpayAddress
    var isCashAddress = bchaddr.isCashAddress
    var isMainnetAddress = bchaddr.isMainnetAddress
    var isTestnetAddress = bchaddr.isTestnetAddress
    var isP2PKHAddress = bchaddr.isP2PKHAddress
    var isP2SHAddress = bchaddr.isP2SHAddress
    var detectAddressFormat = bchaddr.detectAddressFormat
    var detectAddressNetwork = bchaddr.detectAddressNetwork
    var detectAddressType = bchaddr.detectAddressType
    var toLegacyAddress = bchaddr.toLegacyAddress
    var toBitpayAddress = bchaddr.toBitpayAddress
    var toCashAddress = bchaddr.toCashAddress
    assert.strictEqual(
      isLegacyAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR'),
      true
    )
    assert.strictEqual(
      isLegacyAddress('qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk'),
      false
    )
    assert.strictEqual(
      isBitpayAddress('CScMwvXjdooDnGevHgfHjGWFi9cjk75Aaj'),
      true
    )
    assert.strictEqual(
      isBitpayAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR'),
      false
    )
    assert.strictEqual(
      isCashAddress('qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk'),
      true
    )
    assert.strictEqual(
      isCashAddress('CScMwvXjdooDnGevHgfHjGWFi9cjk75Aaj'),
      false
    )
    assert.strictEqual(
      isMainnetAddress('1P238gziZdeS5Wj9nqLhQHSBK2Lz6zPSke'),
      true
    )
    assert.strictEqual(
      isMainnetAddress('mnbGP2FeRsbgdQCzDT35zPWDcYSKm4wrcg'),
      false
    )
    assert.strictEqual(
      isTestnetAddress('qqdcsl6c879esyxyacmz7g6vtzwjjwtznsggspc457'),
      true
    )
    assert.strictEqual(
      isTestnetAddress('CeUvhjLnSgcxyedaUafcyo4Cw9ZPwGq9JJ'),
      false
    )
    assert.strictEqual(
      isP2PKHAddress('1Mdob5JY1yuwoj6y76Vf3AQpoqUH5Aft8z'),
      true
    )
    assert.strictEqual(
      isP2PKHAddress('2NFGG7yRBizUANU48b4dASrnNftqsNwzSM1'),
      false
    )
    assert.strictEqual(
      isP2SHAddress('H92i9XpREZiBscxGu6Vx3M8jNGBKqscBBB'),
      true
    )
    assert.strictEqual(
      isP2SHAddress('CeUvhjLnSgcxyedaUafcyo4Cw9ZPwGq9JJ'),
      false
    )
    assert.strictEqual(
      detectAddressFormat('qqdcsl6c879esyxyacmz7g6vtzwjjwtznsggspc457'),
      Format.Cashaddr
    )
    assert.strictEqual(
      detectAddressFormat('CScMwvXjdooDnGevHgfHjGWFi9cjk75Aaj'),
      Format.Bitpay
    )
    assert.strictEqual(
      detectAddressNetwork('1P238gziZdeS5Wj9nqLhQHSBK2Lz6zPSke'),
      Network.Mainnet
    )
    assert.strictEqual(
      detectAddressNetwork('qqdcsl6c879esyxyacmz7g6vtzwjjwtznsggspc457'),
      Network.Testnet
    )
    assert.strictEqual(
      detectAddressType('1P238gziZdeS5Wj9nqLhQHSBK2Lz6zPSke'),
      Type.P2PKH
    )
    assert.strictEqual(
      detectAddressType('3NKpWcnyZtEKttoQECAFTnmkxMkzgbT4WX'),
      Type.P2SH
    )
    assert.strictEqual(
      toLegacyAddress('qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk'),
      '1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR'
    )
    assert.strictEqual(
      toBitpayAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR'),
      'CScMwvXjdooDnGevHgfHjGWFi9cjk75Aaj'
    )
    assert.strictEqual(
      toCashAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR'),
      'bitcoincash:qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk'
    )
  })
})
