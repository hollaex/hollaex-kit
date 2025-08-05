import React, { Component } from 'react';
// import { SubmissionError } from 'redux-form';
import querystring from 'query-string';
import { Spin, notification, message } from 'antd';
import _get from 'lodash/get';

import './index.css';
import { connect } from 'react-redux';

import './index.css';

import { requestUser, requestUsersDownload } from './actions';

import UserContent from './UserContent';
import { FullListUsers } from '../ListUsers';
import { requestMyPlugins } from '../Plugins/action';
// import { isSupport } from '../../../utils/token';

const INITIAL_STATE = {
	userInformation: {},
	userImages: {},
	loading: false,
	userInformationList: [],
	kycPluginName: 'kyc',
};

class App extends Component {
	constructor(props) {
		super(props);
		const {
			pluginNames: { kyc: kycPluginName },
		} = this.props;
		this.state = {
			...INITIAL_STATE,
			kycPluginName,
			profile: '',
		};
	}

	UNSAFE_componentWillMount() {
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
		if (
			this.props.location.search !== prevProps.location.search &&
			!Object.keys(prevProps.location?.query)?.includes('tab')
		) {
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
				this.setState({ profile: '' });
			}
		}
	}

	requestUserData = (values) => {
		// const isSupportUser = isSupport();
		const { router } = this.props;
		const { kycPluginName, ...rest } = INITIAL_STATE;
		this.setState({ ...rest, loading: true });
		if (values?.tab) {
			this.setState({ profile: values?.tab });
			delete values?.tab;
		}
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
			kycPluginName,
		} = this.state;
		const { coins, constants, isConfigure, showConfigure } = this.props;

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
				referral_history_config={this.props.referral_history_config}
				router={this.props.router}
				userProfile={this.state.profile}
			/>
		) : (
			<div className="app_container-content user-container">
				<FullListUsers
					coins={coins}
					requestUser={this.requestUserData}
					handleDownload={this.requestUsersDownload}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pluginNames: state.app.pluginNames,
	coins: state.app.coins,
	referral_history_config: state.app.constants.referral_history_config,
	constants: state.app.constants,
});

export default connect(mapStateToProps)(App);
