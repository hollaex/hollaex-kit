import React from 'react';
import { Link } from 'react-router';
import { EditWrapper, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDepositAndWithdraw } from 'actions/appActions';

const HeaderSection = ({ icons: ICONS, setDepositAndWithdraw }) => {
	return (
		<div className="header-wrapper justify-content-between">
			<div className="header-title">
				<EditWrapper stringId="ACCORDIAN.ACCORDIAN_ASSETS">
					{STRINGS['ACCORDIAN.ACCORDIAN_ASSETS']}
				</EditWrapper>
			</div>
			<div className="d-flex">
				<div
					className="link sub-header"
					onClick={() => setDepositAndWithdraw(true)}
				>
					<Link to="wallet/deposit">
						<EditWrapper stringId="ACCORDIAN.DEPOSIT">
							{STRINGS['ACCORDIAN.DEPOSIT']}
						</EditWrapper>
					</Link>
				</div>
				<div
					className="sub-header link"
					onClick={() => setDepositAndWithdraw(true)}
				>
					<Link to="wallet/withdraw">
						<EditWrapper stringId="ACCORDIAN.WITHDRAW">
							{STRINGS['ACCORDIAN.WITHDRAW']}
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
