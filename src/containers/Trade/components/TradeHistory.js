import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { DisplayTable } from '../../../components';

import { formatTimestamp } from '../../../utils/utils';

import STRINGS from '../../../config/localizedStrings';

const generateHeaders = () => {
	return [
	{
		key: 'price',
		label: STRINGS.PRICE,
		renderCell: ({ side, price = 0 }, index) => (
			<div
				className={classnames('trade_history-row', side)}
				key={`time-${index}`}
			>
				{price}
			</div>
		)
	},
	{
		key: 'size',
		label: STRINGS.SIZE,
		renderCell: ({ size = 0, side }, index) => (
			<div className={classnames('trade_history-row', side)}>{size}</div>
		)
	},
	{
		key: 'timestamp',
		label: STRINGS.TIME,
		renderCell: ({ timestamp, side }, index) => (
			<div className={classnames('trade_history-row', side)}>{formatTimestamp(timestamp, STRINGS.HOUR_FORMAT)}</div>
		)
	}
];
}

class TradeHistory extends Component {
	state = {
		headers: []
	};

	componentWillMount() {
		this.calculateHeaders();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.language !== this.props.language) {
			this.calculateHeaders();
		}
	}

	calculateHeaders = () => {
		const headers = generateHeaders();
		this.setState({ headers });
	};

	render() {
		return (
			<div className="flex-auto d-flex apply_rtl trade_history-wrapper">
				<DisplayTable headers={this.state.headers} data={this.props.data} />
			</div>
		);
	}
}

TradeHistory.defaultProps = {
	data: []
};

const mapStateToProps = (store) => ({
	pair: store.app.pair
});

export default connect(mapStateToProps)(TradeHistory);
