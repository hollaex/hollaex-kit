import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import bitcoin from '../../utils/utils';

const mapDispatchToProps = dispatch => ({
    
})

class Account extends Component {
	render() {
		return (
			<div>
				{(this.props.user.balance)
					?
					<div>
						<p>Email: {this.props.user.email}</p>
						<p>Bitcoin balance: {bitcoin.toBTC(this.props.user.balance.btc_balance)}</p>
						<p>Toman balance: {this.props.user.balance.fiat_balance}</p>
					</div>
					:
					null
			}
			</div>
		);
	}
}

const mapStateToProps = (store, ownProps) => ({
	user: store.user
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);