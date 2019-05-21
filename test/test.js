const expect = require('chai').expect;
const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const SAMPLE_BTC_RECEIVING_ADDRESS = '2N4sL3HjkYSze9EkQeqNAZ5X8q6sjLkTQja';
const SAMPLE_ETH_RECEIVING_ADDRESS =
	'0x2c6f8a619efd25ce9fa827952e50c46a26cb8d29';
const client = new HollaEx({ accessToken: ACCESS_TOKEN });
const symbolPair = 'btc-eur';

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// describe('Public functions', () => {

// 	describe('#getTicker(symbolPair)', () => {
// 		it('Get the ticker output', (done) => {
// 			client.getTicker(symbolPair).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('high');
// 				expect(data).to.have.property('low');
// 				expect(data).to.have.property('open');
// 				expect(data).to.have.property('close');
// 				expect(data).to.have.property('volume');
// 				expect(data).to.have.property('last');
// 				done();
// 			});
// 		});
// 		it('Should trigger an error when no symbol is given', (done) => {
// 			client.getTicker().catch((err) => {
// 				expect(err.response.body).to.include('Invalid symbol');
// 				done();
// 			});
// 		});
// 	});

// 	describe('#getOrderbook(symbolPair)', () => {
// 		it('Get the orderbook output', (done) => {
// 			client.getOrderbook(symbolPair).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				done();
// 			});
// 		});
// 		it('Get the orderbook output of all symbols and pairs if no symbol is specified', (done) => {
// 			client.getOrderbook().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(Object.keys(data).length).to.equal(5);
// 				expect(data).to.have.property('btc-eur');
// 				expect(data).to.have.property('eth-eur');
// 				expect(data).to.have.property('eth-btc');
// 				expect(data).to.have.property('bch-eur');
// 				expect(data).to.have.property('bch-btc');
// 				done();
// 			});
// 		});
// 		it('Should trigger an error when an invalid parameter is passed', (done) => {
// 			client.getOrderbook(123).catch((err) => {
// 				expect(err.response.body).to.include('Invalid symbols');
// 				done();
// 			});
// 		});
// 	});

// 	describe('#getTrade(symbolPair)', () => {
// 		it('Get the trade output', (done) => {
// 			client.getTrade(symbolPair).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data[symbolPair]).not.be.empty;
// 				expect(data[symbolPair][0]).not.be.empty;
// 				expect(data[symbolPair][0]).to.have.property('size');
// 				expect(data[symbolPair][0]).to.have.property('price');
// 				expect(data[symbolPair][0]).to.have.property('timestamp');
// 				expect(data[symbolPair][0]).to.have.property('side');
// 				done();
// 			});
// 		});
// 		it('Get the trade output of all symbols and pairs if no symbol is specified', (done) => {
// 			client.getTrade().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(Object.keys(data).length).to.equal(5);
// 				expect(data).to.have.property('btc-eur');
// 				expect(data).to.have.property('eth-eur');
// 				expect(data).to.have.property('eth-btc');
// 				expect(data).to.have.property('bch-eur');
// 				expect(data).to.have.property('bch-btc');
// 				expect(data['eth-eur'].length).to.equal(50);
// 				expect(data['eth-eur'][0]).to.have.property('size');
// 				expect(data['eth-eur'][0]).to.have.property('price');
// 				expect(data['eth-eur'][0]).to.have.property('timestamp');
// 				expect(data['eth-eur'][0]).to.have.property('side');
// 				done();
// 			});
// 		});
// 		it('Should trigger an error when an invalid parameter is passed', (done) => {
// 			client.getTrade(123).catch((err) => {
// 				expect(err.response.body).to.include('Invalid symbol');
// 				done();
// 			});
// 		});
// 	});

// 	describe('#getConstant()', () => {
// 		it('Get the constant output', (done) => {
// 			client.getConstant().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data.pairs).not.be.empty;
// 				done();
// 			});
// 		});
// 	});
// });

// describe('Private functions', () => {
// 	describe('#getUser()', () => {
// 		it('Get the user output', (done) => {
// 			client.getUser().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				done();
// 			});
// 		});
// 	});

