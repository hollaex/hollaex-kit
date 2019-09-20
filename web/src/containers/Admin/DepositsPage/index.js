import React from 'react';
import { Tabs } from 'antd';
import { Deposits } from '../';
import './index.css';

const TabPane = Tabs.TabPane;

const DepositsPage = ({
	currency,
	type,
	location,
	noQueryParams,
	showFilters,
	...rest
}) => {
	const queryParams = {};
	if (!noQueryParams) {
		if (currency) {
			queryParams.currency = currency;
		}
		if (type) {
			queryParams.type = type;
		}

		// queryParams.status = false;
		// queryParams.dismissed = false;
	}

	return (
		<div className="app_container-content">
			<Tabs>
				<TabPane tab="Validate" key="validate">
					<Deposits
						queryParams={queryParams}
						showFilters={false}
						noQueryParams={noQueryParams}
						initialData={{
							currency: 'fiat',
							status: 'false',
							dismissed: 'false',
							rejected: 'false'
						}}
					/>
				</TabPane>

				<TabPane tab="Transactions" key="transactions">
					<Deposits
						queryParams={queryParams}
						showFilters={showFilters}
						noQueryParams={noQueryParams}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

DepositsPage.defaultProps = {
	currency: '',
	type: '',
	noQueryParams: false,
	showFilters: false
};

export default DepositsPage;
