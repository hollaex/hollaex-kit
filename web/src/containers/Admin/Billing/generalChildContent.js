import React from 'react';
import { Spin, Table } from 'antd';
import BillingFilter from './billingFilter';

const GeneralChildContent = ({ columns, dataSource, isLoading }) => {
	return (
		<div>
			<BillingFilter />

			<div className="table-wrapper">
				<Spin spinning={isLoading}>
					<Table columns={columns} dataSource={dataSource} />
				</Spin>
			</div>
		</div>
	);
};

export default GeneralChildContent;
