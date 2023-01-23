import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import GeneralContent from './generalContent';

const TabPane = Tabs.TabPane;

const Billing = (props) => {
	const { exchange, user } = props;

	return (
		<div className="app_container-content admin-earnings-container w-100 admin-billing">
			<Tabs defaultActiveKey="0">
				<TabPane tab="Plans" key="0">
					<GeneralContent exchange={exchange} user={user} />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.asset.exchange,
		user: state.user,
	};
};

export default connect(mapStateToProps)(Billing);
