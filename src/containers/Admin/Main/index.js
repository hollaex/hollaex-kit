import React, { Component } from "react";
import UserList from "./userList";
import TradingVolume from "./tradingVolume";
import { Spin, Row, Col } from "antd";
import { getNumOfUsers, getMonthlyTradingVolume, requestFees } from "./actions";
import { getEmail } from "../../../utils";
import { checkRole, isAdmin } from "../../../utils/token";
import "./index.css";

class Main extends Component {
	state = {
		userListLoading: true,
		tradingVolumeLoading: true,
		pageDisplay: "block",
		numbers: 0,
		userError: "",
		selectedPair: "",
		tradingData: [],
		chartData: [],
		newPair: [],
		tradingError: ""
	};

	componentWillMount() {
		this.getUserData();
		this.getTradingData();
	}

	getUserData = () => {
		if (isAdmin()) {
			getNumOfUsers()
				.then((data) => {
					this.setState({
						numbers: data.data.users,
						userListLoading: false
					});
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					this.setState({
						userError: message,
						userListLoading: false
					});
				});
		} else {
			this.setState({
				userError: "not authorized"
			});
		}
	};

	getTradingData = (selectedPair = "btc-eur") => {
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
					return requestFees();
				} else {
					throw new Error("not authorized");
				}
			})
			.then((data) => {
				const newPair = [];
				const sortedData = data.data.sort((a, b) => a.id > b.id);
				sortedData.forEach(({ name }) => {
					newPair.push(name);
				});
				this.setState({
					tradingData: tableData,
					chartData,
					newPair,
					tradingVolumeLoading: false
				});
			})
			.catch((err) => {
				this.setState({ tradingError: "not authorized" });
			});
	};

	handleChange = (selectedPair) => {
		this.setState({ tradingVolumeLoading: true }, () => {
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
			tradingError
		} = this.state;
		if (userListLoading && tradingVolumeLoading) {
			return <Spin size="large" className="m-top" />;
		}
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
						error={tradingError}
						data={tradingData}
						chartData={chartData}
						newPair={newPair}
						handleChange={this.handleChange}
					/>
				</div>
			</div>
		);
	}
}

export default Main;
