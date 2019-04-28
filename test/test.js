const expect = require('chai').expect;
const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const SAMPLE_BTC_RECEIVING_ADDRESS = '2N4sL3HjkYSze9EkQeqNAZ5X8q6sjLkTQja';
const SAMPLE_ETH_RECEIVING_ADDRESS =
	'0x2c6f8a619efd25ce9fa827952e50c46a26cb8d29';
const client = new HollaEx({ accessToken: ACCESS_TOKEN });

describe('Public functions', function() {
	const symbolPair = 'btc-eur';

	describe('#getTicker(symbolPair)', function() {
		it('Get the ticker output', function(done) {
			client.getTicker(symbolPair).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('high');
				expect(data).to.have.property('low');
				expect(data).to.have.property('open');
				expect(data).to.have.property('close');
				expect(data).to.have.property('volume');
				expect(data).to.have.property('last');
				done();
			});
		});
		it('Should trigger an error when no symbol is given', function(done) {
			client.getTicker().catch((err) => {
				expect(err.response.body).to.include('Invalid symbol');
				done();
			});
		});
	});

	describe('#getOrderbook(symbolPair)', function() {
		it('Get the orderbook output', function(done) {
			client.getOrderbook(symbolPair).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
		it('Get the orderbook output of all symbols and pairs if no symbol is specified', function(done) {
			client.getOrderbook().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(Object.keys(data).length).to.equal(5);
				expect(data).to.have.property('btc-eur');
				expect(data).to.have.property('eth-eur');
				expect(data).to.have.property('eth-btc');
				expect(data).to.have.property('bch-eur');
				expect(data).to.have.property('bch-btc');
				done();
			});
		});
		it('Should trigger an error when an invalid parameter is passed', function(done) {
			client.getOrderbook(123).catch((err) => {
				expect(err.response.body).to.include('Invalid symbols');
				done();
			});
		});
	});

	describe('#getTrade(symbolPair)', function() {
		it('Get the trade output', function(done) {
			client.getTrade(symbolPair).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data[symbolPair]).not.be.empty;
				expect(data[symbolPair][0]).not.be.empty;
				expect(data[symbolPair][0]).to.have.property('size');
				expect(data[symbolPair][0]).to.have.property('price');
				expect(data[symbolPair][0]).to.have.property('timestamp');
				expect(data[symbolPair][0]).to.have.property('side');
				done();
			});
		});
		it('Get the trade output of all symbols and pairs if no symbol is specified', function(done) {
			client.getTrade().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(Object.keys(data).length).to.equal(5);
				expect(data).to.have.property('btc-eur');
				expect(data).to.have.property('eth-eur');
				expect(data).to.have.property('eth-btc');
				expect(data).to.have.property('bch-eur');
				expect(data).to.have.property('bch-btc');
				expect(data['eth-eur'].length).to.equal(50);
				expect(data['eth-eur'][0]).to.have.property('size');
				expect(data['eth-eur'][0]).to.have.property('price');
				expect(data['eth-eur'][0]).to.have.property('timestamp');
				expect(data['eth-eur'][0]).to.have.property('side');
				done();
			});
		});
		it('Should trigger an error when an invalid parameter is passed', function(done) {
			client.getTrade(123).catch((err) => {
				expect(err.response.body).to.include('Invalid symbol');
				done();
			});
		});
	});

	describe('#getConstant()', function() {
		it('Get the constant output', function(done) {
			client.getConstant().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data.pairs).not.be.empty;
				done();
			});
		});
	});
});

