import React, { Component } from 'react';
import { Spin, Card, Alert } from 'antd';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import { requestTotalBalance, requestConstants } from './actions';
import { formatCurrency } from '../../../utils';

class Wallets extends Component {
	state = {
		users: [],
		fetched: false,
		loading: false,
		error: '',
		showSweep: null,
		walletNum: null,
		constants: {},
	};

	componentWillMount() {
		this.requestTotalBalance();
		this.requestConstants();
		this.setState({ showSweep: false });
	}

	requestConstants = () => {
		this.setState({
			loading: true,
			error: '',
		});
		requestConstants()
			.then((res) => {
				this.setState({ loading: false, constants: res.kit });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message,
				});
			});
	};

	requestTotalBalance = () => {
		this.setState({
			loading: true,
			error: '',
		});

		requestTotalBalance()
			.then((res) => {
				this.setState({
					balance: res,
					loading: false,
					fetched: true,
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

	goToVault = () => {
		this.props.router.push('/admin/plugins/vault');
	};

	render() {
		const { balance, loading, error } = this.state;
		return (
			<div className="app_container-content">
				{error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
					/>
				)}
				{loading ? (
					<Spin size="large" />
				) : (
					<div style={{ width: '60%' }} className="admin-user-container">
						{error && <p>-{error}-</p>}
						<div className="d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center">
								<ReactSVG
									src={STATIC_ICONS['USER_SECTION_WALLET']}
									className="admin-wallet-icon"
								/>
								<h1>USER WALLETS</h1>
							</div>
						</div>
						<Card className="card-title" title="TOTAL BALANCE OF USERS WALLETS">
							{!balance ? (
								<Alert
									message="Error"
									className="m-top"
									description={error}
									type="error"
									showIcon
								/>
							) : (
								Object.entries(balance).map(([name, value]) => {
									return (
										<p key={name}>
											{name.toUpperCase()} : {formatCurrency(value)}
										</p>
									);
								})
							)}
						</Card>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

export default connect(mapStateToProps)(Wallets);
