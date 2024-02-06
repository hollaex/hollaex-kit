import React from 'react';
import classnames from 'classnames';
import { EditWrapper, Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import { isMobile } from 'react-device-detect';

const Header = ({ icons: ICONS, viewTrendsClick }) => {
	return (
		<div
			className={classnames(
				'quick_trade-section_wrapper',
				'quick_trade-bottom-padded',
				{
					'd-flex': isMobile,
					'justify-content-between': isMobile,
				}
			)}
		>
			<div className="d-flex">
				{isMobile && (
					<div className="quick-trade-title-icon">
						<Image
							iconId="QUICK_TRADE_TAB_ACTIVE,QUICK_TRADE"
							icon={ICONS['QUICK_TRADE_TAB_ACTIVE']}
							wrapperClassName="quick_trade-tab-icon"
						/>
					</div>
				)}
				<div
					className={classnames(
						'quick-trade-header-wrapper title text-capitalize',
						{
							[FLEX_CENTER_CLASSES]: !isMobile,
						}
					)}
				>
					<EditWrapper stringId="QUICK_TRADE_COMPONENT.TITLE">
						{STRINGS['QUICK_TRADE_COMPONENT.TITLE']}
					</EditWrapper>
				</div>
			</div>

			{isMobile && (
				<div className='view-trend-text' onClick={viewTrendsClick}>
					{STRINGS['QUICK_TRADE_COMPONENT.VIEW_TREND']}
				</div>
			)}
			{!isMobile && (
				<div className={classnames('info-text', ...FLEX_CENTER_CLASSES)}>
					{STRINGS['QUICK_TRADE_COMPONENT.INFO']}
				</div>
			)}
		</div>
	);
};

export default withConfig(Header);
