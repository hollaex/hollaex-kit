import React, { Fragment } from 'react';
import { Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import Tab from '../Tab';
import { STATIC_ICONS } from 'config/icons';
import Coins from '../Coins';

const Step1 = ({
	// assetType = '',
	coins,
	coinFormData = {},
	exchangeCoins,
	selectedCoinData,
	onClose,
	handleNext,
	handleScreenChange,
	handleTabs,
	activeTab,
	handleResetAsset,
}) => {
	const handleCreateNew = () => {
		handleScreenChange('step3');
		handleResetAsset();
	};
	const coinKeys = exchangeCoins.map((data) => data.symbol);
	const remainingCoins = coins.filter(
		(coin) => !coinKeys.includes(coin.symbol) && coin.verified
	);
	const renderContent = () => {
		return (
			<div>
				<div className="existing-coin">
					<div className="sub-title">Asset:</div>
					{remainingCoins.length ? (
						<div>
							<div
								className="asset-coin"
								onClick={() => handleScreenChange('step2')}
							>
								<div>
									<img
										src={
											selectedCoinData && selectedCoinData.logo
												? selectedCoinData.logo
												: STATIC_ICONS.COIN_ICONS[
														(selectedCoinData.symbol || '').toLowerCase()
												  ]
												? STATIC_ICONS.COIN_ICONS[
														(selectedCoinData.symbol || '').toLowerCase()
												  ]
												: STATIC_ICONS.MISSING_ICON
										}
										alt="coins"
										className="coin-icon"
									/>
									{`${selectedCoinData.fullname} (${(
										selectedCoinData.symbol || ''
									).toUpperCase()})`}
									{`${
										selectedCoinData.issuer
											? ' - ' + selectedCoinData.issuer
											: ''
									}`}
								</div>
								<DownOutlined />
							</div>
							<div className="asset-coin-details">
								<div className="coin-wrapper">
									<Coins
										nohover
										large
										small
										type={(selectedCoinData.symbol || '').toLowerCase()}
										fullname={selectedCoinData.fullname}
										color={
											selectedCoinData.meta ? selectedCoinData.meta.color : ''
										}
									/>
								</div>
								<div className="content-description">
									<div>{selectedCoinData.description}</div>
									<div className="provider-content">
										<b>Provider:</b>{' '}
										<span className="provider-text">
											{selectedCoinData.issuer}
										</span>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="asset-coin">
							<div>No new coin available</div>
							<DownOutlined />
						</div>
					)}
				</div>
				<div className="mt-3">
					Don't see your asset?{' '}
					<span className="anchor" onClick={handleCreateNew}>
						Add your asset
					</span>
				</div>
				<div className="btn-wrapper">
					<Button type="primary" onClick={onClose} className="green-btn">
						Back
					</Button>
					<div className="separator"></div>
					<Button
						type="primary"
						onClick={handleNext}
						disabled={!remainingCoins.length}
						className="green-btn"
					>
						Next
					</Button>
				</div>
			</div>
		);
	};

	const StepList = [
		{
			key: 'hollaexAssets',
			name: 'HollaEx Assets',
			description: 'Assets offered by HollaEx',
			content: renderContent(),
		},
		{
			key: 'otherAssets',
			name: 'Other Assets',
			description: 'Assets offered by other providers',
			content: renderContent(),
		},
	];

	const renderTabBar = ({ activeKey, onTabClick, ...rest }) => {
		return (
			<div className="d-flex ant-tabs-nav">
				{StepList.map((list, index) => (
					<div
						key={list.key}
						className={
							activeKey === index.toString()
								? 'ant-tabs-tab ant-tabs-tab-active'
								: 'ant-tabs-tab'
						}
						onClick={(e) => onTabClick(index.toString(), e)}
					>
						<div>{list.name}</div>
						<div className="tab-description">{list.description}</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<Fragment>
			<div className="add-asset-wrapper">
				<Tab
					TabList={StepList}
					onChange={handleTabs}
					activeTab={activeTab.toString()}
					renderTabBar={renderTabBar}
				/>
			</div>
		</Fragment>
	);
};

export default Step1;
