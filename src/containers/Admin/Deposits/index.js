import React, { Component } from 'react';
import { Table, Spin, Button, Input, Select, Alert } from 'antd';
import { CSVLink } from 'react-csv';

import './index.css';

import { requestDeposits, completeDeposits, dismissDeposit } from './actions';
import { renderRowContent, COLUMNS, SELECT_KEYS } from './utils';
import { Filters } from './Filters';

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
const HEADERS = [
	{ label: 'Type', dataIndex: 'type', key: 'type' },
	{ label: 'User ID', dataIndex: 'user_id', key: 'user_id' },
	{ label: 'Currency', dataIndex: 'currency', key: 'currency' },
	{ label: 'Amount', dataIndex: 'amount', key: 'amount' },
	{ label: 'Fee', dataIndex: 'fee', key: 'fee' },
	{ label: 'Address', dataIndex: 'address', key: 'address' },
	{
		label: 'Transaction ID',
		dataIndex: 'transaction_id',
		key: 'transaction_id'
	},
	{ label: 'Time', dataIndex: 'created_at', key: 'created_at' }
];

class Deposits extends Component {
	state = {
		deposits: [],
		fetched: false,
		loading: true,
		loadingItem: false,
		dismissingItem: false,
		error: '',
		indexItem: -1,
		searchKey: 'transaction_id',
		searchValue: '',
		queryParams: {},
		queryDone: JSON.stringify({}),
		type: ''
	};

	componentWillMount() {
		const { initialData } = this.props;
		this.requestDeposits(initialData);
	}

	componentWillReceiveProps(nextProps) {
		// if (
		// 	nextProps.queryParams.currency !== this.props.queryParams.currency ||
		// 	nextProps.queryParams.type !== this.props.queryParams.type
		// ) {
		// 	const { initialData, queryParams } = nextProps;
		// 	this.requestDeposits(initialData, queryParams);
		// 	this.onRefresh(false);
		// }
	}

	requestDeposits = (values = {}, queryParams = { type: 'deposits' }) => {
		if (Object.keys(queryParams).length === 0) {
			return this.setState({
				loading: false,
				fetched: false,
				queryParams: {}
			});
		}

		this.setState({
			loading: true,
			error: '',
			queryDone: JSON.stringify(queryParams),
			queryType: queryParams.type
		});

		requestDeposits({
			...values,
			...queryParams
		})
			.then((data) => {
				this.setState({
					deposits: data.data,
					loading: false,
					fetched: true
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message
				});
			});
	};

	completeDeposit = (transaction_id, indexItem) => () => {
		const { loadingItem, loading, dismissingItem } = this.state;
		if (!(dismissingItem || loadingItem || loading)) {
			this.setState({ loadingItem: true, error: '', indexItem });
			completeDeposits(transaction_id, true)
				.then((data) => {
					const { deposits } = this.state;
					this.setState({
						deposits: [].concat(
							deposits.slice(0, indexItem),
							data,
							deposits.slice(indexItem + 1, deposits.length)
						),
						loadingItem: false,
						indexItem: -1
					});
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					this.setState({
						loadingItem: false,
						error: message,
						indexItem: -1
					});
				});
		}
	};

	dismissDeposit = (deposit_id, dismissed, indexItem) => () => {
		const { loadingItem, loading, dismissingItem } = this.state;
		if (!(dismissingItem || loadingItem || loading)) {
			this.setState({ dismissingItem: true, error: '', indexItem });
			dismissDeposit(deposit_id, dismissed)
				.then((data) => {
					const { deposits } = this.state;
					this.setState({
						deposits: [].concat(
							deposits.slice(0, indexItem),
							data,
							deposits.slice(indexItem + 1, deposits.length)
						),
						dismissingItem: false,
						indexItem: -1
					});
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					this.setState({
						dismissingItem: false,
						error: message,
						indexItem: -1
					});
				});
		}
	};
	onSelect = (value, option) => {
		this.setState({ searchKey: value });
	};

	onSearch = (value) => {
		if (value) {
			this.setState({ searchValue: value.trim() });
			const values = {};
			values[this.state.searchKey] = value.trim();
			const queryParams = { ...this.props.queryParams };
			delete queryParams.dismissed;
			delete queryParams.status;
			this.requestDeposits(values, queryParams);
		}
	};

	onRefresh = (requestData = true) => {
		const { initialData } = this.props;
		this.setState({ searchValue: '', searchKey: 'transaction_id' });
		if (requestData) {
			this.requestDeposits(initialData);
		}
	};

	onCloseErrorAlert = () => {
		this.setState({ error: '' });
	};

	onChangeQuery = (key) => (value, option) => {
		const queryParams = {
			...this.state.queryParams
		};
		if (value) {
			queryParams[key] = value;
		} else {
			delete queryParams[key];
		}
		this.setState({ queryParams });
	};

	onClickFilters = () => {
		this.requestDeposits({}, this.state.queryParams);
	};

	render() {
		const {
			deposits,
			loading,
			fetched,
			error,
			indexItem,
			searchValue,
			dismissingItem,
			loadingItem,
			queryParams,
			queryDone,
			queryType
		} = this.state;
		const { showFilters } = this.props;
		const columns = COLUMNS(undefined);
		return (
			<div>
				{loading ? (
					<Spin size="large" />
				) : (
					<div className="app-wrapper">
						<h1 className="upperCase">{queryType}</h1>
						<div>
							{showFilters && (
								<Filters
									onChange={this.onChangeQuery}
									onClick={this.onClickFilters}
									hasChanges={queryDone !== JSON.stringify(queryParams)}
									params={queryParams}
									loading={loading}
									fetched={fetched}
								/>
							)}
						</div>
						{!showFilters && (
							<div className="controls-wrapper">
								<div className="controls-search">
									<div>
										Press enter or click on the search icon to perform a search
									</div>
									<InputGroup compact>
										<Select
											defaultValue={this.state.searchKey}
											style={{ width: '25%' }}
											onSelect={this.onSelect}
										>
											{SELECT_KEYS(undefined).map(({ value, label }, index) => (
												<Option value={value} key={index}>
													{label}
												</Option>
											))}
										</Select>
										<Search style={{ width: '75%' }} onSearch={this.onSearch} />
									</InputGroup>
								</div>
								<div className="controls-refresh">
									<Button
										onClick={this.onRefresh}
										type="primary"
										icon="sync"
										disabled={!searchValue}
									>
										Refresh Data
									</Button>
								</div>
							</div>
						)}

						{error && (
							<Alert
								message={error}
								type="error"
								showIcon
								onClose={this.onCloseErrorAlert}
								closable={true}
								closeText="Close"
							/>
						)}
						<CSVLink
							filename={'deposit/withdrawal.csv'}
							data={deposits}
							headers={HEADERS}
						>
							Download table
						</CSVLink>
						<Table
							columns={columns}
							dataSource={deposits.map((deposit, index) => {
								return {
									...deposit,
									completeDeposit:
										index !== indexItem
											? this.completeDeposit(deposit.id, index)
											: () => {},
									dismissDeposit:
										index !== indexItem
											? this.dismissDeposit(
													deposit.id,
													!deposit.dismissed,
													index
											  )
											: () => {},
									updatingItem: loadingItem && index === indexItem,
									dismissingItem: dismissingItem && index === indexItem
								};
							})}
							expandedRowRender={renderRowContent}
							expandRowByClick={true}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default Deposits;
