import React from 'react';
import { ReactSVG } from 'react-svg';
import { Button, Checkbox, Form } from 'antd';

import { STATIC_ICONS } from 'config/icons';

const { Item } = Form;

const InterfaceForm = ({ initialValues = {}, handleSaveInterface }) => {
	const handleSubmit = (values) => {
		let formValues = {};
		if (values) {
			formValues = {
				chat: !!values.chat,
				quick_trade: !!values.quick_trade,
				pro_trade: !!values.pro_trade,
			};
			handleSaveInterface(formValues);
		}
	};
	return (
		<div className="general-wrapper mb-4">
			<div className="sub-title">Features</div>
			<div className="description">
				Select the features that will be available on your exchange.
			</div>
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
									src={STATIC_ICONS.CANDLES_LOGO}
									className="feature-icon mr-1"
								/>
								<div className="ml-2 checkbox-txt">
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
								<div className="ml-2 checkbox-txt">
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
								<div className="feature-trade-box mr-1">
									<ReactSVG
										src={STATIC_ICONS.CHAT_FEATURE_ICON}
										className="feature-chat-icon"
									/>
								</div>
								<div className="ml-2 checkbox-txt">
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
				<div>
					<Button type="primary" htmlType="submit">
						Save
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default InterfaceForm;
