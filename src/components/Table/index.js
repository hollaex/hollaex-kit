import React, { Component } from 'react';
import classnames from 'classnames';

import TableHeader from './TableHeader';
import TableBody from './TableBody';
// import TableFooter from './TableFooter';
import Paginator from './paginator';

class Table extends Component {
	state = {
		page: 0,
		// pageSize: 10,
		data: []
	};

	componentDidMount() {
		// this.setPageSize(this.props.pageSize);
		this.goToPage(0, this.props.data, this.props.count);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data.length !== this.props.data.length) {
			this.goToPage(this.state.page, nextProps.data, nextProps.count);
		} else {
			this.goToPage(0, nextProps.data, nextProps.count);
		}
	}

	// setPageSize = (pageSize = 10) => {
	//   this.setState({ pageSize });
	// }

	goToPreviousPage = () => {
		this.goToPage(this.state.page - 1, this.props.data, this.props.count);
	};

	goToNextPage = () => {
		this.goToPage(this.state.page + 1, this.props.data, this.props.count);
	};

	goToPage = (page = 0, allData = [], count = 0) => {
		const { showAll, pageSize } = this.props;
		const initItem = page * pageSize;
		if (showAll) {
			this.setState({ page: 1, data: allData });
		} else if (initItem < count) {
			const data = allData.slice(initItem, initItem + pageSize);
			this.setState({ page, data });
		}
	};

	render() {
		const count = this.props.count || this.props.data.length;

		if (count === 0) {
			return (
				<div className="d-flex justify-content-center align-items-center">
					NO DATA
				</div>
			);
		}

		const { headers, withIcon, displayPaginator, pageSize } = this.props;
		const { data, page } = this.state;

		return (
			<div className="table_container">
				<table className={classnames('table-wrapper')}>
					<TableHeader headers={headers} />
					<TableBody headers={headers} data={data} withIcon={withIcon} />
				</table>
				{displayPaginator && (
					<Paginator
						currentPage={page + 1}
						pageSize={pageSize}
						count={count}
						goToPreviousPage={this.goToPreviousPage}
						goToNextPage={this.goToNextPage}
					/>
				)}
			</div>
		);
	}
}

Table.defaultProps = {
	data: [],
	headers: [],
	withIcon: false,
	pageSize: 10,
	displayPaginator: true,
	showAll: false
};

export default Table;
