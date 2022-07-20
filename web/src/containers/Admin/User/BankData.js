import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError, reset } from 'redux-form';
import { addBankData, approveBank, rejectBank } from './actions';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import {
	Card,
	Button,
	Input,
	Popconfirm,
	message,
	Col,
	Row,
	Modal,
} from 'antd';
import { ModalForm } from '../../../components';
import { validateRequired } from 'components/AdminForm/validations';
import { status } from '../../../components/CheckTitle';
import { requestPlugin } from 'actions/appActions';

const Form = ModalForm('BANK_DATA', 'bank_data');
const MethodForm = ModalForm('PAYMENT_METHOD', 'bank_data');

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
			isVisible: false,
			bankData: {},
			method: undefined,
			methodFormVisible: false,
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
		this.getPlugin();
	}

	onCancel = () => {
		this.resetForms();
		this.setState({
			formVisible: false,
			methodFormVisible: false,
			method: undefined,
		});
	};

	onSubmit = (onChangeSuccess, bank, userId, type) => (values) => {
		const { ultimate_fiat, pluginNames } = this.props;

		let bank_account = [...bank];
		values.id = values.account_number + '-man';
		values.status = 3;

		if (!pluginNames.bank && ultimate_fiat) {
			values.type = type;
		}

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

	resetForms = () => {
		const { dispatch } = this.props;
		dispatch(reset('PAYMENT_METHOD'));
		dispatch(reset('BANK_DATA'));
	};

	showModal = () => {
		const {
			pluginNames: { bank },
			ultimate_fiat,
		} = this.props;

		if (!bank && ultimate_fiat) {
			this.setState({ methodFormVisible: true });
		} else {
			this.setState({ formVisible: true });
		}
	};

	closeModal = () => {
		this.resetForms();
		this.setState({ formVisible: false, method: undefined });
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
				const msg = err.data ? err.data.message : err.message;
				message.error(msg);
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
				this.setState({ bank: newBanks, isVisible: false });
			})
			.catch((err) => {
				const msg = err.data ? err.data.message : err.message;
				message.error(msg);
				this.setState({ isVisible: false });
				// throw new SubmissionError({ _error: err.data.message });
			});
	};

	getPlugin = () => {
		const {
			pluginNames: { bank },
		} = this.props;
		requestPlugin({ name: bank })
			.then((res) => {
				if (res.data) {
					this.setState({ bankData: res.data });
				}
			})
			.catch((err) => {
				console.log('err', err);
			});
	};

	handleOpenModal = () => {
		this.setState({ isVisible: true });
	};

	handleClose = () => {
		this.setState({ isVisible: false });
	};

	renderLabel = (data) => {
		let text = data;
		if (data.includes('_')) {
			text = text.replace(/_/g, ' ');
			text = text.split(' ');
			text =
				text[0].replace(/^./, function (str) {
					return str.toUpperCase();
				}) +
				' ' +
				text[1].replace(/^./, function (str) {
					return str.toUpperCase();
				});
		} else {
			text = text.replace(/^./, function (str) {
				return str.toUpperCase();
			});
		}
		return text;
	};

	getPaymentFields = (method) => {
		const { user_payments } = this.props;
		const fields = {};

		if (user_payments && user_payments[method] && user_payments[method].data)
			user_payments[method].data.forEach(
				({ key, label, placeholder, required }) => {
					fields[key] = {
						type: 'text',
						label: label || key,
						placeholder: placeholder || label || key,
						validate: required ? [validateRequired] : [],
					};
				}
			);

		return fields;
	};

	getFields = () => {
		const {
			bankData: { public_meta },
			method,
		} = this.state;
		const {
			pluginNames: { bank },
			ultimate_fiat,
		} = this.props;

		// This will be deprecated and ultimate fiat will supersede bank plugin
		if (!bank && ultimate_fiat) {
			return this.getPaymentFields(method);
		}

		const fields = {};
		if (public_meta) {
			Object.entries(public_meta).forEach(([key, data]) => {
				if (typeof data === 'object') {
					if (data.value) {
						fields[key] = {
							type: 'text',
							label: this.renderLabel(key),
							placeholder: this.renderLabel(key),
						};

						if (data.required) {
							fields[key].validate = [validateRequired];

							//FIXME: This is to make pay_id field optional in the aussie bank
							if (bank === 'aussie-bank' && key === 'pay_id') {
								delete fields[key].validate;
							}
						}
					}
				} else {
					fields[key] = {
						type: 'text',
						label: key,
						placeholder: key,
					};
				}
			});
		}

		return fields;
	};

	getMethods = () => {
		const { user_payments } = this.props;
		const options = Object.keys(user_payments).map((key) => ({
			value: key,
			label: key,
		}));
		const fields = {};

		fields['method'] = {
			type: 'select',
			label: 'Payment Method',
			placeholder: 'Select payment method',
			validate: [validateRequired],
			options,
		};

		return fields;
	};

	onSubmitMethod = ({ method }) => {
		this.resetForms();
		this.setState({ method, methodFormVisible: false, formVisible: true });
	};

	render() {
		const { bank, formVisible, userId, methodFormVisible, method } = this.state;
		const { onChangeSuccess } = this.props;

		return (
			<Row>
				<Button
					onClick={this.showModal}
					type="primary"
					icon={<PlusCircleOutlined />}
					size="small"
				>
					Add bank
				</Button>

				<Form
					onSubmit={this.onSubmit(onChangeSuccess, bank, userId, method)}
					onCancel={this.onCancel}
					title="Add a new bank"
					fields={this.getFields()}
					visible={formVisible}
					destroyOnClose={true}
				/>

				<MethodForm
					onSubmit={this.onSubmitMethod}
					onCancel={this.onCancel}
					title="Select a payment method"
					fields={this.getMethods()}
					visible={methodFormVisible}
					destroyOnClose={true}
				/>

				<Row gutter={16}>
					{bank.map((bank, index) => {
						return (
							<Col style={{ margin: '1em' }} key={index}>
								<Card
									key={bank.id || bank.bank_name}
									title={[
										<div>
											<p>
												<b>Id:</b> {bank.id}
											</p>
											<p>
												<b>Status:</b> {status(bank.status)}
											</p>
										</div>,
									]}
									extra={
										bank.status === 1 ? (
											<div
												style={{ width: '16em', display: 'flex' }}
												className="mb-3"
											>
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
												<div className="ml-3">
													<Button
														onClick={this.handleOpenModal}
														type="danger"
														icon={<CloseOutlined />}
														// size={10}
													>
														Reject
													</Button>
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
									{Object.keys(bank).map((data, index) => {
										if (data !== 'id' && data !== 'status') {
											return (
												<p key={index}>
													<b>{this.renderLabel(data)}:</b> {bank[data]}
												</p>
											);
										} else {
											return null;
										}
									})}
								</Card>
								<Modal
									visible={this.state.isVisible}
									title="Reject Bank"
									onCancel={this.handleClose}
									onOk={() =>
										this.rejectBank({
											user_id: userId,
											bank_id: bank.id,
											message: this.state.note,
										})
									}
								>
									{this.state.isVisible ? (
										<div>
											<div>Notes</div>
											<Input.TextArea
												rows={4}
												value={this.state.note}
												onChange={this.handleNoteChange}
											/>
										</div>
									) : null}
								</Modal>
							</Col>
						);
					})}
				</Row>
			</Row>
		);
	}
}

const mapStateToProps = ({
	app: {
		pluginNames,
		user_payments,
		features: { ultimate_fiat },
	},
}) => ({
	pluginNames,
	user_payments,
	ultimate_fiat,
});

export default connect(mapStateToProps)(BankData);
