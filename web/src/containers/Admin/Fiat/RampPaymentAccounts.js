import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Select, message } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import _get from 'lodash/get';

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

const RampPaymentAccounts = ({
	router,
	isUpgrade,
	user_payments = {},
	formType = '',
	isDisplayFormData = false,
	onramp = {},
	currentActiveTab = '',
	coinSymbol = '',
	setConfig = () => {},
	customName = '',
	originalonramp = {},
	offramp = {},
	pluginName = '',
	currentsymbol = '',
	isPaymentForm = false,
	setCoindata,
	selectedPaymentType = '',
	originalofframp = {},
	getUpdatedKitData = () => {},
	setSelectedPayType = () => {},
	paymentIndex = 1,
	currentOnrampType = 'initial',
	OnsetCurrentType = () => {},
	isProceed = false,
	setIsProceed = () => {},
	isModalVisible = false,
	setIsLoading = () => {},
	setIsDisable = () => {},
	isDisable = false,
	onrampIndex = 1,
	setOnrampIndex = () => {},
	selectedPayType,
	setOfframpCurrentType = () => {},
	offrampCurrentType = '',
	setCoinSymbol = () => {},
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentTab, setCurrentTab] = useState('payment');
	const [paymenttype, setPaymentType] = useState('initial');
	const [savedContent, setSavedContent] = useState(false);
	const [paymentSelect, setPaymentSelect] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [payOption, setPayOption] = useState(true);
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
	const [defaultBankInitialValues, setDefaultBankInitValue] = useState({});
	const [defaultPaypalInitialValues, setDefaultPaypalInitValue] = useState({});
	const [defaultCustomInitialValues, setDefaultCustomInitValue] = useState({});
	const [currentType, setCurrentType] = useState('');
	const [isCurrentFormOpen, setIsCurrentFormOpen] = useState(false);
	const [paymentSavedCoins, setPaymentSavedCoins] = useState([]);
	const [paymentmethodIndex, setPaymentmethodIndex] = useState(1);

	useEffect(() => {
		if (currentActiveTab && currentActiveTab === 'onRamp') {
			setCurrentIndex(onrampIndex);
		}
	}, [onrampIndex, currentActiveTab]);

	useEffect(() => {
		if (
			selectedPayType &&
			Object.keys(selectedPayType).length &&
			offrampCurrentType &&
			offrampCurrentType === 'edit'
		) {
			setIsDisplayDetails(false);
		}
		// eslint-disable-next-line
	}, [selectedPayType]);

	useEffect(() => {
		if (currentPaymentType !== customName) {
			setCurrentPaymentType(customName);
		}
		// eslint-disable-next-line
	}, [customName]);

	useEffect(() => {
		if (isCurrentFormOpen) {
			setIsDisable(true);
		} else if (!isCurrentFormOpen) {
			setIsDisable(false);
		}
	}, [isCurrentFormOpen, setIsDisable]);

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
		let temp = {};
		if (currentActiveTab && currentActiveTab === 'offRamp') {
			const tempData = user_payments[paymentType]?.data || [];
			tempData.forEach((item, index) => {
				temp = {
					...temp,
					[`section_${index + 1}`]: item,
				};
			});
		} else {
			const tempData = onramp[paymentType]?.data || [];
			tempData.forEach((item) => {
				if (item?.length) {
					item.forEach((nestItem, index) => {
						temp = {
							...temp,
							[`section_${index + 1}`]: nestItem,
						};
					});
				}
			});
		}
		return temp;
	};

	const integrateFieldValues = (fieldKey = 'bank', fieldData) => {
		let tempVal = { ...fieldData };
		let newVal = onramp?.[fieldKey]?.data?.[0];
		if (newVal?.length) {
			Object.keys(fieldData).forEach((val) => {
				let valTemp = fieldData[val];
				if (valTemp && valTemp.key) {
					let res = newVal?.find((p) => p.key === valTemp.key) ?? {};
					tempVal[val].value = res.value ?? '';
				}
			});
		}
		return tempVal;
	};

	const generateFormFieldsValues = (type, paymentType, currentType) => {
		if (type === 'bankForm') {
			setBankInitValue(
				currentType === 'add'
					? defaultBankInitialValues
					: currentActiveTab && currentActiveTab === 'offRamp'
					? constructedData(paymentType)
					: integrateFieldValues('bank', constructedData(paymentType))
			);
		} else if (type === 'paypalForm') {
			setPaypalInitValue(
				currentType === 'add'
					? defaultPaypalInitialValues
					: currentActiveTab && currentActiveTab === 'offRamp'
					? constructedData(paymentType)
					: integrateFieldValues('paypal', constructedData(paymentType))
			);
		} else if (type === 'customForm') {
			setCustomInitValue(
				currentType === 'add'
					? getCustomDefaultValues(paymentType)
					: currentActiveTab && currentActiveTab === 'offRamp'
					? constructedData(paymentType)
					: integrateFieldValues(paymentType, constructedData(paymentType))
			);
		}
	};

	useEffect(() => {
		generateDefaultInitValue();
	}, [currentPaymentType, generateDefaultInitValue]);

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
			Object.keys(user_payments).length &&
			currentActiveTab &&
			currentActiveTab !== 'onRamp'
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
			if (currentActiveTab && currentActiveTab !== 'offRamp') {
				setBankInitValue(tempBank);
				setPaypalInitValue(tempPaypal);
				setCustomInitValue(tempCustom);
			}
			setFormValues(user_payments);
			setPaymentSelect(firstPayment[0]);
		} else if (currentActiveTab === 'onRamp') {
			if (
				Object.keys(onramp).length &&
				currentOnrampType !== 'add' &&
				currentOnrampType !== 'addSuccess'
			) {
				Object.keys(onramp).forEach((item) => {
					firstPayment = [...firstPayment, item];
					if (typeof onramp[item]?.data !== 'string') {
						return onramp[item]?.data?.forEach((elem) => {
							if (elem?.length) {
								elem.forEach((nestEl, indexKey) => {
									if (item === 'bank') {
										tempBank = {
											...tempBank,
											[`section_${indexKey + 1}`]: nestEl,
										};
									} else if (item === 'paypal') {
										tempPaypal = {
											...tempPaypal,
											[`section_${indexKey + 1}`]: nestEl,
										};
									} else {
										tempCustom = {
											...tempCustom,
											[`section_${indexKey + 1}`]: nestEl,
										};
									}
								});
							}
						});
					}
				});
				setPaypalInitValue(tempPaypal);
				setCustomInitValue(tempCustom);
				setFormValues(onramp);
				setPayOption(true);
				setPaymentSelect(firstPayment[0]);
			} else if (currentOnrampType === 'add') {
				Object.keys(user_payments).forEach((item) => {
					firstPayment = [...firstPayment, item];
				});
				if (customName === 'bank') {
					tempBank =
						Object.keys(user_payments).length &&
						user_payments['bank']?.data.length > 0
							? getStructedDataFromArray(user_payments['bank'].data)
							: defaultBankInitialValues;
				} else if (customName === 'paypal') {
					tempPaypal =
						Object.keys(user_payments).length &&
						user_payments['paypal']?.data.length > 0
							? getStructedDataFromArray(user_payments['paypal'].data)
							: defaultPaypalInitialValues;
				} else if (customName.trim() !== '') {
					tempCustom = getCustomDefaultValues(customName);
				}
				setCurrentType('add');
				setBankInitValue(tempBank);
				setPaypalInitValue(tempPaypal);
				setCustomInitValue(tempCustom);
				setFormValues(onramp);
				setPayOption(true);
				setPaymentSelect(firstPayment[0]);
				OnsetCurrentType('addSuccess');
			}
		} else {
			setPayOption(false);
			setFormValues(user_payments);
		}
		// TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onramp, user_payments, currentActiveTab, currentOnrampType]);

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
		if (isProceed && currentsymbol === coinSymbol) {
			setPayOption(false);
			setIsDisplayDetails(true);
			setIsCurrentFormOpen(true);
		}
	}, [isProceed, currentsymbol, coinSymbol]);

	const getStructedDataFromArray = (value) => {
		let temp = {};
		value.forEach((val, index) => {
			temp[`section_${index + 1}`] = val;
		});
		return temp;
	};

	const getConstantData = (type) => {
		getConstants()
			.then((res) => {
				if (currentActiveTab && currentActiveTab === 'onRamp') {
					handleBack();
					setCurrentIndex(1);
					if (_get(res, 'kit.onramp')) {
						setFormValues(_get(res, `kit.onramp[${currentsymbol}]`));
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
				if (currentActiveTab && currentActiveTab === 'offRamp') {
					const { offramp = {} } = res && res.kit;
					setIsDisable(false);
					if (
						offramp &&
						Object.keys(offramp).length &&
						Object.keys(offramp).length > 1 &&
						currentsymbol
					) {
						Object.keys(selectedPayType).forEach((item) => {
							if (item && currentsymbol && item !== currentsymbol) {
								setSelectedPayType({
									...selectedPayType,
									[item]: selectedPayType?.item,
								});
							} else {
								setSelectedPayType({
									...selectedPayType,
									[currentsymbol]: offramp[currentsymbol]?.[0],
								});
							}
						});
					}
				}
				setConfig(res && res.kit);
				getUpdatedKitData(res && res.kit);
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
		let temp = [];
		if (currentActiveTab === 'onRamp') {
			Object.keys(formData).forEach((elem) => {
				const item = formData[elem];
				temp = [...temp, item];
				onRampData = {
					data: [temp],
					type: 'manual',
				};
			});
			userPayment = {
				kit: {
					onramp: {
						...originalonramp,
						[currentsymbol]: {
							...originalonramp[currentsymbol],
							[currentPaymentType]: onRampData,
						},
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
		setIsDisplayDetails(true);
		setPaymentType(type);
		setCurrentPaymentType(currentPaymentType);
		setIsCustomPay(isCustomPay);
		setIsDisplayDetails(true);
		if (currentType && currentType === 'edit') {
			setIsDisable(true);
			setOfframpCurrentType('edit');
		}
		setCurrentIndex(curIndex);
		setPaymentmethodIndex(curIndex);
		generateFormFieldsValues(type, currentPaymentType, currentType);
		if (currentType) {
			setCurrentType(currentType);
		}
		if (currentActiveTab && currentActiveTab === 'onRamp') {
			setIsCurrentFormOpen(true);
		} else {
			setCoinSymbol(currentsymbol);
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
		let deletedData = {};
		let deletedBodyData = {};
		if (currentActiveTab && currentActiveTab === 'onRamp') {
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
						[currentsymbol]: deletedData,
					},
				},
			};
		} else if (currentActiveTab && currentActiveTab === 'offRamp') {
			const filteredOfframp = originalofframp[coinSymbol].filter(
				(item) => item !== method
			);
			deletedBodyData = {
				kit: {
					offramp: {
						...originalofframp,
						[coinSymbol]: filteredOfframp,
					},
				},
			};
		}
		updateConstantsData(deletedBodyData, 'delete');
		setIsVisible(false);
		setPaymentmethodIndex(1);
	};
	const handleEdit = () => {
		setSavedContent(false);
	};
	const setPaymentMethod = (e) => {
		setCurrentIndex(Object.keys(formValues).indexOf(e) + 1);
		setPaymentmethodIndex(Object.keys(formValues).indexOf(e) + 1);
		setPaymentSelect(e);
		setPayOption(true);
		setIsDisplayDetails(false);
		setIsCurrentFormOpen(false);
	};
	const handleOpenPayment = () => {
		setIsOpen(!isOpen);
	};

	const handleBack = () => {
		setIsDisable(false);
		setOnrampIndex(1);
		if (!user_payments || !Object.keys(user_payments).length) {
			setPaymentType('initial');
		}
		setIsDisplayDetails(false);
		setIsCurrentFormOpen(false);
		setPaymentmethodIndex(currentIndex);
		if (currentActiveTab && currentActiveTab === 'onRamp') {
			setIsProceed(false);
			OnsetCurrentType('');
		}
	};

	const handleOpen = (text) => {
		if (text === 'open') {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	};

	return (
		<div className="payment-acc-wrapper">
			<div>
				<div className={!isUpgrade ? 'disableall' : ''}>
					{paymentMethods.length && paymentMethods.length > 1 ? (
						<div className="mt-4">
							<div>Payment accounts ({paymentMethods.length} method saved)</div>
							<div className="mb-3">
								<Select
									className="paymentSelect"
									defaultValue={paymentMethods[0]}
									value={paymentSelect}
									suffixIcon={
										isOpen ? (
											<CaretDownOutlined
												className="downarrow"
												onClick={() => handleOpen('close')}
											/>
										) : (
											<CaretUpOutlined
												className="downarrow"
												onClick={() => handleOpen('open')}
											/>
										)
									}
									open={isOpen}
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
			<div className={!isUpgrade ? 'disableall' : ''}>
				{(currentActiveTab &&
					currentActiveTab === 'onRamp' &&
					isCurrentFormOpen) ||
				(currentActiveTab &&
					currentActiveTab === 'offRamp' &&
					isDisplayDetails) ? (
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
						currentIndex={
							currentActiveTab && currentActiveTab === 'onRamp'
								? currentIndex
								: paymentmethodIndex
						}
						handleBack={handleBack}
						currentType={currentType}
						defaultBankInitialValues={defaultBankInitialValues}
						defaultPaypalInitialValues={defaultPaypalInitialValues}
						defaultCustomInitialValues={defaultCustomInitialValues}
					/>
				) : null}
				{payOption &&
				!isDisplayDetails &&
				(paymentSelect || selectedPaymentType) ? (
					<PaymentDetails
						type={
							currentActiveTab && currentActiveTab === 'offRamp'
								? selectedPaymentType
								: paymentSelect
						}
						formUpdate={formUpdate}
						saveType={saveType}
						handleClose={handleClose}
						formData={formData}
						router={router}
						user_payments={formValues}
						activeTab={currentActiveTab}
						paymentIndex={
							currentActiveTab && currentActiveTab === 'offRamp'
								? paymentIndex
								: currentIndex
						}
						isDisable={isDisable}
					/>
				) : null}
			</div>
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
					paymentSelectData={currentPaymentType}
					coinSymbol={currentsymbol}
					selectedPlugin={selectedPlugin}
					currentsymbol={currentsymbol}
					setCoindata={setCoindata}
					currentIndex={
						currentActiveTab && currentActiveTab === 'onRamp'
							? currentIndex
							: paymentmethodIndex
					}
					selectedPaymentType={
						(originalofframp &&
							originalofframp[currentsymbol] &&
							originalofframp[currentsymbol][0]) ||
						(offramp && offramp[0])
					}
					paymentSavedCoins={paymentSavedCoins}
					setIsDisplayDetails={setIsDisplayDetails}
				/>
			</Modal>
		</div>
	);
};

export default RampPaymentAccounts;
