import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { ReactSVG } from 'react-svg';
import { Image, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { renderStatusIcon } from 'components/CheckTitle';
import { DollarOutlined, UserOutlined } from '@ant-design/icons';
import { isLoggedIn } from 'utils/token';

const TraderAccounts = ({
	user = {},
	config = {},
	isAccountDetails = false,
	onUpgradeAccount,
	logout,
	onInviteFriends,
	onDisplayReferralList,
	verification_level,
	selectedAccount,
	referral_history_config,
	icons: ICONS,
	features,
}) => {
	const level = selectedAccount
		? selectedAccount
		: isLoggedIn()
		? verification_level
		: Object.keys(config)[0];
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

	const identity_status = user.id_data?.status || 0;
	const notificationStatus = renderStatusIcon(
		identity_status,
		'verification-stauts user-status'
	);

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
				{user.discount > 0 ? (
					<div className="d-flex mb-2">
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

						{isLoggedIn() && features?.referral_history_config && (
							<Fragment>
								<div className="d-flex align-items-center">
									<DollarOutlined className="mr-2" />
									<EditWrapper stringId="SUMMARY.EARN_COMMISSION">
										{STRINGS['SUMMARY.EARN_COMMISSION']}
									</EditWrapper>
								</div>
								<EditWrapper
									stringId="REFERRAL_LINK.TITLE"
									renderWrapper={(children) => (
										<div className="trade-account-link mb-4">
											<span
												className="pointer caps"
												onClick={
													referral_history_config?.active
														? onDisplayReferralList
														: onInviteFriends
												}
											>
												{children}
											</span>
										</div>
									)}
								>
									{STRINGS['REFERRAL_LINK.TITLE']}
								</EditWrapper>
							</Fragment>
						)}

						{isLoggedIn() && (
							<Fragment>
								<div className="d-flex align-items-center">
									<UserOutlined className="mr-2" />
									<EditWrapper stringId="SUMMARY.ID_VERIFICATION">
										{STRINGS.formatString(STRINGS['SUMMARY.ID_VERIFICATION'])}
									</EditWrapper>
									<div className="mx-2">{notificationStatus}</div>
								</div>
								<Link to="/verification">
									<div className="trade-account-link mb-2 caps">
										<EditWrapper stringId="SUMMARY.VIEW_VERIFICATION">
											{STRINGS['SUMMARY.VIEW_VERIFICATION']}
										</EditWrapper>
									</div>
								</Link>
							</Fragment>
						)}

						{isLoggedIn() && (
							<Fragment>
								<div className="d-flex align-items-center">
									<div className="deposit-icon mr-2">
										<Image
											iconId="DEPOSIT_TITLE"
											icon={ICONS['DEPOSIT_TITLE']}
										/>
									</div>
									<EditWrapper stringId="SUMMARY.WALLET_FUNDING">
										{STRINGS.formatString(STRINGS['SUMMARY.WALLET_FUNDING'])}
									</EditWrapper>
								</div>
								<Link to="/wallet/deposit">
									<div className="trade-account-link mb-2 text-uppercase">
										<EditWrapper stringId="SUMMARY.MAKE_A_DEPOSIT">
											{STRINGS['SUMMARY.MAKE_A_DEPOSIT']}
										</EditWrapper>
									</div>
								</Link>
							</Fragment>
						)}

						{isLoggedIn() && (
							<Fragment>
								<div className="d-flex align-items-center">
									<div className="deposit-icon mr-2">
										<Image iconId="TAB_SUMMARY" icon={ICONS['TAB_SUMMARY']} />
									</div>
									<EditWrapper stringId="VOLUME.TRADE_VOLUME">
										{STRINGS['VOLUME.TRADE_VOLUME']}
									</EditWrapper>
								</div>
								<Link to="/wallet/volume">
									<div className="trade-account-link mb-2 text-uppercase">
										<EditWrapper stringId="VOLUME.VIEW_VOLUME">
											{STRINGS['VOLUME.VIEW_VOLUME']}
										</EditWrapper>
									</div>
								</Link>
							</Fragment>
						)}
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
				{!isAccountDetails && isMobile && isLoggedIn() && (
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

const mapStateToProps = (state) => ({
	features: state.app.features,
});

export default connect(mapStateToProps)(withConfig(TraderAccounts));
