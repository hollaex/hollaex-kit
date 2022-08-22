import React, { Component } from 'react';
// import { SubmissionError } from 'redux-form';
import querystring from 'query-string';
import { Link } from 'react-router';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { RightOutlined } from '@ant-design/icons';
import { Table, Spin, Button, notification, Tabs, message } from 'antd';
import _get from 'lodash/get';

import './index.css';
import { connect } from 'react-redux';

import './index.css';
import { AdminHocForm } from '../../../components';

import { requestUser, requestUsersDownload } from './actions';

import UserContent from './UserContent';
import { ListUsers, FullListUsers } from '../ListUsers';
import { requestMyPlugins } from '../Plugins/action';
// import { isSupport } from '../../../utils/token';

const INITIAL_STATE = {
	userInformation: {},
	userImages: {},
	loading: false,
	userInformationList: [],
	kycPluginName: 'kyc',
};

const Form = AdminHocForm('USER_REQUEST_FORM');

const TabPane = Tabs.TabPane;

class App extends Component {
	constructor(props) {
		super(props);
		const {
			pluginNames: { kyc: kycPluginName },
		} = this.props;
		this.state = {
			...INITIAL_STATE,
			kycPluginName,
		};
	}

	componentWillMount() {
		this.getMyPlugins();
		const { search } = this.props.location;
		if (search) {
			const qs = querystring.parse(search);
			if (qs.id) {
				this.requestUserData(qs);
			}
		}
	}

