import React, { Component } from 'react';
import { Table, Alert } from 'antd';
import { connect } from 'react-redux';

import './index.css';

import {
	requestDeposits,
	completeDeposits,
	dismissDeposit,
	requestDepositsDownload,
} from './actions';
import { renderRowContent, COLUMNS } from './utils';
import { Filters } from './Filters';

// import { Table, Button, Input, Select, Alert } from 'antd';
// import { renderRowContent, COLUMNS, SELECT_KEYS } from './utils';

// const InputGroup = Input.Group;
// const Option = Select.Option;
// const Search = Input.Search;

// const HEADERS = [
// 	{ label: 'Transaction id', key: 'transaction_id' },
// 	{ label: 'Type', key: 'type' },
// 	{ label: 'Amount', key: 'amount' },
// 	{ label: 'Currency', key: 'currency' },
// 	{ label: 'Time', key: 'created_at' }
// ];

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
		queryDone: JSON.stringify({}),
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	};

	componentWillMount() {
		const { initialData, queryParams = {} } = this.props;
		if (Object.keys(queryParams).length) {
			this.requestDeposits(
				initialData,
				queryParams,
				this.state.page,
				this.state.limit
			);
		} else {
			this.requestDeposits(initialData, {}, this.state.page, this.state.limit);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.queryParams.currency !== this.props.queryParams.currency ||
			nextProps.queryParams.type !== this.props.queryParams.type
		) {
			const { initialData, queryParams } = nextProps;
			this.requestDeposits(
				initialData,
				queryParams,
				this.state.page,
				this.state.limit
			);
			this.onRefresh(false);
		}
	}

	requestDeposits = (
		values = {},
		queryParams = this.props.queryParams,
		page = 1,
		limit = 50
	) => {
		if (Object.keys(queryParams).length === 0) {
			return this.setState({
				loading: false,
				fetched: false,
				queryParams: {},
			});
		}

		this.setState({
			loading: true,
			error: '',
			queryDone: JSON.stringify(queryParams),
		});

		requestDeposits({
			...values,
			...queryParams,
			page,
			limit,
		})
			.then((data) => {
				this.setState({
					deposits:
						page === 1 ? data.data : [...this.state.deposits, ...data.data],
					loading: false,
					fetched: true,
					page: page,
					currentTablePage: page === 1 ? 1 : this.state.currentTablePage,
					isRemaining: data.count > page * limit,
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message,
				});
			});
	};

	handleDownload = (
		values = this.props.initialData,
		queryParams = this.props.queryParams
	) => {
		return requestDepositsDownload({
			...values,
			...queryParams,
			format: 'csv',
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
						indexItem: -1,
					});
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					this.setState({
						loadingItem: false,
						error: message,
						indexItem: -1,
					});
				});
		}
	};

	dismissDeposit = (transaction_id, dismissed, indexItem) => () => {
		const { loadingItem, loading, dismissingItem } = this.state;
		if (!(dismissingItem || loadingItem || loading)) {
			this.setState({ dismissingItem: true, error: '', indexItem });
			dismissDeposit(transaction_id, dismissed)
				.then((data) => {
					const { deposits } = this.state;
					this.setState({
						deposits: [].concat(
							deposits.slice(0, indexItem),
							data,
							deposits.slice(indexItem + 1, deposits.length)
						),
						dismissingItem: false,
						indexItem: -1,
					});
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					this.setState({
						dismissingItem: false,
						error: message,
						indexItem: -1,
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
			...this.state.queryParams,
		};
		if (value) {
			queryParams[key] = value;
		} else {
			delete queryParams[key];
		}
		this.setState({ queryParams }, () => {});
	};

	onClickFilters = () => {
		this.requestDeposits({}, this.state.queryParams);
	};

	pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = this.state;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			this.requestDeposits(
				this.props.initialData,
				this.props.queryParams,
				page + 1,
				limit
			);
		}
		this.setState({ currentTablePage: count });
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
			queryDone,
			currentTablePage,
			pageSize,
		} = this.state;
		const { showFilters, coins } = this.props;

		const {
			hideUserColumn,
			queryParams: { currency, type },
		} = this.props;
		const columns = COLUMNS(currency, type);
		return (
			<div className="app_container-content admin-user-container">
				<div>
					{showFilters && (
						<Filters
							coins={coins}
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
					<div className="app-wrapper admin-user-container">
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

						<div>
							<span className="pointer" onClick={() => this.handleDownload()}>
								Download transactions
							</span>
						</div>
						<Table
							className="blue-admin-table"
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
													deposit.transaction_id,
													!deposit.dismissed,
													index
											  )
											: () => {},
									updatingItem: loadingItem && index === indexItem,
									dismissingItem: dismissingItem && index === indexItem,
								};
							})}
							expandedRowRender={renderRowContent}
							expandRowByClick={true}
							rowKey={(data) => {
								return data.id;
							}}
							pagination={{
								pageSize: pageSize,
								current: currentTablePage,
								onChange: this.pageChange,
							}}
						/>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(Transactions);
