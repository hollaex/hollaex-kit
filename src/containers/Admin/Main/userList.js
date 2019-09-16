import React, { Component } from 'react';
import { getNumOfUsers } from './actions';
import { Alert } from 'antd';
import { formatCurrency } from '../../../utils';
import { isAdmin } from '../../../utils/token';
class UserList extends Component {
	state = {
		numbers: 0,
		error: ''
	};

	componentWillMount() {
		if (isAdmin()) {
			getNumOfUsers()
				.then((data) => {
					console.log(data);
					this.setState({
						numbers: data.data.users
					});
					this.props.setUserListLoading();
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					// this.setState({
					//     error: message
					// });
					this.props.setUserListLoading();
				});
		} else {
			this.props.setUserListLoading();
		}
	}

	render() {
		const { error, numbers } = this.state;
		console.log(numbers);
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
	}
}

export default UserList;
