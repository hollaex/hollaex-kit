import React from 'react';
import { isMobile } from 'react-device-detect';
import { EditWrapper } from 'components';

import AccountTypesList from './AccountTypesList';
import AccountTypeDetails from './AccountTypeDetails';
import MobileAccountTypeList from '../MobileAccountTypeList';

import STRINGS from '../../../config/localizedStrings';

const AccountDetails = ({
	user,
	activeTheme,
	coins,
	pairs,
	selectedAccount,
	lastMonthVolume,
	onAccountTypeChange,
	onFeesAndLimits,
	onUpgradeAccount,
	config,
	verification_level,
	balance,
}) => {
	return (
		<div className="account-details-wrapper summary-content-txt">
			<div className="account-details-text">
				<EditWrapper stringId="SUMMARY.ACCOUNT_DETAILS_TXT_1">
					<div>{STRINGS['SUMMARY.ACCOUNT_DETAILS_TXT_1']}</div>
				</EditWrapper>
				<EditWrapper stringId="SUMMARY.ACCOUNT_DETAILS_TXT_2">
					<div>{STRINGS['SUMMARY.ACCOUNT_DETAILS_TXT_2']}</div>
				</EditWrapper>
				<EditWrapper stringId="SUMMARY.ACCOUNT_DETAILS_TXT_3">
					<div className="mt-2">{STRINGS['SUMMARY.ACCOUNT_DETAILS_TXT_3']}</div>
				</EditWrapper>
				<EditWrapper stringId="SUMMARY.ACCOUNT_DETAILS_TXT_4">
					<div className="mt-2">{STRINGS['SUMMARY.ACCOUNT_DETAILS_TXT_4']}</div>
				</EditWrapper>
			</div>
			{isMobile ? (
				<MobileAccountTypeList
					user={user}
					coins={coins}
					config={config}
					balance={balance}
					activeTheme={activeTheme}
					selectedAccount={selectedAccount}
					lastMonthVolume={lastMonthVolume}
					onAccountTypeChange={onAccountTypeChange}
					onFeesAndLimits={onFeesAndLimits}
					onUpgradeAccount={onUpgradeAccount}
					verification_level={verification_level}
				/>
			) : (
				<div className="d-flex align-items-center mt-3">
					<AccountTypesList
						activeTheme={activeTheme}
						selectedAccount={selectedAccount}
						onAccountTypeChange={onAccountTypeChange}
						config={config}
						verification_level={verification_level}
					/>
					<AccountTypeDetails
						className="w-50"
						user={user}
						coins={coins}
						pairs={pairs}
						balance={balance}
						config={config}
						activeTheme={activeTheme}
						selectedAccount={selectedAccount}
						lastMonthVolume={lastMonthVolume}
						onAccountTypeChange={onAccountTypeChange}
						onFeesAndLimits={onFeesAndLimits}
						onUpgradeAccount={onUpgradeAccount}
						verification_level={verification_level}
					/>
				</div>
			)}
		</div>
	);
};

export default AccountDetails;
