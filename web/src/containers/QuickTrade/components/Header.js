import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { EditWrapper, Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { FLEX_CENTER_CLASSES } from 'config/constants';

const Header = ({ icons: ICONS }) => {
	return (
		<div
			className={classnames(
				'quick_trade-section_wrapper',
				'quick_trade-bottom-padded'
			)}
		>
			<div className="d-flex content-center">
				<Image
					iconId="SIDEBAR_QUICK_TRADING_INACTIVE,QUICK_TRADE"
					icon={ICONS['SIDEBAR_QUICK_TRADING_INACTIVE']}
					wrapperClassName={
						isMobile ? 'quick_trade-tab-icon' : 'quick_trade-icon'
					}
				/>
			</div>
			<div
				className={classnames('title text-capitalize', ...FLEX_CENTER_CLASSES)}
			>
				<EditWrapper stringId="QUICK_TRADE_COMPONENT.TITLE">
					{STRINGS['QUICK_TRADE_COMPONENT.TITLE']}
				</EditWrapper>
			</div>
			<div className={classnames('info-text', ...FLEX_CENTER_CLASSES)}>
				<EditWrapper stringId="QUICK_TRADE_COMPONENT.INFO">
					{STRINGS['QUICK_TRADE_COMPONENT.INFO']}
				</EditWrapper>
			</div>
			<div className={classnames('info-text', ...FLEX_CENTER_CLASSES)}>
				<EditWrapper stringId="QUICK_TRADE_COMPONENT.VISIT">
					{STRINGS.formatString(
						STRINGS['QUICK_TRADE_COMPONENT.VISIT'],
						<Link className="visit-asset-info ml-2" to="assets">
							{STRINGS['QUICK_TRADE_COMPONENT.ASSET_INFO_PAGE']}
						</Link>
					)}
				</EditWrapper>
			</div>
		</div>
	);
};

export default withConfig(Header);
