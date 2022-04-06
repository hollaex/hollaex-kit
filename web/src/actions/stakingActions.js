import { web3, CONTRACT_ADDRESSES, CONTRACTS } from 'config/contracts';
import mathjs from 'mathjs';
import { hash } from 'rsvp';
import store from 'store';
import { openMetamaskError } from 'actions/appActions';
import STRINGS from 'config/localizedStrings';

const commonConfigs = {
	type: '0x2',
};

const CONTRACT_EVENTS = {
	Reward: 'RewardEvent',
	Distribute: 'DistributeEvent',
	Stake: 'StakeEvent',
	Unstake: 'UnstakeEvent',
};

export const ETHEREUM_EVENTS = {
	NETWORK_CHANGE: 'networkChanged',
	ACCOUNT_CHANGE: 'accountsChanged',
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
				let message;
				if (error.code === -32002) {
					message = STRINGS['STAKE.CONNECT_ERROR'];
				} else {
					message = error.message || JSON.stringify(error);
				}
				store.dispatch(openMetamaskError(message));
			}
		} else {
			const message = STRINGS['STAKE.INSTALL_METAMASK'];
			store.dispatch(openMetamaskError(message));
		}
	};
};

export const loadBlockchainData = () => {
	return async (dispatch) => {
		try {
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
		} catch (err) {
			console.error(err);
		}
	};
};

export const getCurrentBlock = () => {
	return async (dispatch) => {
		try {
			const currentBlock = await web3.eth.getBlockNumber();
			dispatch(setCurrentBlock(currentBlock));
		} catch (err) {
			console.error(err);
		}
	};
};

export const generateTableData = (account) => {
	return async (dispatch) => {
		try {
			let data = {};
			Object.keys(CONTRACTS()).forEach((symbol) => {
				data = {
					symbol,
					available: getTokenBalance(symbol)(account),
				};
			});

			const stakables = await hash(data);
			dispatch(setStakables([stakables]));
		} catch (err) {
			console.error(err);
		}
	};
};

export const getAllPeriods = () => {
	return async (dispatch) => {
		try {
			const data = {};
			Object.keys(CONTRACTS()).forEach((symbol) => {
				data[symbol] = getAllPeriodsForToken(symbol)();
			});

			const periods = await hash(data);
			dispatch(setPeriods(periods));
		} catch (err) {
			console.error(err);
		}
	};
};

export const getAllPenalties = () => {
	return async (dispatch) => {
		try {
			const data = {};
			Object.keys(CONTRACTS()).forEach((symbol) => {
				data[symbol] = getPenaltyForToken(symbol)();
			});

			const penalties = await hash(data);
			dispatch(setPenalties(penalties));
		} catch (err) {
			console.error(err);
		}
	};
};

export const getAllPots = () => {
	return async (dispatch) => {
		try {
			const data = {};
			Object.keys(CONTRACTS()).forEach((symbol) => {
				data[symbol] = getPotForToken(symbol)();
			});

			const pots = await hash(data);
			dispatch(setPots(pots));
		} catch (err) {
			console.error(err);
		}
	};
};

const getUserStake = (token = 'xht') => async (address) => {
	const stakes = await CONTRACTS()[token].main.methods.getStake(address).call();
	return stakes;
};

export const getAllUserStakes = (account) => {
	return async (dispatch) => {
		try {
			const data = {};
			Object.keys(CONTRACTS()).forEach((symbol) => {
				data[symbol] = getUserStake(symbol)(account);
			});

			const userStakes = await hash(data);
			dispatch(setAllUserStakes(userStakes));
		} catch (err) {
			console.error(err);
		}
	};
};

export const approve = (token = 'xht') => ({
	amount,
	account,
	cb = () => {},
}) => {
	return CONTRACTS()
		[token].token.methods.approve(
			CONTRACT_ADDRESSES()[token].main,
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
	return CONTRACTS()
		[token].main.methods.addStake(web3.utils.toWei(amount.toString()), period)
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
	return CONTRACTS()
		[token].main.methods.removeStake(index)
		.send(
			{
				...commonConfigs,
				from: account,
			},
			cb
		);
};

const getPeriodForToken = (token = 'xht') => async (index) => {
	try {
		const period = await CONTRACTS()[token].main.methods.periods(index).call();
		return period;
	} catch (err) {
		console.error(err);
	}
};

const getAllPeriodsForToken = (token = 'xht') => async () => {
	const indices = Array.from({ length: 5 }, (_, i) => i);
	const periods = await Promise.all(
		indices.map((index) => getPeriodForToken(token)(index))
	);
	return periods.filter((period) => !!period);
};

const getPenaltyForToken = (token = 'xht') => async () => {
	const penalty = await CONTRACTS()[token].main.methods.penalty().call();
	return penalty;
};

const getPotForToken = (token = 'xht') => async () => {
	const address = await CONTRACTS()[token].main.methods.pot().call();
	const balance = await getTokenBalance(token)(address);
	return {
		address,
		balance,
	};
};

// const getTotalStake = (token = 'xht') => async () => {
// 	const total = await CONTRACTS()[token].main.methods.totalStake().call();
// 	return web3.utils.fromWei(total);
// };

const getTokenBalance = (token = 'xht') => async (account) => {
	const balance = await CONTRACTS()
		[token].token.methods.balanceOf(account)
		.call();
	return web3.utils.fromWei(balance);
};

export const getPublicInfo = (token = 'xht') => {
	return async (dispatch) => {
		try {
			const data = {
				totalReward: CONTRACTS()[token].main.methods.getTotalReward().call(),
				totalStaked: CONTRACTS()[token].main.methods.totalStake().call(),
				totalStakeWeight: CONTRACTS()
					[token].main.methods.totalStakeWeight()
					.call(),
			};

			const result = await hash(data);
			const publicInfo = {};
			Object.entries(result).forEach(([key, value]) => {
				publicInfo[key] = mathjs.number(web3.utils.fromWei(value));
			});
			dispatch(setPublicInfo(publicInfo));
		} catch (err) {
			console.error(err);
		}
	};
};

export const getStakeEvents = (token = 'xht', account = '') => {
	return async (dispatch) => {
		try {
			const events = await CONTRACTS()[token].main.getPastEvents('allEvents', {
				fromBlock: 1,
				toBlock: 'latest',
				//filter: {_address: account }
			});
			dispatch(setContractEvents(events.reverse()));
		} catch (err) {
			console.error(err);
		}
	};
};

export const getDistributions = (token = 'xht') => {
	return async (dispatch) => {
		try {
			const events = await CONTRACTS()[token].main.getPastEvents(
				CONTRACT_EVENTS.Distribute,
				{
					fromBlock: 1,
					toBlock: 'latest',
				}
			);
			dispatch(setDistributions(events.reverse()));
		} catch (err) {
			console.error(err);
		}
	};
};

export const getPendingTransactions = (account = '') => {
	return async (dispatch) => {
		try {
			// Pending Transactions Calculations
			// const pendingTransactions = await web3.eth.getPendingTransactions();
			const pendingTransactions = [];
			dispatch(setPendingTransactions(pendingTransactions));
		} catch (err) {
			console.error(err);
		}
	};
};

export const getTokenAllowance = (token = 'xht') => async (account) => {
	const allowance = await CONTRACTS()
		[token].token.methods.allowance(account, CONTRACT_ADDRESSES()[token].main)
		.call();

	return web3.utils.fromWei(allowance);
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
