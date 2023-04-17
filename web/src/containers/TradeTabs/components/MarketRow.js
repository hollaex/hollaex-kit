import React, { Component } from 'react';
import { PriceChange, Image, EditWrapper } from 'components';
import SparkLine from './SparkLine';
import { formatToCurrency } from 'utils/currency';
import STRINGS from 'config/localizedStrings';

class MarketRow extends Component {
	render() {
		const {
			icons: ICONS,
			market,
			chartData,
			handleClick,
			loading,
			index,
			isAsset = false,
			constants,
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
			pairTwo,
			fullname,
		} = market;

		return (
			<tr
				id={`market-list-row-${key}`}
				className="table-row table-bottom-border"
				onClick={() => handleClick(key)}
			>
				<td className="sticky-col">
					{!loading ? (
						<div className="d-flex align-items-center">
							<Image
								width="32px"
								height="32px"
								iconId={icon_id}
								icon={ICONS[icon_id]}
								wrapperClassName="market-list__coin-icons"
								imageWrapperClassName="currency-ball-image-wrapper"
							/>
							<div>{isAsset ? fullname : display_name}</div>
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
						{pairTwo.symbol === constants.native_currency ? (
							<EditWrapper stringId="MARKET_ROW.NATIVE">
								{STRINGS['MARKET_ROW.NATIVE']}
							</EditWrapper>
						) : (
							<EditWrapper stringId="MARKET_ROW.NO_NATIVE">
								{STRINGS['MARKET_ROW.NO_NATIVE']}
							</EditWrapper>
						)}
					</td>
				)}
				<td>
					<PriceChange market={market} />
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
										pairTwo.type === 'blockchain'
											? 'squar-box'
											: pairTwo.type === 'fiat'
											? 'circle-icon'
											: 'triangle-icon'
									}
								/>
							</div>
							<div className="ml-1 caps-first">{pairTwo.type}</div>
						</div>
					</td>
				)}
				<td className="td-chart">
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
				</td>
			</tr>
		);
	}
}

export default MarketRow;
