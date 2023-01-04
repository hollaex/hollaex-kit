import React, { useEffect, useState } from 'react';
import { message, Tabs } from 'antd';
import GeneralContent from './generalContent';
// import { setExchangePlan } from './action';
import { connect } from 'react-redux';
import { getNewExchangeBilling, getPrice, setExchangePlan } from './action';

const TabPane = Tabs.TabPane;

const Billing = (props) => {
	const [priceData, setPriceData] = useState({});

	useEffect(() => {
		getExchangePrice();
	}, []);

	const getExchangePrice = async () => {
		try {
			const res = await getPrice();
			let priceData = {};
			Object.keys(res.data).forEach((key) => {
				let temp = res.data[key];
				if (!temp.month) {
					temp.month = {};
				}
				if (!temp.year) {
					temp.year = {};
				}
				priceData[key] = { ...temp };
			});
			setPriceData(priceData);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			}
		}
	};

	const updatePlanType = async (params, callback = () => {}) => {
		try {
			const res = await setExchangePlan(params);
			if (
				props.exchange &&
				props.exchange[0] &&
				props.exchange[0].id &&
				params.plan !== 'fiat'
			) {
				const resInvoice = await getNewExchangeBilling(props.exchange[0].id);
				if (resInvoice.data) {
					// setState({ pendingInvoice: resInvoice.data });
					// getInvoice();
				}
			}
			if (res.data) {
				// getExchange();
				// callback();
			}
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
		}
	};

	return (
		<div className="app_container-content admin-earnings-container w-100">
			<Tabs defaultActiveKey="0">
				<TabPane tab="Plans" key="0">
					<GeneralContent updatePlanType={updatePlanType} />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.asset.exchange,
	};
};

export default connect(mapStateToProps)(Billing);
