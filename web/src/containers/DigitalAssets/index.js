import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { bindActionCreators } from 'redux';

import withConfig from 'components/ConfigProvider/withConfig';
import AssetsWrapper from './components/AssetsWrapper';
import STRINGS from 'config/localizedStrings';
import { EditWrapper, IconTitle } from 'components';
import { ActionNotification } from 'hollaex-web-lib';
import { STATIC_ICONS } from 'config/icons';
import { setIsRefreshAssets } from 'actions/appActions';

const DigitalAssets = ({
	pair,
	icons: ICONS,
	showQuickTrade,
	setIsRefreshAssets,
}) => {
	return (
		<div className="digital-market-wrapper">
			{isMobile ? (
				<div className="market-wrapper market-wrapper-mobile-view">
					<div className="header-container">
						<div className="mobile-header-content">
							<div className="digital-assets-label">
								<EditWrapper stringId="DIGITAL_ASSETS.DIGITAL_ASSETS_TITLE">
									{STRINGS['DIGITAL_ASSETS.DIGITAL_ASSETS_TITLE']}
								</EditWrapper>
							</div>
							<div className="secondary-text desc-content mb-5">
								<EditWrapper stringId="DIGITAL_ASSETS.MOBILE_DESC">
									{STRINGS['DIGITAL_ASSETS.MOBILE_DESC']}
								</EditWrapper>
							</div>
						</div>
						<AssetsWrapper />
					</div>
				</div>
			) : (
				<div className="market-wrapper">
					<div className="header-container">
						<div className="d-flex">
							<IconTitle
								className="digital-assets-icon"
								stringId="DIGITAL_ASSETS.DIGITAL_ASSETS_TITLE"
								text={STRINGS['DIGITAL_ASSETS.DIGITAL_ASSETS_TITLE']}
								iconPath={ICONS['ASSET_INFO_COIN']}
								iconId="ASSET_INFO_COIN"
								textType="title"
							/>
						</div>
					</div>
					<div className="d-flex justify-content-between mb-2">
						<div>
							<div className="secondary-text">
								<EditWrapper stringId="DIGITAL_ASSETS.ASSETS_INFO">
									{STRINGS['DIGITAL_ASSETS.ASSETS_INFO']}
								</EditWrapper>
							</div>
							<div className="secondary-text">
								<EditWrapper stringId="DIGITAL_ASSETS.ASSETS_INFO_DETAIL">
									{STRINGS['DIGITAL_ASSETS.ASSETS_INFO_DETAIL']}
								</EditWrapper>
							</div>
						</div>
						<div className="link-container">
							<ActionNotification
								stringId="REFRESH"
								text={STRINGS['REFRESH']}
								iconId="REFRESH"
								iconPath={STATIC_ICONS['REFRESH']}
								className="blue-icon refresh-link link-1"
								onClick={() => setIsRefreshAssets(true)}
							/>
							<Link className="link-1" to="/wallet/deposit">
								<EditWrapper stringId="ACCORDIAN.DEPOSIT">
									{STRINGS['ACCORDIAN.DEPOSIT']}
								</EditWrapper>
							</Link>
							{showQuickTrade && (
								<Link className="link-2" to={`/quick-trade/${pair}`}>
									<EditWrapper stringId="DIGITAL_ASSETS.QUICK_TRADE">
										{STRINGS['DIGITAL_ASSETS.QUICK_TRADE']}
									</EditWrapper>
								</Link>
							)}
							<Link className="link-3" to="/markets">
								<EditWrapper stringId="DIGITAL_ASSETS.PRO_TRADE">
									{STRINGS['DIGITAL_ASSETS.PRO_TRADE']}
								</EditWrapper>
							</Link>
						</div>
					</div>
					<AssetsWrapper />
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		pair: state.app.pair,
		showQuickTrade: state.app.constants.features.quick_trade,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setIsRefreshAssets: bindActionCreators(setIsRefreshAssets, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(DigitalAssets));
