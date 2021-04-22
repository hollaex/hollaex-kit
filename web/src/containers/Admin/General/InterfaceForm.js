import React from 'react';
import { ReactSVG } from 'react-svg';
import { Button, Checkbox, Form } from 'antd';
import classnames from 'classnames';

import { STATIC_ICONS } from 'config/icons';

const { Item } = Form;

const InterfaceForm = ({
	initialValues = {},
	handleSaveInterface,
	isUpgrade,
}) => {
	const handleSubmit = (values) => {
		let formValues = {};
		if (values) {
			formValues = {
				chat: isUpgrade ? false : !!values.chat,
				quick_trade: !!values.quick_trade,
				pro_trade: !!values.pro_trade,
				home_page: isUpgrade ? false : !!values.home_page,
			};
			handleSaveInterface(formValues);
		}
	};
	let initialValue = initialValues;
	if (isUpgrade) {
		initialValue.home_page = false;
		initialValue.chat = false;
	}
	return (
		<div className="general-wrapper mb-4 pb-4">
			<div className="sub-title">Features</div>
			<div className="description">
				Select the features that will be available on your exchange.
			</div>
			<Form
				name="interface-form"
				initialValues={initialValue}
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
					<div className={classnames({ 'disabled-area': isUpgrade })}>
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
						<Item name="home_page" valuePropName="checked">
							<Checkbox className="mt-3">
								<div className="d-flex align-items-center">
									<div className="feature-trade-box mr-1">
										<ReactSVG
											src={STATIC_ICONS.HOME_PAGE_FEATURE_ICON}
											className="feature-chat-icon"
										/>
									</div>
									<div className="ml-2 checkbox-txt">
										Homepage
										<div className="d-flex justify-content-between">
											<div className="small-text">
												(This will be the first page seen on your domain)
											</div>
										</div>
									</div>
								</div>
							</Checkbox>
						</Item>
					</div>
				</div>
				{isUpgrade ? (
					<div className="d-flex">
						<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
							<div>
								<div className="font-weight-bold">
									Make a good first impression
								</div>
								<div>Add a customizable landing page</div>
							</div>
							<div className="ml-5 button-wrapper">
								<a
									href="https://dash.bitholla.com/billing"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button type="primary" className="w-100">
										Upgrade Now
									</Button>
								</a>
							</div>
						</div>
					</div>
				) : null}
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
