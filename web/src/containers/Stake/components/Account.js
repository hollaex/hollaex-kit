import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connectWallet } from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';
import { roundNumber } from 'utils';
import { dotifyString } from 'utils/eth';
import STRINGS from 'config/localizedStrings';
import { networksMismatchSelector } from '../selector';

const Account = ({
	account = '',
	balance,
	network,
	connectWallet,
	contracts,
	networksMismatch,
}) => {
	if (!account) {
		return (
			<div onClick={connectWallet} className="d-flex staking-account__connect">
				{STRINGS['STAKE.CONNECT_A_WALLET']}
			</div>
		);
	} else {
		const displayAccount = dotifyString(account);

		return (
			<div className="d-flex">
				{networksMismatch && (
					<div className="d-flex align-center warning_text">
						{STRINGS.formatString(
							STRINGS['STAKE.NETWORK_WARNING'],
							contracts['xht'].network.toUpperCase()
						)}
					</div>
				)}
				<div className="d-flex align-center staking-account__container mx-2">
					{network}
				</div>
				<div className="d-flex align-center staking-account__container">
					<div className="staking-account__balance">{`~${roundNumber(
						balance
					)} ETH`}</div>
					<div className="d-flex staking-account__address">
						{displayAccount}
					</div>
				</div>
			</div>
		);
	}
};

const mapStateToProps = (store) => ({
	account: store.stake.account,
	network: store.stake.network,
	balance: store.stake.balance,
	contracts: store.app.contracts,
	networksMismatch: networksMismatchSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
	connectWallet: bindActionCreators(connectWallet, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Account));
