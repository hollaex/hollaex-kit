import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import withConfig from 'components/ConfigProvider/withConfig';
import { getSparklines } from 'actions/chartAction';
import { MarketsSelector } from './utils';
import AssetsList from 'containers/DigitalAssets/components/AssetsList';

class Markets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			chartData: {},
			pageSize: 10,
			page: 0,
			count: 0,
		};
	}

	componentDidMount() {
		const { pairs } = this.props;
		const { page } = this.state;
		this.constructData(page);

		getSparklines(Object.keys(pairs)).then((chartData) =>
			this.setState({ chartData })
		);
	}

	componentDidUpdate(prevProps) {
		const { markets, selectedSource = '' } = this.props;
		const { page } = this.state;

		if (
			JSON.stringify(markets) !== JSON.stringify(prevProps.markets) ||
			(selectedSource && selectedSource !== prevProps.selectedSource)
		) {
			this.constructData(page);
		}
	}

	goToPreviousPage = () => {
		const { page } = this.state;
		this.constructData(page - 1);
	};

	goToNextPage = () => {
		const { page } = this.state;
		this.constructData(page + 1);
	};

	constructData = (page) => {
		const { pageSize } = this.state;
		const { markets, selectedSource, pairs } = this.props;
		let filteredData = [];
		let nonDublicateCoins = [];

		if (!selectedSource || selectedSource === 'all') {
			filteredData = markets.filter(({ key }) => {
				if (!nonDublicateCoins.includes(key.split('-')[0])) {
					nonDublicateCoins.push(key.split('-')[0]);
					return Object.keys(pairs).includes(key);
				}
				return null;
			});
		} else {
			filteredData = markets.filter(
				({ key }) => key.split('-')[1] === selectedSource
			);
		}

		const count = filteredData.length;

		const initItem = page * pageSize;
		if (initItem < count) {
			const data = filteredData.slice(0, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: filteredData, page, count });
		}
	};

	handleClick = (pair) => {
		const {
			router,
			constants: { features: { pro_trade, quick_trade } = {} },
		} = this.props;
		if (pair && router) {
			if (pro_trade) {
				router.push(`/trade/${pair}`);
			} else if (quick_trade) {
				router.push(`/quick-trade/${pair}`);
			}
		}
	};

	handleAssetsClick = (pair) => {
		const { router } = this.props;
		if (pair && router) {
			router.push(`/assets/coin/${pair.split('-')[0]}`);
		}
	};

	render() {
		const { data, chartData, page, pageSize, count } = this.state;

		return (
			<div>
				<AssetsList
					loading={!data.length}
					markets={data}
					chartData={chartData}
					handleClick={this.handleAssetsClick}
					page={page}
					pageSize={pageSize}
					count={count}
					goToNextPage={this.goToNextPage}
					goToPreviousPage={this.goToPreviousPage}
					showPaginator={count > pageSize}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user || {},
	pairs: state.app.pairs,
	coins: state.app.coins,
	tickers: state.app.tickers,
	constants: state.app.constants,
	markets: MarketsSelector(state),
});

export default connect(mapStateToProps)(withRouter(withConfig(Markets)));
