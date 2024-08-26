import React from 'react';
import { isMobile } from 'react-device-detect';
import { Space, Menu, Dropdown } from 'antd';

import { ActionNotification, Coin } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const TradeInputGroup = ({
	markets,
	quicktrade,
	goToTrade,
	icons: ICONS,
	pairs,
	tradeClassName,
}) => {
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
						const { display_name, icon_id } =
							pairs[market] ||
							quicktrade.find(({ symbol }) => symbol === market) ||
							{};
						return (
							<Menu.Item className="caps" key={market}>
								<div className="d-flex align-items-center">
									<Coin iconId={icon_id} type={isMobile ? 'CS5' : 'CS2'} />
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
					tradeClassName={tradeClassName}
				/>
			</Space>
		</Dropdown>
	);
};

export default withConfig(TradeInputGroup);
