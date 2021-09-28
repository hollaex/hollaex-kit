import React from 'react';
import withConfig from 'components/ConfigProvider/withConfig';
import { roundNumber } from 'utils';
import { dotifyAccount } from 'utils/eth';

const Account = ({ icons: ICONS, account = '', balance, network }) => {
	if (!account) {
		return <div />;
	} else {
		const displayAccount = dotifyAccount(account);

		return (
			<div className="d-flex">
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

export default withConfig(Account);
