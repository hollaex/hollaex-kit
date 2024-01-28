import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import { useNode } from '@craftjs/core';
import { Connector, EditWrapper } from 'components';
const AccountTypesList = ({
	selectedAccount,
	onAccountTypeChange,
	verification_level,
	config = {},
	icons: ICONS,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className={classnames('account-type-container', {
				'mobile-account-type': isMobile,
			})}
		>
			{Object.keys(config).map((key, index) => {
				let configData = config[key];
				return (
					<div
						key={index}
						className={classnames('d-flex', 'account-type-menu', {
							'account-type-menu-active': `${selectedAccount}` === key,
							'account-type-menu-last-active':
								index === Object.keys(config).length - 1,
						})}
						onClick={() => onAccountTypeChange(key)}
						style={{ padding: 10 }}
					>
						<div className="mr-4">
							{/* <Image
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
							/> */}
						</div>
						<div className={classnames(FLEX_CENTER_CLASSES)}>
							<div className={classnames(FLEX_CENTER_CLASSES)}>
								{configData.name ||
									STRINGS.formatString(
										STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
										key
									)}
							</div>
							{key === verification_level && (
								<div className="account-current summary-content-txt ml-2">
									{' ('}
									{STRINGS['SUMMARY.CURRENT_TXT']}
									{')'}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default withConfig(AccountTypesList);
