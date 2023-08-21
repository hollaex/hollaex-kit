import React, { useState } from 'react';
import MultiFilter from './TableFilter';
import { getExchangeBalances } from './action';

// const columns = [
// 	{
// 		title: 'User Id',
// 		dataIndex: 'user_id',
// 		key: 'user_id',
// 		render: (user_id, data) => {
// 			return (
// 				<div className="d-flex">
// 					<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
// 						<Link to={`/admin/user?id=${data.User.id}`}>
// 							{data.User.id}
// 						</Link>
// 					</Button>
// 				</div>
// 			);
// 		},
// 	},
// 	{
// 		title: 'Currency',
// 		dataIndex: 'symbol',
// 		key: 'symbol',
// 	},
// 	{
// 		title: 'Available Balance',
// 		dataIndex: 'available',
// 		key: 'available',
// 		render: (available, data) => {
// 			return (
// 				<div>
// 					{parseFloat(data.available)}
// 				</div>
// 			);
// 		},
// 	},
// 	{
// 		title: 'Total Balance',
// 		dataIndex: 'balance',
// 		key: 'balance',
// 		render: (balance, data) => {
// 			return (
// 				<div>
// 					{parseFloat(data.balance)}
// 				</div>
// 			);
// 		},
// 	},
// ];

const filterFields = [
	{
		label: 'User ID',
		value: '',
		placeholder: 'Input User ID',
		type: 'number',
		name: 'user_id',
	},
	{
		label: 'Currency',
		value: '',
		placeholder: 'Currency',
		type: 'select',
		name: 'currency',
	},
];

const filterOptions = [
	{
		label: 'User ID',
		value: 'user_id',
		name: 'user_id',
	},
	{
		label: 'Currency',
		value: 'currency',
		name: 'currency',
	}

];

const Balances = () => {
	const [isLoading, setIsLoading] = useState(false);

	// useEffect(() => {
	// 	setIsLoading(true);
	// 	getBalances();
	// }, []);


	const requestDownload = (fieldValues = {}) => {
		return getExchangeBalances({ ...fieldValues, format: 'csv' });
	};

	return (
		<div className="asset-exchange-wallet-wrapper">
			<div className="header-txt">Exchange balances</div>
			<div style={{ color: '#ccc', marginTop: 5 }}>In this section you can download all current balances of the users. Apply the filters and click download to proceed. Please note that this function could take some time to complete. </div>
			<div className="wallet-filter-wrapper mt-4">
				<MultiFilter
					fields={filterFields}
					filterOptions={filterOptions}
					onHandle={() => {}}
					setIsLoading={setIsLoading}
					isLoading={isLoading}
					buttonText={'Download'}
					alwaysEnabled = {true}
					onDownload={requestDownload}
				/>
			</div>
			{/* <div className="mt-5">
				<span
					onClick={() => { requestDownload(); }}
					className="mb-2 underline-text cursor-pointer"
				>
					Download below CSV table
				</span>
				<div className="mt-4">
					<Spin spinning={isLoading}>
						<Table columns={columns} dataSource={userData} />
					</Spin>
				</div>
			</div> */}
		</div>
	);
};

export default Balances;
