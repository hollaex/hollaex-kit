import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import { isMobile } from 'react-device-detect';

const Header = ({ icons: ICONS }) => {
	return (
		<div
			className={classnames(
				'quick_trade-section_wrapper',
				'quick_trade-bottom-padded'
			)}
		>
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
			{!isMobile && (
				<div className={classnames('info-text', ...FLEX_CENTER_CLASSES)}>
					{STRINGS['QUICK_TRADE_COMPONENT.INFO']}
				</div>
			)}
		</div>
	);
};

export default withConfig(Header);
