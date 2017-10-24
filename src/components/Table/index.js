import React, { Component } from 'react';
import classnames from 'classnames';
import { IconTitle } from '../';

import Paginator from './paginator';

const RENDER_CELL = (row, key) => <td key={key}>{row[key]}</td>;

class Table extends Component{
  state = {
    page: 0,
    pageSize: 25,
    data: []
  }

  componentDidMount() {
    this.goToPage(0, this.props.data, this.props.count);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.data.length !== this.props.data.length) {
      this.goToPage(nextState.page, nextProps.data, nextProps.count);
    }
  }

  renderHeader = (headers = []) => (
    <thead className="table_header-wrapper">
      <tr className="table_header-row">
        {headers.map(({ label }, index) => <td key={index}>{label}</td>)}
      </tr>
    </thead>
  )

  renderRow = (headers = []) =>  (row, rowIndex) => (
    <tr className="table_body-row" key={`row_${rowIndex}`}>
      {headers.map(({ key, renderCell = RENDER_CELL }, cellIndex) => renderCell(row, key, cellIndex))}
    </tr>
  );

  renderBody = (headers = [], data = []) => (
    <tbody className={classnames(
      'table_body-wrapper',
      {
        'with_icon': this.props.withIcon || false,
      }
    )}>
      {data.map(this.renderRow(headers))}
    </tbody>
  );

  renderProps = ({ data, headers, count }) => {
    return (
      <div>
        <div>count: {count}</div>
        <div>headers: {JSON.stringify(headers)}</div>
        <div>data: {JSON.stringify(data)}</div>
      </div>
    )
  }

  renderFooter = () => {
    return (
      <tfoot className="table_footer-wrapper">
        <tr className="table_footer-row">
          <td>tf1</td>
          <td>tf2</td>
          <td>tf3</td>
          <td>tf4</td>
          <td>tf5</td>
        </tr>
      </tfoot>
    )
  }


  goToPreviousPage = () => {
    this.goToPage(this.state.page - 1, this.props.data, this.props.count);
  }

  goToNextPage = () => {
    this.goToPage(this.state.page + 1, this.props.data, this.props.count);
  }

  goToPage = (page = 0, allData = [], count = 0) => {
    const { pageSize } = this.state;
    const initItem = page * pageSize;
    if (initItem < count) {
      const data = allData.slice(initItem, initItem + pageSize);
      this.setState({ page, data });
    }

  }

  render() {
    const { headers } = this.props;
    const { data, page, pageSize } = this.state;
    const count = this.props.count || this.props.data.length;
    return (
      <div className="table_container">
        <table className={classnames('table-wrapper')}>
          {this.renderHeader(headers)}
          {this.renderBody(headers, data)}
        </table>
        <Paginator
          currentPage={page + 1}
          pageSize={pageSize}
          count={count}
          goToPreviousPage={this.goToPreviousPage}
          goToNextPage={this.goToNextPage}
        />
      </div>
    );
  }
}

Table.defaultProps = {
  data: [],
  headers: [],
  withIcon: false,
}
export default Table;
