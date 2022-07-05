import React, { useEffect, useState } from 'react';
import { Button, Modal, Tooltip, Select, message } from 'antd';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	QuestionCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import _get from 'lodash/get';

import { STATIC_ICONS } from 'config/icons';
import PaymentAccountPopup from './PaymentPopup';
import PaymentDetails from './PaymentDetails';
import FormConfig from './PaymentFormUtils/FormConfig';
import { updateConstants } from '../General/action';

import './index.css';
import { getConstants } from '../Settings/action';

const { Option } = Select;

const PaymentWay = ({
	paymenttype,
	handleClosePlugin,
	handleSave,
	savedContent,
	handleEdit,
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
	isCustomPay,
	customName,
}) => {
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
					/>
				</div>
			);
		case 'plugin':
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
							<div>User payment account 1</div>
							{!savedContent ? (
								<div className="ml-4">
									<Tooltip
										overlayClassName="admin-general-description-tip general-description-tip-right"
										title={
											<img
												src={STATIC_ICONS.HELP_FOOTER_POPUP}
												className="help-icon description_footer"
												alt="footer"
											/>
										}
										placement="right"
									>
										<QuestionCircleOutlined className="quesIcon" />
									</Tooltip>
								</div>
							) : (
								''
							)}
						</div>
						<div className="d-flex mb-5 ml-1">
							<img
								src={STATIC_ICONS.FIAT_PLUGIN}
								alt="pay-icon"
								className="pay-icon"
							/>
							<div className="d-flex flex-column">
								<span>{pluginName ? pluginName : 'Bank'}</span>
								<span>
									<b className="mr-1">Plugin:</b> True
								</span>
								{!savedContent ? (
									<span className="txtanchor" onClick={() => handleDel(true)}>
										Delete payment account
									</span>
								) : (
									''
								)}
							</div>
						</div>
						<div className="d-flex align-items-center mb-4">
							<InfoCircleOutlined />
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
							<Button
								type="primary"
								className="green-btn customizedbtn"
								onClick={() => handleSave(true)}
							>
								SAVE
							</Button>
						) : (
							<div className="txtanchor" onClick={() => handleEdit()}>
								EDIT
							</div>
						)}
					</div>
				</div>
			);
		case 'bankForm':
			return (
				<div>
					<div className="d-flex">
						{currentActiveTab && currentActiveTab === 'paymentAccounts' ? (
							<div className="mr-4">User payment account 1</div>
						) : (
							<div className="mr-4">On-ramp 1</div>
						)}
						<Tooltip
							overlayClassName="admin-general-description-tip general-description-tip-right fiat-icon"
							title={
								<img
									src={STATIC_ICONS.HELP_FOOTER_POPUP}
									className="help-icon description_footer"
									alt="footer"
								/>
							}
							placement="right"
						>
							<QuestionCircleOutlined className="quesIcon" />
						</Tooltip>
					</div>
					<div className="d-flex mt-4 mb-4">
						<img
							src={STATIC_ICONS.BANK_FIAT_PILLARS}
							alt="bank-icon"
							className="fiat-icon mr-3"
						/>
						<div>
							<b>Bank</b>
							<div className="anchor" onClick={() => handleDelBank(true)}>
								Delete payment account
							</div>
						</div>
					</div>
					<FormConfig
						initialValues={bankInitialValues}
						// handleSubmitFooter={this.submitSettings}
						buttonSubmitting={false}
						isFiat={true}
						handleClose={handleClose}
						currentActiveTab={currentActiveTab}
						paymentSelect={paymentSelect}
					/>
				</div>
			);
		case 'paypalForm':
			return (
				<div>
					<div className="d-flex">
						<div className="mr-4">User payment account 2</div>
						<Tooltip
							overlayClassName="admin-general-description-tip general-description-tip-right fiat-icon"
							title={
								<img
									src={STATIC_ICONS.HELP_FOOTER_POPUP}
									className="help-icon description_footer"
									alt="footer"
								/>
							}
							placement="right"
						>
							<QuestionCircleOutlined className="quesIcon" />
						</Tooltip>
					</div>
					<div className="d-flex mt-4 mb-4">
						<img
							src={STATIC_ICONS.PAYPAL_FIAT_ICON}
							alt="bank-icon"
							className="fiat-icon mr-3"
						/>
						<div>
							<b>PayPal</b>
							<div
								className="anchor"
								// onClick={() => handleClose(true, 'delete')}
								onClick={() => handleDelBank(true)}
							>
								Delete payment account
							</div>
						</div>
					</div>
					<FormConfig
						initialValues={paypalInitialValues}
						// handleSubmitFooter={this.submitSettings}
						buttonSubmitting={false}
						isFiat={true}
						handleClose={handleClose}
						currentActiveTab={currentActiveTab}
						paymentSelect={paymentSelect}
					/>
				</div>
			);
		case 'customForm':
			return (
				<div>
					<div className="d-flex">
						<div className="mr-4">User payment account 1</div>
						<Tooltip
							overlayClassName="admin-general-description-tip general-description-tip-right fiat-icon"
							title={
								<img
									src={STATIC_ICONS.HELP_FOOTER_POPUP}
									className="help-icon description_footer"
									alt="footer"
								/>
							}
							placement="right"
						>
							<QuestionCircleOutlined className="quesIcon" />
						</Tooltip>
					</div>
					<div className="d-flex mt-4 mb-4">
						<img
							src={STATIC_ICONS.MPESA_ICON}
							alt="bank-icon"
							className="fiat-icon mr-3"
						/>
						<div>
							<b>{currentPaymentType || customName}</b>
							<div className="anchor" onClick={() => handleDelBank(true)}>
								Delete payment account
							</div>
						</div>
					</div>
					<FormConfig
						initialValues={isCustomPay ? {} : customInitialValues}
						// handleSubmitFooter={this.submitSettings}
						buttonSubmitting={false}
						isFiat={true}
						handleClose={handleClose}
						currentActiveTab={currentActiveTab}
						paymentSelect={paymentSelect}
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
						account system information <span className="txtanchor">here</span>.
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

const PaymentAccounts = ({
	router,
	isUpgrade,
	user_payments = {},
	formType = '',
	isDisplayFormData = false,
	onramp = {},
	currentActiveTab = '',
	coinSymbol = '',
	setConfig = () => {},
	onRampCoins = [],
	customName = '',
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentTab, setCurrentTab] = useState('payment');
	const [pluginName, setPluginName] = useState('');
	const [paymenttype, setPaymentType] = useState('initial');
	const [savedContent, setSavedContent] = useState(false);
	const [paymentSelect, setPaymentSelect] = useState('bank');
	const [isOpen, setIsOpen] = useState(false);
	const [payOption, setPayOption] = useState(true);
	const [isDisplayForm, setIsDisplayForm] = useState(isDisplayFormData);
	const [formData, setFormData] = useState({});
	const [saveType, setSaveType] = useState('');
	const [bodyData, setBodyData] = useState({});
	const [bankInitialValues, setBankInitValue] = useState({});
	const [paypalInitialValues, setPaypalInitValue] = useState({});
	const [customInitialValues, setCustomInitValue] = useState({});
	const [formValues, setFormValues] = useState({});
	const [currentPaymentType, setCurrentPaymentType] = useState('');
	const [isCustomPay, setIsCustomPay] = useState(false);
	const [isOnRampCoins, setIsOnRampCoins] = useState(false);

	useEffect(() => {
		if (formType) {
			setPaymentType(formType);
		}
	}, [formType]);

	useEffect(() => {
		if (onRampCoins.includes(coinSymbol)) {
			setIsOnRampCoins(true);
		} else {
			setIsOnRampCoins(false);
		}
	}, [onRampCoins, coinSymbol]);

	useEffect(() => {
		let tempBank = {};
		let tempPaypal = {};
		let tempCustom = {};
		if (Object.keys(user_payments).length) {
			setPayOption(true);
			Object.keys(user_payments).forEach((item) => {
				return user_payments[item]?.data?.forEach((elem, index) => {
					if (item === 'bank') {
						tempBank = {
							...tempBank,
							[`section_${index + 1}`]: elem,
						};
					} else if (item === 'paypal') {
						tempPaypal = {
							...tempPaypal,
							[`section_${index + 1}`]: elem,
						};
					} else if (item === currentPaymentType) {
						tempCustom = {
							...tempCustom,
							[`section_${index + 1}`]: elem,
						};
					}
				});
			});
			setBankInitValue(tempBank);
			setPaypalInitValue(tempPaypal);
			setCustomInitValue(tempCustom);
			setFormValues(user_payments);
		} else if (Object.keys(onramp).length) {
			Object.keys(onramp).forEach((item) => {
				if (typeof onramp[item]?.data !== 'string') {
					return onramp[item]?.data?.forEach((elem, index) => {
						if (item === 'bank') {
							tempBank = {
								...tempBank,
								[`section_${index + 1}`]: elem,
							};
						} else if (item === 'paypal') {
							tempPaypal = {
								...tempPaypal,
								[`section_${index + 1}`]: elem,
							};
						} else {
							tempCustom = {
								...tempCustom,
								[`section_${index + 1}`]: elem,
							};
						}
					});
				}
			});
			setBankInitValue(tempBank);
			setPaypalInitValue(tempPaypal);
			setCustomInitValue(tempCustom);
			setFormValues(onramp);
			setPayOption(true);
		} else {
			setPayOption(false);
			setIsDisplayForm(true);
		}
	}, [currentPaymentType, onramp, user_payments]);

	const getConstantData = () => {
		getConstants()
			.then((res) => {
				if (_get(res, 'kit.user_payments')) {
					setFormValues(_get(res, 'kit.user_payments'));
					setConfig(res && res.kit);
				}
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				console.log('message', message);
			});
	};

	const handleClosePlugin = (val) => {
		setIsVisible(val);
		setCurrentTab('payment');
	};
	const handleSaveAndPublish = (val, payType, saveMethod) => {
		setIsVisible(val);
		setPaymentType('paymentform');
		setPaymentSelect(payType);
		setSaveType(saveMethod);
		updateConstants(bodyData)
			.then((res) => {
				if (res) {
					getConstantData();
					message.success('Updated successfully');
				}
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};
	const handleClose = (val, type = '', formData = {}) => {
		setIsVisible(val);
		setCurrentTab(type);
		setFormData(formData);
		let userPayment = {};
		let onRampData = {};
		let paymentAccData = [];
		if (currentActiveTab === 'onRamp') {
			Object.keys(formData).forEach((elem) => {
				const item = formData[elem];
				let temp = [];
				item.forEach((val) => {
					if (val) {
						temp = [
							...temp,
							{
								key: val?.key,
								lablel: val?.label || val?.lablel,
								value: val?.value || '',
							},
						];
					}
				});
				onRampData = {
					data: [temp],
					type: 'manual',
				};
			});
			userPayment = {
				kit: {
					onramp: {
						[coinSymbol]: {
							[currentPaymentType || customName]: onRampData,
						},
					},
				},
			};
		} else if (currentActiveTab === 'paymentAccounts') {
			Object.keys(formData).forEach((elem) => {
				const item = formData[elem];
				paymentAccData = [
					...paymentAccData,
					{
						key: item?.key,
						label: item?.label,
						required: item?.required,
					},
				];
			});
			userPayment = {
				kit: {
					user_payments: {
						[currentPaymentType]: { data: paymentAccData },
					},
				},
			};
		}
		setBodyData(userPayment);
	};
	const tabUpdate = (type) => {
		setCurrentTab(type);
	};
	const formUpdate = (type, currentPaymentType, isCustomPay) => {
		setPaymentType(type);
		setIsDisplayForm(true);
		setCurrentPaymentType(currentPaymentType);
		setIsCustomPay(isCustomPay);
		setIsOnRampCoins(false);
	};
	const onCancel = () => {
		setIsVisible(false);
		setCurrentTab('payment');
	};
	const updatePlugin = (e) => {
		setPaymentType('plugin');
		setPluginName(e);
	};
	const handleSave = (val) => {
		setIsVisible(val);
		setCurrentTab('save');
	};
	const handleDel = (val) => {
		setIsVisible(val);
		setCurrentTab('delete');
	};
	const handleDelBank = (val, formData) => {
		setIsVisible(val);
		setCurrentTab('deletebank');
		setFormData(formData);
	};

	const handlePopupSave = () => {
		setSavedContent(true);
		setIsVisible(false);
	};
	const handlePopupDel = () => {
		setPaymentType('initial');
		setIsVisible(false);
	};
	const handleEdit = () => {
		setSavedContent(false);
	};
	const setPaymentMethod = (e) => {
		setPaymentSelect(e);
	};
	const handleOpenPayment = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="payment-acc-wrapper">
			<div>
				{currentActiveTab && currentActiveTab === 'paymentAccounts' ? (
					<div>
						<div className="d-flex justify-content-between">
							<div className="d-flex">
								<img
									src={STATIC_ICONS.DOUBLEFIAT_ICON}
									alt="pay-icon"
									className="pay-icon"
								/>
								<div>
									<div>
										Allow your users add their payment method for{' '}
										{paymenttype === 'initial'
											? 'receiving fiat.'
											: 'withdrawing fiat.'}
									</div>
									<div className="d-flex align-items-center">
										<div className="mr-3">
											The payment account details will be added to the user's
											verification section.
										</div>
										<Tooltip
											overlayClassName="admin-general-description-tip general-description-tip-right"
											title={
												<img
													src={STATIC_ICONS.FIAT_PAYMENT_TOOLTIP}
													className="help-icon description_footer"
													alt="footer"
												/>
											}
											placement="right"
										>
											<QuestionCircleOutlined className="quesIcon" />
										</Tooltip>
									</div>
									<div className="mt-4">
										These payment details can be reused for{' '}
										{paymenttype === 'initial'
											? 'on and off ramping.'
											: 'off ramping page.'}
									</div>
								</div>
							</div>
							<Button
								type="primary"
								className={!isUpgrade ? 'green-btn disableall' : 'green-btn'}
								onClick={() => handleClosePlugin(true)}
							>
								Add payment account
							</Button>
						</div>
						<div className="border-divider"></div>
					</div>
				) : null}
				{payOption && (
					<div className="mt-4">
						<div>
							Payment accounts ({Object.keys(formValues).length} method saved)
						</div>
						<div className="mb-3">
							<Select
								className="paymentSelect"
								defaultValue={'bank'}
								suffixIcon={
									isOpen ? (
										<CaretDownOutlined className="downarrow" />
									) : (
										<CaretUpOutlined className="downarrow" />
									)
								}
								onClick={handleOpenPayment}
								onChange={setPaymentMethod}
							>
								{Object.keys(formValues).map((item, index) => {
									return (
										<Option value={item} key={index}>
											User payment account {index + 1}: {item}
										</Option>
									);
								})}
							</Select>
						</div>
					</div>
				)}
				{!isUpgrade ? (
					<div className="d-flex mt-3 ml-4">
						<div className="d-flex align-items-center justify-content-between upgrade-section my-4">
							<div>
								<div className="font-weight-bold">
									Add fiat deposits & withdrawals
								</div>
								<div>Allow your users to send USD & other fiat</div>
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
			</div>
			<Modal visible={isVisible} footer={null} width={500} onCancel={onCancel}>
				<PaymentAccountPopup
					handleClosePlugin={handleClosePlugin}
					type={currentTab}
					tabUpdate={tabUpdate}
					updatePlugin={updatePlugin}
					handlePopupSave={handlePopupSave}
					handlePopupDel={handlePopupDel}
					formData={formData}
					formUpdate={formUpdate}
					handleSaveAndPublish={handleSaveAndPublish}
					currentActiveTab={currentActiveTab}
					user_payments={formValues}
					bodyData={bodyData}
					paymentSelectData={currentPaymentType || customName}
					coinSymbol={coinSymbol}
				/>
			</Modal>
			{/* {isDisplayForm || !payOption && */}
			{isDisplayForm && !isOnRampCoins && (
				<PaymentWay
					paymenttype={paymenttype}
					handleClosePlugin={handleClosePlugin}
					handleSave={handleSave}
					savedContent={savedContent}
					handleEdit={handleEdit}
					pluginName={pluginName}
					handleDel={handleDel}
					isUpgrade={isUpgrade}
					handleDelBank={handleDelBank}
					paymentSelect={paymentSelect}
					handleClose={handleClose}
					saveType={saveType}
					formData={formData}
					router={router}
					formUpdate={formUpdate}
					currentActiveTab={currentActiveTab}
					bankInitialValues={bankInitialValues}
					paypalInitialValues={paypalInitialValues}
					customInitialValues={customInitialValues}
					currentPaymentType={currentPaymentType}
					isCustomPay={isCustomPay}
					customName={customName}
				/>
			)}
			{/* {payOption && !isDisplayForm && */}
			{payOption && (
				<PaymentDetails
					type={paymentSelect}
					formUpdate={formUpdate}
					saveType={saveType}
					handleClose={handleClose}
					formData={formData}
					router={router}
					user_payments={formValues}
					activeTab={currentActiveTab}
				/>
			)}
		</div>
	);
};

export default PaymentAccounts;
