import React from 'react';
import { isMobile } from 'react-device-detect';
import { ActionNotification, Image } from 'components';
import { Space, Menu, Dropdown } from 'antd';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const TradeInputGroup = ({ markets, goToTrade, icons: ICONS, pairs }) => {
	return (
		<Dropdown
			size="small"
			overlayClassName="custom-dropdown-style"
			style={{
				width: 130,
			}}
			overlay={
				<Menu onClick={({ key }) => goToTrade(key)}>
					{markets.map((market) => {
						const display_name = pairs[market]?.display_name;
						const icon_id = pairs[market]?.icon_id;
						return (
							<Menu.Item className="caps" key={market}>
								<div className="d-flex align-items-center">
									<Image
										iconId={icon_id}
										icon={ICONS[icon_id]}
										wrapperClassName="app-bar-add-tab-icons"
										imageWrapperClassName="currency-ball-image-wrapper"
									/>
									<div className="app_bar-pair-font">{display_name}</div>
								</div>
							</Menu.Item>
						);
					})}
				</Menu>
			}
		>
			<Space>
				<ActionNotification
					stringId="TRADE_TAB_TRADE"
					text={STRINGS['TRADE_TAB_TRADE']}
					iconId="BLUE_TRADE_ICON"
					iconPath={ICONS['BLUE_TRADE_ICON']}
					className="csv-action"
					showActionText={isMobile}
					disable={markets.length === 0}
				/>
			</Space>
		</Dropdown>
	);
};

export default withConfig(TradeInputGroup);
