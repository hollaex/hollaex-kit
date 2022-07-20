import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Tooltip, Select, message, Checkbox, Spin } from 'antd';
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
import { getConstants } from '../Settings/action';
import {
	DEFAULT_BANK_PAYMENT_ACCOUNTS,
	DEFAULT_CUSTOM_PAYMENT_CUSTOM,
	DEFAULT_PAYPAL_PAYMENT_PAYPAL,
} from 'config/constants';

import './index.css';

const { Option } = Select;

const PaymentWay = ({
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
	isCustomPay,
	customName,
	currentsymbol = '',
	coinSymbol = '',
	isPaymentForm,
	currentIndex = 1,
	handleBack = () => {},
	currentType,
	defaultBankInitialValues = {},
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
						) : (
							<div className="mr-4">On-ramp {currentIndex}</div>
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
							<div className="anchor" onClick={() => handleDelBank(true)}>
								{currentActiveTab && currentActiveTab === 'paymentAccounts'
									? 'Delete payment account'
									: 'Delete On-ramp'}
							</div>
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
					/>
				</div>
			);
		case 'paypalForm':
			return (
				<div>
					<div className="d-flex">
						<div className="mr-4">User payment account {currentIndex}</div>
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
							<div className="anchor" onClick={() => handleDelBank(true)}>
								Delete payment account
							</div>
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
					/>
				</div>
			);
		case 'customForm':
			return (
				<div>
					<div className="d-flex">
						<div className="mr-4">User payment account {currentIndex}</div>
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
							<div className="anchor" onClick={() => handleDelBank(true)}>
								Delete payment account
							</div>
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
	originalonramp = {},
	offramp = {},
	pluginName = '',
	currentsymbol = '',
	isPaymentForm = false,
	setCoindata,
	kitOfframpData = {},
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentTab, setCurrentTab] = useState('payment');
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
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [isDisplayDetails, setIsDisplayDetails] = useState(false);
	const [selectedPlugin, setPlugin] = useState('');
	const [currentIndex, setCurrentIndex] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [defaultBankInitialValues, setDefaultBankInitValue] = useState({});
	const [defaultPaypalInitialValues, setDefaultPaypalInitValue] = useState({});
	const [defaultCustomInitialValues, setDefaultCustomInitValue] = useState({});
	const [currentType, setCurrentType] = useState('');
	const [isCurrentFormOpen, setIsCurrentFormOpen] = useState(false);

	const getCustomDefaultValues = (paymentType = '') => {
		let temp = {};
		DEFAULT_CUSTOM_PAYMENT_CUSTOM.forEach((item, index) => {
			const itemData = {
				...item,
				label: `${paymentType} ${item?.label}`,
				key: paymentType
					? `${paymentType?.toLowerCase()}_${item?.key}`
					: item?.key,
			};
			temp = {
				...temp,
				[`section_${index + 1}`]: itemData,
			};
		});
		return temp;
	};

	const generateDefaultInitValue = useCallback(() => {
		if (DEFAULT_BANK_PAYMENT_ACCOUNTS.length) {
			let temp = {};
			DEFAULT_BANK_PAYMENT_ACCOUNTS.forEach((item, index) => {
				temp = {
					...temp,
					[`section_${index + 1}`]: item,
				};
			});
			setDefaultBankInitValue(temp);
		}
		if (DEFAULT_PAYPAL_PAYMENT_PAYPAL.length) {
			let temp = {};
			DEFAULT_PAYPAL_PAYMENT_PAYPAL.forEach((item, index) => {
				temp = {
					...temp,
					[`section_${index + 1}`]: item,
				};
			});
			setDefaultPaypalInitValue(temp);
		}
		if (DEFAULT_CUSTOM_PAYMENT_CUSTOM.length) {
			const temp = getCustomDefaultValues();
			setDefaultCustomInitValue(temp);
		}
	}, []);

	const generateFormFieldsValues = (type, paymentType) => {
		if (type === 'bankForm') {
			if (Object.keys(bankInitialValues).length === 0) {
				setBankInitValue(defaultBankInitialValues);
			}
		} else if (type === 'paypalForm') {
			if (Object.keys(paypalInitialValues).length === 0) {
				setPaypalInitValue(defaultPaypalInitialValues);
			}
		} else if (type === 'customForm') {
			if (Object.keys(customInitialValues).length === 0) {
				const test = getCustomDefaultValues(paymentType);
				setCustomInitValue(test);
			}
		}
	};

	useEffect(() => {
		generateDefaultInitValue();
	}, [currentPaymentType, generateDefaultInitValue]);

	useEffect(() => {
		if (currentsymbol === coinSymbol) {
			setIsCurrentFormOpen(true);
		} else {
			setIsCurrentFormOpen(false);
		}
	}, [currentsymbol, coinSymbol]);

	useEffect(() => {
		if (formType) {
			setPaymentType(formType);
		}
	}, [formType]);

	useEffect(() => {
		let tempBank = { ...bankInitialValues };
		let tempPaypal = { ...paypalInitialValues };
		let tempCustom = { ...customInitialValues };
		let firstPayment = [];
		if (
			currentActiveTab === 'paymentAccounts' ||
			(Object.keys(offramp).length && currentActiveTab === 'offRamp')
		) {
			setPayOption(true);
			Object.keys(user_payments).forEach((item) => {
				firstPayment = [...firstPayment, item];
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
					} else {
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
			setPaymentSelect(firstPayment[0]);
		} else if (Object.keys(onramp).length && currentActiveTab === 'onRamp') {
			Object.keys(onramp).forEach((item) => {
				firstPayment = [...firstPayment, item];
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
			setPaymentSelect(firstPayment[0]);
		} else {
			setPayOption(false);
			setIsDisplayForm(true);
		}
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPaymentType, onramp, user_payments, currentActiveTab]);

	useEffect(() => {
		if (
			formValues &&
			Object.keys(formValues).length &&
			currentActiveTab !== 'offRamp'
		) {
			let temp = Object.keys(formValues).map((item) => item);
			setPaymentMethods(temp);
		}
	}, [formValues, currentActiveTab]);

	useEffect(() => {
		if (kitOfframpData && Object.keys(kitOfframpData).length) {
			updateConstantsData(kitOfframpData);
		}
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [kitOfframpData]);

	const getConstantData = (type) => {
		getConstants()
			.then((res) => {
				if (currentActiveTab === 'onRamp') {
					if (_get(res, 'kit.onramp')) {
						setFormValues(_get(res, `kit.onramp[${coinSymbol}]`));
					}
				} else if (currentActiveTab === 'offRamp') {
					if (_get(res, 'kit.offramp')) {
						setFormValues(_get(res, `kit.offramp`));
					}
				} else {
					if (_get(res, 'kit.user_payments')) {
						const tempData = _get(res, 'kit.user_payments');
						let temp = Object.keys(tempData).map((item) => item);
						if (type === 'delete') {
							setPaymentMethod(temp[0]);
							if (Object.keys(tempData).length === 0) {
								setPaymentType('initial');
								setFormValues({});
								setBankInitValue({});
								setPaypalInitValue({});
								setCustomInitValue({});
							}
						} else if (type === 'add') {
							setPaymentMethod(temp[temp.length - 1]);
							setFormValues(tempData);
						}
					}
				}
				setConfig(res && res.kit);
				setIsLoading(false);
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				setIsLoading(false);
				console.log('message', message);
			});
	};

	const handleClosePlugin = (val) => {
		setIsVisible(val);
		setCurrentTab('payment');
	};

	const updateConstantsData = (bodyData, type = '') => {
		updateConstants(bodyData)
			.then((res) => {
				if (res) {
					getConstantData(type);
					message.success('Updated successfully');
				}
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	const handleSaveAndPublish = (val, payType, saveMethod) => {
		setIsLoading(true);
		setIsVisible(val);
		setPaymentType('paymentform');
		// setPaymentSelect(payType);
		setSaveType(saveMethod);
		setIsDisplayDetails(false);
		updateConstantsData(bodyData, 'add');
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
								label: val?.label,
								value: val?.value || '',
								required: val?.required,
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
						...originalonramp,
						[coinSymbol]: {
							...originalonramp[coinSymbol],
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
						...user_payments,
						[currentPaymentType]: { data: paymentAccData },
					},
				},
			};
		}
		setBodyData(userPayment);
	};
	const tabUpdate = (type, currentType) => {
		setCurrentTab(type);
		setCurrentType(currentType);
	};
	const formUpdate = (
		type,
		currentPaymentType,
		isCustomPay,
		curIndex,
		currentType = ''
	) => {
		setPaymentType(type);
		setIsDisplayForm(true);
		setCurrentPaymentType(currentPaymentType);
		setIsCustomPay(isCustomPay);
		setIsDisplayDetails(true);
		setCurrentIndex(curIndex);
		// setCoinSymbol(coinSymbol);
		generateFormFieldsValues(type, currentPaymentType);
		if (currentType) {
			setCurrentType(currentType);
		}
	};
	const onCancel = () => {
		setIsVisible(false);
		setCurrentTab('payment');
	};

	const handleSave = (val, selectedPlugin) => {
		setIsVisible(val);
		setCurrentTab('save');
		setPlugin(selectedPlugin);
	};
	const handleDel = (val, selectedPlugin) => {
		setIsVisible(val);
		setCurrentTab('delete');
		setPlugin(selectedPlugin);
	};
	const handleDelBank = (val, formData) => {
		setIsVisible(val);
		setCurrentTab('deletebank');
		setFormData(formData);
	};

	const handlePopupSave = () => {
		const pluginBodyData = {
			kit: {
				onramp: {
					...originalonramp,
					[coinSymbol]: {
						...originalonramp[coinSymbol],
						[selectedPlugin]: {
							data: selectedPlugin,
							type: 'plugin',
						},
					},
				},
			},
		};
		updateConstantsData(pluginBodyData);
		setSavedContent(true);
		setIsVisible(false);
	};
	const handlePopupDel = (method) => {
		setIsLoading(true);
		let deletedData = {};
		if (currentActiveTab === 'paymentAccounts') {
			Object.keys(user_payments).forEach((item) => {
				if (item !== method)
					deletedData = {
						...deletedData,
						[item]: user_payments[item],
					};
			});
		}
		let deletedBodyData = {
			kit: {
				user_payments: deletedData,
			},
		};
		if (currentActiveTab === 'onRamp') {
			Object.keys(onramp).forEach((item) => {
				if (item !== method) {
					deletedData = {
						...deletedData,
						[item]: onramp[item],
					};
				}
			});

			deletedBodyData = {
				kit: {
					onramp: {
						...originalonramp,
						[coinSymbol]: deletedData,
					},
				},
			};
		}
		updateConstantsData(deletedBodyData, 'delete');
		// setPaymentType('initial');
		setIsVisible(false);
	};
	const handleEdit = () => {
		setSavedContent(false);
	};
	const setPaymentMethod = (e) => {
		setCurrentIndex(Object.keys(formValues).indexOf(e) + 1);
		setPaymentSelect(e);
		setIsDisplayDetails(false);
		setIsDisplayForm(false);
	};
	const handleOpenPayment = () => {
		setIsOpen(!isOpen);
	};

	const handleBack = () => {
		setIsDisplayDetails(false);
		setIsDisplayForm(false);
		if (!user_payments || !Object.keys(user_payments).length) {
			setPaymentType('initial');
			setIsDisplayForm(true);
		}
		setIsCurrentFormOpen(false);
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
													className="fiatpayhelp fiatpayhelpnote"
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
				{!isUpgrade && currentActiveTab === 'paymentAccounts' ? (
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
				<div className={!isUpgrade ? 'disableall' : ''}>
					{payOption && paymentMethods.length && paymentMethods.length > 1 ? (
						<div className="mt-4">
							<div>Payment accounts ({paymentMethods.length} method saved)</div>
							<div className="mb-3">
								<Select
									className="paymentSelect"
									defaultValue={paymentMethods[0]}
									value={paymentSelect}
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
										const value =
											currentActiveTab === 'offRamp' ? formValues[item] : item;
										return (
											<Option value={value} key={index}>
												User payment account {index + 1}: {value}
											</Option>
										);
									})}
								</Select>
							</div>
						</div>
					) : null}
				</div>
			</div>
			{isLoading ? (
				<div className="d-flex justify-content-center align-items-center">
					<Spin size="large" />
				</div>
			) : (
				<div className={!isUpgrade ? 'disableall' : ''}>
					{((currentActiveTab &&
						currentActiveTab === 'paymentAccounts' &&
						isDisplayForm) ||
						(currentActiveTab &&
							currentActiveTab === 'onRamp' &&
							isCurrentFormOpen)) && (
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
							currentsymbol={currentsymbol}
							coinSymbol={coinSymbol}
							isPaymentForm={isPaymentForm}
							currentIndex={currentIndex}
							handleBack={handleBack}
							currentType={currentType}
							defaultBankInitialValues={defaultBankInitialValues}
							defaultPaypalInitialValues={defaultPaypalInitialValues}
							defaultCustomInitialValues={defaultCustomInitialValues}
						/>
					)}
					{payOption && !isDisplayDetails ? (
						<PaymentDetails
							type={paymentSelect}
							formUpdate={formUpdate}
							saveType={saveType}
							handleClose={handleClose}
							formData={formData}
							router={router}
							user_payments={formValues}
							activeTab={currentActiveTab}
							paymentIndex={currentIndex}
						/>
					) : null}
				</div>
			)}
			<Modal visible={isVisible} footer={null} width={500} onCancel={onCancel}>
				<PaymentAccountPopup
					handleClosePlugin={handleClosePlugin}
					type={currentTab}
					tabUpdate={tabUpdate}
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
					selectedPlugin={selectedPlugin}
					currentsymbol={currentsymbol}
					setCoindata={setCoindata}
					currentIndex={currentIndex}
				/>
			</Modal>
		</div>
	);
};

export default PaymentAccounts;
