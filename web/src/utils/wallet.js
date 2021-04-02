const getWalletsByCurrnecy = (currency, wallets = []) => {
	return wallets.filter((wallet) => wallet.currency === currency);
};

const getWalletByNetwork = (network = null, currnecyWallets) => {
	if (network) {
		const wallet = currnecyWallets.find((wallet) => wallet.network === network);
		return wallet && wallet['address'];
	} else if (network === null && currnecyWallets.length === 1) {
		const wallet = currnecyWallets[0]['address'];
		return wallet && wallet['address'];
	}
};

export const getWallet = (currnecy, network, wallets = []) => {
	return getWalletByNetwork(network, getWalletsByCurrnecy(currnecy, wallets));
};