// 	describe('#getBalance()', () => {
// 		it('Get the balance output', (done) => {
// 			client.getBalance().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				done();
// 			});
// 		});
// 	});

// 	describe('#getDeposit(currency, limit, page, orderBy, order)', () => {
// 		it('Get the deposit output', (done) => {
// 			client.getDeposit().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				done();
// 			});
// 		});
// 		it('Get only 2 deposits', (done) => {
// 			client.getDeposit(undefined, 2).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.be.an('object');
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				expect(data).to.have.property('count');
// 				expect(data.data).to.have.lengthOf(2);
// 				done();
// 			});
// 		});
// 		it('Get only BTC deposits', (done) => {
// 			client.getDeposit('btc', 1).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				expect(data.data[0].currency).to.equal('btc');
// 				done();
// 			});
// 		});
// 		it('Get results in descending order by amount field', (done) => {
// 			client.getDeposit(undefined, 2, 1, 'amount', 'desc').then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				expect(data.data[0].amount).to.be.at.least(data.data[1].amount);
// 				done();
// 			});
// 		});
// 	});

// 	describe('#getWithdrawal(currency, limit, page, orderBy, order)', () => {
// 		it('Get the withdrawal output', (done) => {
// 			client.getWithdrawal().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				done();
// 			});
// 		});
// 		it('Get only 2 withdrawals', (done) => {
// 			client.getWithdrawal(undefined, 2).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				expect(data).to.have.property('count');
// 				expect(data.data).to.have.lengthOf(2);
// 				done();
// 			});
// 		});
// 		it('Get only BTC withdrawals', (done) => {
// 			client.getWithdrawal('btc', 1).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				expect(data.data[0].currency).to.equal('btc');
// 				done();
// 			});
// 		});
// 		it('Get results in descending order by amount field', (done) => {
// 			client.getWithdrawal(undefined, 2, 1, 'amount', 'desc').then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				expect(data.data[0].amount).to.be.at.least(data.data[1].amount);
// 				done();
// 			});
// 		});
// 	});

// 	describe('#getWithdrawalFee(currency)', () => {
// 		it('Get the withdrawal fee for btc', (done) =>{
// 			client.getWithdrawalFee('btc').then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data.fee).to.be.an('number');
// 				done();
// 			});
// 		});
// 		it('Get error when passing non-currency parameter', (done) => {
// 			client.getWithdrawalFee(123).catch((err) => {
// 				expect(err.response.body).to.include('Invalid currency');
// 				done();
// 			});
// 		});
// 	});

