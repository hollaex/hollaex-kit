import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { changePair } from '../../actions/appActions';
import STRINGS from '../../config/localizedStrings';

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
							{STRINGS[`${obj.pair_2.toUpperCase()}_NAME`].toUpperCase()}
						</Link>
					))}
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch)
});

export default connect(mapDispatchToProps)(MarketList);
