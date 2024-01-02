import React from 'react';
import { PriceChange, Coin } from 'components';
import { MiniSparkLine } from 'containers/TradeTabs/components/MiniSparkLine';
import STRINGS from 'config/localizedStrings';
import { getRandomValuesFromParts } from 'utils/array';

const AssetsRow = ({ coinData, handleClick, loading, index }) => {
	const {
		icon_id,
		symbol,
		fullname,
		type,
		chartData,
		priceDifference,
		priceDifferencePercent,
		lastPrice,
		key,
		networkType,
	} = coinData;

	return (
		<tr
			id={`market-list-row-${key}`}
			className="table-row table-bottom-border"
			onClick={() => handleClick(key)}
		>
			<td className="sticky-col">
				{!loading ? (
					<div className="d-flex align-items-center">
						<Coin iconId={icon_id} />
						<div className="px-2">{fullname}</div>
					</div>
				) : (
					<div
						className="loading-anime"
						style={{
							animationDelay: `.${index + 1}s`,
						}}
					/>
				)}
			</td>
			<td>
				{!loading ? (
					<div>
						<span className="title-font ml-1">{lastPrice}</span>
						<span className="title-font ml-2">{'USDT'}</span>
					</div>
				) : (
					<div
						className="loading-anime"
						style={{
							animationDelay: `.${index + 1}s`,
						}}
					/>
				)}
			</td>
			<td>
				{networkType === 'network'
					? STRINGS['DIGITAL_ASSETS.NETWORK']
					: type === 'broker'
					? STRINGS['DIGITAL_ASSETS.BROKER']
					: STRINGS['DIGITAL_ASSETS.ORDERBOOK']}
			</td>
			<td>
				<PriceChange
					market={{
						priceDifference: priceDifference,
						priceDifferencePercent: priceDifferencePercent,
					}}
					key={key}
				/>
			</td>
			<td>
				<div className="ml-1">{symbol.toUpperCase()}</div>
			</td>
			<td>
				<div className="d-flex">
					<div className="icon-container">
						<div
							className={
								type === 'blockchain'
									? 'squar-box'
									: type === 'fiat'
									? 'circle-icon'
									: 'triangle-icon'
							}
						/>
					</div>
					<div className="ml-1 caps-first">{type}</div>
				</div>
			</td>
			<td className="td-chart">
				<MiniSparkLine
					chartData={getRandomValuesFromParts(chartData?.price || [])}
					isArea
				/>
			</td>
		</tr>
	);
};

export default AssetsRow;
