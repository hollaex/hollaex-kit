import React, { Component } from 'react';
import { Spin, Row, Col } from 'antd';
import { connect } from 'react-redux';

import UserList from './userList';
import TradingVolume from './tradingVolume';
import { getNumOfUsers, getMonthlyTradingVolume } from './actions';
import { getEmail } from '../../../utils';
import { checkRole, isAdmin } from '../../../utils/token';
import './index.css';

class Main extends Component {
	state = {
		pairLoading: true,
		userListLoading: true,
		tradingVolumeLoading: true,
		pageDisplay: 'block',
		numbers: 0,
		userError: '',
		selectedPair: '',
		tradingData: [],
		chartData: [],
		newPair: [],
		tradingError: '',
		pairError: '',
	};

	componentWillMount() {
		this.getPairsData(this.props.pairs);
		this.getUserData();
	}

	componentDidMount() {
		if (Object.keys(this.props.pairs).length) {
			this.getPairsData(this.props.pairs);
		}
	}

	componentDidUpdate(prevProps) {
		if (JSON.stringify(prevProps.pairs) !== JSON.stringify(this.props.pairs)) {
			this.getPairsData(this.props.pairs);
		}
	}

	getUserData = () => {
		if (isAdmin()) {
			getNumOfUsers()
				.then((data) => {
					this.setState({
						numbers: data.data.users,
						userListLoading: false,
					});
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					this.setState({
						userError: message,
						userListLoading: false,
					});
				});
		} else {
			this.setState({
				userError: 'not authorized',
			});
		}
	};

	getPairsData = (pairs) => {
		if (isAdmin()) {
			const newPair = Object.keys(pairs).sort(
				(a, b) => pairs[a].id - pairs[b].id
			);
			if (newPair.length) {
				this.getTradingData(newPair[0]);
				this.setState({
					selectedPair: newPair[0],
					newPair,
					pairLoading: false,
				});
			} else {
				this.setState({ pairError: 'Invalid pair' });
			}
		} else {
			this.setState({
				userError: 'not authorized',
			});
		}
	};

	getTradingData = (selectedPair = this.state.selectedPair) => {
		let tableData = [],
			chartData = [];
		getMonthlyTradingVolume(selectedPair)
			.then((data) => {
				const sortedData = data.sort((a, b) => a.date > b.date);
				chartData = sortedData.map((obj) => obj.volume);
				tableData = data.sort((a, b) => {
					return new Date(b.date) - new Date(a.date);
				});
				if (isAdmin()) {
					this.setState({
						tradingData: tableData,
						chartData,
						tradingVolumeLoading: false,
					});
				} else {
					throw new Error('not authorized');
				}
			})
			.catch((err) => {
				this.setState({ tradingError: 'not authorized' });
			});
	};

	handleChange = (selectedPair) => {
		this.setState({ tradingVolumeLoading: true, selectedPair }, () => {
			this.getTradingData(selectedPair);
		});
	};

	render() {
		const {
			userListLoading,
			tradingVolumeLoading,
			pageDisplay,
			numbers,
			userError,
			tradingData,
			chartData,
			newPair,
			tradingError,
			pairLoading,
			selectedPair,
			pairError,
		} = this.state;
		if (userListLoading || tradingVolumeLoading || pairLoading) {
			return <Spin size="large" className="m-top" />;
		}
		let error = pairError ? pairError : '';
		error = !error && tradingError ? tradingError : '';
		return (
			<div className="app_container-content">
				<div className="page" style={{ display: pageDisplay }}>
					<h1 className="black-header">
						<div className="black-text">DASHBOARD</div>
					</h1>
					<Row>
						<Col span={8}>
							<p>Welcome {getEmail()}</p>
						</Col>
						<Col span={8}>
							<p>Role: {checkRole()}</p>
						</Col>
					</Row>
					<div className="main-header">
						<UserList numbers={numbers} error={userError} />
					</div>
					<TradingVolume
						error={error}
						data={tradingData}
						chartData={chartData}
						newPair={newPair}
						selectedPair={selectedPair}
						handleChange={this.handleChange}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(Main);