// 	describe('#requestWithdrawal(currency, amount, address)', () => {
// 		it('Get the successful request withdrawal output', (done) => {
// 			client
// 				.requestWithdrawal('btc', 0.0001, SAMPLE_BTC_RECEIVING_ADDRESS)
// 				.then((result) => {
// 					expect(result).to.equal('{"message":"Success"}');
// 					done();
// 				})
// 				.catch((err) => {
// 					console.log(
// 						'*****ATTENTION: Disable Two-Factor Authentication to enable this function*****'
// 					);
// 					expect(err.response.body).to.include('Invalid OTP Code');
// 					done();
// 				});
// 		});
// 		it('Get error when calling requestWithdrawal without parameters', (done) => {
// 			client.requestWithdrawal().catch((err) => {
// 				expect(err.response.body).to.include(
// 					'Missing required property: currency'
// 				);
// 				expect(err.response.body).to.include(
// 					'Missing required property: amount'
// 				);
// 				expect(err.response.body).to.include(
// 					'Missing required property: address'
// 				);
// 				done();
// 			});
// 		});
// 		it('Get error when requesting BTC withdrawal request with ETH address', (done) => {
// 			client
// 				.requestWithdrawal('btc', 0.0001, SAMPLE_ETH_RECEIVING_ADDRESS)
// 				.catch((err) => {
// 					expect(err.response.body).to.include('Invalid BTC address');
// 					done();
// 				});
// 		});
// 		it('Get error when requesting negative amount of btc withdrawal', (done) => {
// 			client
// 				.requestWithdrawal('btc', -24, SAMPLE_BTC_RECEIVING_ADDRESS)
// 				.catch((err) => {
// 					expect(err.response.body).to.include(
// 						'Amount should be bigger than 0'
// 					);
// 					done();
// 				});
// 		});
// 		it('Get error when requesting a BTC amount that is larger than 10', (done) => {
// 			client
// 				.requestWithdrawal('btc', 11, SAMPLE_BTC_RECEIVING_ADDRESS)
// 				.catch((err) => {
// 					expect(err.response.body).to.include(
// 						'Exceeded max amount for a withdrawal: 10'
// 					);
// 					done();
// 				});
// 		});
// 		it('Get error when requesting a ETH amount that is larger than 50', (done) => {
// 			client
// 				.requestWithdrawal('eth', 51, SAMPLE_ETH_RECEIVING_ADDRESS)
// 				.catch((err) => {
// 					expect(err.response.body).to.include(
// 						'Exceeded max amount for a withdrawal: 50'
// 					);
// 					done();
// 				});
// 		});
// 		it('Get error when requesting a BTC amount that is lower than 0.0001', (done) => {
// 			client
// 				.requestWithdrawal('btc', 0.00001, SAMPLE_BTC_RECEIVING_ADDRESS)
// 				.catch((err) => {
// 					expect(err.response.body).to.include(
// 						'Withdrawal amount is too small. Minimum amount for Bitcoin withdrawal: 0.0001'
// 					);
// 					done();
// 				});
// 		});
// 		it('Get error when requesting a ETH amount that is lower than 0.001', (done) => {
// 			client
// 				.requestWithdrawal('eth', 0.0001, SAMPLE_ETH_RECEIVING_ADDRESS)
// 				.catch((err) => {
// 					expect(err.response.body).to.include(
// 						'Withdrawal amount is too small. Minimum amount for Ethereum withdrawal: 0.001'
// 					);
// 					done();
// 				});
// 		});
// 	});

// 	describe('#getUserTrade(symbol, limit, page)', () => {
// 		it('Get the user trade output', (done) => {
// 			client.getUserTrade().then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				done();
// 			});
// 		});
// 		it('Get one user trade output', (done) => {
// 			client.getUserTrade(undefined, 2).then((result) => {
// 				const data = JSON.parse(result);
// 				expect(data).to.be.an('object');
// 				expect(data).not.be.empty;
// 				expect(data).to.have.property('count');
// 				expect(data).to.have.property('data');
// 				expect(data.data).to.have.lengthOf(2);
// 				done();
// 			});
// 		});
// 		it('Get error message when passing invalid symbol', (done) => {
// 			client.getUserTrade(123).catch((err) => {
// 				expect(err.response.body).to.include('Invalid symbol');
// 				done();
// 			});
// 		});
// 	});

// 	describe('Orders', () => {
// 		let btcOrder;

// 		describe('#createOrder(symbolPair, side, size, type, price)', () => {
// 			it('Create an order and return output', (done) => {
// 				client
// 					.createOrder('btc-eur', 'buy', 0.0001, 'limit', 1000)
// 					.then((result) => {
// 						const data = JSON.parse(result);
// 						btcOrder = data;
// 						expect(data).to.be.an('object');
// 						expect(data).not.be.empty;
// 						done();
// 					});
// 			});
// 			it('Get an error message when price is too low', (done) => {
// 				client
// 					.createOrder('btc-eur', 'buy', 0.0001, 'limit', -9999)
// 					.catch((err) => {
// 						expect(err.response.body).to.include(
// 							'Order price is out of the limits'
// 						);
// 						done();
// 					});
// 			});
// 			it('Get an error message when amount is too low', (done) => {
// 				client
// 					.createOrder('btc-eur', 'buy', -9999, 'limit', 1000)
// 					.catch((err) => {
// 						expect(err.response.body).to.include(
// 							'Order size is out of the limits'
// 						);
// 						done();
// 					});
// 			});
// 		});

