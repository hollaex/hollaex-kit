import React from 'react';
import { connect } from 'react-redux';
import math from 'mathjs';
import { formatBtcAmount, formatFiatAmount } from '../../utils/string';
import DisplayTable from './DisplayTable';
import { cancelOrder, cancelAllOrders } from '../../actions/orderAction'

const Header = ({ cancelAll }) => (
	<thead>
		<tr style={{borderBottom:'3px solid #81868a'}}>
			<td className="text-left">Type</td>
			<td>Amount(BTC)</td>
			<td>Filled(BTC)</td>
			<td>Unfilled amount</td>
			<td>OrderPrice(USD)</td>
			<td>Total order amount(USD)</td>
			<td><div onClick={cancelAll}>Cancel All</div></td>
		</tr>
	</thead>
);

const Body = ({ data = [], cancelOrder }) => {
	return (
		<tbody>
			{data.map((item, index) => {
				return (
					<tr
						key={`data-row-${index}`}
						className={item.side === 'buy' ? 'table-success' : 'table-danger'}
					>
						<td className="text-left">{item.side.toUpperCase()}</td>
						<td>{formatBtcAmount(item.size)}</td>
						<td>{formatBtcAmount(item.filled)}</td>
						<td>{formatBtcAmount(math.chain(item.size).subtract(item.filled).done())}</td>
						<td>${formatFiatAmount(item.price)}</td>
						<td>${formatFiatAmount(math.chain(item.price).multiply(item.size).done())}</td>
						<td><div onClick={() => cancelOrder(item.id)}>Cancell</div></td>
					</tr>
				)
			})}
		</tbody>
	);
}

const OpenOrders = ({ cancelAll, cancelOrder, orders }) => {
	return (
		<DisplayTable
			data={orders}
			header={<Header cancelAll={cancelAll} />}
			body={<Body cancelOrder={cancelOrder} />}
		/>
	);
}

const mapDispatchToProps = (dispatch) => ({
  cancelAll: () => dispatch(cancelAllOrders()),
  cancelOrder: (id) => dispatch(cancelOrder(id)),
});

const mapStateToProps = (state) => ({
	orders: state.order.activeOrders,
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenOrders);
