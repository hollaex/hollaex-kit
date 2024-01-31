import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import withConfig from 'components/ConfigProvider/withConfig';
import AssetsWrapper from './components/AssetsWrapper';
import { EditWrapper, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';

const DigitalAssets = ({ pair, icons: ICONS, showQuickTrade }) => {

	return (
		<div className="digital-market-wrapper">
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
				<div className="d-flex justify-content-between mb-3">
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
						{showQuickTrade && (
							<Link className="link-1" to={`/quick-trade/${pair}`}>
								<EditWrapper stringId="DIGITAL_ASSETS.QUICK_TRADE">
									{STRINGS['DIGITAL_ASSETS.QUICK_TRADE']}
								</EditWrapper>
							</Link>
						)}
						<Link className="link-2" to="/markets">
							<EditWrapper stringId="DIGITAL_ASSETS.PRO_TRADE">
								{STRINGS['DIGITAL_ASSETS.PRO_TRADE']}
							</EditWrapper>
						</Link>
						<Link className="link-3" to="/wallet">
							<EditWrapper stringId="DIGITAL_ASSETS.WALLET">
								{STRINGS['DIGITAL_ASSETS.WALLET']}
							</EditWrapper>
						</Link>
					</div>
				</div>
				<AssetsWrapper />
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		pair: state.app.pair,
		showQuickTrade: state.app.constants.features.quick_trade,
	};
};

export default connect(mapStateToProps)(withConfig(DigitalAssets));
