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

export const getNetworkLabelByKey = (network) => {
	if (network) {
		switch (network) {
			case 'eth':
				return 'ERC20';
			case 'trx':
				return 'TRC20';
			default:
				return network.toUpperCase();
		}
	} else {
		return network;
	}
};
