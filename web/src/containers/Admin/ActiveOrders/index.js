import React, { Component } from 'react';
import { Tabs, Row } from 'antd';
import { connect } from 'react-redux';

import PairsSection from './PairsSection';

const TabPane = Tabs.TabPane;

class ActiveOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '',
		};
	}

	componentDidMount() {
		this.setInitTab();
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(this.props.pairs) !== JSON.stringify(prevProps.pairs)) {
			this.setInitTab();
		}
	}

	setInitTab = () => {
		const pairKeys = Object.keys(this.props.pairs);
		if (pairKeys.length) {
			this.setState({ activeTab: pairKeys[0] });
		}
	};

	tabChange = (activeTab) => {
		this.setState({ activeTab });
	};

	render() {
		const { activeTab } = this.state;
		const { pairs, userId, cancelOrder } = this.props;

		return (
			<div className="app_container-content">
				<h1>Active Orders</h1>
				<Tabs onChange={this.tabChange}>
					{Object.keys(pairs).map((pair) => {
						return (
							<TabPane tab={pair} key={pair}>
								{activeTab === pair ? (
									<Row>
										<PairsSection
											userId={userId}
											activePair={activeTab}
											cancelOrder={cancelOrder}
										/>
									</Row>
								) : null}
							</TabPane>
						);
					})}
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(ActiveOrders);
