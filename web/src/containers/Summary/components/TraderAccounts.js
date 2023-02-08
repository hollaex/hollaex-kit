import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { ReactSVG } from 'react-svg';
import { Image, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const TraderAccounts = ({
	user = {},
	config = {},
	isAccountDetails = false,
	onUpgradeAccount,
	logout,
	onInviteFriends,
	verification_level,
	selectedAccount,
	icons: ICONS,
}) => {
	const level = selectedAccount ? selectedAccount : verification_level;
	const accountData = config[level] || {};
	const title =
		accountData.name ||
		STRINGS.formatString(
			STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
			verification_level
		);

	const description =
		accountData.description ||
		(STRINGS[`SUMMARY.LEVEL_${verification_level}_TXT`]
			? STRINGS[`SUMMARY.LEVEL_${verification_level}_TXT`]
			: STRINGS['SUMMARY.LEVEL_TXT_DEFAULT']);
	const icon = ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
		? ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
		: ICONS['LEVEL_ACCOUNT_ICON_4'];

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
					<EditWrapper
						stringId="SUMMARY.LEVEL_OF_ACCOUNT"
						renderWrapper={(children) => (
							<div className="summary-block-title mb-3">{children}</div>
						)}
					>
						{title}
					</EditWrapper>
				)}
				<div className="account-details-content">
					<EditWrapper
						stringId="SUMMARY.LEVEL_TXT_DEFAULT"
						renderWrapper={(children) => <div className="mb-2">{children}</div>}
					>
						{description}
					</EditWrapper>
				</div>
				{!isAccountDetails && user.discount ? (
					<div className="d-flex">
						<div>
							<ReactSVG
								src={ICONS['GREEN_CHECK']}
								className="currency_ball-wrapper s mr-2"
							/>
						</div>
						<div>
							{STRINGS['FEE_REDUCTION']}: {user.discount}%
						</div>
					</div>
				) : null}
				{!isAccountDetails && (
					<Fragment>
						<Link to="/fees-and-limits">
							<div className="trade-account-link my-2 caps">
								<EditWrapper stringId="FEES_AND_LIMITS.LINK">
									{STRINGS['FEES_AND_LIMITS.LINK']}
								</EditWrapper>
							</div>
						</Link>

						<EditWrapper
							stringId="REFERRAL_LINK.TITLE"
							renderWrapper={(children) => (
								<div className="trade-account-link mb-2">
									<span className="pointer caps" onClick={onInviteFriends}>
										{children}
									</span>
								</div>
							)}
						>
							{STRINGS['REFERRAL_LINK.TITLE']}
						</EditWrapper>
					</Fragment>
				)}
				{isAccountDetails && (
					<EditWrapper
						stringId="SUMMARY.VIEW_FEE_STRUCTURE"
						renderWrapper={(children) => (
							<div className="trade-account-link mb-2">
								<span className="pointer caps">
									<Link to="/fees-and-limits">{children}</Link>
								</span>
							</div>
						)}
					>
						{STRINGS['SUMMARY.VIEW_FEE_STRUCTURE']}
					</EditWrapper>
				)}
				{!isAccountDetails &&
					verification_level.level >= 1 &&
					verification_level.level < 4 && (
						<EditWrapper
							stringId="SUMMARY.UPGRADE_ACCOUNT"
							renderWrapper={(children) => (
								<div className="trade-account-link mb-2">
									<span className="pointer caps" onClick={onUpgradeAccount}>
										{children}
									</span>
								</div>
							)}
						>
							{STRINGS['SUMMARY.UPGRADE_ACCOUNT']}
						</EditWrapper>
					)}
				{!isAccountDetails && isMobile && (
					<div>
						<EditWrapper
							stringId="LOGOUT"
							renderWrapper={(children) => (
								<div className="trade-account-link my-2 caps" onClick={logout}>
									{children}
								</div>
							)}
						>
							{STRINGS['LOGOUT']}
						</EditWrapper>
					</div>
				)}
			</div>
		</div>
	);
};

export default withConfig(TraderAccounts);
