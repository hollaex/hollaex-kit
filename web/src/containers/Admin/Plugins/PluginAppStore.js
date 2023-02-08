import React from 'react';
import { Button, Input } from 'antd';
import { STATIC_ICONS } from 'config/icons';

const PluginAppStore = ({ onChangeNextType, handlePlugin, handleSearch }) => {
	return (
		<div className="app-store-wrapper">
			<div
				onClick={() => onChangeNextType('explore')}
				style={{
					backgroundImage: `url(${STATIC_ICONS.EXCHANGE_APP_STORE_BACKGROUND_SPLASH})`,
				}}
				className="apps-store-background-img"
			>
				<div className="exchange-plugin-content-wrapper w-100">
					<div className="text-center">
						<img
							src={STATIC_ICONS.HOLLAEX_NETWORK_WHITE}
							alt=""
							className="exchange-plugin-image"
						/>
						<div className="exchange-plugin-title">
							Exchange Plugin App Store
						</div>
						<div>
							Marketplace to buy, sell and install plugin apps for your crypto
							platform.
						</div>
						<div className="link-text blink_me">Click to enter</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PluginAppStore;
