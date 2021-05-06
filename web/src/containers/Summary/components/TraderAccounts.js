import React, { Fragment } from 'react';
import Image from 'components/Image';
import { isMobile } from 'react-device-detect';
import { ReactSVG } from 'react-svg';

import STRINGS from '../../../config/localizedStrings';
import { IS_XHT } from '../../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';

const TraderAccounts = ({
	user = {},
	config = {},
	isAccountDetails = false,
	onFeesAndLimits,
	onUpgradeAccount,
	logout,
	onInviteFriends,
	verification_level,
	selectedAccount,
	onStakeToken,
	icons: ICONS,
}) => {
	const level = selectedAccount ? selectedAccount : verification_level;
	const accountData = config[level] || {};
	const Title =
		accountData.name ||
		STRINGS.formatString(
			STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
			verification_level
		);

	let description =
		accountData.description ||
		(STRINGS[`SUMMARY.LEVEL_${verification_level}_TXT`]
			? STRINGS[`SUMMARY.LEVEL_${verification_level}_TXT`]
			: STRINGS['SUMMARY.LEVEL_TXT_DEFAULT']);
	let icon = ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
		? ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
		: ICONS['LEVEL_ACCOUNT_ICON_4'];
	// if (!isAccountDetails) {
	// 	description = user.is_hap
	// 		? STRINGS["SUMMARY.HAP_ACCOUNT_TXT"]
	// 		: STRINGS["SUMMARY.TRADER_ACCOUNT_XHT_TEXT"];
	// 	icon = user.is_hap === true
	// 		? ICONS["HAP_ACCOUNT_ICON"]
	// 		: ICONS["ACCOUNT_SUMMARY"];
	// }
	return (
		<div className="d-flex">
			<div>
				<Image
					iconId={
						ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
							? `LEVEL_ACCOUNT_ICON_${verification_level}`
							: 'LEVEL_ACCOUNT_ICON_4'
					}
					icon={icon}
					wrapperClassName={
						isAccountDetails
							? 'trader-wrapper-icon trader-acc-detail-icon'
							: 'trader-wrapper-icon'
					}
				/>
			</div>
			<div className="trade-account-secondary-txt summary-content-txt">
				{isAccountDetails && (
					<div className="summary-block-title mb-3">{Title}</div>
				)}
				<div className="account-details-content">
					<div className="mb-2">{description}</div>
				</div>
				{!isAccountDetails && user.discount
					?
					<div className="d-flex">
						<div>
							<ReactSVG src={ICONS['GREEN_CHECK']} className="currency_ball-wrapper s mr-2" />
						</div>
						<div>
							{STRINGS['FEE_REDUCTION']}: {user.discount}
						</div>
					</div>
					: null
				}
				{/* {!!limitLevel.length && <div
                    className="trade-account-link mb-2">
                    <span
                        className="pointer"
                        onClick={() => onFeesAndLimits(account)}>
                        {STRINGS["SUMMARY.VIEW_FEE_STRUCTURE"].toUpperCase()}
                    </span>
                </div>} */}
				{!isAccountDetails && (
					<Fragment>
						<div className="trade-account-link mb-2">
							<span className="pointer" onClick={onInviteFriends}>
								{(IS_XHT
									? STRINGS['REFERRAL_LINK.XHT_TITLE']
									: STRINGS['REFERRAL_LINK.TITLE']
								).toUpperCase()}
							</span>
						</div>
						<div className="trade-account-link mb-2">
							<span
								className="pointer"
								onClick={() => onFeesAndLimits(level, user.discount)}
							>
								{STRINGS['SUMMARY.MY_FEES_LIMITS'].toUpperCase()}
							</span>
						</div>
					</Fragment>
				)}
				{isAccountDetails ? (
					<div className="trade-account-link mb-2">
						<span
							className="pointer"
							onClick={() => onFeesAndLimits(level, user.discount)}
						>
							{STRINGS['SUMMARY.VIEW_FEE_STRUCTURE'].toUpperCase()}
						</span>
					</div>
				) : null}
				{!IS_XHT &&
					!isAccountDetails &&
					verification_level.level >= 1 &&
					verification_level.level < 4 && (
						<div className="trade-account-link mb-2">
							<span className="pointer" onClick={onUpgradeAccount}>
								{STRINGS['SUMMARY.UPGRADE_ACCOUNT'].toUpperCase()}
							</span>
						</div>
					)}
				{!isAccountDetails && isMobile ? (
					<div className="trade-account-link my-2" onClick={() => logout()}>
						{STRINGS['LOGOUT'].toUpperCase()}
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default withConfig(TraderAccounts);