// 		describe('#getOrder(orderId)', () => {
// 			it('Get the single order output', (done) => {
// 				client.getOrder(btcOrder.id).then((result) => {
// 					const data = JSON.parse(result);
// 					expect(data).to.be.an('object');
// 					expect(data).not.be.empty;
// 					expect(data).to.include(btcOrder);
// 					done();
// 				});
// 			});
// 			it('Get an error message when order cannot be found', (done) => {
// 				client.getOrder(123).catch((err) => {
// 					expect(err.response.body).to.include('Order not found');
// 					done();
// 				});
// 			});
// 		});

// 		describe('#getAllOrder(symbolPair)', () => {
// 			it('Get all orders', (done) =>{
// 				client.getAllOrder('btc-eur').then((result) => {
// 					const data = JSON.parse(result);
// 					expect(data).to.be.an('array');
// 					expect(data).not.be.empty;
// 					expect(data[data.length - 1]).to.include(btcOrder);
// 					done();
// 				});
// 			});
// 			it('Get an error message when invalid pair is give', (done) => {
// 				client.getAllOrder('hello').catch((err) => {
// 					expect(err.response.body).to.include('Invalid symbol');
// 					done();
// 				});
// 			});
// 		});

// 		describe('#cancelOrder(orderId)', () => {
// 			it('Cancel a specific order', (done) => {
// 				client.cancelOrder(btcOrder.id).then((result) => {
// 					const data = JSON.parse(result);
// 					expect(data).to.be.an('object');
// 					expect(data).not.be.empty;
// 					expect(data).to.include(btcOrder);
// 					done();
// 				});
// 			});
// 			it('Get an error message when order cannot be found', (done) => {
// 				client.cancelOrder(123).catch((err) => {
// 					expect(err.response.body).to.include('Order not found');
// 					done();
// 				});
// 			});
// 		});
// 	});
// });

