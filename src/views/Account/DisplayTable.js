import React, { Component } from 'react';

import Pagination from './Pagination';

class DisplayTable extends Component {
	state = {
		currentPage: 1,
		dataPerPage: 5,
		pages: 0,
	};

	componentWillMount() {
		this.setPages(this.props.data.length, this.state.dataPerPage);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.count !== this.props.count) {
			this.setPages(nextProps.count, this.state.dataPerPage);
		}
	}

	setPages = (numberOfItems = 0, itemsPerPage = 10) => {
		const pages = Math.ceil(numberOfItems / itemsPerPage);
		this.setState({ pages });

	}

	setCurrentPage = (currentPage = 1) => {
		this.setState({ currentPage });
	}

	render() {
		const { header, body, data, title } = this.props;
		const { currentPage, dataPerPage, pages } = this.state;

		const indexOfLastOrder = currentPage * dataPerPage;
		const indexOfFirstOrder = indexOfLastOrder - dataPerPage;

		const currentData = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const modifiedBody = React.cloneElement(body, {
      data: currentData
    });

		return (
			<div className='col-lg-10 offset-lg-1 '>
				{title && <h4>{title}</h4>}
				<div className='tableView'>
					<table className='table text-right'>
						{header}
						{modifiedBody}
					</table>
				</div>
				{pages > 0 &&
					<Pagination
						currentPage={currentPage}
						pageLength={pages}
						handleClick={this.setCurrentPage}
						handleNext={() => this.setCurrentPage(currentPage + 1)}
						handlePrevious={() => this.setCurrentPage(currentPage - 1)}
						handleFirst={() => this.setCurrentPage(1)}
						handleLast={() => this.setCurrentPage(pages)}
					/>
				}
			</div>
		);
	}
}

export default DisplayTable;
