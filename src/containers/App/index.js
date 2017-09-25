import React, { Component } from 'react';
import { connect } from 'react-redux'
import io from 'socket.io-client';
import { setOrderbook, addTrades } from '../../actions/orderbookAction'
import { WS_URL } from '../../config/constants'
import { checkUserSessionExpired } from '../../utils/utils';
import { logout } from '../../actions/authAction';

import { AppBar, Sidebar, Dialog } from '../../components';
import { ContactForm } from '../';

class Container extends Component {
	state = {
		dialogIsOpen: false,
	}

	componentWillMount() {
		if (checkUserSessionExpired(localStorage.getItem('time'))) {
			this.props.logout();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.fetchingAuth && nextProps.fetchingAuth !== this.props.fetchingAuth) {
			this.setPublicWS();
		}
	}

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

	goToPage = (path) => {
    this.props.router.push(path)
  }

  goToAccountPage = () => this.goToPage('/account');
	goToWalletPage = () => this.goToPage('/wallet');
	goToTradePage = () => this.goToPage('/trade');
  goToDashboard = () => this.goToPage('/');

	logout = () => this.props.logout();

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
	}

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false });
	}

	getClassForActivePath = (path) => {
		switch (path) {
			case '/wallet':
				return 'wallet';
			case '/account':
				return 'account';
			case '/trade':
				return 'trade';
			default:
				return '';
		}
	}

	render() {
		const { fetchingAuth, symbol } = this.props;
		const { dialogIsOpen } = this.state;

		if (this.props.fetchingAuth) {
			return <div className="app_container"></div>;
		}

		const activePath = this.getClassForActivePath(this.props.location.pathname);
		return (
			<div className={`app_container ${activePath} ${symbol}`}>
				<AppBar
					title={
						<div onClick={this.onOpenDialog}>exir-exchange</div>
					}
					goToAccountPage={this.goToAccountPage}
					goToDashboard={this.goToDashboard}
					acccountIsActive={activePath === 'account'}
				/>
        <div className="app_container-content">
          <div className="app_container-main">
            {this.props.children}
          </div>
          <div className="app_container-sidebar">
            <Sidebar
							goToAccountPage={this.goToAccountPage}
							goToWalletPage={this.goToWalletPage}
							goToTradePage={this.goToTradePage}
							logout={this.logout}
						/>
          </div>
        </div>
				<Dialog
					isOpen={dialogIsOpen}
					label="exir-modal"
					onCloseDialog={this.onCloseDialog}
				>
					<ContactForm onSubmitSuccess={this.onCloseDialog} />
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	orderbook: store.orderbook,
  symbol: store.orderbook.symbol,
	fetchingAuth: store.auth.fetching,
})

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
		addTrades: (trades) => dispatch(addTrades(trades)),
		setOrderbook: (orderbook) => dispatch(setOrderbook(orderbook))
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
