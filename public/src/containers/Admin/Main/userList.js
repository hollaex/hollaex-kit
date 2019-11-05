import React from 'react';
import { Alert } from 'antd';
import { formatCurrency } from '../../../utils';

const UserList = ({ error, numbers }) => {
	return (
		<div>
			{error && (
				<Alert
					message="Error"
					className="m-top"
					description={error}
					type="error"
					showIcon
					style={{ width: '200%', left: '-100%' }}
				/>
			)}
			{numbers && (
				<h1 className="number-user">
					Total Registered Users : {formatCurrency(numbers)}
				</h1>
			)}
		</div>
	);
};

export default UserList;
