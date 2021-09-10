import React, { Fragment } from 'react';
import { Input } from 'antd';

import { STATIC_ICONS } from 'config/icons';

const Step2 = ({
	coins = [],
	exchangeCoins = [],
	activeTab,
	handleSearch,
	handleSelectCoin,
	handleScreenChange,
	handleResetAsset,
}) => {
	const handleCreateNew = () => {
		handleScreenChange('step3');
		handleResetAsset();
	};
	const coinKeys = exchangeCoins.map((data) => data.symbol);
	return (
		<Fragment>
			<div className="first-title">
				{activeTab === '0' ? 'HollaEx assets' : 'Other assets'}
			</div>
			<div className="title">Select a coin</div>
			<Input
				placeholder={'Search name or paste token contract address'}
				onChange={handleSearch}
			/>
			<div className="sub-title">Asset:</div>
			<div className="coin-option-wrapper">
				{coins
					.filter((coin) => !coinKeys.includes(coin.symbol) && coin.verified)
					.map((coin, index) => (
						<div
							key={index}
							className="coin-option"
							onClick={() => handleSelectCoin(coin)}
						>
							<img
								src={
									coin && coin.logo
										? coin.logo
										: STATIC_ICONS.COIN_ICONS[(coin.symbol || '').toLowerCase()]
										? STATIC_ICONS.COIN_ICONS[(coin.symbol || '').toLowerCase()]
										: STATIC_ICONS.MISSING_ICON
								}
								alt="coins"
								className="coin-icon"
							/>
							{`${coin.fullname} (${coin.symbol})`}
							{`${coin.issuer ? ' - ' + coin.issuer : ''}`}
						</div>
					))}
			</div>
			<div className="create-new-link">
				<div>Can't find what your looking for?</div>
				<span className="anchor" onClick={handleCreateNew}>
					Create a brand new asset
				</span>
			</div>
		</Fragment>
	);
};

export default Step2;
