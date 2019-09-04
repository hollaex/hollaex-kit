import React, { Component } from 'react';
import { Table, Alert } from 'antd';

import './index.css';

import { requestDeposits, completeDeposits, dismissDeposit } from './actions';
import { renderRowContent, COLUMNS } from './utils';
import { Filters } from './Filters';
import { CSVLink } from 'react-csv';

// import { Table, Button, Input, Select, Alert } from 'antd';
// import { renderRowContent, COLUMNS, SELECT_KEYS } from './utils';

// const InputGroup = Input.Group;
// const Option = Select.Option;
// const Search = Input.Search;

const HEADERS = [
	{ label: 'Transaction id', key: 'transaction_id' },
	{ label: 'Type', key: 'type' },
	{ label: 'Amount', key: 'amount' },
	{ label: 'Currency', key: 'currency' },
	{ label: 'Time', key: 'created_at' }
];

class Transactions extends Component {
	state = {
		deposits: [],
		fetched: false,
		loading: true,
		loadingItem: false,
		dismissingItem: false,
		// searchValue: '',
		error: '',
		indexItem: -1,
		searchKey: 'transaction_id',
		queryParams: {},
		queryDone: JSON.stringify({})
	};

	componentWillMount() {
		const { initialData } = this.props;
		this.requestDeposits(initialData);
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.queryParams.currency !== this.props.queryParams.currency ||
			nextProps.queryParams.type !== this.props.queryParams.type
		) {
			const { initialData, queryParams } = nextProps;
			this.requestDeposits(initialData, queryParams);
			this.onRefresh(false);
		}
	}

	requestDeposits = (values = {}, queryParams = this.props.queryParams) => {
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
			queryDone: JSON.stringify(queryParams)
		});

		requestDeposits({
			...values,
			...queryParams
		})
			.then((data) => {
				this.setState({
					deposits: data.data ? data.data : data,
					loading: false,
					fetched: true
				});
			})
			.catch((error) => {
				console.log(error.data);
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
			completeDeposits({ transaction_id, status: true })
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
					console.log(error.data);
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
					console.log(error.data);
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
		console.log('onSelect', value, option);
		this.setState({ searchKey: value });
	};

	onSearch = (value) => {
		console.log('onSearch', value);
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
		this.setState({ queryParams }, () => {
			console.log(this.state.queryParams);
		});
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
			// searchValue,
			dismissingItem,
			loadingItem,
			queryParams,
			queryDone
		} = this.state;
		const { showFilters } = this.props;

		const {
			hideUserColumn,
			queryParams: { currency, type }
		} = this.props;
		const columns = COLUMNS(currency, type);
		return (
			<div className="app_container-content">
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
				{loading ? (
					<div />
				) : (
					<div className="app-wrapper">
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

						{console.log(deposits)}

						<CSVLink data={deposits} headers={HEADERS}>
							Download transactions
						</CSVLink>
						<Table
							columns={hideUserColumn ? columns.slice(1) : columns}
							dataSource={deposits.map((deposit, index) => {
								return {
									...deposit,
									completeDeposit:
										index !== indexItem
											? this.completeDeposit(deposit.transaction_id, index)
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

export default Transactions;
