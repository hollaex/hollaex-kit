var isNode = typeof module !== 'undefined' && typeof module.exports !== 'undefined';

var chai = isNode ? require('chai') : window.chai,
    expect = chai.expect;

var WAValidator = isNode ? require('../src/wallet_address_validator') : window.WAValidator;

function valid (address, currency, networkType) {
    var result = WAValidator.validate(address, currency, networkType);
    expect(result).to.be.true;
}

function invalid (address, currency, networkType) {
    var result = WAValidator.validate(address, currency, networkType);
    expect(result).to.be.false;
}

describe('WAValidator.validate()', function () {
    describe('valid results', function () {
        it('should return true for correct bitcoin addresses', function () {
            valid('12KYrjTdVGjFMtaxERSk3gphreJ5US8aUP', 'bitcoin');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'bitcoin');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'BTC');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'Bitcoin');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'btc');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'btc', 'prod');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'btc', 'both');
            valid('1oNLrsHnBcR6dpaBpwz3LSwutbUNkNSjs', 'bitcoin');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'bitcoin', 'testnet');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'bitcoin', 'both');

            valid('1SQHtwR5oJRKLfiWQ2APsAd9miUc4k2ez');
            valid('116CGDLddrZhMrTwhCVJXtXQpxygTT1kHd');

            // p2sh addresses
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt');
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'bitcoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'bitcoin', 'testnet');

            // segwit addresses
            valid('BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4', 'bitcoin');
            valid('tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7', 'bitcoin');
            valid('bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx', 'bitcoin');
            valid('BC1SW50QA3JX3S', 'bitcoin');
            valid('bc1zw508d6qejxtdg4y5r3zarvaryvg6kdaj', 'bitcoin');
            valid('tb1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy', 'bitcoin');

            invalid("tc1qw508d6qejxtdg4y5r3zarvary0c5xw7kg3g4ty", 'bitcoin'),
            invalid("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5", 'bitcoin'),
            invalid("BC13W508D6QEJXTDG4Y5R3ZARVARY0C5XW7KN40WF2", 'bitcoin'),
            invalid("bc1rw5uspcuh", 'bitcoin'),
            invalid("bc10w508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kw5rljs90", 'bitcoin'),
            invalid("BC1QR508D6QEJXTDG4Y5R3ZARVARYV98GJ9P", 'bitcoin'),
            invalid("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sL5k7", 'bitcoin'),
            invalid("bc1zw508d6qejxtdg4y5r3zarvaryvqyzf3du", 'bitcoin'),
            invalid("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3pjxtptv", 'bitcoin'),
            invalid("bc1gmk9yu", 'bitcoin')
        });

        it('should return true for correct bitcoincash addresses', function () {
            valid('12KYrjTdVGjFMtaxERSk3gphreJ5US8aUP', 'bitcoincash');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'bitcoincash');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'BCH');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'Bitcoin');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'bch');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'bch', 'prod');
            valid('12QeMLzSrB8XH8FvEzPMVoRxVAzTr5XM2y', 'bch', 'both');
            valid('1oNLrsHnBcR6dpaBpwz3LSwutbUNkNSjs', 'bitcoincash');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'bitcoincash', 'testnet');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'bitcoincash', 'both');

            // p2sh addresses
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'bitcoincash');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'bitcoincash', 'testnet');
        });

        it('should return true for correct litecoin addresses', function () {
            valid('LVg2kJoFNg45Nbpy53h7Fe1wKyeXVRhMH9', 'litecoin');
            valid('LVg2kJoFNg45Nbpy53h7Fe1wKyeXVRhMH9', 'LTC');
            valid('LTpYZG19YmfvY2bBDYtCKpunVRw7nVgRHW', 'litecoin');
            valid('Lb6wDP2kHGyWC7vrZuZAgV7V4ECyDdH7a6', 'litecoin');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'litecoin', 'testnet');

            // p2sh addresses
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'litecoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'litecoin', 'testnet');
            valid('QW2SvwjaJU8LD6GSmtm1PHnBG2xPuxwZFy', 'litecoin', 'testnet');
            valid('QjpzxpbLp5pCGsCczMbfh1uhC3P89QZavY', 'litecoin', 'testnet');
        });

        it('should return true for correct peercoin addresses', function () {
            valid('PHCEsP6od3WJ8K2WKWEDBYKhH95pc9kiZN', 'peercoin');
            valid('PSbM1pGoE9dnAuVWvpQqTTYVpKZU41dNAz', 'peercoin');
            valid('PUULeHrJL2WujJkorc2RsUAR3SardKUauu', 'peercoin');
            valid('PUULeHrJL2WujJkorc2RsUAR3SardKUauu', 'PPC');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'peercoin', 'testnet');

            // p2sh addresses
            valid('pNms4CaWqgZUxbNZaA1yP2gPr3BYnez9EM', 'peercoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'peercoin', 'testnet');
        });

        it('should return true for correct dogecoin addresses', function () {
            valid('DPpJVPpvPNP6i6tMj4rTycAGh8wReTqaSU', 'dogecoin');
            valid('DNzLUN6MyYVS5zf4Xc2yK69V3dXs6Mxia5', 'dogecoin');
            valid('DPS6iZj7roHquvwRYXNBua9QtKPzigUUhM', 'dogecoin');
            valid('DPS6iZj7roHquvwRYXNBua9QtKPzigUUhM', 'DOGE');
            //TODO: NEED A DOGECOIN TESTNET ADDRESS

            //p2sh addresses
            valid('A7JjzK9k9x5b2MkkQzqt91WZsuu7wTu6iS', 'dogecoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'dogecoin', 'testnet');
        });

        it('should return true for correct beavercoin addresses', function () {
            valid('BPPtB4EpPi5wCaGXZuNyKQgng8ya579qUh', 'beavercoin');
            valid('BC1LLYoE4mTCHTJhVYvLGxhRTwAHyWTQ49', 'beavercoin');
            valid('BBuyeg2vjtyFdMNj3LTxuVra4wJMKVAY9C', 'beavercoin');
            valid('BBuyeg2vjtyFdMNj3LTxuVra4wJMKVAY9C', 'BVC');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'beavercoin', 'testnet');

            // p2sh addresses
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'beavercoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'beavercoin', 'testnet');
        });

        it('should return true for correct freicoin addresses', function () {
            valid('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'freicoin');
            valid('1oNLrsHnBcR6dpaBpwz3LSwutbUNkNSjs', 'freicoin');
            valid('1SQHtwR5oJRKLfiWQ2APsAd9miUc4k2ez', 'freicoin');
            valid('1SQHtwR5oJRKLfiWQ2APsAd9miUc4k2ez', 'FRC');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'freicoin', 'testnet');

            // p2sh addresse
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'freicoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'freicoin', 'testnet');
        });

        it('should return true for correct protoshares addresses', function () {
            valid('PaNGELmZgzRQCKeEKM6ifgTqNkC4ceiAWw', 'protoshares');
            valid('Piev8TMX2fT5mFtgxx2TXJaqXP37weMPuD', 'protoshares');
            valid('PgsuLoe9ojRKFGJGVpqqk37gAqNJ4ozboD', 'protoshares');
            valid('PgsuLoe9ojRKFGJGVpqqk37gAqNJ4ozboD', 'PTS');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'protoshares', 'testnet');

            //p2sh addresses
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'protoshares');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'protoshares', 'testnet');
        });

        it('should return true for correct megacoin addresses', function () {
            valid('MWUHaNxjXGZUYTh92i3zuDmsnH1rHSBk5M', 'megacoin');
            valid('MSAkrhRyte7bz999Ga5SqYjzypFFYa2oEb', 'megacoin');
            valid('MLUTAtDQFcfo1QACWocLuufFq5fBDTpCHE', 'megacoin');
            valid('MLUTAtDQFcfo1QACWocLuufFq5fBDTpCHE', 'MEC');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'megacoin', 'testnet');

            //p2sh addresses
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'megacoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'megacoin', 'testnet');
        });

        it('should return true for correct primecoin addresses', function () {
            valid('AVKeiZ5JadfWdH2EYVgVRfX4ufoyd4ehuM', 'primecoin');
            valid('AQXBRPyob4dywUJ21RUKrR1xetQCDVenKD', 'primecoin');
            valid('ANHfTZnskKqaBU7oZuSha9SpbHU3YBfeKf', 'primecoin');
            valid('AYdiYMKSGYxLcZNDmqB8jNcck7SQibrfiK', 'primecoin');
            valid('AYdiYMKSGYxLcZNDmqB8jNcck7SQibrfiK', 'XPM');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'primecoin', 'testnet');

            //p2sh addresses
            valid('af5CvTQq7agDh717Wszb5QDbWb7nT2mukP', 'primecoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'primecoin', 'testnet');
        });

        it('should return true for correct auroracoin addresses', function () {
            valid('ARM3GLZXF1PDTZ5vz3wh5MVahbK9BHTWAN', 'auroracoin');
            valid('AUtfc6ThCLb7FuEu7QPrWpJuaXaJRPciDF', 'auroracoin');
            valid('AUN1oaj5hjispGnczt8Aruw3TxgGyRqB3V', 'auroracoin');
            valid('AXGcBkGX6NiaDXj85C5dCrhTRUgwxSkKDK', 'auroracoin');
            valid('AXGcBkGX6NiaDXj85C5dCrhTRUgwxSkKDK', 'AUR');
            valid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'auroracoin', 'testnet');

            //p2sh addresses
            valid('3NJZLcZEEYBpxYEUGewU4knsQRn1WM5Fkt', 'auroracoin');
            valid('2MxKEf2su6FGAUfCEAHreGFQvEYrfYNHvL7', 'auroracoin', 'testnet');
        });

        it('should return true for correct namecoin addresses', function () {
            valid('NEpeRmS775fnti8TDgJA28m8KLEfNNRZvT', 'namecoin');
            valid('MyJ691bGJ48RBK2LS8n1U57wcFLFScFXxi', 'namecoin');
            valid('NFY9aw1RXLGtWpeqgNQXprnUcZXyKNinTh', 'namecoin');
            valid('NCPPc7Pzb75CpRPJQPRRh6ouJTq7BCy1H4', 'namecoin');
            valid('NCPPc7Pzb75CpRPJQPRRh6ouJTq7BCy1H4', 'NMC');
        });

        it('should return true for correct BioCoin addresses', function () {
            valid('B7xseoLGk7hEpMDDeSvZDKmmiAMHWiccok', 'biocoin');
            valid('B8zjmYFGhWmiaQSJshfrnefE72xCapCkvo', 'biocoin');
            valid('muH8LL42DiMs8GEQ6Grfi8KUw2uFvuKr1J', 'biocoin', 'testnet');
            valid('muH8LL42DiMs8GEQ6Grfi8KUw2uFvuKr1J', 'BIO', 'testnet');
            valid('B8zjmYFGhWmiaQSJshfrnefE72xCapCkvo', 'BIO');
        });

        it('should return true for correct Garlicoin addresses', function () {
            valid('GU2NtcNotWFiZjTp2Vdgf5CjeMfgsWYCua', 'garlicoin');
            valid('GNWeWaoQ6rv21ZFjJWT9vb91hXUzFTLkru', 'garlicoin');
            valid('mjKbQTkgwzmsL3J86tdVzhyW9pc4NePqTb', 'garlicoin', 'testnet');
            valid('mnYp36NuyRavMKQ9Q9Q6oGqoorAs9p3zYn', 'GRLC', 'testnet');
            valid('GU2NtcNotWFiZjTp2Vdgf5CjeMfgsWYCua', 'GRLC');
        });

        it('should return true for correct Vertcoin addresses', function () {
            valid('VmoMjGf3zgZLy8sk3PMKd3xikZHXWvnYi7', 'vertcoin');
            valid('VmhHwXr3J8xMZpy62WuBGpu3xVvThWzcTQ', 'vertcoin');
            valid('mvww6DEJ18dbyQUukpVQXvLgrNDJazZn1Y', 'vertcoin', 'testnet');
            valid('mn3mdEE6cf1snxVsknNz4GRTdSrWXqYp7c', 'VTC', 'testnet');
            valid('Vri6Q4GgNFfdtcpxD961TotJwaSaYQCaL5', 'VTC');
            valid('vtc1qmzq3erafwvz23yfeu9tu45uz2kx3d7esk0rayg', 'VTC');
            valid('vtc1qhy8eqwqxpyryz4wctus36yl2uu60t0z6ecrvtc', 'VTC');
            valid('vtc1qh9y09s2crkp63mk26u3vrq9q4w3h8ee8gepjgw', 'VTC');
        });

        it('should return true for correct BitcoinGold addresses', function () {
            valid('GW3JrQyHtoVfEFES3Y9JagiX3VSKQStLwj', 'bitcoingold');
            valid('GUDWdeMyAXQbrNFFivAhkJQ1GfBCFdc7JF', 'bitcoingold');
            valid('mvww6DEJ18dbyQUukpVQXvLgrNDJazZn1Y', 'bitcoingold', 'testnet');
            valid('mn3mdEE6cf1snxVsknNz4GRTdSrWXqYp7c', 'BTG', 'testnet');
            valid('GSNFPRsdaM3MXrU5HW1AxgFwmUQC8HXK9F', 'BTG');
        });

        it('should return true for correct Decred addresses', function () {
            valid('Dsesax2GJnMN4wwmWo5rJGq73dDK217Rh85', 'DCR');
            valid('DsYuxtvGRfN8rncXAndtLUpJm55F77K17RA', 'decred');
            valid('DsaXDG2NrJW8g4tFAb8n9MNx81Sn3Qc8AEV', 'decred');
            valid('TsijUgejaRnLKF5WAbpUxNtwKGUiKVeXLr7', 'decred', 'testnet');
            valid('TsZ9QmAoadF12hGvyALp6qvaF4be3BmLqG9', 'dcr', 'testnet');
        });

        it('should return true for correct Digibyte addresses', function () {
            valid('DG2rM2orU2JH5i4ACh3AKNpRTNESdv5xf8', 'DGB');
            valid('DBR2Lj1F17eHGHXgbpae2Wb4m39bDyA1qo', 'DGB');
            valid('D9TDZTR9Z9Mx2NoDJnhqhnYhDLKRAmsL9n', 'digibyte');
            valid('DHRzA1YHA1kFWpz2apRckZJy6KZRyGq4EV', 'digibyte');
            valid('DJ53hTyLBdZp2wMi5BsCS3rtEL1ioYUkva', 'digibyte');
        });

        it('should return true for correct Ethereum addresses', function () {
            valid('0xE37c0D48d68da5c5b14E5c1a9f1CFE802776D9FF', 'ethereum');
            valid('0xa00354276d2fC74ee91e37D085d35748613f4748', 'ethereum');
            valid('0xAff4d6793F584a473348EbA058deb8caad77a288', 'ETH');
            valid('0xc6d9d2cd449a754c494264e1809c50e34d64562b', 'ETH');
            valid('0x52908400098527886E0F7030069857D2E4169EE7', 'ETH');
            valid('0x8617E340B3D01FA5F11F306F4090FD50E238070D', 'ETH');
            valid('0xde709f2102306220921060314715629080e2fb77', 'ETH');
            valid('0x27b1fdb04752bbc536007a920d24acb045561c26', 'ETH');
            valid('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', 'ETH');
            valid('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', 'ETH');
            valid('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB', 'ETH');
            valid('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', 'ETH');

            valid('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', 'ethereumclassic');
            valid('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', 'ETC');
            valid('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', 'etherzero');
            valid('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', 'ETZ');
            valid('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', 'callisto');
            valid('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', 'CLO');
        });

        it('should return true for correct Ripple addresses', function () {
            valid('rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn', 'ripple');
            valid('rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn', 'XRP');
            valid('r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV', 'XRP');
            valid('rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', 'XRP');
            valid('rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN', 'XRP');
        });

        it('should return true for correct dash addresses', function () {
            valid('Xx4dYKgz3Zcv6kheaqog3fynaKWjbahb6b', 'dash');
            valid('XcY4WJ6Z2Q8w7vcYER1JypC8s2oa3SQ1b1', 'DASH');
            valid('XqMkVUZnqe3w4xvgdZRtZoe7gMitDudGs4', 'dash');
            valid('yPv7h2i8v3dJjfSH4L3x91JSJszjdbsJJA', 'dash', 'testnet');
        });

        it('should return true for correct neo addresses', function () {
            valid('AR4QmqYENiZAD6oXe7ftm6eDcwtHk7rVTT', 'neo');
            valid('AKDVzYGLczmykdtRaejgvWeZrvdkVEvQ1X', 'NEO');
        });

        it('should return true for correct neo gas addresses', function () {
            valid('AR4QmqYENiZAD6oXe7ftm6eDcwtHk7rVTT', 'neogas');
        });

        it('should return true for correct qtum addresses', function () {
            valid('QNjUiD3bVVZwYTc5AhpeQbS1mfb2guyWhe', 'qtum');
            valid('QVZnSrMwKp6AL4FjUPPnfFgsma6j1DXQXu', 'QTUM');
            valid('qcSLSxN1sngCWSrKFZ6UC7ri4hhVSdq9SU', 'qtum', 'testnet');
            valid('qbgHcqxXYHVJZXHheGpHwLJsB5epDUtWxe', 'qtum', 'testnet');
            valid('qZqqcqCsVtP2U38WWaUnwshHRpefvCa8hX', 'qtum', 'testnet');
        });

        it('should return true for correct votecoin addresses', function () {
            valid('t1U9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'votecoin');
            valid('t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'VOT');
            valid('t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'votecoin', 'testnet');
        });

        it('should return true for correct bitcoinz addresses', function () {
            valid('t1U9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'bitcoinz');
            valid('t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'BTCZ');
            valid('t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'bitcoinz', 'testnet');
        });

        it('should return true for correct zclassic addresses', function () {
            valid('t1U9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'zclassic');
            valid('t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'ZCL');
            valid('t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'zclassic', 'testnet');
        });

        it('should return true for correct hush addresses', function () {
            valid('t1U9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'hush');
            valid('t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'HUSH');
            valid('t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'hush', 'testnet');
        });

        it('should return true for correct zcash addresses', function () {
            valid('t1U9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'zcash');
            valid('t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'ZEC');
            valid('t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'zcash', 'testnet');
        });

        it('should return true for correct bitcoinprivate addresses', function () {
            valid('b1M4XXPFhwMb1SP33yhzn3h9qWXjujkgep4', 'bitcoinprivate');
            //valid('bx....', 'BTCP');
            //valid('nx....', 'bitcoinprivate', 'testnet');
        });

        it('should return true for correct snowgem addresses', function () {
            valid('s1fx7WBkjB4UH6qQjPp6Ysmtr1C1JiTK2Yw', 'snowgem');
            valid('s3d27MhkBRt3ha2UuxhjXaYF4DCnttTMnL1', 'SNG');
            valid('t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'snowgem', 'testnet');
        });

        it('should return true for correct zencash addresses', function () {
            valid('znhiGGfYRepxkBjXYvA2kFrXiC351i9ta4z', 'zencash');
            valid('zssEdGnZCQ9G86LZFtbynMn1hYTVhn6eYCL', 'ZEN');
            valid('ztmWMDLWjbruCJxKmmfAZiT6QAQdiv5F291', 'zencash', 'testnet');
        });

        it('should return true for correct komodo addresses', function () {
            valid('R9R5HirAzqDcWrWGiJEL115dpV3QB3hobH', 'komodo');
            valid('RAvj2KKVUohTu3hVdNJ4U6hQi7TNawpacH', 'KMD');
            //valid('t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'komodo', 'testnet');
        });

        it('should return true for correct Bankex addresses', function () {
            valid('0xeac39e1bc802baae3d4b9cb518f3f60374bbad6c', 'bankex');
            valid('0x45245bc59219eeaaf6cd3f382e078a461ff9de7b', 'BKX');
            valid('0xf40d80FCfa5cdEa0bB1E570c2D52132ac9bC6aEC', 'bankex', 'testnet');
            valid('0x8A7395f281EeCf2B471B689E87Cf4C7fa8bb957d', 'BKX', 'testnet');
        });

        it('should return true for correct monero addresses', function () {
            valid('47zQ5LAivg6hNCgijXSEFVLX7mke1bgM6YGLFaANDoJbgXDymcAAZvvMNt2PmMpqEe5qRy2zyfMYXdwpmdyitiFh84xnPG2', 'monero');
            valid('48bWuoDG75CXMDHbmPEvUF2hm1vLDic7ZJ7hqRkL65QR9p13AQAX4eEACXNk4YP115Q4KRVZnAvmMBHrcGfv9FvKPZnH6vH', 'XMR');
            valid('A2be3UvzMtkJtxRYgcCbQt2y7Rp2eLVGqNTWfZeankrWimSMM4y7uMP6B9oAZaHsXTj8KFSerkSkkVRuEuEca9QM8VhxCNU', 'monero', 'testnet');

            //integrated addresses
            valid('4Gd4DLiXzBmbVX2FZZ3Cvu6fUaWACup1qDowprUCje1kSP4FmbftiJMSfV8kWZXNqmVwj4m52xqtgFNUudVmsmGkGvkLcCibWfVUfUFVB7', 'monero');
            valid('4J5sF94AzXgFgx8LuWc9dcWkJkGkD3cL3L2AuhX6QA9jFvSxxj6QhHqHXqM2b2Go7G8RyDzEbHxYd9G26XUUbuJChipEyBz9fENMU2Ua9b', 'XMR');
        });

        it('should return true for correct nano addresses', function () {
            valid('xrb_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3', 'nano');
            valid('xrb_13ezf4od79h1tgj9aiu4djzcmmguendtjfuhwfukhuucboua8cpoihmh8byo', 'nano');
            valid('xrb_35jjmmmh81kydepzeuf9oec8hzkay7msr6yxagzxpcht7thwa5bus5tomgz9', 'nano');
            valid('xrb_1111111111111111111111111111111111111111111111111111hifc8npp', 'nano');
            valid('xrb_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkztrfjy5k7z4imsrata9est', 'nano');
            valid('xrb_3wm37qz19zhei7nzscjcopbrbnnachs4p1gnwo5oroi3qonw6inwgoeuufdp', 'nano');
            valid('xrb_3arg3asgtigae3xckabaaewkx3bzsh7nwz7jkmjos79ihyaxwphhm6qgjps4', 'nano');
            valid('xrb_1f5e4w33ndqbkx4bw5jtp13kp5xghebfxcmw9hdt1f7goid1s4373w6tjmgu', 'nano');
            valid('xrb_1q79ahdr36uqn38p5tp5sqwkn73rnpj1k8obtuetdbjcx37d5gahhd1u9cuh', 'nano');
            valid('nano_1q79ahdr36uqn38p5tp5sqwkn73rnpj1k8obtuetdbjcx37d5gahhd1u9cuh', 'nano');
        });
    });

    describe('invalid results', function () {
        function commonTests(currency) {
            invalid('', currency); //reject blank
            invalid('%%@', currency); //reject invalid base58 string
            invalid('1A1zP1ePQGefi2DMPTifTL5SLmv7DivfNa', currency); //reject invalid address
            invalid('bd839e4f6fadb293ba580df5dea7814399989983', currency);  //reject transaction id's
            //testnet
            invalid('', currency, 'testnet'); //reject blank
            invalid('%%@', currency, 'testnet'); //reject invalid base58 string
            invalid('1A1zP1ePQGefi2DMPTifTL5SLmv7DivfNa', currency, 'testnet'); //reject invalid address
            invalid('bd839e4f6fadb293ba580df5dea7814399989983', currency, 'testnet');  //reject transaction id's
        }

        it('should return false for incorrect bitcoin addresses', function () {
            commonTests('bitcoin');
        });

        it('should return false for incorrect bitcoincash addresses', function () {
            commonTests('bitcoincash');
        });

        it('should return false for incorrect litecoin addresses', function () {
            commonTests('litecoin');
        });

        it('should return false for incorrect peercoin addresses', function () {
            commonTests('peercoin');
        });

        it('should return false for incorrect dogecoin addresses', function () {
            commonTests('dogecoin');
        });

        it('should return false for incorrect beavercoin addresses', function () {
            commonTests('beavercoin');
        });

        it('should return false for incorrect freicoin addresses', function () {
            commonTests('freicoin');
        });

        it('should return false for incorrect protoshares addresses', function () {
            commonTests('protoshares');
        });

        it('should return false for incorrect megacoin addresses', function () {
            commonTests('megacoin');
        });

        it('should return false for incorrect primecoin addresses', function () {
            commonTests('primecoin');
        });

        it('should return false for incorrect auroracoin addresses', function () {
            commonTests('auroracoin');
        });

        it('should return false for incorrect namecoin addresses', function () {
            commonTests('namecoin');
        });

        it('should return false for incorrect biocoin addresses', function () {
            commonTests('biocoin');
        });

        it('should return false for incorrect garlicoin addresses', function () {
            commonTests('garlicoin');
        });

        it('should return false for incorrect vertcoin addresses', function () {
            commonTests('vertcoin');
            invalid('vtc1qmzq3erafwvz23yabc9tu45uz2kx3d7esk0rayg', 'vertcoin');
            invalid('vtc1qhy8eqwqxpyryz4wctus36yl2uu60t0z6ecrvt', 'vertcoin');
            invalid('vtd1qhy8eqwqxpyryz4wctus36yl2uu60t0z6ecrvtc', 'vertcoin');
        });

        it('should return false for incorrect bitcoingold addresses', function () {
            commonTests('bitcoingold');
        });

        it('should return false for incorrect decred addresses', function () {
            commonTests('decred');
        });

        it('should return false for incorrect bankex addresses', function () {
            invalid('1SQHtwR5oJRKLfiWQ2APsAd9miUc4k2ez', 'bankex');
            invalid('116CGDLddrZhMrTwhCVJXtXQpxygTT1kHd', 'BKX');
            invalid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'bankex', 'testnet');
            invalid('mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef', 'BKX', 'testnet');
        });

        it('should return false for incorrect digibyte addresses', function () {
            commonTests('digibyte');
        });

        it('should return false for incorrect eip55 addresses', function () {
            invalid('6xAff4d6793F584a473348EbA058deb8caad77a288', 'ethereum');
            invalid('0x02fcd51aAbB814FfFe17908fbc888A8975D839A5', 'ethereum');
            invalid('0XD1220A0CF47C7B9BE7A2E6BA89F429762E7B9ADB', 'ethereum');
            invalid('aFf4d6793f584a473348ebA058deb8caad77a2885', 'ethereum');
            invalid('0xff4d6793F584a473', 'ethereum');

            invalid('0x02fcd51aAbB814FfFe17908fbc888A8975D839A5', 'ethereumclassic');
            invalid('0x02fcd51aAbB814FfFe17908fbc888A8975D839A5', 'etherzero');
            invalid('0x02fcd51aAbB814FfFe17908fbc888A8975D839A5', 'callisto');
        });

        it('should return false for incorrect ripple addresses', function () {
            invalid('rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCN', 'ripple');
            invalid('rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhMN', 'XRP');
            invalid('6xAff4d6793F584a473348EbA058deb8ca', 'ripple');
            invalid('DJ53hTyLBdZp2wMi5BsCS3rtEL1ioYUkva', 'ripple');
        });

        it('should return false for incorrect dash addresses', function () {
            commonTests('dash');
        });

        it('should return false for incorrect neo addresses', function () {
            commonTests('neo');
            invalid('AR4QmqYENiZAD6oXe7ftm6eDcwtHk7rVTa', 'neo');
            invalid('AKDVzYGLczmykdtRaejgvWeZrvdkVEvQ10', 'NEO');
        });

        it('should return false for incorrect qtum addresses', function () {
            commonTests('qtum');
            invalid('QNPhBbVhDghASxcUh2vHotQUgNeLRFTcfb', 'qtum');
            invalid('QOPhBbVhDghASxcUh2vHotQUgNeLRFTcfa', 'QTUM');
            invalid('qZqqcqCsVtP2U38ABCUnwshHRpefvCa8hX', 'QTUM', 'testnet');
        });

        it('should return false for incorrect votecoin addresses', function () {
            commonTests('votecoin');
            invalid('t1Y9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'votecoin');
            invalid('t3Yz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'VOT');
            invalid('t2YNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'votecoin', 'testnet');
        });

        it('should return false for incorrect bitcoinz addresses', function () {
            commonTests('bitcoinz');
            invalid('t1Y9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'bitcoinz');
            invalid('t3Yz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'BTCZ');
            invalid('t2YNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'bitcoinz', 'testnet');
        });

        it('should return false for incorrect zclassic addresses', function () {
            commonTests('zclassic');
            invalid('t1Y9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'zclassic');
            invalid('t3Yz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'ZCL');
            invalid('t2YNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'zclassic', 'testnet');
        });

        it('should return false for incorrect hush addresses', function () {
            invalid('t1Y9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'hush');
            invalid('t3Yz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'HUSH');
            invalid('t2YNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'hush', 'testnet');
        });

        it('should return false for incorrect zcash addresses', function () {
            commonTests('zcash');
            invalid('t1Y9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'zcash');
            invalid('t3Yz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd', 'ZEC');
            invalid('t2YNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'zcash', 'testnet');
        });

        it('should return false for incorrect bitcoinprivate addresses', function () {
            commonTests('bitcoinprivate');
            invalid('b1Y4XXPFhwMb1SP33yhzn3h9qWXjujkgep4', 'bitcoinprivate');
            //invalid('bx....', 'BTCP');
            //invalid('nx....', 'bitcoinprivate', 'testnet');
        });

        it('should return false for incorrect snowgem addresses', function () {
            commonTests('snowgem');
            invalid('s1Yx7WBkjB4UH6qQjPp6Ysmtr1C1JiTK2Yw', 'snowgem');
            invalid('s3Y27MhkBRt3ha2UuxhjXaYF4DCnttTMnL1', 'SNG');
            invalid('t2YNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'snowgem', 'testnet');
        });

        it('should return false for incorrect zencash addresses', function () {
            commonTests('zencash');
            invalid('znYiGGfYRepxkBjXYvA2kFrXiC351i9ta4z', 'zencash');
            invalid('zsYEdGnZCQ9G86LZFtbynMn1hYTVhn6eYCL', 'ZEN');
            invalid('ztYWMDLWjbruCJxKmmfAZiT6QAQdiv5F291', 'zencash', 'testnet');
        });

        it('should return false for incorrect komodo addresses', function () {
            commonTests('komodo');
            invalid('R9Y5HirAzqDcWrWGiJEL115dpV3QB3hobH', 'komodo');
            invalid('RAYj2KKVUohTu3hVdNJ4U6hQi7TNawpacH', 'KMD');
            //invalid('t2YNzUUx8mWBCRYPRezvA363EYXyEpHokyi', 'komodo', 'testnet');
        });

        it('should return false for incorrect monero addresses', function () {
            commonTests('monero');
            invalid('4AWygwA3hHNE4e4Yr9PtRWJiorXTjZkCi57g4ExYzfXDFFQ8DRFEFyui1dLqVknpqQjGUBdTMbgaFAZaDbrVHdk3GAKBZ3E', 'monero');
            invalid('44643dtxcxjgMWEQLo6mh1c4d9Zxx9GbgK9hEj9iGSiFEryCkbwHyJ3JqxZJRqeC3Hb7ZBLKq5NkaJwR1x95EYnR1bTgN6d', 'xmr');
            invalid('A17N9ztrxjQD3v3JJtHGvHVnq6BAbujDNEuensB6PFwBYFpkjAicih8hDtX76HBuEag5NeaCuMZmRMe6eE5NMRGxFTQn8nJ', 'monero', 'testnet');

            //integrated
            invalid('4LNSCKNSTPNbJYkyAEgL966eHJHLDHiq1PpwKoiFBybcSqNGYfLBJApC62uQEeGAFxfYEd29uXBBrJFo7DhKqFVNi3GhmN79EtD5dgycYz', 'monero');
            invalid('4JpzTwf3i1GeCV76beVr19179oa8j1L8xNSC1bXMtAxxdf4aTTLqubL8EvXfQmUGKt9MMigFtKy91VtoTTSfg1LU7LocPruT6KcGC9RKJV', 'xmr');
        });

        it('should return false for incorrect nano addresses', function () {
            commonTests('nano');
            invalid('xrb_1f5e4w33ndqbkx4bw5jtp13kp5xghebfxcmw9hdt1f7goid1s4373w6tjdgu', 'nano');
            invalid('nano_1f5e4w33ndqbkx4bw5jtp13kp5xghebfxcmw9hdt1f7goid1s4373w6tjdgu', 'nano');
            invalid('xrb_1111111112111111111111111111111111111111111111111111hifc8npp', 'nano');
            invalid('nano_111111111111111111111111111111111111111111111111111hifc8npp', 'nano');
        });
    });
});
