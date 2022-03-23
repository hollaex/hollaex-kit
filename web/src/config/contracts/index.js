import store from '../../store';
import Main from 'config/contracts/Main.json';
import Token from 'config/contracts/Token.json';
import Web3 from 'web3';

export const CONTRACT_ADDRESSES = () => {
	const {
		app: { contracts },
	} = store.getState();
	return contracts;
};

export const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

export const generateContracts = (contractsObject, web3) => {
	const contracts = {};
	Object.entries(contractsObject).forEach(([key, { token, main }]) => {
		contracts[key] = {
			token: new web3.eth.Contract(Token.abi, token),
			main: new web3.eth.Contract(Main.abi, main),
		};
	});
	return contracts;
};

export const CONTRACTS = () => generateContracts(CONTRACT_ADDRESSES(), web3);

export const isStakingAvailable = (token, contracts = {}) => {
	return (
		contracts[token] &&
		contracts[token].main &&
		contracts[token].token &&
		contracts[token].network
	);
};

export const STAKING_INDEX_COIN = 'xht';
