import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';

import STRINGS from '../../config/localizedStrings';
import AccountTypeDetails from './components/AccountTypeDetails';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';

const MobileAccountTypeList = ({
	user,
	coins,
	config = {},
	activeTheme,
	selectedAccount,
	lastMonthVolume,
	onAccountTypeChange,
	onFeesAndLimits,
	onUpgradeAccount,
	verification_level,
	balance,
	icons: ICONS,
}) => {
	return (
		<div className="mobile-account-type my-4">
			{Object.keys(config).map((key, index) => {
				let configData = config[key];
				return (
					<div
						key={index}
						className={classnames('account-type-menu', {
							'account-type-menu-active': `${selectedAccount}` === key,
							'accounnt-type-menu-last-active':
								index === Object.keys(config).length - 1,
						})}
						onClick={() => onAccountTypeChange(key)}
					>
						{`${selectedAccount}` !== key ? (
							<div className="d-flex">
								<div className="mr-4">
									<Image
										iconId={
											ICONS[`LEVEL_ACCOUNT_ICON_${key}`]
												? `LEVEL_ACCOUNT_ICON_${key}`
												: 'LEVEL_ACCOUNT_ICON_4'
										}
										icon={
											ICONS[`LEVEL_ACCOUNT_ICON_${key}`]
												? ICONS[`LEVEL_ACCOUNT_ICON_${key}`]
												: ICONS['LEVEL_ACCOUNT_ICON_4']
										}
										wrapperClassName="trader-account-icon"
									/>
								</div>
								<div className={classnames(FLEX_CENTER_CLASSES)}>
									{configData.name ||
										STRINGS.formatString(
											STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
											key
										)}
									{key === verification_level && (
										<div className="account-current summary-content-txt ml-2">
											{' '}
											{`(${STRINGS['SUMMARY.CURRENT_TXT']})`}{' '}
										</div>
									)}
								</div>
							</div>
						) : null}
						{key === `${selectedAccount}` && (
							<div className="my-4">
								<AccountTypeDetails
									user={user}
									coins={coins}
									config={config}
									balance={balance}
									activeTheme={activeTheme}
									selectedAccount={selectedAccount}
									lastMonthVolume={lastMonthVolume}
									onFeesAndLimits={onFeesAndLimits}
									onUpgradeAccount={onUpgradeAccount}
								/>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default withConfig(MobileAccountTypeList);
