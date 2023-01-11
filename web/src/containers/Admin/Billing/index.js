import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import GeneralContent from './generalContent';

const TabPane = Tabs.TabPane;

const Billing = (props) => {
	const { exchange } = props;

	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs defaultActiveKey="0">
				<TabPane tab="Plans" key="0">
					<GeneralContent exchange={exchange} />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.asset.exchange,
	};
};

export default connect(mapStateToProps)(Billing);
