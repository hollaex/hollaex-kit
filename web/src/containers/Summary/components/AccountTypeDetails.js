import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';
import TraderAccounts from './TraderAccounts';
import SummaryRequirements, { getRequirements } from './SummaryRequirements';
import STRINGS from 'config/localizedStrings';

const AccountTypeDetails = ({
	user,
	coins,
	pairs,
	config,
	className = '',
	selectedAccount,
	lastMonthVolume,
	onUpgradeAccount,
	verification_level,
	balance,
}) => {
	let isAccountDetails = true;
	const currentAccount = selectedAccount;
	const selectedLevel = isAccountDetails
		? currentAccount || user.verification_level
		: 2;
	const requirement = getRequirements(
		user,
		selectedLevel,
		lastMonthVolume,
		coins
	);
	return (
		<div className={classnames(className, 'mx-auto')}>
			<TraderAccounts
				user={user}
				coins={coins}
				pairs={pairs}
				config={config}
				account={currentAccount}
				isAccountDetails={true}
				verification_level={currentAccount}
				selectedAccount={currentAccount}
			/>
			{Object.keys(requirement).length && (
				<div>
					<div className="requirement-header d-flex justify-content-between">
						<div>
							<EditWrapper stringId="SUMMARY.ONE_REQUIREMENT,SUMMARY.REQUIREMENTS">
								{selectedLevel === 3
									? STRINGS['SUMMARY.ONE_REQUIREMENT']
									: STRINGS['SUMMARY.REQUIREMENTS']}
							</EditWrapper>
						</div>
						<div className="status-header">
							<EditWrapper stringId="STATUS">{STRINGS['STATUS']}</EditWrapper>
						</div>
					</div>
					<SummaryRequirements
						user={user}
						coins={coins}
						isAccountDetails={true}
						balance={balance}
						config={config}
						verificationLevel={currentAccount}
						lastMonthVolume={lastMonthVolume}
						onUpgradeAccount={onUpgradeAccount}
						contentClassName="w-100"
					/>
				</div>
			)}
		</div>
	);
};

export default AccountTypeDetails;
