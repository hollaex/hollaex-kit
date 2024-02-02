import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { ReactSVG } from 'react-svg';
import { Image, EditWrapper, Connector } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { renderStatusIcon } from 'components/CheckTitle';
import { DollarOutlined, UserOutlined } from '@ant-design/icons';
import { isLoggedIn } from 'utils/token';
import { Editor, Frame, Element } from 'craftjs';
import { useNode } from 'craftjs';
import { uniqueId } from 'lodash';

const TraderSideInfo = ({
	title,
	description,
	ICONS,
	user,
	onInviteFriends,
	notificationStatus,
	verification_level,
	onUpgradeAccount,
	isAccountDetails,
	logout,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();

	return (
		<div ref={(ref) => connect(drag(ref))}>
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

					{isLoggedIn() && (
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
	);
};

export default withConfig(TraderSideInfo);
