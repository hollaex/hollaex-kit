import React, { Component } from 'react';
import { connect } from 'react-redux'
import io from 'socket.io-client';
import { setOrderbook, addTrades } from '../../actions/orderbookAction'
import { WS_URL } from '../../config/constants'
import { checkUserSessionExpired } from '../../utils/utils';
import { logout } from '../../actions/authAction';

import { AppBar, Sidebar } from '../../components';

class Container extends Component {

	componentWillMount() {
		if (checkUserSessionExpired(localStorage.getItem('time'))) {
			this.props.logout();
		} else {
			this.setPublicWS();
		}
	}

  setActiveAccount

	setPublicWS = () => {
		const { symbol } = this.props;
		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				symbol,
			}
		});

		publicSocket.on('orderbook', (data) => {
			console.log('orderbook', data)
			this.props.setOrderbook(data[symbol])
		});

		publicSocket.on('trades', (data) => {
			console.log('trades', data[symbol])
			if (data[symbol].length > 0) {
				this.props.addTrades(data[symbol]);
			}
		});
	}

  goToAccountPage = () => {
    this.props.router.push('/account')
  }

	logout = () => this.props.logout();

	render() {
		if (this.props.fetchingAuth) {
			return <div className="app_container"></div>;
		}
		return (
			<div className="app_container">
				<AppBar user={this.props.user} goToAccountPage={this.goToAccountPage}/>
        <div className="app_container-content">
          <div className="app_container-main">
            {/*this.props.children*/}
            asdasd
          </div>
          <div className="app_container-sidebar">
            <Sidebar logout={this.logout}  />
          </div>
        </div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	orderbook: store.orderbook,
  symbol: store.orderbook.symbol,
	user: store.user,
	fetchingAuth: store.auth.fetching
})

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
		addTrades: (trades) => dispatch(addTrades(trades)),
		setOrderbook: (orderbook) => dispatch(setOrderbook(orderbook))
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
