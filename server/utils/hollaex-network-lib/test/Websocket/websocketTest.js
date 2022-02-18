const common = require('../common');
const client = common.client;
const expect = common.expect;
const symbolPair = common.symbolPair;
const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('Socket testing', () => {
	let socket;
	this.logs = [];

	describe('#connect()', () => {
		it('Create a socket connection', (done) => {
			socket = client.connect('all');
			done();
		});
	});

	describe('#userUpdate', () => {
		beforeEach(async () => {
			await Promise.all([
				client.getBalance(),
				client.getOrderbook(symbolPair)
			]).then(async (result) => {
				await result.forEach((res, i) => {
					result[i] = JSON.parse(res);
				});

				this.balance = result[0];
				this.orderbook = result[1][symbolPair];
				this.firstAsk = this.orderbook.asks[0];
				this.firstBid = this.orderbook.bids[0];
				this.usdt = this.balance['usdt_available'];
				this.xht = this.balance['xht_available'];

				await sleep(1000);
			});
		});

		it('Socket listen for userUpdate events', (done) => {
			socket.on('userUpdate', (data) => {
				this.logs.push(data);
			});
			done();
		});

		it('Market maker places a valid order', async () => {
			if (0.0001 <= this.xht) {
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
						for (let i = 0; i >= 0 && this.logs.length < 3; i++) {
							await sleep(500);
						}
						expect(this.logs[0]['type']).to.equal('order_queued');
						expect(this.logs[1]['type']).to.equal('order_added');
						expect(this.logs[2]['type']).to.equal('order_processed');
						this.logs.forEach((log) => {
							expect(log.data.id).to.equal(data.id);
						});
						expect(this.logs.length).to.equal(3);

						await client.cancelOrder(data.id).then(async (result) => {
							let data = JSON.parse(result);
							for (let i = 0; i >= 0 && this.logs.length < 4; i++) {
								await sleep(500);
							}
							expect(this.logs[3]['type']).to.equal('order_removed');
							expect(this.logs[3].data[0].id).to.equal(data.id);
						});
					});
			} else {
				expect.fail('not enough btc available to run test');
			}
		});

		it('Market maker creates sell order significantly larger than largest sell order', async () => {
			if (0.0001 <= this.xht) {
				this.logs = [];
				await client
					.createOrder(symbolPair, 'sell', 0.0001, 'limit', 50000)
					.then(async (result) => {
						let data = JSON.parse(result);
						for (let i = 0; i >= 0 && this.logs.length < 3; i++) {
							await sleep(500);
						}
						expect(this.logs[0]['type']).to.equal('order_queued');
						expect(this.logs[1]['type']).to.equal('order_added');
						expect(this.logs[2]['type']).to.equal('order_processed');
						this.logs.forEach((log) => {
							expect(log.data.id).to.equal(data.id);
						});
						expect(this.logs.length).to.equal(3);

						await client.cancelOrder(data.id).then(async (result) => {
							let data = JSON.parse(result);
							for (let i = 0; i >= 0 && this.logs.length < 4; i++) {
								await sleep(500);
							}
							expect(this.logs[3]['type']).to.equal('order_removed');
							expect(this.logs[3].data[0].id).to.equal(data.id);
						});
					});
			} else {
				expect.fail('not enough btc available to run test');
			}
		});

		it('Market taker creates an order that is immediately filled', async () => {
			if (0.0001 * (this.firstBid[0] + 1) <= this.usdt && 0.0001 <= this.xht) {
				this.logs = [];
				await client
					.createOrder(symbolPair, 'buy', 0.0001, 'limit', this.firstBid[0] + 1)
					.then(async () => {
						await client
							.createOrder(
								symbolPair,
								'sell',
								0.0001,
								'limit',
								this.firstBid[0] + 1
							)
							.then(async (result) => {
								let data = JSON.parse(result);
								for (let i = 0; i >= 0 && this.logs.length < 9; i++) {
									await sleep(500);
								}
								const logs = await this.logs.filter((log) =>
									log.data.id !== undefined
										? log.data.id === data.id
										: log.data[0].id === data.id
								);
								expect(logs[0]['type']).to.equal('order_queued');
								expect(logs[1]['type']).to.equal('trade');
								expect(logs[2]['type']).to.equal('order_filled');
								expect(logs[3]['type']).to.equal('order_processed');
								logs.forEach((log) => {
									log.data.id !== undefined
										? expect(log.data.id).to.equal(data.id)
										: expect(log.data[0].id).to.equal(data.id);
								});
								expect(logs.length).to.equal(4);
							});
					});
			} else {
				expect.fail('not enough balance available to run test');
			}
		});

		it('Market taker creates an order that is immediately partially filled', async () => {
			if (0.0001 * (this.firstBid[0] + 1) <= this.usdt && 0.0001 <= this.xht) {
				this.logs = [];
				await client
					.createOrder(symbolPair, 'buy', 0.0001, 'limit', this.firstBid[0] + 1)
					.then(async () => {
						await client
							.createOrder(
								symbolPair,
								'sell',
								0.0002,
								'limit',
								this.firstBid[0] + 1
							)
							.then(async (result) => {
								let data = JSON.parse(result);
								this.currentOrder = data;
								for (let i = 0; i >= 0 && this.logs.length < 9; i++) {
									await sleep(500);
								}
								const logs = await this.logs.filter((log) =>
									log.data.id !== undefined
										? log.data.id === data.id
										: log.data[0].id === data.id
								);
								expect(logs[0]['type']).to.equal('order_queued');
								expect(logs[1]['type']).to.equal('trade');
								expect(logs[2]['type']).to.equal('order_partialy_filled');
								expect(logs[3]['type']).to.equal('order_processed');
								logs.forEach((log) => {
									log.data.id !== undefined
										? expect(log.data.id).to.equal(data.id)
										: expect(log.data[0].id).to.equal(data.id);
								});
								expect(logs.length).to.equal(4);
							});
					});
			} else {
				expect.fail('not enough balance available to run test');
			}
		});

		it('Market taker cancels an order that was partially filled', async () => {
			if (this.currentOrder !== undefined) {
				this.logs = [];
				await client
					.cancelOrder(this.currentOrder.id)
					.then(async (result) => {
						let data = JSON.parse(result);
						for (let i = 0; i >= 0 && this.logs.length < 1; i++) {
							await sleep(500);
						}
						expect(this.logs[0]['type']).to.equal('order_removed');
						expect(this.logs[0].data[0].id).to.equal(data.id);
						this.currentOrder = undefined;
					})
					.catch((err) => {
						expect(err.error).to.include('Order not found');
						this.currentOrder = undefined;
					});
			} else {
				expect.fail('not enough balance available to run test');
			}
		});

		it('Market taker creates a market order', async () => {
			if (0.0001 * (this.firstBid[0] + 1) <= this.usdt && 0.0001 <= this.xht) {
				this.logs = [];
				await client
					.createOrder(symbolPair, 'buy', 0.0001, 'limit', this.firstBid[0] + 1)
					.then(async () => {
						await client
							.createOrder(symbolPair, 'sell', 0.0001, 'market')
							.then(async (result) => {
								let data = JSON.parse(result);
								for (let i = 0; i >= 0 && this.logs.length < 9; i++) {
									await sleep(500);
								}
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
			}
		});
	});
});
