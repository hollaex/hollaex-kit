import React, { Fragment } from 'react';
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import Coins from '../Coins';

const PairSelection = ({
	coins = [],
	pairsRemaining = [],
	handleSearch,
	handleSelectPair,
	moveToStep,
	activeTab,
	handleSelectType,
}) => {
	const getCoinData = (pair) => {
		return (
			coins.filter((coin) => {
				if (typeof coin === 'string') {
					return coin === pair;
				}
				return coin.symbol === pair;
			})[0] || {}
		);
	};
	const handleBack = () => {
		moveToStep('pair-init-selection');
		handleSelectType();
	};
	return (
		<Fragment>
			<div className="first-title">
				{activeTab === '0' ? 'HollaEx markets' : 'Other markets'}
			</div>
			<div className="title">Select a market</div>
			<div>
				Markets are based on assets selected in the previous step. To see
				more markets go back and add more assets.
			</div>
			<Input placeholder={'Search market'} onChange={handleSearch} />
			<div className="sub-title">Markets:</div>
			<div className="coin-option-wrapper">
				{pairsRemaining.map((pair, index) => {
					let pairBase = getCoinData(pair.pair_base);
					let pair2 = getCoinData(pair.pair_2);
					return (
						<div
							key={index}
							className="coin-option"
							onClick={() => handleSelectPair(pair)}
						>
							<div className="d-flex align-items-center">
								<div className="d-flex align-items-center f-1">
									<Coins type={pairBase.symbol} small={true} />
									<span className="coin-full-name">{pairBase.fullname}</span>
								</div>
								<CloseOutlined
									style={{ fontSize: '24px', margin: '0px 15px' }}
								/>
								<div className="d-flex align-items-center f-1">
									<Coins type={pair2.symbol} small={true} />
									<span className="coin-full-name">{pair2.fullname}</span>
								</div>
								<div>{pair.issuer ? ` - ${pair.issuer}` : ''}</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className="footer">
				<div>Can't find what your looking for?</div>
				<div className="anchor" onClick={handleBack}>
					Create a new market
				</div>
			</div>
		</Fragment>
	);
};

export default PairSelection;
