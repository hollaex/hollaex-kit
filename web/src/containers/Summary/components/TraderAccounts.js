import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { ReactSVG } from 'react-svg';
import { Image, EditWrapper, Connector } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { renderStatusIcon } from 'components/CheckTitle';
import { DollarOutlined, UserOutlined } from '@ant-design/icons';
import { isLoggedIn } from 'utils/token';
import { Editor, Frame, Element } from '@craftjs/core';
import { useNode } from '@craftjs/core';
import { uniqueId } from 'lodash';
import TraderSideInfo from './TraderSideInfo';

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
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div className="d-flex">
			<Element id={uniqueId()} is={Connector} canvas>
				<div ref={(ref) => connect(drag(ref))}>
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
			</Element>

			<div
				className="trade-account-secondary-txt summary-content-txt"
				style={{ padding: 10 }}
			>
				<Element id={uniqueId()} is={Connector} canvas>
					<TraderSideInfo
						title={title}
						description={description}
						ICONS={ICONS}
						user={user}
						onInviteFriends={onInviteFriends}
						notificationStatus={notificationStatus}
						verification_level={verification_level}
						onUpgradeAccount={onUpgradeAccount}
						isAccountDetails={isAccountDetails}
						logout={logout}
					/>
				</Element>
			</div>
		</div>
	);
};

export default withConfig(TraderAccounts);
