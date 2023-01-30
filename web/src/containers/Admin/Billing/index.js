import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { message, Tabs } from 'antd';
import GeneralContent from './generalContent';
import { getDashExchange, putDashExchange } from '../AdminFinancials/action';
import { setDashExchange } from 'actions/adminBillingActions';

const TabPane = Tabs.TabPane;

const Billing = (props) => {
	const { exchange, user, setDashExchange } = props;

	useEffect(() => {
		getExchange();
	}, []);

	const getExchange = async () => {
		const res = await getDashExchange();
		setDashExchange(res.data[0]);
	};

	const putExchange = async (type = 'Cloud') => {
		try {
			const exchangeBody = {
				id: exchange.id,
				info: {
					tech: { SERVER_TYPE: type },
				},
				type,
			};
			await putDashExchange(exchangeBody);
			await getExchange();
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error('Failed to update setup configs');
			}
		}
	};

	return (
		<div className="app_container-content admin-earnings-container w-100 admin-billing">
			<Tabs defaultActiveKey="0">
				<TabPane tab="Plans" key="0">
					<GeneralContent
						exchange={exchange}
						user={user}
						putExchange={putExchange}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.admin.exchange,
		user: state.user,
	};
};

export default connect(mapStateToProps, { setDashExchange })(Billing);
