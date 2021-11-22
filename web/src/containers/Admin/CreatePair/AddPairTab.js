import React from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';

import Tab from '../Tab';
import Coins from '../Coins';

const getCoinPairSelect = (currentPresetPair, pairBase, pair2, moveToStep) => {
	if (currentPresetPair.id) {
		return (
			<div className="coin-container">
				<div
					className="asset-pairs"
					onClick={() => moveToStep('pair-selection')}
				>
					<div>
						<div className="d-flex align-items-center">
							<div className="d-flex align-items-center">
								<Coins type={pairBase.symbol} small={true} />
								<span className="coin-full-name">{pairBase.fullname}</span>
							</div>
							<CloseOutlined style={{ fontSize: '24px' }} />
							<div className="d-flex align-items-center">
								<Coins type={pair2.symbol} small={true} />
								<span className="coin-full-name">{pair2.fullname}</span>
							</div>
						</div>
					</div>
					<DownOutlined />
				</div>
				{currentPresetPair.issuer ? (
					<div className="provider-display">
						Provider: {currentPresetPair.issuer}
					</div>
				) : null}
			</div>
		);
	} else if (!currentPresetPair.id) {
		return (
			<div className="coin-container">
				<div className="asset-pairs">
					<div>No markets</div>
					<DownOutlined />
				</div>
			</div>
		);
	} else {
		return null;
	}
};

const AddPairTab = ({
	allCoins = [],
	currentPresetPair = {},
	formData = {},
	isExchangeWizard = false,
	onClose,
	moveToStep,
	moveToParentStep,
	activeTab,
	handleTabs,
	handleSelectType,
}) => {
	const pairBase =
		allCoins.filter((data) => data.symbol === currentPresetPair.pair_base)[0] ||
		{};
	const pair2 =
		allCoins.filter((data) => data.symbol === currentPresetPair.pair_2)[0] ||
		{};
	const handleNavigate = () => {
		moveToStep('pair-init-selection');
		handleSelectType();
	};
	const renderContent = () => {
		return (
			<div>
				<div className="add-pair-radio-wrapper">
					{getCoinPairSelect(currentPresetPair, pairBase, pair2, moveToStep)}
				</div>
				<div className="add-pair-radio-wrapper">
					<div>
						Don't see your asset?{' '}
						<span className="anchor" onClick={handleNavigate}>
							Create a new market
						</span>
					</div>
				</div>
			</div>
		);
	};

	const StepList = [
		{
			key: 'hollaexPairs',
			name: 'HollaEx markets',
			description: 'Markets offered by HollaEx',
			content: renderContent(),
		},
		{
			key: 'otherPairs',
			name: 'Other markets',
			description: 'Markets offered by other providers',
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
		<div className="add-pair-wrapper">
			<div className="title">Add Market</div>
			{isExchangeWizard ? (
				<div>
					Markets are based on assets selected in the previous step. To see
					more markets{' '}
					<Link onClick={() => moveToParentStep(2)}>go back</Link> and add more
					assets.
				</div>
			) : null}
			<Tab
				TabList={StepList}
				renderTabBar={renderTabBar}
				onChange={handleTabs}
				activeTab={activeTab}
			/>
			<div className="btn-wrapper">
				<Button className="green-btn" type="primary" onClick={onClose}>
					Back
				</Button>
				<div className="separator"></div>
				<Button
					className="green-btn"
					type="primary"
					onClick={() => moveToStep('preview')}
					disabled={!formData.pair_base}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default AddPairTab;
