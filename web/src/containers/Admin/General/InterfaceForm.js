import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Button, Checkbox, Form } from 'antd';
import classnames from 'classnames';
import _isEqual from 'lodash/isEqual';

import { STATIC_ICONS } from 'config/icons';

const { Item } = Form;

const InterfaceForm = ({
	initialValues = {},
	handleSaveInterface,
	isUpgrade,
	buttonSubmitting,
	isFiatUpgrade,
}) => {
	const [isSubmit, setIsSubmit] = useState(!buttonSubmitting);
	const [form] = Form.useForm();

	const handleSubmit = (values) => {
		let formValues = {};
		if (values) {
			formValues = {
				chat: isUpgrade ? false : !!values.chat,
				quick_trade: !!values.quick_trade,
				pro_trade: !!values.pro_trade,
				stake_page: !!values.stake_page,
				home_page: isUpgrade ? false : !!values.home_page,
				ultimate_fiat: !!values.ultimate_fiat,
			};
			handleSaveInterface(formValues);
		}
	};

	const handleValuesChange = () => {
		if (!_isEqual(initialValues, form.getFieldsValue())) {
			setIsSubmit(false);
		} else {
			setIsSubmit(true);
		}
	};

	const handleSubmitData = (formProps) => {
		setIsSubmit(true);
		handleSubmit(formProps);
	};

	let initialValue = initialValues;
	if (isUpgrade) {
		initialValue.home_page = false;
		initialValue.chat = false;
	}
	return (
		<div className="general-wrapper">
			<div className="sub-title">Features</div>
			<div className="description">
				Select the features that will be available on your exchange.
			</div>
			<Form
				form={form}
				name="interface-form"
				initialValues={initialValue}
				onFinish={handleSubmitData}
				onValuesChange={handleValuesChange}
				className="disable-button"
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
					<Item name="stake_page" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<div className="feature-trade-box mr-1">
									<ReactSVG
										src={STATIC_ICONS.STAKE_FEATURE}
										className="d-flex feature-icon justify-content-center mr-1 mt-1 ml-3 pl-1"
										beforeInjection={(svg) => {
											svg.setAttribute('style', 'width: 60px');
										}}
									/>
								</div>
								<div className="ml-2 checkbox-txt">
									Staking
									<div className="small-text">
										(Lock coins and distribute crypto rewards)
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>

					<div className={classnames({ 'disabled-area': isFiatUpgrade })}>
						<Item name="ultimate_fiat" valuePropName="checked">
							<Checkbox className="mt-3">
								<div className="d-flex align-items-center">
									<div className="feature-trade-box mr-1">
										<ReactSVG
											src={STATIC_ICONS.MPESA_ICON}
											className="d-flex feature-icon justify-content-center mr-2 mt-3 ml-1 pl-1"
											beforeInjection={(svg) => {
												svg.setAttribute('style', 'width: 60px');
											}}
										/>
									</div>
									<div className="ml-2 checkbox-txt">
										Ultimate fiat
										<div className="small-text">(Ultimate fiat ...)</div>
									</div>
								</div>
							</Checkbox>
						</Item>
					</div>
					{isFiatUpgrade ? (
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
					</div>
					{isUpgrade ? (
						<div className="d-flex">
							<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
								<div>
									<div className="font-weight-bold">
										Start your crypto culture
									</div>
									<div>Allow your users to socialize through chat</div>
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
					<div className={classnames({ 'disabled-area': isUpgrade })}>
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
					<Button type="primary" htmlType="submit" disabled={isSubmit}>
						Save
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default InterfaceForm;
