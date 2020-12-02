import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';

class GetSocketState extends Component {
	componentDidMount() {
		this.checkConnection();
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(this.props.orderbooks) !==
				JSON.stringify(prevProps.orderbooks) ||
			JSON.stringify(this.props.pairsTrades) !==
				JSON.stringify(prevProps.pairsTrades)
		) {
			this.checkConnection();
		}
	}

	checkConnection = () => {
		if (!this.props.isDataReady) {
			const { orderbooks, pairsTrades, pair, router } = this.props;
			let pairTemp = pair;
			if (router && router.params && router.params.pair) {
				pairTemp = router.params.pair;
			}
			let isReady =
				Object.keys(orderbooks).length &&
				orderbooks[pairTemp] &&
				Object.keys(pairsTrades).length;
			this.props.socketDataCallback(isReady);
		}
	};

	render() {
		return <Fragment />;
	}
}

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	orderbooks: store.orderbook.pairsOrderbooks,
	pairsTrades: store.orderbook.pairsTrades,
});

export default connect(mapStateToProps)(GetSocketState);
