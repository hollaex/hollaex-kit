const common = require('../common');
const client = common.client;
const expect = common.expect;
const symbolPair = common.symbolPair;

const SAMPLE_BTC_RECEIVING_ADDRESS = '2N4sL3HjkYSze9EkQeqNAZ5X8q6sjLkTQja';
const SAMPLE_ETH_RECEIVING_ADDRESS =
	'0x2c6f8a619efd25ce9fa827952e50c46a26cb8d29';

let constants = {};

describe('Public functions', () => {
	describe('#getConstant()', () => {
		it('Get the constant output', (done) => {
			client.getConstant().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				constants = data;
				done();
			});
		});
	});

	describe('#getTicker(symbolPair)', () => {
		it('Get the ticker output', (done) => {
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
		it('Should trigger an error when no symbol is given', (done) => {
			client.getTicker().catch((err) => {
				expect(err.response.body).to.include('Invalid symbol');
				done();
			});
		});
	});

	describe('#getOrderbook(symbolPair)', () => {
		it('Get the orderbook output', (done) => {
			client.getOrderbook(symbolPair).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
		it('Get the orderbook output of all symbols and pairs if no symbol is specified', (done) => {
			client.getOrderbook().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(Object.keys(data).length).to.equal(Object.keys(constants.pairs).length);
				Object.keys(constants.pairs).forEach((pair) => {
					expect(data).to.have.property(pair);
				});
				done();
			});
		});
		it('Should trigger an error when an invalid parameter is passed', (done) => {
			client.getOrderbook(123).catch((err) => {
				expect(err.response.body).to.include('Invalid symbols');
				done();
			});
		});
	});

	describe('#getTrade(symbolPair)', () => {
		it('Get the trade output', (done) => {
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
		it('Get the trade output of all symbols and pairs if no symbol is specified', (done) => {
			client.getTrade().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(Object.keys(data).length).to.equal(Object.keys(constants.pairs).length);
				Object.keys(constants.pairs).forEach((pair) => {
					expect(data).to.have.property(pair);
					if (data[pair][0]) {
						expect(data[pair][0]).to.have.property('size');
						expect(data[pair][0]).to.have.property('price');
						expect(data[pair][0]).to.have.property('timestamp');
						expect(data[pair][0]).to.have.property('side');
					}
				});
				done();
			});
		});
		it('Should trigger an error when an invalid parameter is passed', (done) => {
			client.getTrade(123).catch((err) => {
				expect(err.response.body).to.include('Invalid symbol');
				done();
			});
		});
	});
});

