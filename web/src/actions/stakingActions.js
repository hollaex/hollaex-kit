import { web3, CONTRACT_ADDRESSES, CONTRACTS } from 'config/contracts';
import { hash } from 'rsvp';

const commonConfigs = {
	type: '0x2',
};

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_CURRENT_BLOCK = 'SET_CURRENT_BLOCK';
export const SET_BLOCKCHAIN_DATA = 'SET_BLOCKCHAIN_DATA';
export const SET_STAKABLES = 'SET_STAKABLES';
export const SET_PERIODS = 'SET_STAKING_PERIODS';
export const SET_USER_STAKES = 'SET_USER_STAKES';

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

const setAllUserStakes = (userStakes = {}) => ({
	type: SET_USER_STAKES,
	payload: {
		userStakes,
	},
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

export const approve = (token = 'xht') => async ({ amount, account }) => {
	return CONTRACTS[token].token.methods
		.approve(
			CONTRACT_ADDRESSES[token].main,
			web3.utils.toWei(amount.toString())
		)
		.send({
			...commonConfigs,
			from: account,
		});
};

export const addStake = (token = 'xht') => ({ amount, period, account }) => {
	return CONTRACTS[token].main.methods
		.addStake(web3.utils.toWei(amount.toString()), period)
		.send({
			...commonConfigs,
			from: account,
		});
};

export const removeStake = (token = 'xht') => async ({ account, index }) => {
	await CONTRACTS[token].main.methods.removeStake(index).send({
		...commonConfigs,
		from: account,
	});
};

export const distribute = (token = 'xht') => async ({ account }) => {
	await CONTRACTS[token].main.methods
		.distribute()
		.send({ ...commonConfigs, from: account });
};

export const approveAndStake = (token = 'xht') => async ({
	amount,
	period,
	account,
}) => {
	await approve(token)({ amount, account });
	await addStake(token)({ amount, period, account });
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

export const getPublicInfo = (token = 'xht') => async (account) => {
	const data = {
		stakeWeight: CONTRACTS[token].main.methods.getStakeWeight(account).call(),
		totalStakeWeight: CONTRACTS[token].main.methods.totalStakeWeight().call(),
		getTotalReward: CONTRACTS[token].main.methods.getTotalReward().call(),
	};

	return await hash(data);
};
