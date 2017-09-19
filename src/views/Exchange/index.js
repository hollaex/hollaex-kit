import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navbar from './Navbar'

class Exchange extends Component {

	render() {	
		return (
			<div className="">
				<Navbar />
				{this.props.children}
			</div>
		);
	}
}

export default Exchange;
