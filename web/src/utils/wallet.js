const getWalletsByCurrnecy = (currency, wallets) => {
	return wallets.filter((wallet) => wallet.currency === currency);
};

const getWalletByNetwork = (network, networks, currnecyWallets) => {
	let wallet;
	if (!networks && currnecyWallets.length === 1) {
		wallet = currnecyWallets[0];
	} else if (network) {
		wallet = currnecyWallets.find((wallet) => wallet.network === network);
	}

	return wallet ? wallet['address'] : '';
};

export const getWallet = (currnecy, network, wallets, networks) => {
	return getWalletByNetwork(
		network,
		networks,
		getWalletsByCurrnecy(currnecy, wallets)
	);
};

export const getNetworkNameByKey = (network) => {
	if (network) {
		switch (network) {
			case 'eth':
				return 'ERC20';
			case 'trx':
				return 'TRC20';
			case 'bnb':
				return 'BEP20';
			case 'klay':
				return 'Klaytn';
			case 'matic':
				return 'Polygon';
			case 'pol':
				return 'Polygon';
			case 'sol':
				return 'Solana';
			case 'xlm':
				return 'Stellar';
			case 'ftm':
				return 'Fantom';
			case 's':
				return 'Sonic';
			case 'arb':
				return 'Arbitrum';
			default:
				return network.toUpperCase();
		}
	} else {
		return network;
	}
};

export const getNetworkLabelByKey = (network) => {
	return `${network.toUpperCase()} (${getNetworkNameByKey(network)})`;
};

export const getNetworkName = (network) => {
	if (network) {
		switch (network) {
			case 'ERC20':
				return 'eth';
			case 'TRC20':
				return 'trx';
			case 'BEP20':
				return 'bnb';
			case 'klaytn':
				return 'klay';
			case 'Polygon':
				return 'matic';
			case 'Solana':
				return 'sol';
			case 'Stellar':
				return 'xlm';
			case 'Fantom':
				return 'ftm';
			default:
				return network.toUpperCase();
		}
	} else {
		return network;
	}
};
