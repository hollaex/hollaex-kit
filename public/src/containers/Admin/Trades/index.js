import React, { Component } from 'react';
// import { requestTrades } from './actions';
// import { SubmissionError } from 'redux-form';
// import querystring from 'query-string';
// import { Spin, notification, Tabs } from 'antd';
// import { AdminHocForm } from '../../../components';

// import { requestUser, requestUserBalance } from './actions';

// import UserContent from './UserContent';
// import ListUsers from '../ListUsers/index';
import UserListTrades from './userListTrades';
// import { isSupport } from '../../../utils';
// import UserList from "../Main/userList";

// const INITIAL_STATE = {
// 	userInformation: {},
// 	userImages: {},
// 	loading: false
// };

// const Form = AdminHocForm('USER_REQUEST_FORM');

class Trades extends Component {
	componentWillMount() {
		// requestTrades(1)
		//
		// const { search } = this.props.location;
		// if (search) {
		//   const qs = querystring.parse(search);
		//   if (qs.id) {
		//     this.requestTrades(1);
		//   }
		// }
	}

	requestTrades(id) {}

	render() {
		return (
			<div className="app_container-content">
				{/*<h1>USERS TRADE HISTORY</h1>*/}
				{/*<h2>SEARCH FOR USER</h2>*/}
				{/*<Form*/}
				{/*onSubmit={()=>this.requestTrades(1)}*/}
				{/*buttonText="Search"*/}
				{/*fields={{*/}
				{/*id: {*/}
				{/*type: 'number',*/}
				{/*label: 'User Id',*/}
				{/*min: 1,*/}
				{/*max: 100000,*/}
				{/*validate: []*/}
				{/*},*/}
				{/*email: {*/}
				{/*type: 'eamil',*/}
				{/*label: 'Email',*/}
				{/*placeholder: 'Email',*/}
				{/*validate: []*/}
				{/*}*/}
				{/*}}*/}
				{/*initialValues={{ id: '0' }}*/}
				{/*/>*/}
				<h2 className="m-top">LIST OF USERS</h2>
				<UserListTrades />
			</div>
		);
	}
}

export default Trades;
