import React from 'react';
import { Checkbox, Form, Button } from 'antd';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import { handleUpgrade } from 'utils/utils';

const { Item } = Form;

const Features = ({ initialValues = {}, handleNext, updateConstants, kit }) => {
	const isUpgrade = handleUpgrade(kit.info);

	const handleSubmit = (values) => {
		const formValues = {};
		if (values) {
			formValues.kit = {
				features: {
					chat: isUpgrade ? false : !!values.chat,
					quick_trade: !!values.quick_trade,
					pro_trade: !!values.pro_trade,
				},
			};
			updateConstants(formValues, () => handleNext(4));
		}
	};
	let initialValue = initialValues;
	if (isUpgrade) {
		initialValue.home_page = false;
		initialValue.chat = false;
	}
	return (
		<div className="asset-content show-scroll">
			<div>Select the features that will be available on your exchange.</div>
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
					<div className={isUpgrade ? 'disabled-area' : ''}>
						<Item name="chat" valuePropName="checked">
							<Checkbox className="mt-3" disabled={isUpgrade}>
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
				</div>
				{isUpgrade ? (
					<div className="d-flex">
						<div className="d-flex align-items-center justify-content-between upgrade-section mt-2">
							<div>
								<div className="font-weight-bold">
									Start your crypto culture
								</div>
								<div className="font-weight-normal">
									Allow your users to socialize through chat
								</div>
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
				<div className="asset-btn-wrapper">
					<div className="btn-container">
						<Button htmlType="submit">Proceed</Button>
					</div>
					{/* <span className="step-link" onClick={() => handleNext(4)}>
						Skip this step
					</span> */}
				</div>
			</Form>
		</div>
	);
};

export default Features;
