import { Button, Spin } from 'antd';
import React from 'react';
import Coins from '../Coins';
import './index.css';

const RemoveConfirmation = ({
	onCancel,
	removeContent,
	onHandleRemoveAsset,
	isRemovePair,
	removePair,
	removeCoin,
	onHandleRemoveMarket,
	isLoading,
}) => {
	return (
		<div>
			<Spin spinning={isLoading}>
				<div className="remove-confirmation-wrapper">
					<div className="title">
						Remove {removeContent === 'Markets' ? 'Market' : 'Asset'}
					</div>
					<div className="sub-text">
						Removing the {removeContent === 'Markets' ? 'Market' : 'Asset'} only
						removes it from your exchange supported{' '}
						{removeContent === 'Markets' ? 'Markets' : 'Assets'}. You can simply
						add it back anytime you want later. Are you sure you want to remove
						the {removeContent === 'Markets' ? 'Market' : 'Asset'}?
					</div>
					{removeContent && !removeContent === 'Markets' && (
						<div className="coin">
							<Coins
								type={removeCoin.symbol}
								color={removeCoin.ASSET_COLOR}
								small={true}
							/>
							<span className="coin-item">{removeCoin.fullname}</span>
						</div>
					)}
					{isRemovePair && (
						<div className="flex-container">
							<div className="coin x-mark">
								<Coins type={removePair && removePair[0]} small={true} />
							</div>
							<div className="coin">
								<Coins type={removePair && removePair[1]} small={true} />
							</div>
						</div>
					)}
					<div className="btn-wrapper">
						<Button type="primary" onClick={() => onCancel(false)}>
							Cancel
						</Button>
						<div className="separator"></div>
						<Button
							type="primary"
							disabled={isLoading}
							onClick={() =>
								removeContent === 'Markets'
									? onHandleRemoveMarket(removePair)
									: onHandleRemoveAsset(removeCoin.symbol)
							}
						>
							Remove
						</Button>
					</div>
				</div>
			</Spin>
		</div>
	);
};

export default RemoveConfirmation;
