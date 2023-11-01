import React, { Component } from 'react';
import { PriceChange, EditWrapper, Coin } from 'components';
import SparkLine from './SparkLine';
import { formatToCurrency } from 'utils/currency';
import STRINGS from 'config/localizedStrings';

class MarketRow extends Component {
	render() {
		const {
			market,
			chartData,
			handleClick,
			loading,
			index,
			isAsset = false,
		} = this.props;

		const {
			key,
			ticker,
			increment_price,
			display_name,
			pair_base_display,
			pair_2_display,
			icon_id,
			volume_native_text,
			symbol,
			pairBase,
			fullname,
			sourceType: type,
		} = market;

		const isBrokerage = type === 'network' || type === 'broker';

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
							<div className="px-2">{isAsset ? fullname : display_name}</div>
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
							<span className="title-font ml-1">
								{formatToCurrency(ticker.close, increment_price)}
							</span>
							<span className="title-font ml-2">{pair_2_display}</span>
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
				{isAsset && (
					<td>
						{type === 'network' ? (
							<EditWrapper stringId="DIGITAL_ASSETS.NETWORK">
								{STRINGS['DIGITAL_ASSETS.NETWORK']}
							</EditWrapper>
						) : type === 'broker' ? (
							<EditWrapper stringId="DIGITAL_ASSETS.BROKER">
								{STRINGS['DIGITAL_ASSETS.BROKER']}
							</EditWrapper>
						) : (
							<EditWrapper stringId="DIGITAL_ASSETS.ORDERBOOK">
								{STRINGS['DIGITAL_ASSETS.ORDERBOOK']}
							</EditWrapper>
						)}
					</td>
				)}
				<td>
					{isBrokerage ? (
						<EditWrapper stringId="DIGITAL_ASSETS.BROKERAGE">
							{STRINGS['DIGITAL_ASSETS.BROKERAGE']}
						</EditWrapper>
					) : (
						<PriceChange market={market} key={key} />
					)}
				</td>
				{!isAsset && (
					<td>
						{!loading ? (
							<div>
								{ticker.volume > 0 && (
									<div>
										<span className="title-font ml-1 important-text">
											{volume_native_text}
										</span>
									</div>
								)}
								<div>
									<span className="title-font ml-1">{ticker.volume}</span>
									<span className="title-font ml-2">{pair_base_display}</span>
								</div>
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
				)}
				{isAsset && (
					<td>
						<div className="ml-1">{symbol.toUpperCase()}</div>
					</td>
				)}
				{isAsset && (
					<td>
						<div className="d-flex">
							<div className="icon-container">
								<div
									className={
										pairBase.type === 'blockchain'
											? 'squar-box'
											: pairBase.type === 'fiat'
											? 'circle-icon'
											: 'triangle-icon'
									}
								/>
							</div>
							<div className="ml-1 caps-first">{pairBase.type}</div>
						</div>
					</td>
				)}
				<td className="td-chart">
					{isBrokerage ? (
						<EditWrapper stringId="DIGITAL_ASSETS.BROKERAGE">
							{STRINGS['DIGITAL_ASSETS.BROKERAGE']}
						</EditWrapper>
					) : (
						<SparkLine
							data={
								!chartData[key] ||
								(chartData[key] &&
									chartData[key].close &&
									chartData[key].close.length < 2)
									? { close: [0.1, 0.1, 0.1], open: [] }
									: chartData[key]
							}
							containerProps={{ style: { height: '100%', width: '100%' } }}
						/>
					)}
				</td>
			</tr>
		);
	}
}

export default MarketRow;
