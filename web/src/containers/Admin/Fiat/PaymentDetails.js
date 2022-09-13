import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';

const PaymentDetails = ({
	activeTab = '',
	type,
	formUpdate,
	user_payments = {},
	paymentIndex,
	isDisable = false,
}) => {
	const renderImage = (type) => {
		if (type === 'bank') {
			return STATIC_ICONS.BANK_FIAT_PILLARS;
		} else if (type === 'paypal') {
			return STATIC_ICONS.PAYPAL_FIAT_ICON;
		} else {
			return STATIC_ICONS.MPESA_ICON;
		}
	};

	if (!user_payments) {
		return null;
	}

	return (
		<div>
			{user_payments &&
				Object.keys(user_payments).length > 0 &&
				Object.keys(user_payments)
					.filter((e) => e === type)
					.map((item, index) => {
						const curData = user_payments[item];
						return (
							<div className="paymentContainer mt-4" key={index}>
								<div className="paymentheader d-flex justify-content-between mb-4">
									<div>
										{activeTab && activeTab === 'paymentAccounts'
											? `User payment account ${curData.orderBy}`
											: `${activeTab}  ${paymentIndex}`}
									</div>
								</div>
								<div className="d-flex mb-4">
									<img
										src={
											typeof curData?.data === 'string'
												? STATIC_ICONS.FIAT_PLUGIN
												: renderImage(item)
										}
										alt="pay-icon"
										className="pay-icon"
									/>
									<div className="d-flex flex-column">
										<span>{item}</span>
										{typeof curData?.data === 'string' ? (
											<span>
												<b>Plugin</b>: True
											</span>
										) : null}
									</div>
								</div>
								{typeof curData?.data === 'string' ? (
									<div className="d-flex align-items-center mb-4">
										<InfoCircleOutlined
											style={{ fontSize: '35px' }}
											className="ml-4"
										/>
										<div className="ml-4">
											<div>
												This on-ramp is marked as a <b>'plugin'</b> based
												system.
											</div>
											<div>
												Plugins require that you get in touch with{' '}
												<span className="txtanchor">support@hollaex.com</span>
											</div>
										</div>
									</div>
								) : null}
								{typeof curData?.data !== 'string' ? (
									<div>
										{activeTab && activeTab === 'onRamp' ? (
											<div>
												{curData?.data.map((elem) =>
													elem.filter((item) => item?.required)
												)[0]?.length ? (
													<div className="mb-1">REQUIRED</div>
												) : null}
												<div className="bankborder">
													{curData?.data.map((elem) => {
														return elem.map((item, key) => {
															if (item?.required) {
																return (
																	<div className="bankDetails" key={key}>
																		<span>
																			<b>{item?.label}: </b>
																		</span>
																		{item?.value ? (
																			<span className="userinfo">
																				{item?.value}
																			</span>
																		) : (
																			<span className="userinfo">
																				(user input)
																			</span>
																		)}
																	</div>
																);
															} else {
																return null;
															}
														});
													})}
												</div>
												{curData?.data.map((elem) =>
													elem.filter((item) => !item?.required)
												)[0]?.length ? (
													<div className="mb-1">OPTIONAL</div>
												) : null}
												<div className="bankborder">
													{curData?.data.map((elem) => {
														return elem.map((item, key) => {
															if (!item?.required) {
																return (
																	<div className="bankDetails" key={key}>
																		<span>
																			<b>{item?.label}: </b>
																		</span>
																		{item?.value ? (
																			<span className="userinfo">
																				{item?.value}
																			</span>
																		) : (
																			<span className="userinfo">
																				(user input)
																			</span>
																		)}
																	</div>
																);
															} else {
																return null;
															}
														});
													})}
												</div>
											</div>
										) : (
											<div>
												{user_payments[item]?.data?.filter(
													(item) => item?.required
												).length ? (
													<div className="mb-1">REQUIRED</div>
												) : null}
												<div className="bankborder">
													{curData?.data?.map((elem, index) => {
														if (elem?.required) {
															return (
																<div className="bankDetails" key={index}>
																	<span>
																		<b>{elem?.label}: </b>
																	</span>
																	<span className="userinfo">(user input)</span>
																</div>
															);
														} else {
															return null;
														}
													})}
												</div>
												{user_payments[item]?.data.filter(
													(item) => !item?.required
												).length ? (
													<div>OPTIONAL</div>
												) : null}
												<div className="bankborder">
													{curData?.data.map((elem, index) => {
														if (!elem?.required) {
															return (
																<div className="bankDetails" key={index}>
																	<span className="d-flex flex-column mb-1">
																		<b>{elem?.label}: </b>
																		<span className="userinfo">(optional)</span>
																	</span>
																	<span className="userinfo">(user input)</span>
																</div>
															);
														} else {
															return null;
														}
													})}
												</div>
											</div>
										)}
									</div>
								) : null}
								<div
									className={
										isDisable ? 'txtanchor mt-4 pointer-none' : 'txtanchor mt-4'
									}
									onClick={() =>
										formUpdate(
											typeof curData?.data === 'string'
												? 'plugin'
												: item === 'bank' || item === 'paypal'
												? `${item}Form`
												: 'customForm',
											item,
											false,
											paymentIndex,
											'edit'
										)
									}
								>
									<div>EDIT</div>
								</div>
							</div>
						);
					})}
		</div>
	);
};
export default PaymentDetails;