describe('Private functions', () => {
	describe('#getUser()', () => {
		it('Get the user output', (done) => {
			client.getUser().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
	});

	describe('#getBalance()', () => {
		it('Get the balance output', (done) => {
			client.getBalance().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
	});

	describe('#getDeposit(currency, limit, page, orderBy, order)', () => {
		it('Get the deposit output', (done) => {
			client.getDeposit().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
		it('Get only 2 deposits', (done) => {
			client.getDeposit(undefined, 2).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.be.an('object');
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				expect(data).to.have.property('count');
				if (data.data.length > 0 && data.data.length >= 2) expect(data.data).to.have.lengthOf(2);
				done();
			});
		});
		it('Get only BTC deposits', (done) => {
			client.getDeposit('btc', 1).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				if (data.data.length > 0) expect(data.data[0].currency).to.equal('btc');
				done();
			});
		});
		it('Get results in descending order by amount field', (done) => {
			client.getDeposit(undefined, 2, 1, 'amount', 'desc').then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				if (data.data.length >= 2) expect(data.data[0].amount).to.be.at.least(data.data[1].amount);
				done();
			});
		});
	});

	describe('#getWithdrawal(currency, limit, page, orderBy, order)', () => {
		it('Get the withdrawal output', (done) => {
			client.getWithdrawal().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				done();
			});
		});
		it('Get only 2 withdrawals', (done) => {
			client.getWithdrawal(undefined, 2).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				expect(data).to.have.property('count');
				if (data.data.length > 0 && data.data.length >= 2) expect(data.data).to.have.lengthOf(2);
				done();
			});
		});
		it('Get only BTC withdrawals', (done) => {
			client.getWithdrawal('btc', 1).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				if (data.data.length > 0) expect(data.data[0].currency).to.equal('btc');
				done();
			});
		});
		it('Get results in descending order by amount field', (done) => {
			client.getWithdrawal(undefined, 2, 1, 'amount', 'desc').then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				if (data.data.length > 0) expect(data.data[0].amount).to.be.at.least(data.data[1].amount);
				done();
			});
		});
	});

	describe('#requestWithdrawal(currency, amount, address)', () => {
		it('Get the successful request withdrawal output', (done) => {
			client
				.requestWithdrawal('btc', 0.0001, SAMPLE_BTC_RECEIVING_ADDRESS)
				.then((result) => {
					expect(result).to.equal('{"message":"Success"}');
					done();
				})
				.catch((err) => {
					console.log(
						'*****ATTENTION: Disable Two-Factor Authentication to enable this function*****'
					);
					expect(err.response.body).to.include('Invalid OTP Code');
					done();
				});
		});
		it('Get error when calling requestWithdrawal without parameters', (done) => {
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
		it('Get error when requesting BTC withdrawal request with ETH address', (done) => {
			client
				.requestWithdrawal('btc', 0.0001, SAMPLE_ETH_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include('Invalid btc address');
					done();
				});
		});
		it('Get error when requesting negative amount of btc withdrawal', (done) => {
			client
				.requestWithdrawal('btc', -24, SAMPLE_BTC_RECEIVING_ADDRESS)
				.catch((err) => {
					expect(err.response.body).to.include(
						'Amount should be bigger than 0'
					);
					done();
				});
		});
		// it('Get error when requesting a BTC amount that is larger than 10', (done) => {
		// 	client
		// 		.requestWithdrawal('btc', constants.coins.btc.max * 1.01, SAMPLE_BTC_RECEIVING_ADDRESS)
		// 		.then((data) => console.log(data))
		// 		.catch((err) => {
		// 			expect(err.response.body).to.include(
		// 				'Exceeded max amount for a withdrawal: 10'
		// 			);
		// 			done();
		// 		});
		// });
		// it('Get error when requesting a ETH amount that is larger than 50', (done) => {
		// 	client
		// 		.requestWithdrawal('eth', constants.coins.eth.max * 1.01, SAMPLE_ETH_RECEIVING_ADDRESS)
		// 		.catch((err) => {
		// 			expect(err.response.body).to.include(
		// 				'Exceeded max amount for a withdrawal: 50'
		// 			);
		// 			done();
		// 		});
		// });
		// it('Get error when requesting a BTC amount that is lower than min', (done) => {
		// 	client
		// 		.requestWithdrawal('btc', constants.coins.btc.min * 0.99, SAMPLE_BTC_RECEIVING_ADDRESS)
		// 		.catch((err) => {
		// 			expect(err.response.body).to.include(
		// 				'Amount should be bigger than'
		// 			);
		// 			done();
		// 		});
		// });
		// it('Get error when requesting a ETH amount that is lower than min', (done) => {
		// 	client
		// 		.requestWithdrawal('eth', constants.coins.eth.min * 0.99, SAMPLE_ETH_RECEIVING_ADDRESS)
		// 		.catch((err) => {
		// 			expect(err.response.body).to.include(
		// 				'Amount should be bigger than'
		// 			);
		// 			done();
		// 		});
		// });
	});

	describe('#getUserTrade(symbol, limit, page)', () => {
		it('Get the user trade output', (done) => {
			client.getUserTrade().then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				done();
			});
		});
		it('Get one user trade output', (done) => {
			client.getUserTrade(undefined, 2).then((result) => {
				const data = JSON.parse(result);
				expect(data).to.be.an('object');
				expect(data).not.be.empty;
				expect(data).to.have.property('count');
				expect(data).to.have.property('data');
				expect(data.data).to.have.lengthOf(2);
				done();
			});
		});
		it('Get error message when passing invalid symbol', (done) => {
			client.getUserTrade(123).catch((err) => {
				expect(err.response.body).to.include('Invalid symbol');
				done();
			});
		});
	});

	describe('Orders', () => {
		let btcOrder;

		describe('#createOrder(symbolPair, side, size, type, price)', () => {
			it('Create an order and return output', (done) => {
				client
					.createOrder('btc-usdt', 'buy', 0.0001, 'limit', 1000)
					.then((result) => {
						const data = JSON.parse(result);
						btcOrder = data;
						delete btcOrder['status'];
						expect(data).to.be.an('object');
						expect(data).not.be.empty;
						done();
					});
			});
			it('Get an error message when price is too low', (done) => {
				client
					.createOrder('btc-usdt', 'buy', 0.0001, 'limit', -9999)
					.catch((err) => {
						expect(err.response.body).to.include(
							'Order price is out of the limits'
						);
						done();
					});
			});
			it('Get an error message when amount is too low', (done) => {
				client
					.createOrder('btc-usdt', 'buy', -9999, 'limit', 1000)
					.catch((err) => {
						expect(err.response.body).to.include(
							'Order size is out of the limits'
						);
						done();
					});
			});
		});

		describe('#getOrder(orderId)', () => {
			it('Get the single order output', (done) => {
				client.getOrder(btcOrder.id).then((result) => {
					const data = JSON.parse(result);
					expect(data).to.be.an('object');
					expect(data).not.be.empty;
					expect(data).to.include(btcOrder);
					done();
				});
			});
			it('Get an error message when order cannot be found', (done) => {
				client.getOrder(123).catch((err) => {
					expect(err.response.body).to.include('Order not found');
					done();
				});
			});
		});

		describe('#getAllOrder(symbolPair)', () => {
			it('Get all orders', (done) => {
				client.getAllOrder('btc-usdt').then((result) => {
					const data = JSON.parse(result);
					expect(data).to.be.an('array');
					expect(data).not.be.empty;
					expect(data[data.length - 1]).to.include(btcOrder);
					done();
				});
			});
			it('Get an error message when invalid pair is give', (done) => {
				client.getAllOrder('hello').catch((err) => {
					expect(err.response.body).to.include('Invalid symbol');
					done();
				});
			});
		});

		describe('#cancelOrder(orderId)', () => {
			it('Cancel a specific order', (done) => {
				client.cancelOrder(btcOrder.id).then((result) => {
					const data = JSON.parse(result);
					expect(data).to.be.an('object');
					expect(data).not.be.empty;
					expect(data).to.include(btcOrder);
					done();
				});
			});
			it('Get an error message when order cannot be found', (done) => {
				client.cancelOrder(123).catch((err) => {
					expect(err.response.body).to.include('Order not found');
					done();
				});
			});
		});
	});
});
