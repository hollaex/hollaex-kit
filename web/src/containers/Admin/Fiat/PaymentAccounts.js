import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Tooltip, Select, message, Spin } from 'antd';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';
import _get from 'lodash/get';

import { STATIC_ICONS } from 'config/icons';
import PaymentAccountPopup from './PaymentPopup';
import PaymentDetails from './PaymentDetails';
import { updateConstants } from '../General/action';
import { getConstants } from '../Settings/action';
import {
	DEFAULT_BANK_PAYMENT_ACCOUNTS,
	DEFAULT_CUSTOM_PAYMENT_CUSTOM,
	DEFAULT_PAYPAL_PAYMENT_PAYPAL,
} from 'config/constants';
import { PaymentWay } from './PaymentWay';

import './index.css';

const { Option } = Select;

const PaymentAccounts = ({
	currentActiveTab = '',
	router,
	isUpgrade,
	user_payments = {},
	setConfig = () => {},
	offramp = {},
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentTab, setCurrentTab] = useState('payment');
	const [paymenttype, setPaymentType] = useState('initial');
	const [paymentSelect, setPaymentSelect] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [payOption, setPayOption] = useState(true);
	const [isDisplayForm, setIsDisplayForm] = useState(true);
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
	const [paymentSavedCoins, setPaymentSavedCoins] = useState([]);
	const [paymentmethodIndex, setPaymentmethodIndex] = useState(1);

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

	const constructedData = (paymentType) => {
		const tempData = user_payments[paymentType]?.data || [];
		let temp = {};
		tempData.forEach((item, index) => {
			temp = {
				...temp,
				[`section_${index + 1}`]: item,
			};
		});
		return temp;
	};

	const generateFormFieldsValues = (type, paymentType, currentType) => {
		if (type === 'bankForm') {
			setBankInitValue(
				currentType === 'add'
					? defaultBankInitialValues
					: constructedData(paymentType)
			);
		} else if (type === 'paypalForm') {
			setPaypalInitValue(
				currentType === 'add'
					? defaultPaypalInitialValues
					: constructedData(paymentType)
			);
		} else if (type === 'customForm') {
			const test =
				currentType === 'add'
					? getCustomDefaultValues(paymentType)
					: constructedData(paymentType);
			setCustomInitValue(test);
		}
	};

	useEffect(() => {
		generateDefaultInitValue();
	}, [currentPaymentType, generateDefaultInitValue]);

	useEffect(() => {
		let tempBank = { ...bankInitialValues };
		let tempPaypal = { ...paypalInitialValues };
		let tempCustom = { ...customInitialValues };
		let firstPayment = [];
		if (Object.keys(user_payments).length) {
			setPayOption(true);
			setIsDisplayForm(false);
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
		}
		// TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user_payments]);

	useEffect(() => {
		if (formValues && Object.keys(formValues).length) {
			let temp = Object.keys(formValues).map((item) => item);
			setPaymentMethods(temp);
		}
	}, [formValues]);

	const getConstantData = (type) => {
		getConstants()
			.then((res) => {
				if (_get(res, 'kit.user_payments')) {
					const tempData = _get(res, 'kit.user_payments');
					let temp = Object.keys(tempData).map((item) => item);
					if (type === 'delete') {
						setPaymentMethod(temp[0]);
						if (
							!tempData ||
							!Object.keys(tempData).length ||
							Object.keys(tempData).length === 0
						) {
							setIsDisplayForm(true);
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
					setPaymentmethodIndex(1);
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
		setIsLoading(true);
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
		setPaymentmethodIndex(1);
		setIsLoading(true);
		setIsVisible(val);
		setPaymentType('paymentform');
		setSaveType(saveMethod);
		setIsDisplayDetails(false);
		updateConstantsData(bodyData, 'add');
	};
	const handleClose = (val, type = '', formData = {}) => {
		setIsVisible(val);
		setCurrentTab(type);
		setFormData(formData);
		let userPayment = {};
		let paymentAccData = [];
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
		if (currentType === 'add') {
			setPaymentmethodIndex(
				user_payments && Object.keys(user_payments).length
					? Object.keys(user_payments).length + 1
					: 1
			);
		} else {
			setPaymentmethodIndex(
				Object.keys(user_payments).indexOf(currentPaymentType) + 1
			);
		}

		setCurrentIndex(curIndex);
		generateFormFieldsValues(type, currentPaymentType, currentType);
		if (currentType) {
			setCurrentType(currentType);
		}
	};
	const onCancel = () => {
		setIsVisible(false);
		setCurrentTab('payment');
		setPaymentSavedCoins([]);
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

	const handlePopupDel = (method) => {
		let deletedData = {};
		if (currentActiveTab && currentActiveTab === 'paymentAccounts') {
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

		let paymentSavedCoins = Object.keys(offramp).filter((item) => {
			if (offramp[item].includes(method)) {
				return item;
			}
			return null;
		});
		if (
			paymentSavedCoins &&
			currentActiveTab &&
			currentActiveTab === 'paymentAccounts' &&
			paymentSavedCoins.length > 0
		) {
			setPaymentSavedCoins(paymentSavedCoins);
		} else {
			updateConstantsData(deletedBodyData, 'delete');
			setIsVisible(false);
			setPaymentmethodIndex(1);
		}
	};
	const setPaymentMethod = (e) => {
		setCurrentIndex(Object.keys(user_payments).indexOf(e) + 1);
		setPaymentmethodIndex(Object.keys(formValues).indexOf(e) + 1);
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
		setPaymentmethodIndex(currentIndex);
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
											? 'withdrawing fiat.'
											: 'receiving fiat.'}
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
											? 'off ramping page.'
											: 'on and off ramping.'}
									</div>
								</div>
							</div>
							<Button
								type="primary"
								className={!isUpgrade ? 'green-btn disableall' : 'green-btn'}
								onClick={() => handleClosePlugin(true)}
								disabled={isDisplayDetails || isLoading}
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
										return (
											<Option value={item} key={index}>
												User payment account {index + 1}: {item}
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
					{isDisplayForm ? (
						<PaymentWay
							paymenttype={paymenttype}
							handleClosePlugin={handleClosePlugin}
							handleSave={handleSave}
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
							currentIndex={paymentmethodIndex}
							handleBack={handleBack}
							currentType={currentType}
							defaultBankInitialValues={defaultBankInitialValues}
							defaultPaypalInitialValues={defaultPaypalInitialValues}
							defaultCustomInitialValues={defaultCustomInitialValues}
							user_payments={user_payments}
						/>
					) : null}
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
							paymentIndex={paymentmethodIndex}
						/>
					) : null}
				</div>
			)}
			<Modal visible={isVisible} footer={null} width={500} onCancel={onCancel}>
				<PaymentAccountPopup
					handleClosePlugin={handleClosePlugin}
					type={currentTab}
					tabUpdate={tabUpdate}
					handlePopupDel={handlePopupDel}
					formData={formData}
					formUpdate={formUpdate}
					handleSaveAndPublish={handleSaveAndPublish}
					currentActiveTab={currentActiveTab}
					user_payments={formValues}
					bodyData={bodyData}
					paymentSelectData={currentPaymentType}
					selectedPlugin={selectedPlugin}
					currentIndex={paymentmethodIndex}
					paymentSavedCoins={paymentSavedCoins}
					setIsDisplayDetails={setIsDisplayDetails}
					offramp={offramp}
					isVisible={isVisible}
					setPaymentSavedCoins={setPaymentSavedCoins}
					handleBack={handleBack}
				/>
			</Modal>
		</div>
	);
};

export default PaymentAccounts;
