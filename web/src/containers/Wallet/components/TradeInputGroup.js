import React from 'react';
import { isMobile } from 'react-device-detect';
import { ActionNotification } from 'components';
import { Space, Menu, Dropdown } from 'antd';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const TradeInputGroup = ({ markets, goToTrade, icons: ICONS }) => {
	return (
		<Dropdown
			size="small"
			overlayClassName="custom-dropdown-style"
			style={{
				width: 100,
			}}
			overlay={
				<Menu onClick={({ key }) => goToTrade(key)}>
					{markets.map((pair) => (
						<Menu.Item className="caps" key={pair}>
							{pair}
						</Menu.Item>
					))}
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
