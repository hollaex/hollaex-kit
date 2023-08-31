import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import withConfig from 'components/ConfigProvider/withConfig';
import { getSparklines } from 'actions/chartAction';
import { dataSelector } from './utils';
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
		const { data } = this.props;
		const { page } = this.state;

		if (JSON.stringify(data) !== JSON.stringify(prevProps.data)) {
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
		const { data: allData } = this.props;

		const count = allData.length;
		const initItem = page * pageSize;
		if (initItem < count) {
			const data = allData.slice(0, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: allData, page, count });
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

const mapStateToProps = (state, props) => ({
	pairs: state.app.pairs,
	constants: state.app.constants,
	data: dataSelector(state, props),
});

export default connect(mapStateToProps)(withRouter(withConfig(Markets)));
