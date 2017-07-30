import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';;

const mapDispatchToProps = dispatch => ({
    
})

class Deposit extends Component {
	render() {
		return (
			<div>
				<p>Deposit Bitcoin address: {this.props.user.crypto_wallet.bitcoin}</p>
			</div>
		);
	}
}

const mapStateToProps = (store, ownProps) => ({
	user: store.user
})

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);