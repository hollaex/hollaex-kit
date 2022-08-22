import React from 'react';
import { Button, Tooltip, Checkbox } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import PaymentDetails from './PaymentDetails';
import FormConfig from './PaymentFormUtils/FormConfig';

export const PaymentWay = ({
	paymenttype,
	handleClosePlugin,
	handleSave,
	savedContent,
	pluginName,
	handleDel,
	isUpgrade,
	handleDelBank,
	paymentSelect,
	handleClose,
	formUpdate,
	saveType,
	formData,
	router,
	currentActiveTab = '',
	bankInitialValues,
	paypalInitialValues,
	customInitialValues,
	currentPaymentType,
	customName,
	currentsymbol = '',
	coinSymbol = '',
	isPaymentForm,
	currentIndex = 1,
	handleBack = () => {},
	currentType,
	user_payments = {},
}) => {
	const renderTooltip = () => {
		let imgSrc = STATIC_ICONS.FIAT_PAYMENT_TOOLTIP;
		if (currentActiveTab === 'onRamp') {
			imgSrc = STATIC_ICONS.FIAT_ONRAMP_TOOLTIP;
		} else if (currentActiveTab === 'offRamp') {
			imgSrc = STATIC_ICONS.FIAT_OFFRAMP_TOOLTIP;
		}
		return (
			<Tooltip
				overlayClassName={
					'admin-general-description-tip general-description-tip-right'
				}
				title={
					<img
						src={imgSrc}
						className={
							currentActiveTab !== 'onRamp'
								? 'fiatpayhelp fiatpayhelpnote'
								: 'fiatpayhelp fiatonramppop'
						}
						alt="footer"
					/>
				}
				placement="right"
			>
				<QuestionCircleOutlined className="quesIcon" />
			</Tooltip>
		);
	};

	switch (paymenttype) {
		case 'paymentform':
			return (
				<div className="payment-acc-wrapper ">
					<PaymentDetails
						type={paymentSelect}
						formUpdate={formUpdate}
						saveType={saveType}
						handleClose={handleClose}
						formData={formData}
						router={router}
						user_payments={user_payments}
					/>
				</div>
			);
		case 'plugin':
			if ((currentsymbol === coinSymbol && isPaymentForm) || !isPaymentForm) {
				return (
					<div className="payment-acc-wrapper">
						<div
							className={
								!savedContent
									? 'pluginContentWrapper'
									: 'pluginContentWrapper boxcontent'
							}
						>
							<div className="d-flex mb-5 ml-1">
								<div>Onramp 1</div>
								{!savedContent ? (
									<div className="ml-4">{renderTooltip()}</div>
								) : null}
							</div>
							<div className="d-flex mb-5 ml-1">
								<img
									src={STATIC_ICONS.FIAT_PLUGIN}
									alt="pay-icon"
									className="pay-icon"
								/>
								<div className="d-flex flex-column">
									<span>{pluginName || currentPaymentType}</span>
									<span>
										<b className="mr-1">Plugin:</b> True
									</span>
									{!savedContent ? (
										<span
											className="txtanchor"
											onClick={() =>
												handleDel(true, pluginName || currentPaymentType)
											}
										>
											Delete on-ramp
										</span>
									) : null}
								</div>
							</div>
							<div className="d-flex align-items-center mb-4">
								<InfoCircleOutlined style={{ fontSize: '40px' }} />
								<div className="ml-3">
									<div>
										This payment account is marked as a <b>'plugin'</b> based
										system.
									</div>
									<div>
										Plugins require that you get in touch with{' '}
										<span className="txtanchor">support@hollaex.com</span>
									</div>
								</div>
							</div>
							{!savedContent ? (
								<div className="field-wrap ml-5 mt-5">
									<Checkbox name="allow_deposit">
										<div className="checkbox-title">
											Only show to verified or upgraded users
										</div>
										<div className="description">
											<div>
												(user won't be able to access these details unless they
												complete part or all verification)
											</div>
										</div>
									</Checkbox>
								</div>
							) : null}
							{!savedContent ? (
								<Button
									type="primary"
									className="green-btn customizedbtn"
									onClick={() =>
										handleSave(
											true,
											pluginName ? pluginName : currentPaymentType
										)
									}
								>
									SAVE
								</Button>
							) : (
								<div
									className="txtanchor"
									onClick={() => formUpdate('plugin', pluginName)}
								>
									EDIT
								</div>
							)}
						</div>
					</div>
				);
			} else {
				return null;
			}
		case 'bankForm':
			return (
				<div>
					<div className="d-flex">
						{currentActiveTab && currentActiveTab === 'paymentAccounts' ? (
							<div className="mr-4">User payment account {currentIndex}</div>
						) : currentActiveTab && currentActiveTab === 'onRamp' ? (
							<div className="mr-4">On-ramp {currentIndex}</div>
						) : (
							<div className="mr-4">Off-ramp {currentIndex}</div>
						)}
						{renderTooltip()}
					</div>
					<div className="d-flex mt-4 mb-4">
						<img
							src={STATIC_ICONS.BANK_FIAT_PILLARS}
							alt="bank-icon"
							className="fiat-icon mr-3"
						/>
						<div>
							<b>Bank</b>
							{currentType && currentType === 'add' ? null : (
								<div className="anchor" onClick={() => handleDelBank(true)}>
									{currentActiveTab && currentActiveTab === 'paymentAccounts'
										? 'Delete payment account'
										: currentActiveTab && currentActiveTab === 'onRamp'
										? 'Delete On-ramp'
										: 'Delete off-ramp'}
								</div>
							)}
						</div>
					</div>
					<FormConfig
						handleBack={handleBack}
						initialValues={bankInitialValues}
						isFiat={true}
						handleClose={handleClose}
						currentActiveTab={currentActiveTab}
						paymentSelect={paymentSelect}
						buttonSubmitting={currentType && currentType === 'add'}
						currentPaymentType={'bank'}
						user_payments={user_payments}
						currentType={currentType}
					/>
				</div>
			);
		case 'paypalForm':
			return (
				<div>
					<div className="d-flex">
						{currentActiveTab && currentActiveTab === 'paymentAccounts' ? (
							<div className="mr-4">User payment account {currentIndex}</div>
						) : currentActiveTab && currentActiveTab === 'onRamp' ? (
							<div className="mr-4">On-ramp {currentIndex}</div>
						) : (
							<div className="mr-4">Off-ramp {currentIndex}</div>
						)}
						{renderTooltip()}
					</div>
					<div className="d-flex mt-4 mb-4">
						<img
							src={STATIC_ICONS.PAYPAL_FIAT_ICON}
							alt="bank-icon"
							className="fiat-icon mr-3"
						/>
						<div>
							<b>PayPal</b>
							{currentType && currentType === 'add' ? null : (
								<div className="anchor" onClick={() => handleDelBank(true)}>
									{currentActiveTab && currentActiveTab === 'paymentAccounts'
										? 'Delete payment account'
										: currentActiveTab && currentActiveTab === 'onRamp'
										? 'Delete On-ramp'
										: 'Delete off-ramp'}
								</div>
							)}
						</div>
					</div>
					<FormConfig
						handleBack={handleBack}
						initialValues={paypalInitialValues}
						isFiat={true}
						handleClose={handleClose}
						currentActiveTab={currentActiveTab}
						paymentSelect={paymentSelect}
						buttonSubmitting={currentType && currentType === 'add'}
						currentPaymentType={'paypal'}
						user_payments={user_payments}
						currentType={currentType}
					/>
				</div>
			);
		case 'customForm':
			return (
				<div>
					<div className="d-flex">
						{currentActiveTab && currentActiveTab === 'paymentAccounts' ? (
							<div className="mr-4">User payment account {currentIndex}</div>
						) : currentActiveTab && currentActiveTab === 'onRamp' ? (
							<div className="mr-4">On-ramp {currentIndex}</div>
						) : (
							<div className="mr-4">Off-ramp {currentIndex}</div>
						)}
						{renderTooltip()}
					</div>
					<div className="d-flex mt-4 mb-4">
						<img
							src={STATIC_ICONS.MPESA_ICON}
							alt="bank-icon"
							className="fiat-icon mr-3"
						/>
						<div>
							<b>{currentPaymentType || customName}</b>
							{currentType && currentType === 'add' ? null : (
								<div className="anchor" onClick={() => handleDelBank(true)}>
									{currentActiveTab && currentActiveTab === 'paymentAccounts'
										? 'Delete payment account'
										: currentActiveTab && currentActiveTab === 'onRamp'
										? 'Delete On-ramp'
										: 'Delete off-ramp'}
								</div>
							)}
						</div>
					</div>
					<FormConfig
						handleBack={handleBack}
						initialValues={customInitialValues}
						isFiat={true}
						handleClose={handleClose}
						currentActiveTab={currentActiveTab}
						paymentSelect={paymentSelect}
						buttonSubmitting={currentType && currentType === 'add'}
						currentPaymentType={'payment'}
						user_payments={user_payments}
						currentType={currentType}
					/>
				</div>
			);
		case 'initial':
			return currentActiveTab && currentActiveTab === 'paymentAccounts' ? (
				<div
					className={
						isUpgrade
							? 'inner-content '
							: 'inner-content disableall upgradedheight'
					}
				>
					<img
						src={STATIC_ICONS.DOLLAR_GEAR}
						alt="fiat-icon"
						className="fiat-icon"
					/>
					<div className="info">
						There are no fiat payment account systems added yet. Add a payment
						account system information{' '}
						<span className="txtanchor" onClick={() => handleClosePlugin(true)}>
							here
						</span>
						.
					</div>
					<Button
						type="primary"
						className="green-btn"
						onClick={() => handleClosePlugin(true)}
					>
						Add payment account
					</Button>
				</div>
			) : null;
		default:
			return null;
	}
};
