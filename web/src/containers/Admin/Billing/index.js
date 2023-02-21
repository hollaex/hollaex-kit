import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import GeneralContent from './generalContent';
import { getDashExchange, putDashExchange } from '../AdminFinancials/action';
import { setDashExchange } from 'actions/adminBillingActions';

const Billing = (props) => {
	const { dashExchange, user, setDashExchange } = props;

	useEffect(() => {
		getExchange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getExchange = async () => {
		const res = await getDashExchange();
		setDashExchange(res.data[0]);
	};

	const fiatPutExchange = async (body) => {
		try {
			await putDashExchange(body);
			await getExchange();
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error('Failed to update setup configs');
			}
		}
	};

	const putExchange = async (type = 'Cloud') => {
		let res = {};
		try {
			const exchangeBody = {
				id: dashExchange.id,
				info: {
					tech: { SERVER_TYPE: type },
				},
				type,
			};
			res = await putDashExchange(exchangeBody);
			await getExchange();
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error('Failed to update setup configs');
			}
		}
		return res;
	};

	return (
		<div className="app_container-content admin-earnings-container w-100 admin-billing">
			<GeneralContent
				dashExchange={dashExchange}
				user={user}
				putExchange={putExchange}
				fiatPutExchange={fiatPutExchange}
				getExchange={getExchange}
			/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		dashExchange: state.admin.dashExchange,
		user: state.user,
	};
};

export default connect(mapStateToProps, { setDashExchange })(Billing);
