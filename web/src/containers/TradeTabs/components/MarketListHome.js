import React from 'react';
import {
	oneOfType,
	arrayOf,
	shape,
	array,
	object,
	number,
	string,
	func,
} from 'prop-types';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import MarketRow from './MarketRow';
import './MarketListHome.css';

const MarketListHome = ({ markets, handleClick, chartData, icons: ICONS }) => {
	return (
		<div className="market-list__container">
			<div className="market-list__block p-0">
				<table className="table table-hover">
					<thead>
						<tr className="table-bottom-border">
							<th>Amount</th>
							<th>{STRINGS['PRICE']}</th>
							<th>24h Change</th>
							<th>24h Volume</th>
							<th>24 Price Graph</th>
						</tr>
					</thead>
					<tbody>
						{markets.map((market, index) => (
							<MarketRow
								key={index}
								icons={ICONS}
								handleClick={handleClick}
								chartData={chartData}
								market={market}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

MarketListHome.propTypes = {
	markets: oneOfType([
		arrayOf(
			shape({
				key: string,
				pair: object,
				symbol: string,
				pairTwo: object,
				ticker: object,
				increment_price: number,
				priceDifference: number,
				priceDifferencePercent: string,
			})
		),
		array,
	]).isRequired,
	chartData: object.isRequired,
	handleClick: func.isRequired,
};

export default withConfig(MarketListHome);
