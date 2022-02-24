import { web3, CONTRACT_ADDRESSES, CONTRACTS } from 'config/contracts';
import mathjs from 'mathjs';
import { hash } from 'rsvp';

const commonConfigs = {
	type: '0x2',
};

const CONTRACT_EVENTS = {
	Reward: 'RewardEvent',
	Distribute: 'DistributeEvent',
	Stake: 'StakeEvent',
	Unstake: 'UnstakeEvent',
};

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_CURRENT_BLOCK = 'SET_CURRENT_BLOCK';
export const SET_BLOCKCHAIN_DATA = 'SET_BLOCKCHAIN_DATA';
export const SET_STAKABLES = 'SET_STAKABLES';
export const SET_PERIODS = 'SET_STAKING_PERIODS';
export const SET_USER_STAKES = 'SET_USER_STAKES';
export const SET_CONTRACT_EVENTS = 'SET_CONTRACT_EVENTS';
export const SET_DISTRIBUTIONS = 'SET_DISTRIBUTIONS';
export const SET_PUBLIC_INFO = 'SET_PUBLIC_INFO';
export const SET_PENDING_TRANSACTIONS = 'SET_PENDING_TRANSACTIONS';
export const RESET_STAKE_STORE = 'RESET_STAKE_STORE';
export const SET_PENALTIES = 'SET_PENALTIES';
export const SET_POTS = 'SET_POTS';

const setAccount = (account = '', balance = 0) => ({
	type: SET_ACCOUNT,
	payload: {
		account,
		balance,
	},
});

const setBlockchainData = (account = '', balance = 0, network = '') => ({
	type: SET_BLOCKCHAIN_DATA,
	payload: {
		account,
		balance,
		network,
	},
});

const setCurrentBlock = (currentBlock = '') => ({
	type: SET_CURRENT_BLOCK,
	payload: {
		currentBlock,
	},
});

const setStakables = (stakables = []) => ({
	type: SET_STAKABLES,
	payload: {
		stakables,
	},
});

const setPeriods = (periods = {}) => ({
	type: SET_PERIODS,
	payload: {
		periods,
	},
});

const setPenalties = (penalties = {}) => ({
	type: SET_PENALTIES,
	payload: {
		penalties,
	},
});

const setPots = (pots = {}) => ({
	type: SET_POTS,
	payload: {
		pots,
	},
});

const setAllUserStakes = (userStakes = {}) => ({
	type: SET_USER_STAKES,
	payload: {
		userStakes,
	},
});

const setContractEvents = (contractEvents = []) => ({
	type: SET_CONTRACT_EVENTS,
	payload: {
		contractEvents,
	},
});

const setDistributions = (distributions = []) => ({
	type: SET_DISTRIBUTIONS,
	payload: {
		distributions,
	},
});

const setPublicInfo = (publicInfo = {}) => ({
	type: SET_PUBLIC_INFO,
	payload: {
		publicInfo,
	},
});

const setPendingTransactions = (pendingTransactions = []) => ({
	type: SET_PENDING_TRANSACTIONS,
	payload: {
		pendingTransactions,
	},
});

const resetStake = () => ({
	type: RESET_STAKE_STORE,
});

export const connectWallet = () => {
	return async (dispatch) => {
		if (window.ethereum) {
			//check if Metamask is installed
			try {
				const [account] = await window.ethereum.enable(); //connect Metamask
				const balance = await web3.eth.getBalance(account);
				dispatch(setAccount(account, web3.utils.fromWei(balance)));
			} catch (error) {
				// Connect to Metamask using the button on the top right.
				console.error('Connect to Metamask using the button on the top right.');
			}
		} else {
			// You must install Metamask into your browser: https://metamask.io/download.html
			console.error(
				'You must install Metamask into your browser: https://metamask.io/download.html'
			);
		}
	};
};

export const loadBlockchainData = () => {
	return async (dispatch) => {
		const [[account], network] = await Promise.all([
			web3.eth.getAccounts(),
			web3.eth.net.getNetworkType(),
		]);
		let balance = 0;
		if (account) {
			const weiBalance = await web3.eth.getBalance(account);
			balance = web3.utils.fromWei(weiBalance);
		}
		dispatch(setBlockchainData(account, balance, network));
	};
};

export const getCurrentBlock = () => {
	return async (dispatch) => {
		const currentBlock = await web3.eth.getBlockNumber();
		dispatch(setCurrentBlock(currentBlock));
	};
};

export const generateTableData = (account) => {
	return async (dispatch) => {
		let data = {};
		Object.keys(CONTRACTS).forEach((symbol) => {
			data = {
				symbol,
				available: getTokenBalance(symbol)(account),
			};
		});

		const stakables = await hash(data);
		dispatch(setStakables([stakables]));
	};
};

export const getAllPeriods = () => {
	return async (dispatch) => {
		const data = {};
		Object.keys(CONTRACTS).forEach((symbol) => {
			data[symbol] = getPeriodsForToken(symbol)();
		});

		const periods = await hash(data);
		dispatch(setPeriods(periods));
	};
};

export const getAllPenalties = () => {
	return async (dispatch) => {
		const data = {};
		Object.keys(CONTRACTS).forEach((symbol) => {
			data[symbol] = getPenaltyForToken(symbol)();
		});

		const penalties = await hash(data);
		dispatch(setPenalties(penalties));
	};
};

export const getAllPots = () => {
	return async (dispatch) => {
		const data = {};
		Object.keys(CONTRACTS).forEach((symbol) => {
			data[symbol] = getPotForToken(symbol)();
		});

		const pots = await hash(data);
		dispatch(setPots(pots));
	};
};

const getUserStake = (token = 'xht') => async (address) => {
	const stakes = await CONTRACTS[token].main.methods.getStake(address).call();
	return stakes;
};

