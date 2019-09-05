import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import querystring from 'query-string';
import { Spin, notification, Tabs } from 'antd';
import './index.css';
import { AdminHocForm } from '../../../components';

import { requestUser } from './actions';

import UserContent from './UserContent';
import { ListUsers, FullListUsers } from '../ListUsers';
import { isSupport } from '../../../utils';

const INITIAL_STATE = {
	userInformation: {},
	userImages: {},
	loading: false
};

const Form = AdminHocForm('USER_REQUEST_FORM');

const TabPane = Tabs.TabPane;

class App extends Component {
	state = INITIAL_STATE;

	componentWillMount() {
		const { search } = this.props.location;
		console.log(this.props.location);
		if (search) {
			const qs = querystring.parse(search);
			if (qs.id) {
				this.requestUserData(qs);
			}
		}
	}

	requestUserData = (values) => {
		const isSupportUser = isSupport();
		const { router } = this.props;
		this.setState({ ...INITIAL_STATE, loading: true });
		if (values.id) {
			router.replace(`/admin/user?id=${values.id}`);
		} else if (values.email) {
			router.replace(`/admin/user?email=${values.email}`);
		} else {
			router.replace(`/admin/user?username=${values.username}`);
		}
		return requestUser(values)
			.then(([userInformation, userImages, userBalance]) => {
				if (userInformation.id) {
					this.setState({
						userInformation,
						userImages,
						userBalance,
						loading: false
					});
				} else {
					const error = new Error('Not found');
					error.data = userInformation;
					throw error;
				}
			})
			.catch((err) => {
				console.log(err.statusCode, err.status);
				if (err.status === 403) {
					// return this.logout();
				}
				this.setState({ loading: false });
				// throw new SubmissionError({ _error: err.data.message });
			});
	};

	refreshData = (data, type) => {
		if (type === 'files') {
			this.setState({ userImages: data });
		} else {
			delete data.user_id;

			const userInformation = {
				...this.state.userInformation,
				...data
			};
			this.setState({ userInformation });
		}
	};

	refreshAllData = () => {
		const { search } = this.props.location;
		if (search) {
			const qs = querystring.parse(search);
			if (qs.id) {
				this.requestUserData(qs);
			}
		}
	};

	clearData = () => {
		this.setState(INITIAL_STATE);
		this.props.history.replace('/user');
	};

	onChangeUserDataSuccess = (userInformation) => {
		notification['success']({
			message: 'Success',
			description: 'Data saved successfully.'
		});
		this.setState({ userInformation });
	};

	searchUser = ({ type, input }) => {
		const searchUserdata = input.trim();
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(searchUserdata)) {
			this.requestUserData({ email: searchUserdata });
		} else if (isNaN(input)) {
			this.requestUserData({ username: searchUserdata });
		} else if (!isNaN(parseInt(input, 10))) {
			this.requestUserData({ id: searchUserdata });
		}
	};

	render() {
		const { userInformation, userImages, userBalance, loading } = this.state;

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return userInformation && userInformation.id ? (
			<UserContent
				userBalance={userBalance}
				userInformation={userInformation}
				userImages={userImages}
				refreshAllData={this.refreshAllData}
				clearData={this.clearData}
				refreshData={this.refreshData}
				onChangeUserDataSuccess={this.onChangeUserDataSuccess}
			/>
		) : (
			<div className="app_container-content">
				<Tabs>
					<TabPane tab="Search" key="search">
						<h2>SEARCH FOR USER</h2>
						<Form
							onSubmit={this.searchUser}
							buttonText="Search"
							fields={{
								input: {
									type: 'string',
									label: 'input',
									placeholder: 'email or id or username',
									validate: []
								}
							}}
							initialValues={{ type: 'id' }}
						/>
					</TabPane>

					<TabPane tab="User Verification" key="userVerification">
						<div className="list_users">
							<ListUsers requestUser={this.requestUserData} />
						</div>
					</TabPane>

					<TabPane tab="All Users" key="users">
						<h2 className="m-top">LIST OF ALL USERS</h2>
						<FullListUsers requestUser={this.requestUserData} />
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

export default App;