describe('Socket testing', () => {
	let socket;

	describe('#connect()', () => {
		it('Create a socket connection', (done) => {
			socket = client.connect('all');
			done();
		});
	});

	describe('#userUpdate', async () => {
		before(async () => {
			await socket.on('userUpdate', (data) => {
				this.logs.push(data);
			});
		});

		beforeEach(async () => {
			await Promise.all([
				client.getBalance(),
				client.getOrderbook(symbolPair)
			]).then((result) => {
				result.forEach((res, i) => {
					result[i] = JSON.parse(res);
				});

				this.balance = result[0];
				this.orderbook = result[1][symbolPair];
				this.logs = [];
				this.firstAsk = this.orderbook.asks[0];
				this.firstBid = this.orderbook.bids[0];
				this.fiat = this.balance['fiat_available'];
				this.btc = this.balance['btc_available'];
			});
		});

		it('Market maker places a valid order', async () => {
			await sleep(1000);
			if (0.0001 <= this.btc) {
				await client
				.createOrder(symbolPair, 'sell', 0.0001, 'limit', this.firstAsk[0] - 1)
				.then(async (result) => {
					let data = JSON.parse(result);
					await sleep(1000);
					expect(this.logs.length).to.equal(3);
					expect(this.logs[0]['type']).to.equal('order_queued');
					expect(this.logs[1]['type']).to.equal('order_added');
					expect(this.logs[2]['type']).to.equal('order_processed');
					this.logs.forEach((log) => {
						expect(log.data.id).to.equal(data.id);
					});

					await client.cancelOrder(data.id).then(async (result) => {
						let data = JSON.parse(result);
						await sleep(1000);
						expect(this.logs[3]['type']).to.equal('order_removed');
						expect(this.logs[3].data[0].id).to.equal(data.id);
					});
				});
			} else {
				expect.fail('not enough btc available to run test');
			}
		});

		it('Market maker creates sell order significantly larger than largest sell order', async () => {
			await sleep(1000);
			let highestAskPrice = this.orderbook.asks[
				this.orderbook.asks.length - 1
			][0];
			if (0.0001 <= this.btc) {
				await client
					.createOrder(symbolPair, 'sell', 0.0001, 'limit', highestAskPrice * 2)
					.then(async (result) => {
						let data = JSON.parse(result);
						await sleep(1000);
						expect(this.logs.length).to.equal(3);
						expect(this.logs[0]['type']).to.equal('order_queued');
						expect(this.logs[1]['type']).to.equal('order_added');
						expect(this.logs[2]['type']).to.equal('order_processed');
						this.logs.forEach((log) => {
							expect(log.data.id).to.equal(data.id);
						});

						await client.cancelOrder(data.id).then(async (result) => {
							let data = JSON.parse(result);
							await sleep(1000);
							expect(this.logs[3]['type']).to.equal('order_removed');
							expect(this.logs[3].data[0].id).to.equal(data.id);
						});
					});
			} else {
				expect.fail('not enough btc available to run test');
			}
		});

		it('Market taker creates an order that is immediately filled', async () => {
			await sleep(1000);
			if (0.0001 * (this.firstAsk[0] - 1) <= this.fiat && 0.0001 <= this.btc) {
				await client
				.createOrder(symbolPair, 'buy', 0.0001, 'limit', this.firstAsk[0] - 1)
				.then(async () => {
					await client
						.createOrder(
							symbolPair,
							'sell',
							0.0001,
							'limit',
							this.firstAsk[0] - 1
						)
						.then(async (result) => {
							let data = JSON.parse(result);
							await sleep(1000);
							const logs = await this.logs.filter((log) =>
								log.data.id !== undefined
									? log.data.id === data.id
									: log.data[0].id === data.id
							);
							expect(logs.length).to.equal(4);
							expect(logs[0]['type']).to.equal('order_queued');
							expect(logs[1]['type']).to.equal('trade');
							expect(logs[2]['type']).to.equal('order_filled');
							expect(logs[3]['type']).to.equal('order_processed');
							logs.forEach((log) => {
								log.data.id !== undefined
									? expect(log.data.id).to.equal(data.id)
									: expect(log.data[0].id).to.equal(data.id);
							});
						});
				});
			} else {
				expect.fail('not enough balance available to run test');
			}
		});

		it('Market taker creates an order that is immediately partially filled', async () => {
			await sleep(1000);
			if (0.0001 * (this.firstAsk[0] - 1) <= this.fiat && 0.0001 <= this.btc) {
				await client
					.createOrder(symbolPair, 'buy', 0.0001, 'limit', this.firstAsk[0] - 1)
					.then(async () => {
						await client
							.createOrder(
								symbolPair,
								'sell',
								0.0002,
								'limit',
								this.firstAsk[0] - 1
							)
							.then(async (result) => {
								let data = JSON.parse(result);
								this.currentOrder = data;
								await sleep(1000);
								const logs = await this.logs.filter((log) =>
									log.data.id !== undefined
										? log.data.id === data.id
										: log.data[0].id === data.id
								);
								expect(logs.length).to.equal(4);
								expect(logs[0]['type']).to.equal('order_queued');
								expect(logs[1]['type']).to.equal('trade');
								expect(logs[2]['type']).to.equal('order_partialy_filled');
								expect(logs[3]['type']).to.equal('order_processed');
								logs.forEach((log) => {
									log.data.id !== undefined
										? expect(log.data.id).to.equal(data.id)
										: expect(log.data[0].id).to.equal(data.id);
								});
							});
					});
			} else {
				expect.fail('not enough balance available to run test');
			}
		});

		it('Market taker cancels an order that was partially filled', async () => {
			if (this.currentOrder !== undefined) {
				await client.cancelOrder(this.currentOrder.id)
				.then(async (result) => {
					let data = JSON.parse(result);
					await sleep(1000);
					expect(this.logs[0]['type']).to.equal('order_removed');
					expect(this.logs[0].data[0].id).to.equal(data.id);
				})
				.catch((err) => {
					expect(err.error).to.include('Order not found');
				})
			} else {
				expect.fail('not enough balance available to run test');
			}
		})
	});
});
