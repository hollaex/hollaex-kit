import React, { Fragment } from 'react';
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

import MarketCard from './MarketCard';
import { Paginator } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const MarketCards = ({
	page,
	pageSize,
	count,
	handleClick,
	goToPreviousPage,
	goToNextPage,
	markets,
	chartData,
	icons: ICONS,
}) => {
	return (
		<Fragment>
			<div className="d-flex flex-wrap p-3 my-5 justify-content-center">
				{markets.map((market, index) => (
					<MarketCard
						index={index}
						key={index}
						icons={ICONS}
						handleClick={handleClick}
						chartData={chartData}
						market={market}
					/>
				))}
			</div>
			<Paginator
				currentPage={page + 1}
				pageSize={pageSize}
				count={count}
				goToPreviousPage={goToPreviousPage}
				goToNextPage={goToNextPage}
			/>
		</Fragment>
	);
};

MarketCards.propTypes = {
	markets: oneOfType([
		arrayOf(
			shape({
				key: string,
				pair: object,
				symbol: string,
				pairTwo: object,
				fullname: string,
				ticker: object,
				increment_price: number,
				priceDifference: number,
				priceDifferencePercent: string,
			})
		),
		array,
	]).isRequired,
	handleClick: func.isRequired,
	goToPreviousPage: func.isRequired,
	goToNextPage: func.isRequired,
	page: number.isRequired,
	pageSize: number.isRequired,
	count: number.isRequired,
};

export default withConfig(MarketCards);
