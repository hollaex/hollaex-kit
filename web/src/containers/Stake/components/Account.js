import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Dropdown } from 'antd';
import { connectWallet, disconnectWallet } from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';
import { roundNumber } from 'utils';
import { dotifyString } from 'utils/eth';
import STRINGS from 'config/localizedStrings';

const Account = ({
	account = '',
	balance,
	network,
	connectWallet,
	disconnectWallet,
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
				<div className="d-flex align-center staking-account__container mx-2">
					{network}
				</div>
				<Dropdown
					overlay={
						<Menu className="disconnect-menu">
							<Menu.Item key="0">
								<div onClick={disconnectWallet}>
									{STRINGS['STAKE.DISCONNECT']}
								</div>
							</Menu.Item>
						</Menu>
					}
					trigger={['click']}
				>
					<div className="d-flex align-center staking-account__container pointer">
						<div className="staking-account__balance">{`~${roundNumber(
							balance
						)} ETH`}</div>
						<div className="d-flex staking-account__address">
							{displayAccount}
						</div>
					</div>
				</Dropdown>
			</div>
		);
	}
};

const mapStateToProps = (store) => ({
	account: store.stake.account,
	network: store.stake.network,
	balance: store.stake.balance,
});

const mapDispatchToProps = (dispatch) => ({
	connectWallet: bindActionCreators(connectWallet, dispatch),
	disconnectWallet: bindActionCreators(disconnectWallet, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Account));
