import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import ReactSVG from 'react-svg';
import STRINGS from '../../../config/localizedStrings';

import {
	ICONS,
	FLEX_CENTER_CLASSES
} from '../../../config/constants';

const AccountTypesList = ({
	selectedAccount,
	onAccountTypeChange,
	verification_level,
	config
}) => {
	return (
		<div
			className={classnames('account-type-container', {
				'mobile-account-type': isMobile
			})}
		>
			{config.map((key, index) => {
				return (
					<div
						key={index}
						className={classnames('d-flex', 'account-type-menu', {
							'account-type-menu-active': selectedAccount === key,
							'accounnt-type-menu-last-active':
								index === config.length - 1
						})}
						onClick={() => onAccountTypeChange(key)}
					>
						<div className="mr-4">
                            <ReactSVG
                               	path={ICONS[`LEVEL_ACCOUNT_ICON_${key}`] ? ICONS[`LEVEL_ACCOUNT_ICON_${key}`] : ICONS.LEVEL_ACCOUNT_ICON_4}
                                wrapperClassName="trader-account-icon"
                            />
                        </div>
						<div className={classnames(FLEX_CENTER_CLASSES)}>
							<div className={classnames(FLEX_CENTER_CLASSES)}>
								{STRINGS.formatString(STRINGS["SUMMARY.LEVEL_OF_ACCOUNT"], key)}
							</div>
							{key === verification_level && (
								<div className="account-current summary-content-txt ml-2">
									{' ('}
									{STRINGS["SUMMARY.CURRENT_TXT"]}{')'}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default AccountTypesList;
