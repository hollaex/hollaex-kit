import Main from 'config/contracts/Main.json';
import Token from 'config/contracts/Token.json';
import Web3 from 'web3';

export const CONTRACT_ADDRESSES = {
	xht: {
		main: '0x2ac19c641e6453b2fae4bf6bc52f14a5c82eea0f',
		token: '0xf0D641A2f02cA52ec56d0791BC79f68da2C772A9',
	},
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

export const CONTRACTS = generateContracts(CONTRACT_ADDRESSES, web3);

export const isStakingAvailable = (token) => {
	return (
		CONTRACT_ADDRESSES[token] &&
		CONTRACT_ADDRESSES[token].main &&
		CONTRACT_ADDRESSES[token].token
	);
};
