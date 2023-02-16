import React from 'react';
import { STATIC_ICONS } from 'config/icons';

const PluginAppStore = ({ onChangeNextType, router }) => {
	return (
		<div className="app-store-wrapper">
			<div
				className="underline-text m-3 pointer"
				onClick={() => onChangeNextType('myplugin')}
			>{`<Back`}</div>{' '}
			<div
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
						<div
							className="link-text blink_me pointer"
							onClick={() => router.push(`/admin/plugins/store`)}
						>
							Click to enter
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PluginAppStore;