	getMyPlugins = (params = {}) => {
		return requestMyPlugins(params)
			.then((res) => {
				if (res && res.data) {
					const filterData = res.data.filter((data) => data.type === 'kyc');
					if (filterData.length) {
						this.setState({
							kycPluginName: _get(filterData, '[0].name', 'kyc'),
						});
					}
				}
			})
			.catch((err) => {
				throw err;
			});
	};

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location.search !== prevProps.location.search) {
			if (this.props.location.search) {
				const qs = querystring.parse(this.props.location.search);
				if (qs.id) {
					this.requestUserData(qs);
				}
			} else {
				this.setState({
					userInformation: {},
					userImages: {},
				});
			}
		}
		if (
			JSON.stringify(prevState.userInformation) !==
			JSON.stringify(this.state.userInformation)
		) {
			if (this.state.userInformation.id) {
				this.props.router.replace(
					`/admin/user?id=${this.state.userInformation.id}`
				);
			}
		}
	}

	requestUserData = (values) => {
		// const isSupportUser = isSupport();
		const { router } = this.props;
		const { kycPluginName, ...rest } = INITIAL_STATE;
		this.setState({ ...rest, loading: true });
		if (values.id) {
			router.replace(`/admin/user?id=${values.id}`);
		}
		if (values.search) {
			router.replace(`/admin/user?search=${values.search}`);
		}
		return requestUser(values, this.state.kycPluginName)
			.then(([userInformation, userImages, userBalance]) => {
				if (
					userInformation &&
					userInformation.data &&
					userInformation.data.length
				) {
					if (userInformation.data.length === 1) {
						this.setState({
							userInformationList: [],
							userInformation: userInformation.data[0],
							userImages,
							userBalance,
							loading: false,
						});
					} else {
						this.setState({
							userInformationList: userInformation.data,
							userInformation: {},
							userImages,
							userBalance,
							loading: false,
						});
					}
				} else {
					const error = new Error('Not found');
					error.data = userInformation;
					throw error;
				}
			})
			.catch((err) => {
				if (err.status === 403) {
					// return this.logout();
				}
				this.setState({ loading: false });
				// throw new SubmissionError({ _error: err.data.message });
			});
	};

	requestUsersDownload = (params = {}) => {
		return requestUsersDownload({ ...params, format: 'csv' });
	};

	refreshData = (data, type) => {
		if (type === 'files') {
			this.setState({ userImages: data });
		} else {
			delete data.user_id;
			let userImages = this.state.userImages;
			if (type === 'reject') {
				userImages = {};
			}

			const userInformation = {
				...this.state.userInformation,
				...data,
			};
			this.setState({ userInformation, userImages });
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
		const { kycPluginName, ...rest } = INITIAL_STATE;
		this.setState(rest);
		this.props.router.replace('/admin/user');
	};

	onChangeUserDataSuccess = (userInformation) => {
		notification['success']({
			message: 'Success',
			description: 'Data saved successfully.',
		});
		this.setState({ userInformation });
	};

	searchUser = (values) => {
		let valueData = values;
		if (values.id) {
			valueData['id'] = parseInt(valueData.id);
		}
		if (valueData.id === 0) {
			message.error('User not found');
		} else if (valueData.id) {
			this.requestUserData({ id: valueData.id });
		} else {
			let searchUserdata =
				valueData && valueData.input ? valueData.input.trim() : '';
			searchUserdata = searchUserdata.toLowerCase();
			this.requestUserData({ search: searchUserdata });
		}
		// const REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		// if (REGEX.test(searchUserdata)) {
		// 	this.requestUserData({ email: searchUserdata });
		// } else if (isNaN(input)) {

		// } else if (!isNaN(parseInt(input, 10))) {
		// }
	};

	render() {
		const {
			userInformation,
			userImages,
			userBalance,
			loading,
			userInformationList,
			kycPluginName,
		} = this.state;
		const { coins, constants, isConfigure, showConfigure } = this.props;
		const renderBoolean = (value) => (
			<LegacyIcon type={value ? 'check-circle-o' : 'close-circle'} />
		);

		const renderLink = (value) => (
			<Button
				type="primary"
				// onClick={() => this.requestUserData({ id: value })}
				className="green-btn"
			>
				<Link to={`/admin/user?id=${value}`}>
					GO
					<RightOutlined />
				</Link>
			</Button>
		);

		const COLUMNS = [
			{ title: 'ID', dataIndex: 'id', key: 'id' },
			{ title: 'Email', dataIndex: 'email', key: 'email' },
			{
				title: 'Verification Level',
				dataIndex: 'verification_level',
				key: 'verification_level',
			},
			{
				title: 'Activated',
				dataIndex: 'activated',
				key: 'activated',
				render: renderBoolean,
			},
			{ title: 'See Data', dataIndex: 'id', key: 'data', render: renderLink },
		];

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return userInformation && userInformation.id ? (
			<UserContent
				coins={coins}
				constants={constants}
				userBalance={userBalance}
				userInformation={userInformation}
				userImages={userImages}
				isConfigure={isConfigure}
				showConfigure={showConfigure}
				kycPluginName={kycPluginName}
				refreshAllData={this.refreshAllData}
				clearData={this.clearData}
				refreshData={this.refreshData}
				onChangeUserDataSuccess={this.onChangeUserDataSuccess}
				requestUserData={this.requestUserData}
			/>
		) : (
			<div className="app_container-content user-container">
				<Tabs>
					<TabPane tab="Search" key="search">
						<h2>SEARCH FOR USER</h2>
						<Form
							onSubmit={this.searchUser}
							buttonText="Search"
							buttonClass="green-btn"
							fields={{
								id: {
									type: 'number',
									label: 'Id',
									placeholder: ' id ',
									validate: [],
									min: 1,
								},
								input: {
									type: 'string',
									label: 'Email or User Name',
									placeholder: 'email or username',
									validate: [],
								},
							}}
							initialValues={{ type: 'id' }}
						/>
						{userInformationList.length ? (
							<Table
								className="mt-4 blue-admin-table admin-user-container"
								columns={COLUMNS}
								dataSource={userInformationList}
								rowKey={(data) => {
									return data.id;
								}}
							/>
						) : null}
					</TabPane>

					<TabPane tab="User Verification" key="userVerification">
						<div className="list_users">
							<ListUsers
								requestUser={this.requestUserData}
								handleDownload={this.requestUsersDownload}
								columns={COLUMNS}
							/>
						</div>
					</TabPane>

					<TabPane tab="All Users" key="users">
						<h2 className="m-top">LIST OF ALL USERS</h2>
						<FullListUsers
							coins={coins}
							requestUser={this.requestUserData}
							handleDownload={this.requestUsersDownload}
						/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pluginNames: state.app.pluginNames,
	coins: state.app.coins,
	constants: state.app.constants,
});

export default connect(mapStateToProps)(App);