describe('Private functions', function() {
	describe('#getUser()', function() {
		it('Get the user output', function(done) {
			client.getUser().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
	});

	describe('#getBalance()', function() {
		it('Get the balance output', function(done) {
			client.getBalance().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
	});

	describe('#getDeposit()', function() {
		it('Get the deposit output', function(done) {
			client.getDeposit().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
		it('Get only 2 deposits', function(done) {
			client.getDeposit(undefined, 2).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.be.an('object');
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				expect(data).to.have.property('count');
				expect(data.data).to.have.lengthOf(2);
				done();
			});
		});
	});

	describe('#getWithdrawal()', function() {
		it('Get the withdrawal output', function(done) {
			client.getWithdrawal().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
	});

	describe('#getWithdrawalFee(currency)', function() {
		it('Get the withdrawal fee for btc', function(done) {
			client.getWithdrawalFee('btc').then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data.fee).to.be.an('number');
				done();
			});
		});
		it('Get error when passing non-currency parameter', function(done) {
			client.getWithdrawalFee(123).catch((err) => {
				expect(err.response.body).to.include('Invalid currency');
				done();
			});
		});
	});

	describe('#requestWithdrawal(currency, amount, address)', function() {
		it('Get the successful request withdrawal output', function(done) {
			client
				.requestWithdrawal('btc', 0.0001, SAMPLE_BTC_RECEIVING_ADDRESS)
				.then((result) => {
					expect(result).to.equal('{"message":"Success"}');
					done();
				})
				.catch((err) => {
					console.log(
						'*****ATTENTION: Disable Two-Factor Authenication to enable this function*****'
					);
					expect(err.response.body).to.include('Invalid OTP Code');
					done();
				});
		});
		it('Get error when calling requestWithdrawal without parameters', function(done) {
			client.requestWithdrawal().catch((err) => {
				expect(err.response.body).to.include(
					'Missing required property: currency'
				);
				expect(err.response.body).to.include(
					'Missing required property: amount'
				);
				expect(err.response.body).to.include(
					'Missing required property: address'
				);
				done();
			});
		});
		it('Get error when requesting BTC withdrawal request with ETH address', function(done) {
			client
				.requestWithdrawal('btc', 0.0001, SAMPLE_ETH_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include('Invalid BTC address');
					done();
				});
		});
		it('Get error when requesting negative amount of btc withdrawal', function(done) {
			client
				.requestWithdrawal('btc', -24, SAMPLE_BTC_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include(
						'Amount should be bigger than 0'
					);
					done();
				});
		});
		it('Get error when requesting a BTC amount that is larger than 10', function(done) {
			client
				.requestWithdrawal('btc', 11, SAMPLE_BTC_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include(
						'Exceeded max amount for a withdrawal: 10'
					);
					done();
				});
		});
		it('Get error when requesting a ETH amount that is larger than 50', function(done) {
			client
				.requestWithdrawal('eth', 51, SAMPLE_ETH_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include(
						'Exceeded max amount for a withdrawal: 50'
					);
					done();
				});
		});
		it('Get error when requesting a BTC amount that is lower than 0.0001', function(done) {
			client
				.requestWithdrawal('btc', 0.00001, SAMPLE_BTC_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include(
						'Withdrawal amount is too small. Minimum amount for Bitcoin withdrawal: 0.0001'
					);
					done();
				});
		});
		it('Get error when requesting a ETH amount that is lower than 0.001', function(done) {
			client
				.requestWithdrawal('eth', 0.0001, SAMPLE_ETH_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include(
						'Withdrawal amount is too small. Minimum amount for Ethereum withdrawal: 0.001'
					);
					done();
				});
		});
	});

	describe('#getUserTrade()', function() {
		it('Get the user trade output', function(done) {
			client.getUserTrade().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
	});

	describe('Orders', function() {
		let btcOrder;

		describe('#createOrder(symbolPair, side, size, type, price)', function() {
			it('Create an order and return output', function(done) {
				client
					.createOrder('btc-eur', 'buy', 0.0001, 'limit', 1000)
					.then((result) => {
						const data = JSON.parse(result);
						btcOrder = data;
						expect(data).to.be.an('object');
						expect(data).not.be.empty;
						done();
					});
			});
			it('Get an error message when price is too low', function(done) {
				client
					.createOrder('btc-eur', 'buy', 0.0001, 'limit', -9999)
					.catch((err) => {
						expect(err.response.body).to.include(
							'Order price is out of the limits'
						);
						done();
					});
			});
			it('Get an error message when amount is too low', function(done) {
				client
					.createOrder('btc-eur', 'buy', -9999, 'limit', 1000)
					.catch((err) => {
						expect(err.response.body).to.include(
							'Order size is out of the limits'
						);
						done();
					});
			});
		});

		describe('#getOrder(orderId)', function() {
			it('Get the single order output', function(done) {
				client.getOrder(btcOrder.id).then((result) => {
					const data = JSON.parse(result);
					expect(data).to.be.an('object');
					expect(data).not.be.empty;
					expect(data).to.include(btcOrder);
					done();
				});
			});
			it('Get an error message when order cannot be found', function(done) {
				client.getOrder(123).catch((err) => {
					expect(err.response.body).to.include('Order not found');
					done();
				});
			});
		});

		describe('#getAllOrder(symbolPair)', function() {
			it('Get all orders', function(done) {
				client.getAllOrder('btc-eur').then((result) => {
					const data = JSON.parse(result);
					expect(data).to.be.an('array');
					expect(data).not.be.empty;
					expect(data[data.length - 1]).to.include(btcOrder);
					done();
				});
			});
			it('Get an error message when invalid pair is give', function(done) {
				client.getAllOrder('hello').catch((err) => {
					expect(err.response.body).to.include('Invalid symbol');
					done();
				});
			});
		});

		describe('#cancelOrder(orderId)', function() {
			it('Cancel a specific order', function(done) {
				client.cancelOrder(btcOrder.id).then((result) => {
					const data = JSON.parse(result);
					expect(data).to.be.an('object');
					expect(data).not.be.empty;
					expect(data).to.include(btcOrder);
					done();
				});
			});
			it('Get an error message when order cannot be found', function(done) {
				client.cancelOrder(123).catch((err) => {
					expect(err.response.body).to.include('Order not found');
					done();
				});
			});
		});
	});
});

describe('Socket testing', function() {
	let socket;

	describe('#connect()', function() {
		it('Create a socket connection', function(done) {
			socket = client.connect('all');
			done();
		});
	});

	describe('#ticker', function() {
		it('Get the ticker output', function(done) {
			socket.on('ticker', (data) => {
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
	});
});
