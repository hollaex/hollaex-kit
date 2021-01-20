import React from 'react';
import { Checkbox, Form, Button } from 'antd';
import ReactSVG from 'react-svg';

import { STATIC_ICONS } from 'config/icons';

const { Item } = Form;

const Features = ({ initialValues = {}, handleNext, updateConstants }) => {
	const handleSubmit = (values) => {
		const formValues = {};
		if (values) {
			formValues.kit = {
				features: {
					chat: !!values.chat,
					quick_trade: !!values.quick_trade,
					pro_trade: !!values.pro_trade,
				},
			};
			updateConstants(formValues, () => handleNext(4));
		}
	};
	return (
		<div className="asset-content show-scroll">
			<div>Select the features that will be available on your exchange.</div>
			<Form
				name="interface-form"
				initialValues={initialValues}
				onFinish={handleSubmit}
			>
				<div className="interface-box">
					<Item name="pro_trade" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<ReactSVG
									path={STATIC_ICONS.CANDLES_LOGO}
									wrapperClassName="feature-icon mr-1"
								/>
								<div className="ml-2">
									Pro trade
									<div className="small-text">
										(Chart, orderbook, limit orders with wallet)
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>
					<Item name="quick_trade" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<div className="feature-trade-box mr-1">
									<div className="interface_container">
										<div className="sell">
											<span className="label">SELL</span>
										</div>
										<div className="buy">
											<span className="label">BUY</span>
										</div>
									</div>
								</div>
								<div className="ml-2">
									Quick trade
									<div className="d-flex justify-content-between">
										<div className="small-text">
											(Simple buy/sell interface with wallet)
										</div>
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>
					<Item name="chat" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<div>
									<ReactSVG
										path={STATIC_ICONS.WALLET_BTC_ICON}
										wrapperClassName="feature-icon mr-1"
									/>
								</div>
								<div className="ml-2">
									Chat system
									<div className="d-flex justify-content-between">
										<div className="small-text">
											(Usernames, text and emoji communication)
										</div>
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>
				</div>
				<div className="asset-btn-wrapper">
					<div className="btn-container">
						<Button htmlType="submit">Proceed</Button>
					</div>
					<span className="step-link" onClick={() => handleNext(4)}>
						Skip this step
					</span>
				</div>
			</Form>
		</div>
	);
};

export default Features;
