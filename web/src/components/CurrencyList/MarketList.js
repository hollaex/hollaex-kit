import React, { Component } from 'react';
import { Link } from 'react-router';

class MarketList extends Component {
	render() {
		const { markets, unFocus } = this.props;
		return (
			<div className="d-flex flex-column markets-list" onMouseLeave={unFocus}>
				<div className="d-flex filter-box" />
				<div className="d-flex flex-wrap align-items-start flex-column markets-wrapper">
					{markets.map(([pair, obj], index) => (
						<Link
							key={index}
							className="d-flex align-items-center justify-content-center market"
							to={`/trade/${pair}`}
						>
							{pair.replace('-', '/').toUpperCase()}
						</Link>
					))}
				</div>
			</div>
		);
	}
}

export default MarketList;
