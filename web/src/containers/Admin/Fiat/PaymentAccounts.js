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
import { constractPaymentOption } from 'utils/utils';

import './index.css';

const { Option } = Select;

const PaymentAccounts = ({
	router,
	isUpgrade,
	user_payments = {},
	paymentsMethodsData = [],
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
	const [formValues, setFormValues] = useState([]);
	const [currentPaymentType, setCurrentPaymentType] = useState('');
	const [isCustomPay, setIsCustomPay] = useState(false);
	const [isDisplayDetails, setIsDisplayDetails] = useState(false);
	const [selectedPlugin, setPlugin] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [defaultBankInitialValues, setDefaultBankInitValue] = useState({});
	const [defaultPaypalInitialValues, setDefaultPaypalInitValue] = useState({});
	const [defaultCustomInitialValues, setDefaultCustomInitValue] = useState({});
	const [currentType, setCurrentType] = useState('');
	const [paymentSavedCoins, setPaymentSavedCoins] = useState([]);
	const [paymentmethodLen, setPaymentmethodLen] = useState(0);
	const [paymentOrderBy, setPaymentOrderBy] = useState(0);

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
		const tempData =
			paymentsMethodsData.filter((item) => item.name === paymentType)[0]
				?.data || [];
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

		if (paymentsMethodsData.length) {
			setPaymentmethodLen(paymentsMethodsData.length);
			setPayOption(true);
			setIsDisplayForm(false);
			paymentsMethodsData.forEach((item) => {
				const tempArr = item?.data || [];
				tempArr.forEach((elem, index) => {
					if (item.name === 'bank') {
						tempBank = {
							...tempBank,
							[`section_${index + 1}`]: elem,
						};
					} else if (item.name === 'paypal') {
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
			setFormValues(paymentsMethodsData);
			setPaymentSelect(paymentsMethodsData[0].name);
		}
		// TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentsMethodsData]);

	const getConstantData = (type) => {
		getConstants()
			.then((res) => {
				if (_get(res, 'kit.user_payments')) {
					const tempData =
						constractPaymentOption(_get(res, 'kit.user_payments')) || [];
					setPaymentmethodLen(tempData.length);
					if (type === 'delete') {
						if (tempData.length === 0) {
							setIsDisplayForm(true);
							setPaymentType('initial');
							setFormValues([]);
							setBankInitValue({});
							setPaypalInitValue({});
							setCustomInitValue({});
							setIsDisplayDetails(false);
						} else {
							setPaymentMethod(tempData[0]?.name);
						}
					} else if (type === 'add') {
						setPaymentMethod(tempData[tempData.length - 1].name);
						setFormValues(tempData);
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
					[currentPaymentType]: {
						data: paymentAccData,
						orderBy: paymentOrderBy,
					},
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
		generateFormFieldsValues(type, currentPaymentType, currentType);
		if (currentType === 'add') {
			setPaymentOrderBy(paymentmethodLen + 1);
		} else {
			const inx = paymentsMethodsData.filter(
				(item) => item.name === currentPaymentType
			)[0]?.orderBy;
			setPaymentOrderBy(inx);
		}
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
		const bodyData = {};
		let orderBy = 1;
		paymentsMethodsData.forEach((item) => {
			if (item.name !== method) {
				bodyData[item.name] = { data: item.data, orderBy: orderBy };
				orderBy++;
			}
		});

		let deletedBodyData = {
			kit: { user_payments: bodyData },
		};

		let paymentSavedCoins = Object.keys(offramp).filter((item) => {
			if (offramp[item].includes(method)) {
				return item.name;
			}
			return null;
		});
		if (paymentSavedCoins && paymentSavedCoins.length > 0) {
			setPaymentSavedCoins(paymentSavedCoins);
		} else {
			updateConstantsData(deletedBodyData, 'delete');
			setIsVisible(false);
		}
	};

	const setPaymentMethod = (e) => {
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
	};

	return (
		<div className="payment-acc-wrapper">
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

				<div className={!isUpgrade ? 'disableall' : ''}>
					{payOption && formValues.length && formValues.length > 1 ? (
						<div className="mt-4">
							<div>Payment accounts ({formValues.length} method saved)</div>
							<div className="mb-3">
								<Select
									className="paymentSelect"
									defaultValue={formValues[0]}
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
									{formValues.map((item, index) => {
										return (
											<Option value={item.name} key={index}>
												User payment account {item.orderBy}: {item.name}
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
							currentActiveTab={'paymentAccounts'}
							bankInitialValues={bankInitialValues}
							paypalInitialValues={paypalInitialValues}
							customInitialValues={customInitialValues}
							currentPaymentType={currentPaymentType}
							isCustomPay={isCustomPay}
							currentIndex={paymentOrderBy}
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
							user_payments={user_payments}
							activeTab={'paymentAccounts'}
							paymentIndex={paymentOrderBy}
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
					currentActiveTab={'paymentAccounts'}
					user_payments={user_payments}
					bodyData={bodyData}
					paymentSelectData={currentPaymentType}
					selectedPlugin={selectedPlugin}
					currentIndex={paymentOrderBy}
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
