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

import { Paginator } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import MarketRow from './MarketRow';
import { EditWrapper } from 'components';

const MarketList = ({
	markets,
	handleClick,
	chartData,
	icons: ICONS,
	page,
	pageSize,
	count,
	goToNextPage,
	goToPreviousPage,
	showPaginator = false,
}) => {
	return (
		<div className="market-list__container">
			<div className="market-list__block">
				<table className="market-list__block-table">
					<thead>
						<tr className="table-bottom-border">
							<th className="sticky-col">
								<div>
									<EditWrapper stringId="MARKETS_TABLE.MARKETS">
										{STRINGS['MARKETS_TABLE.MARKETS']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div>
									<EditWrapper stringId="MARKETS_TABLE.LAST_PRICE">
										{STRINGS['MARKETS_TABLE.LAST_PRICE']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div>
									<EditWrapper stringId="MARKETS_TABLE.CHANGE_24H">
										{STRINGS['MARKETS_TABLE.CHANGE_24H']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div>
									<EditWrapper stringId="MARKETS_TABLE.VOLUME_24h">
										{STRINGS['MARKETS_TABLE.VOLUME_24h']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div>
									<EditWrapper stringId="MARKETS_TABLE.CHART_24H">
										{STRINGS['MARKETS_TABLE.CHART_24H']}
									</EditWrapper>
								</div>
							</th>
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
			{showPaginator && (
				<Paginator
					currentPage={page + 1}
					pageSize={pageSize}
					count={count}
					goToPreviousPage={goToPreviousPage}
					goToNextPage={goToNextPage}
				/>
			)}
		</div>
	);
};

MarketList.propTypes = {
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

export default withConfig(MarketList);
