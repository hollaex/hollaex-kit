import React from 'react';
// import { Tabs } from 'antd';
import { connect } from 'react-redux';

// import { BASE_CURRENCY } from '../../../config/constants';
import { Deposits } from '../';
import './index.css';

// const TabPane = Tabs.TabPane;

const DepositsPage = ({
	currency,
	type,
	location,
	noQueryParams,
	showFilters,
	coins,
	...rest
}) => {
	const queryParams = {};
	// const currencies = Object.keys(coins);
	if (!noQueryParams) {
		if (currency) {
			queryParams.currency = currency;
		}
		// else if(currencies[0]){
		// 	queryParams.currency = currencies[0];
		// }
		if (type) {
			queryParams.type = type;
		}

		// queryParams.status = false;
		// queryParams.dismissed = false;
	}

	return (
		<div className="app_container-content">
			{/* <Tabs> */}
			{/* <TabPane tab="Transactions" key="transactions"> */}
			<Deposits
				coins={coins}
				type={type}
				queryParams={queryParams}
				showFilters={showFilters}
				noQueryParams={noQueryParams}
			/>
			{/* </TabPane>
				<TabPane tab="Validate" key="validate">
					<Deposits
						queryParams={queryParams}
						showFilters={false}
						noQueryParams={noQueryParams}
						coins={coins}
						type={type}
						initialData={{
							// currency: currencies[0] ? currencies[0] : BASE_CURRENCY,
							status: 'false',
							dismissed: 'false',
							rejected: 'false',
						}}
					/>
				</TabPane> */}
			{/* </Tabs> */}
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

DepositsPage.defaultProps = {
	currency: '',
	type: '',
	noQueryParams: false,
	showFilters: false,
};

export default connect(mapStateToProps)(DepositsPage);
