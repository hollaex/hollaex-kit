import React from 'react';
import { PriceChange, Image } from 'components';
import SparkLine from 'containers/TradeTabs/components/SparkLine';
import { formatToCurrency } from 'utils/currency';
import withConfig from 'components/ConfigProvider/withConfig';

const MarketCard = ({ icons: ICONS, market, chartData }) => {
	const {
		key,
		pairTwo,
		fullname,
		ticker,
		increment_price,
		display_name,
		pair_base_display,
		pair_2_display,
		icon_id,
	} = market;

	return (
		<div className="tabs-pair-details">
			<div className="w-100">
				<div className="d-flex justify-content-between">
					<div className="d-flex flex-direction-column justify-content-between pl-3">
						<div className="d-flex height-40">
							<div className="px-2">
								<Image
									iconId={icon_id}
									icon={ICONS[icon_id]}
									wrapperClassName="trade_tab-icons"
									imageWrapperClassName="currency-ball-image-wrapper"
								/>
							</div>
							<div>
								<div className="trade_tab-pair-title">{display_name}</div>
								<div className="trade_tab-pair-sub-title">
									{fullname}/{pairTwo.fullname}
								</div>
							</div>
						</div>
						<div className="d-flex align-center pl-3">
							<div className="trade_tab-pair-price">
								{formatToCurrency(ticker.close, increment_price)}
							</div>
							<div className="ml-2 trade_tab-pair-price">{pair_2_display}</div>
						</div>
						<div className="trade_tab-pair-volume pl-3">
							<span className="pr-2">Vol:</span>
							<span>
								{ticker.volume && `${ticker.volume} ${pair_base_display}`}
							</span>
						</div>
					</div>
					<div className="d-flex flex-direction-column align-start mr-2">
						<div className="d-flex justify-content-end align-center pl-5 ml-5">
							<div className="d-flex justify-content-end">
								<PriceChange market={market} disableGlance={true} />
							</div>
						</div>
						<div className="market-card__sparkline-wrapper w-100">
							<SparkLine
								data={chartData[key] || []}
								containerProps={{ style: { height: '100%', width: '100%' } }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withConfig(MarketCard);
