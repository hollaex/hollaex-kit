import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { bindActionCreators } from 'redux';

import STRINGS from 'config/localizedStrings';
import { ActionNotification, EditWrapper, Image } from 'components';
import { setDepositAndWithdraw } from 'actions/appActions';
import { STATIC_ICONS } from 'config/icons';

const HeaderSection = ({
	icons: ICONS,
	setDepositAndWithdraw,
	onHandleRefresh,
	isLoading,
	activeBalanceHistory,
}) => {
	return (
		<div className="header-wrapper justify-content-between">
			<div className="header-title">
				<EditWrapper stringId="ACCORDIAN.ACCORDIAN_ASSETS">
					{STRINGS['ACCORDIAN.ACCORDIAN_ASSETS']}
				</EditWrapper>
			</div>
			<div className="d-flex">
				{!activeBalanceHistory && !isMobile && (
					<div className="link sub-header">
						<ActionNotification
							stringId="REFRESH"
							text={STRINGS['REFRESH']}
							iconId="REFRESH"
							iconPath={STATIC_ICONS['REFRESH']}
							className="blue-icon refresh-link mb-2"
							onClick={onHandleRefresh}
							disable={isLoading}
						/>
					</div>
				)}
				<div
					className="link sub-header"
					onClick={() => setDepositAndWithdraw(true)}
				>
					<Link to="/wallet/deposit">
						<EditWrapper stringId="ACCORDIAN.DEPOSIT">
							{STRINGS['ACCORDIAN.DEPOSIT']}
						</EditWrapper>
					</Link>
				</div>
				<div
					className="sub-header link"
					onClick={() => setDepositAndWithdraw(true)}
				>
					<Link to="/wallet/withdraw">
						<EditWrapper stringId="ACCORDIAN.WITHDRAW">
							{STRINGS['ACCORDIAN.WITHDRAW']}
						</EditWrapper>
					</Link>
				</div>
				<div className="sub-header link text-uppercase">
					<Link to="/wallet/address-book">
						<EditWrapper stringId="ADDRESS_BOOK.ADDRESSES">
							{STRINGS['ADDRESS_BOOK.ADDRESSES']}
						</EditWrapper>
					</Link>
				</div>
				<div className="sub-header link text-uppercase">
					<Link to="/wallet/volume">
						<EditWrapper stringId="VOLUME.VOLUME">
							{STRINGS['VOLUME.VOLUME']}
						</EditWrapper>
					</Link>
				</div>
				<div className="sub-header">
					<Link to="/transactions">
						<EditWrapper stringId="ACCORDIAN.ACCORDIAN_HISTORY">
							{STRINGS['ACCORDIAN.ACCORDIAN_HISTORY']}
						</EditWrapper>
					</Link>
				</div>
				<div className="image-Wrapper">
					<Image
						iconId={'CLOCK'}
						icon={ICONS['CLOCK']}
						alt={'text'}
						svgWrapperClassName="action_notification-svg"
					/>
				</div>
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setDepositAndWithdraw: bindActionCreators(setDepositAndWithdraw, dispatch),
	dispatch,
});

export default connect('', mapDispatchToProps)(HeaderSection);
