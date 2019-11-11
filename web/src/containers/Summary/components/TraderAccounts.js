import React from 'react';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../../config/localizedStrings';
import { ICONS } from '../../../config/constants';

const TraderAccounts = ({
	isAccountDetails = false,
	onFeesAndLimits,
	onUpgradeAccount,
	logout,
	onInviteFriends,
	verification_level,
	selectedAccount
}) => {
	const level = selectedAccount ? selectedAccount : verification_level;
	const Title = STRINGS.formatString(STRINGS.SUMMARY.LEVEL_OF_ACCOUNT, verification_level)
	return (
		<div className="d-flex">
			<div>
				<ReactSVG
					path={ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
						? ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
						: ICONS.LEVEL_ACCOUNT_ICON_4}
					wrapperClassName='trader-wrapper-icon'
				/>
			</div>
			<div className="trade-account-secondary-txt summary-content-txt">
				{isAccountDetails && (
					<div className="summary-block-title mb-3">
						{Title}
					</div>
				)}
				<div className="account-details-content">
					<div className="mb-2">
						{STRINGS.SUMMARY[`LEVEL_${verification_level}_TXT`]
							? STRINGS.SUMMARY[`LEVEL_${verification_level}_TXT`]
							: STRINGS.SUMMARY.LEVEL_TXT_DEFAULT
						}
					</div>
				</div>
				{/* {!!limitLevel.length && <div
                    className="trade-account-link mb-2">
                    <span
                        className="pointer"
                        onClick={() => onFeesAndLimits(account)}>
                        {STRINGS.SUMMARY.VIEW_FEE_STRUCTURE.toUpperCase()}
                    </span>
                </div>} */}
				{!isAccountDetails && (
					<div className="trade-account-link mb-2">
						<span className="pointer" onClick={onInviteFriends}>
							{STRINGS.REFERRAL_LINK.TITLE.toUpperCase()}
						</span>
					</div>
				)}
				<div className="trade-account-link mb-2">
					<span
						className="pointer"
						onClick={() => onFeesAndLimits(level)}
					>
						{STRINGS.SUMMARY.VIEW_FEE_STRUCTURE.toUpperCase()}
					</span>
				</div>
				{!isAccountDetails && verification_level.level >= 1 && verification_level.level < 4 && (
					<div className="trade-account-link mb-2">
						<span className="pointer" onClick={onUpgradeAccount}>
							{STRINGS.SUMMARY.UPGRADE_ACCOUNT.toUpperCase()}
						</span>
					</div>
				)}
				{!isAccountDetails && isMobile
					? (
						<div className="trade-account-link mb-2">
							<div className="my-2" onClick={() => logout()}>
								{STRINGS.LOGOUT.toUpperCase()}
							</div>
						</div>
					) : (null)
				}
			</div>
		</div>
	);
};

export default TraderAccounts;
