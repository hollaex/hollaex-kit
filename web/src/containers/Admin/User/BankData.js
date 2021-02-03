import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { addBankData, approveBank, rejectBank } from './actions';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import { Card, Button, Input, Popconfirm, message, Col, Row } from 'antd';
import { ModalForm } from '../../../components';

const Form = ModalForm('BANK_DATA', 'bank_data');

const BankFields = {
	bank_name: {
		type: 'text',
		label: 'Bank Name',
	},
	account_number: {
		type: 'text',
		label: 'Account Number',
	},
};

const Fields = {
	...BankFields,
};

// const generateInitialValues = (initialValues) => {
// 	const values = {
// 		...initialValues
// 	};
// 	return values;
// };

class BankData extends Component {
	constructor() {
		super();
		this.state = {
			bank: [],
			formVisible: false,
			note: '',
		};
	}

	componentWillMount() {
		let bank = [];
		if (
			this.props.initialValues.bank_account &&
			this.props.initialValues.bank_account.length > 0 &&
			this.props.initialValues.bank_account[0].bank_name !== ''
		) {
			bank = this.props.initialValues.bank_account;
		}
		this.setState({
			bank,
			userId: this.props.initialValues.id,
		});
	}

	onCancel = () => {
		this.setState({ formVisible: false });
	};

	onSubmit = (onChangeSuccess, bank, userId) => (values) => {
		let bank_account = [...bank];
		values.id = values.account_number + '-man';
		values.status = 3;
		bank_account = [...bank_account, values];
		const submitData = {
			id: userId,
			bank_account,
		};
		return addBankData(submitData)
			.then((data) => {
				this.closeModal();
				if (onChangeSuccess) {
					onChangeSuccess({
						...this.props.initialValues,
						...submitData,
					});
				}
				this.setState({ bank: data });
			})
			.catch((err) => {
				message.error('error');
				throw new SubmissionError({
					_error: err && err.data ? err.data.message : err.message,
				});
			});
	};

	showModal = () => {
		this.setState({ formVisible: true });
	};
	closeModal = () => {
		this.setState({ formVisible: false });
	};

	handleNoteChange = (event) => {
		this.setState({ note: event.target.value });
	};

	deleteBank = (id) => {
		const { bank, userId } = this.state;
		const newBanks = bank.filter((b) => {
			return b.id !== id;
		});
		const submitData = {
			id: userId,
			bank_account: newBanks,
		};
		addBankData(submitData)
			.then((data) => {
				message.success('Bank deleted');
				this.setState({ bank: newBanks });
			})
			.catch((err) => {
				message.error('error');
				// throw new SubmissionError({ _error: err.data.message });
			});
	};

	approveBank = (values) => {
		// const newBanks = this.state.bank.filter((b) => {
		// 	return b.id !== values.bank_id;
		// });
		approveBank(values)
			.then((data) => {
				this.setState({ bank: data });
				message.success('Bank approved');
			})
			.catch((err) => {
				message.error('error');
				// throw new SubmissionError({ _error: err.data.message });
			});
	};

	rejectBank = (values) => {
		rejectBank(values)
			.then((data) => {
				const newBanks = this.state.bank.filter((b) => {
					return b.id !== values.bank_id;
				});
				message.success('Bank rejected');
				this.setState({ bank: newBanks });
			})
			.catch((err) => {
				message.error('error');
				// throw new SubmissionError({ _error: err.data.message });
			});
	};

	render() {
		const { bank, formVisible, userId } = this.state;
		const { onChangeSuccess } = this.props;
		let disabled = false;
		return (
			<Row>
				{bank && bank.length <= 3 ? (disabled = false) : (disabled = true)}
				<Button
					disabled={disabled}
					onClick={() => this.showModal()}
					type="primary"
					icon={<PlusCircleOutlined />}
					size="small"
				>
					Add bank
				</Button>
				<Form
					onSubmit={this.onSubmit(onChangeSuccess, bank, userId)}
					onCancel={this.onCancel}
					title="Add a new bank"
					fields={Fields}
					visible={formVisible}
				/>
				<Row gutter={16}>
					{bank.map((bank, index) => {
						return (
							<Col style={{ margin: '1em' }} key={index}>
								<Card
									key={bank.id || bank.bank_name}
									title={bank.bank_name}
									extra={
										bank.status === 1 ? (
											<div style={{ width: '10em' }}>
												<div>
													<Button
														onClick={() =>
															this.approveBank({
																user_id: userId,
																bank_id: bank.id,
															})
														}
														type="primary"
														className="green-btn"
														icon={<CheckOutlined />}
														// size={10}
													>
														Accept
													</Button>
												</div>
												<div>
													<Button
														onClick={() =>
															this.rejectBank({
																user_id: userId,
																bank_id: bank.id,
																message: this.state.note,
															})
														}
														type="danger"
														icon={<CloseOutlined />}
														// size={10}
													>
														Reject
													</Button>
													<Input.TextArea
														rows={4}
														value={this.state.note}
														onChange={this.handleNoteChange}
													/>
												</div>
											</div>
										) : (
											<Popconfirm
												title="Are you sure delete this task?"
												onConfirm={() => this.deleteBank(bank.id)}
												okText="Yes"
												cancelText="No"
											>
												<DeleteOutlined
													style={{
														fontSize: '20px',
														color: '#08c',
													}}
												/>
											</Popconfirm>
										)
									}
									style={{ width: 300 }}
								>
									<p>{bank.bank_name}</p>
									<p>{bank.account_number}</p>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Row>
		);
	}
}

export default BankData;
