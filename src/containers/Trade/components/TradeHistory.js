import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { DisplayTable } from '../../../components';

import { formatTimestamp } from '../../../utils/utils';
import { formatFiatAmount, formatBtcFullAmount, formatBtcAmount, checkNonFiatPair } from '../../../utils/currency';

import STRINGS from '../../../config/localizedStrings';

const generateHeaders = (isNonFiatPair) => {
	return [
	{
		key: 'price',
		label: STRINGS.PRICE,
		renderCell: ({ side, price = 0 }, index) => (
			<div
				className={classnames('trade_history-row', side)}
				key={`time-${index}`}
			>
				{isNonFiatPair ? formatBtcFullAmount(price) : formatFiatAmount(price)}
			</div>
		)
	},
	{
		key: 'size',
		label: STRINGS.SIZE,
		renderCell: ({ size = 0 }, index) => formatBtcAmount(size)
	},
	{
		key: 'timestamp',
		label: STRINGS.TIME,
		renderCell: ({ timestamp }, index) =>
			formatTimestamp(timestamp, STRINGS.HOUR_FORMAT)
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
		const { pair } = this.props;
		const isNonFiatPair = checkNonFiatPair(pair);
		const headers = generateHeaders(isNonFiatPair);
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
