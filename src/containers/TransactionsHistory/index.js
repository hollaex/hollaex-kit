import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { getUserTrades } from '../../actions/walletActions';
import { fiatSymbol } from '../../utils/currency';

import { ActionNotification, IconTitle, Table, CsvDownload } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';

import {
  TITLE, TEXT_DOWNLOAD
} from './constants';

import { generateHeaders } from './utils';

class TransactionsHistory extends Component {
  state = {
    headers: [],
    page: 0,
    pageSize: 25,
  }

  componentDidMount() {
    this.generateHeaders(this.props.symbol);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol) {
      this.generateHeaders(nextProps.symbol);
    }
  }

  generateHeaders(symbol) {
    this.props.getUserTrades(symbol);
    this.setState({ headers: generateHeaders(symbol) });
    this.setState({ headers: {
      trades: generateHeaders(symbol),
    }});
  }

  renderContent = ({ data, count, loading }, headers) => {
    if (loading) {
      return <div>LOADING</div>
    }

    return (
      <Table
        data={data}
        count={count}
        headers={headers}
        withIcon={true}
      />
    );
  }

  renderExportToCsv = (headers, data, filename) => {
    return (
      <CsvDownload
        data={data}
        headers={headers}
        filename={filename}
      >
        <ActionNotification
          text={TEXT_DOWNLOAD}
          iconPath={ICONS.LETTER}
        />
      </CsvDownload>
    );
  }

  renderBlock = (symbol, title, headers, data) => (
    <div>
      <div className="title text-capitalize">
        {title}
        {data.count > 0 && this.renderExportToCsv(headers, data.data, `${symbol}-transactions_history`)}
      </div>
      {symbol === fiatSymbol ?
        <div>No trades for {fiatSymbol}</div> :
        this.renderContent(data, headers)
      }
    </div>
  )

  render() {
    const { id, trades, symbol } = this.props;
    const { headers } = this.state;

    if (!id) {
      return <div></div>;
    }

    const { name } = CURRENCIES[symbol];

    return (
      <div className="presentation_container">
        <IconTitle
          text={TITLE}
          iconPath={ICONS.LETTER}
          textType="title"
        />
        <div className={classnames('inner_container', 'with_border_top')}>
          {this.renderBlock(symbol, `${name} ${TITLE}`, headers.trades, trades)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  id: store.user.id,
  trades: store.wallet.trades,
  symbol: store.orderbook.symbol,
});

const mapDispatchToProps = (dispatch) => ({
  getUserTrades: (symbol) => dispatch(getUserTrades({ symbol })),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsHistory);
