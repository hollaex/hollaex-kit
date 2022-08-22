import React, { Component } from 'react';
import { Button, message, Select, Form } from 'antd';
import { getSettle } from '../AdminFees/action';
import moment from 'moment';
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';

const { Option } = Select;

export class SettleModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedUser: {},
			buttonSubmitting: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isOpen !== this.props.isOpen) {
			this.setState({ selectedUser: {} });
		}
	}

	settleFee = () => {
		this.setState({ buttonSubmitting: true });
		const { requestFees, handleSettle } = this.props;
		const { selectedUser } = this.state;
		if (selectedUser && selectedUser.id) {
			getSettle(selectedUser.id)
				.then((response) => {
					message.success('Successfully Settled');
					requestFees();
				})
				.catch((error) => {
					const error_msg = error.data ? error.data.message : error.message;
					message.error(error_msg);
				})
				.finally(() => {
					handleSettle();
					this.setState({ buttonSubmitting: false });
				});
		} else {
			handleSettle();
		}
	};

	searchUser = (value) => {
		if (value) {
			this.props.getAllUserData({ search: value });
		} else {
			this.props.getAllUserData();
		}
	};

	handleSubmit = (value) => {
		const filterData = this.props.userDetails.filter(
			(data) => value.email === data.email
		);
		this.setState({ selectedUser: filterData[0] });
		this.props.handleNext();
	};

	handleSearch = _debounce(this.searchUser, 500);

	render() {
		const {
			toggleVisibility,
			earningsData,
			currentScreen,
			userDetails,
		} = this.props;
		const { selectedUser, buttonSubmitting } = this.state;
		return (
			<div>
				{currentScreen === 'step1' ? (
					<div className="settle-modal-page">
						<div className="d-flex align-items-center">
							<div className="dollar-icon text-center">$</div>
							<div className="heading">Settle trading fees</div>
						</div>
						<div className="margin-top-bottom">
							Which account would you like to send the earnings to?.
						</div>
						<div>
							<div>Account (input an email)</div>
							<Form
								onFinish={this.handleSubmit}
								initialValues={{ email: this.state.selectedUser.email }}
							>
								<Form.Item
									name="email"
									rules={[
										{
											required: true,
											message: 'Please input your E-mail!',
										},
									]}
								>
									<Select
										showSearch
										placeholder="Input an email"
										className="user-search-field"
										onSearch={(text) => this.handleSearch(text.toLowerCase())}
										filterOption={() => true}
										loading={this.props.isLoading}
									>
										{this.props.userDetails.map((sender) => (
											<Option key={sender.email}>{sender.email}</Option>
										))}
									</Select>
								</Form.Item>
								<div className="btn-wrapper">
									<Button type="primary" onClick={toggleVisibility}>
										Cancel
									</Button>
									<Button
										type="primary"
										htmlType="submit"
										disabled={userDetails.length ? false : true}
									>
										Next
									</Button>
								</div>
							</Form>
						</div>
					</div>
				) : currentScreen === 'step2' ? (
					<div className="settle-modal-page">
						<div className="d-flex align-items-center">
							<div className="dollar-icon text-center">$</div>
							<div className="heading">Settle trading fees</div>
						</div>
						<div className="margin-top-bottom">
							Click settle below to calculate the trading fees generated from
							your users from the last settlement date until today.
						</div>
						<div className="margin-top-bottom">
							The settled earning amounts will be freely accessible to use.
						</div>
						<div className="modal-content">
							<span className="legend title-content text-center">
								Calculate earning dates
							</span>
							<div className="title-content margin-top-bottom">
								<div>User account:</div>
								<div>{_get(selectedUser, 'email')}</div>
							</div>
							<div className="title-content margin-top-bottom">
								<div>Receiver user ID:</div>
								<div>{_get(selectedUser, 'id')}</div>
							</div>
							<div className="title-content margin-top-bottom">
								<div>From last settlement:</div>
								<div>
									{earningsData[0] && earningsData[0].date
										? moment(earningsData[0].date).format('YYYY-MM-DD')
										: 'N/A'}
								</div>
							</div>
							<div className="title-content margin-top-bottom">
								<div>Until current todays date:</div>
								<div>{moment().format('YYYY-MM-DD')}</div>
							</div>
						</div>
						<div className="d-flex justify-content-around">
							<Button className="modal-button" onClick={toggleVisibility}>
								Back
							</Button>
							<Button
								className="modal-button"
								onClick={this.settleFee}
								disabled={buttonSubmitting}
							>
								Settle
							</Button>
						</div>
					</div>
				) : null}
			</div>
		);
	}
}
