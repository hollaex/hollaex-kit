import React, { Component } from 'react';
import { PriceChange, EditWrapper, Coin, Image } from 'components';
import SparkLine from './SparkLine';
import { formatToCurrency } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import icons from 'config/icons/dark';

class MarketRow extends Component {
	render() {
		const {
			market,
			chartData,
			handleClick,
			loading,
			index,
			isAsset = false,
			pinned_markets = [],
		} = this.props;

		const {
			key,
			ticker,
			increment_price,
			// display_name,
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
							<div className="px-2 market-pairs">
								{isAsset ? (
									fullname
								) : (
									<>
										<span className="important-text font-weight-bold">
											{pair_base_display}
										</span>
										/<span className="secondary-text">{pair_2_display}</span>
									</>
								)}
							</div>
							{pinned_markets.includes(key) && (
								<Image
									iconId="SPARKLE_ICON"
									icon={icons['SPARKLE_ICON']}
									wrapperClassName="sparkle-icon mt-2"
								/>
							)}
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
							<span className="title-font ml-1 last-price-label font-weight-bold">
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
				{!loading ? (
					<td>
						{isBrokerage ? (
							<EditWrapper stringId="DIGITAL_ASSETS.BROKERAGE">
								{STRINGS['DIGITAL_ASSETS.BROKERAGE']}
							</EditWrapper>
						) : (
							<PriceChange market={market} key={key} />
						)}
					</td>
				) : (
					<td>
						<div
							className="loading-anime"
							style={{
								animationDelay: `.${index + 1}s`,
							}}
						/>
					</td>
				)}
				{!isAsset && (
					<td>
						{!loading ? (
							<div>
								{ticker.volume > 0 && (
									<div>
										<span className="title-font ml-1 important-text font-weight-bold">
											{volume_native_text.split(' ')[0]}
										</span>
										<span className="ml-1">
											{volume_native_text.split(' ')[1]}
										</span>
									</div>
								)}
								<div>
									<span className="title-font ml-1">
										{formatToCurrency(ticker.volume)}
									</span>
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
				<td>
					{isBrokerage ? (
						<EditWrapper stringId="DIGITAL_ASSETS.BROKERAGE">
							{STRINGS['DIGITAL_ASSETS.BROKERAGE']}
						</EditWrapper>
					) : !loading ? (
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
					) : (
						<div
							className="loading-anime"
							style={{
								animationDelay: `.${index + 1}s`,
							}}
						/>
					)}
				</td>
			</tr>
		);
	}
}

export default MarketRow;