export const getAllUserStakes = (account) => {
	return async (dispatch) => {
		const data = {};
		Object.keys(CONTRACTS).forEach((symbol) => {
			data[symbol] = getUserStake(symbol)(account);
		});

		const userStakes = await hash(data);
		dispatch(setAllUserStakes(userStakes));
	};
};

export const approve = (token = 'xht') => ({
	amount,
	account,
	cb = () => {},
}) => {
	return CONTRACTS[token].token.methods
		.approve(
			CONTRACT_ADDRESSES[token].main,
			web3.utils.toWei(amount.toString())
		)
		.send(
			{
				...commonConfigs,
				from: account,
			},
			cb
		);
};

export const addStake = (token = 'xht') => ({
	amount,
	period,
	account,
	cb = () => {},
}) => {
	return CONTRACTS[token].main.methods
		.addStake(web3.utils.toWei(amount.toString()), period)
		.send(
			{
				...commonConfigs,
				from: account,
			},
			cb
		);
};

export const removeStake = (token = 'xht') => ({
	account,
	index,
	cb = () => {},
}) => {
	return CONTRACTS[token].main.methods.removeStake(index).send(
		{
			...commonConfigs,
			from: account,
		},
		cb
	);
};

const getPeriodsForToken = (token = 'xht') => async () => {
	const periods = await Promise.all([
		CONTRACTS[token].main.methods.periods(0).call(),
		CONTRACTS[token].main.methods.periods(1).call(),
		CONTRACTS[token].main.methods.periods(2).call(),
		CONTRACTS[token].main.methods.periods(3).call(),
	]);
	return periods;
};

const getPenaltyForToken = (token = 'xht') => async () => {
	const penalty = await CONTRACTS[token].main.methods.penalty().call();
	return penalty;
};

const getPotForToken = (token = 'xht') => async () => {
	const address = await CONTRACTS[token].main.methods.pot().call();
	const balance = await getTokenBalance(token)(address);
	return {
		address,
		balance,
	};
};

// const getTotalStake = (token = 'xht') => async () => {
// 	const total = await CONTRACTS[token].main.methods.totalStake().call();
// 	return web3.utils.fromWei(total);
// };

const getTokenBalance = (token = 'xht') => async (account) => {
	const balance = await CONTRACTS[token].token.methods
		.balanceOf(account)
		.call();
	return web3.utils.fromWei(balance);
};

export const getPublicInfo = (token = 'xht') => {
	return async (dispatch) => {
		const data = {
			totalReward: CONTRACTS[token].main.methods.getTotalReward().call(),
			totalStaked: CONTRACTS[token].main.methods.totalStake().call(),
			totalStakeWeight: CONTRACTS[token].main.methods.totalStakeWeight().call(),
		};

		const result = await hash(data);
		const publicInfo = {};
		Object.entries(result).forEach(([key, value]) => {
			publicInfo[key] = mathjs.number(web3.utils.fromWei(value));
		});
		dispatch(setPublicInfo(publicInfo));
	};
};

export const getStakeEvents = (token = 'xht', account = '') => {
	return async (dispatch) => {
		const events = await CONTRACTS[token].main.getPastEvents(
			'allEvents',
			{
				fromBlock: 1,
				toBlock: 'latest',
			}
			// {filter: {_address: account }}
		);
		dispatch(setContractEvents(events.reverse()));
	};
};

export const getDistributions = (token = 'xht') => {
	return async (dispatch) => {
		const events = await CONTRACTS[token].main.getPastEvents(
			CONTRACT_EVENTS.Distribute,
			{
				fromBlock: 1,
				toBlock: 'latest',
			}
		);
		dispatch(setDistributions(events.reverse()));
	};
};

export const getPendingTransactions = (account = '') => {
	return async (dispatch) => {
		// Pending Transactions Calculations
		// const pendingTransactions = await web3.eth.getPendingTransactions();
		const pendingTransactions = [
			{
				hash:
					'0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b',
				nonce: 2,
				blockHash:
					'0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46',
				blockNumber: 3,
				transactionIndex: 0,
				from: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				to: '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
				value: '123450000000000000',
				gas: 314159,
				gasPrice: '2000000000000',
				input: '0x57cb2fc4',
				v: '0x3d',
				r: '0xaabc9ddafffb2ae0bac4107697547d22d9383667d9e97f5409dd6881ce08f13f',
				s: '0x69e43116be8f842dcd4a0b2f760043737a59534430b762317db21d9ac8c5034',
			},
			{
				hash:
					'0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b',
				nonce: 3,
				blockHash:
					'0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46',
				blockNumber: 4,
				transactionIndex: 0,
				from: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				to: '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
				value: '123450000000000000',
				gas: 314159,
				gasPrice: '2000000000000',
				input: '0x57cb2fc4',
				v: '0x3d',
				r: '0xaabc9ddafffb2ae0bac4107697547d22d9383667d9e97f5409dd6881ce08f13f',
				s: '0x69e43116be8f842dcd4a0b2f760043737a59534430b762317db21d9ac8c5034',
			},
		];
		dispatch(setPendingTransactions(pendingTransactions));
	};
};

export const disconnectWallet = () => {
	return async (dispatch) => {
		if (window.ethereum) {
			try {
				const accounts = await web3.eth.getAccounts();
				if (accounts.length) {
					await window.ethereum._handleDisconnect();
					dispatch(resetStake());
				}
			} catch (error) {
				console.error('Connect to Metamask using the button on the top right.');
			}
		} else {
			// You must install Metamask into your browser: https://metamask.io/download.html
			console.error(
				'You must install Metamask into your browser: https://metamask.io/download.html'
			);
		}
	};
};
