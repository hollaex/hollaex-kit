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
