import React from 'react';

const MarketList = ({ markets, unFocus }) => (
	<div className="d-flex flex-column markets-list" onMouseLeave={unFocus}>
		<div className="d-flex filter-box" />
		<div className="d-flex flex-wrap align-items-start flex-column markets-wrapper">
			{markets.map((market, index) => (
				<div
					key={index}
					className="d-flex align-items-center justify-content-center market"
				>
					{market}
				</div>
			))}
		</div>
	</div>
);

export default MarketList;
