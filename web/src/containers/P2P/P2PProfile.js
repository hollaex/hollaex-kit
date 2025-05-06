/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Button, message, Rate, Modal, Input, Select } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import './_P2P.scss';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Dialog, EditWrapper } from 'components';
import {
	fetchFeedback,
	fetchP2PProfile,
	fetchP2PPaymentMethods,
	createP2PPaymentMethod,
	updateP2PPaymentMethod,
	deleteP2PPaymentMethod,
} from './actions/p2pActions';
import { Loading } from 'containers/DigitalAssets/components/utils';

const P2PProfile = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	user,
	refresh,
	setSelectedDealEdit,
	setTab,
	selectedProfile,
	setSelectedProfile,
	setRefresh,
	p2p_config,
}) => {
	const [myDeals, setMyDeals] = useState([]);
	// const [checks] = useState([]);
	const [myProfile, setMyProfile] = useState();
	const [selectedUser] = useState(user);
	const [selectedTab, setSelectedTab] = useState('0');
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [selectedMethod, setSelectedMethod] = useState({
		name: null,
		details: {},
		is_p2p: true,
	});
	const [addMethodDetails, setAddMethodDetails] = useState();
	const [myMethods, setMyMethods] = useState([]);
	// const [displayPaymentAdd, setDisplayPaymentAdd] = useState(false);
	const [displayNewPayment, setDisplayNewPayment] = useState(false);
	const [paymentFieldAdd, setPaymentFieldAdd] = useState(false);
	const [displayConfirmation, setDisplayConfirmation] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState({
		system_name: null,
		fields: {},
	});
	const [customFields, setCustomFields] = useState([
		{
			id: 1,
			name: null,
			required: true,
		},
	]);
	const [customField, setCustomField] = useState({
		id: null,
		name: null,
		required: null,
	});

	useEffect(() => {
		setIsLoading(true);
		fetchFeedback({ merchant_id: (selectedProfile || selectedUser).id })
			.then((res) => {
				setMyDeals(res.data);
			})
			.catch((err) => err);
		setIsLoading(false);

		fetchP2PProfile({ user_id: (selectedProfile || selectedUser).id })
			.then((res) => {
				setMyProfile(res);
			})
			.catch((err) => err);

		fetchP2PPaymentMethods({ is_p2p: true })
			.then((res) => {
				setMyMethods(res.data);
			})
			.catch((err) => err);

		setDefaultPaymentMethod();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh, selectedProfile]);

	const setDefaultPaymentMethod = () => {
		const defaultPaymentOption = p2p_config?.bank_payment_methods?.[0];
		if (defaultPaymentOption) {
			setPaymentMethod({
				...paymentMethod,
				system_name: defaultPaymentOption?.system_name,
			});
			setCustomFields(defaultPaymentOption?.fields);
		} else {
			setPaymentMethod({
				system_name: null,
				fields: {},
			});
		}
	};

	const isPaymentMethod = myMethods?.filter((method) => {
		return method?.name === paymentMethod?.system_name;
	});

	return (
		<div
			className={classnames(
				...[
					'P2pOrder p2p-profile-wrapper w-100',
					isMobile ? 'mobile-view-p2p p2p-mobile-profile' : '',
				]
			)}
		>
			<div className="p2p-profile-content-wrapper">
				<div
					className={
						isMobile
							? 'display-label fs-24 important-text'
							: 'display-label fs-16 important-text'
					}
				>
					<EditWrapper stringId="P2P.DISPLAY_NAME">
						{STRINGS['P2P.DISPLAY_NAME']}
					</EditWrapper>
				</div>
				<div className="mb-4">
					{(selectedProfile || selectedUser)?.full_name || (
						<EditWrapper stringId="P2P.ANONYMOUS">
							{STRINGS['P2P.ANONYMOUS']}
						</EditWrapper>
					)}
				</div>
				{/* <div style={{ marginBottom: 20, display: 'flex', gap: 5 }}>
					<div><Checkbox style={{ color: 'white' }} checked={true}>EMAIL</Checkbox></div>
					<div><Checkbox style={{ color: 'white' }} checked={true}>SMS</Checkbox></div>
					<div><Checkbox style={{ color: 'white' }} checked={true}>ID</Checkbox></div>
				</div> */}
				<div className="profile-card-wrapper">
					<div className="profile-card-content-wrapper important-text">
						<div className="profile-cards">
							<div
								className={
									isMobile ? 'fs-24 text-uppercase' : 'fs-14 text-uppercase'
								}
							>
								<EditWrapper stringId="P2P.TOTAL_ORDERS">
									{STRINGS['P2P.TOTAL_ORDERS']}
								</EditWrapper>
							</div>
							<div className={isMobile ? 'fs-24' : 'fs-18'}>
								{myProfile?.totalTransactions} {STRINGS['P2P.TIMES']}
							</div>
						</div>
						<div className="profile-cards">
							<div
								className={
									isMobile ? 'fs-24 text-uppercase' : 'fs-14 text-uppercase'
								}
							>
								<EditWrapper stringId="P2P.COMPLETION_RATE">
									{STRINGS['P2P.COMPLETION_RATE']}
								</EditWrapper>
							</div>
							<div className={isMobile ? 'fs-24' : 'fs-18'}>
								{(myProfile?.completionRate || 0).toFixed(2)}%
							</div>
						</div>
						<div className="profile-cards">
							<div
								className={
									isMobile ? 'fs-24 text-uppercase' : 'fs-14 text-uppercase'
								}
							>
								<EditWrapper stringId="P2P.POSITIVE_FEEDBACK">
									{STRINGS['P2P.POSITIVE_FEEDBACK']}
								</EditWrapper>
							</div>
							<div className={isMobile ? 'fs-24' : 'fs-18'}>
								{(myProfile?.positiveFeedbackRate || 0).toFixed(2)}%
							</div>
							<div>
								<EditWrapper stringId="P2P.POSITIVE">
									{STRINGS['P2P.POSITIVE']}
								</EditWrapper>{' '}
								{myProfile?.positiveFeedbackCount} /{' '}
								<EditWrapper stringId="P2P.NEGATIVE">
									{STRINGS['P2P.NEGATIVE']}
								</EditWrapper>{' '}
								{myProfile?.negativeFeedbackCount}
							</div>
						</div>
					</div>
				</div>

				<div className="p2p-btn-wrapper mt-3 mb-5">
					<div
						className={`${
							selectedTab === '0'
								? 'active-btn important-text method-btn'
								: 'method-btn'
						}`}
						onClick={() => {
							setSelectedTab('0');
						}}
					>
						<EditWrapper stringId="P2P.P2P_METHODS">
							{STRINGS['P2P.P2P_METHODS']}
						</EditWrapper>
					</div>

					<div
						className={`${
							selectedTab === '1'
								? 'active-btn important-text feedback-btn'
								: 'feedback-btn'
						}`}
						onClick={() => {
							setSelectedTab('1');
						}}
					>
						<EditWrapper stringId="P2P.P2P_METHODS">
							{STRINGS['P2P.FEEDBACK']}
						</EditWrapper>
						({myDeals.length || 0})
					</div>
				</div>
				{selectedTab === '0' && (
					<div className="payment-method-wrapper">
						<div
							className={
								isMobile
									? 'd-flex justify-content-between flex-column-reverse'
									: 'd-flex justify-content-between'
							}
						>
							<div className={isMobile ? 'flex-1 mt-5' : 'flex-1'}>
								<div className="pay-method-desc-wrapper">
									<div className="pay-method-label important-text">
										<EditWrapper stringId="P2P.PAYMENT_METHODS">
											<span className={isMobile ? 'fs-24' : ''}>
												{STRINGS['P2P.PAYMENT_METHODS']}
											</span>
										</EditWrapper>
									</div>
									<div className="secondary-text">
										<EditWrapper stringId="P2P.PAYMENT_METHODS_DEC">
											{STRINGS['P2P.PAYMENT_METHODS_DEC']}
										</EditWrapper>
									</div>
								</div>
							</div>
							<div className="flex-1">
								<div>
									<div className="pay-method-label important-text">
										<EditWrapper stringId="P2P.PAYMENT_METHODS_SEND_FIAT">
											{STRINGS['P2P.PAYMENT_METHODS_SEND_FIAT']}
										</EditWrapper>
									</div>
									<div className="mt-2 mb-3 add-payment-wrapper">
										<Button
											className="purpleButtonP2P"
											onClick={() => {
												setDisplayNewPayment(true);
											}}
										>
											<EditWrapper stringId="P2P.ADD_PAYMENT_METHOD">
												{STRINGS['P2P.ADD_PAYMENT_METHOD']}
											</EditWrapper>
										</Button>
									</div>

									{myMethods
										?.map((x) => x.details)
										.map((method, index) => {
											const info = myMethods.find(
												(x) => x?.details?.system_name === method?.system_name
											);
											return (
												<div className="payment-fields" key={`method-${index}`}>
													<div
														className="whiteTextP2P field pay-field"
														onClick={() => {
															const newSelected = [...paymentMethods];

															if (
																newSelected.find(
																	(x) => x.system_name === method.system_name
																)
															) {
																setPaymentMethods(
																	newSelected.filter(
																		(x) => x.system_name !== method.system_name
																	)
																);
															} else {
																newSelected.push(method);
																setPaymentMethods(newSelected);
																setSelectedMethod(method);
																setAddMethodDetails(true);
															}
														}}
													>
														<div>{method.system_name}</div>
													</div>
													{info?.status !== 3 && (
														<div
															onClick={() => {
																setSelectedMethod(method);
																setAddMethodDetails(true);
															}}
															className="edit-txt blue-link"
														>
															<EditWrapper stringId="P2P.EDIT_UPPERCASE">
																<span>{STRINGS['P2P.EDIT_UPPERCASE']}</span>
															</EditWrapper>
														</div>
													)}
													<div
														onClick={() => {
															setSelectedMethod(method);
															setDisplayConfirmation(true);
														}}
														className="delete-txt blue-link"
													>
														<EditWrapper stringId="P2P.DELETE_UPPERCASE">
															<span>{STRINGS['P2P.DELETE_UPPERCASE']}</span>
														</EditWrapper>
													</div>
													<div>
														{info?.status === 0 && (
															<div className="d-flex align-items-end">
																<span className="unverified-label">
																	({STRINGS['P2P.UNVERIFIED']})
																</span>
																<span className="secondary-text ml-2">
																	<ClockCircleOutlined />
																</span>
															</div>
														)}
														{info?.status === 1 && (
															<span className="pending-label">
																({STRINGS['TRANSACTION_STATUS.PENDING']})
															</span>
														)}
														{info?.status === 2 && (
															<span className="rejected-label">
																({STRINGS['TRANSACTION_STATUS.REJECTED']})
															</span>
														)}
														{info?.status === 3 && (
															<div className="d-flex">
																<div className="verified-label">
																	({STRINGS['P2P.VERIFIED']})
																</div>
																<div className="mt-2 ml-2">✔</div>
															</div>
														)}
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
				)}
				{selectedTab === '1' && (
					<div className="feedback-wrapper">
						{myDeals.length === 0 ? (
							<div className="no-feedback">
								<EditWrapper stringId="P2P.NO_FEEDBACK">
									{STRINGS['P2P.NO_FEEDBACK']}
								</EditWrapper>
							</div>
						) : (
							<table className="feedback-table-wrapper w-100">
								<thead>
									<tr className="table-header-wrapper">
										<th>
											<EditWrapper stringId="P2P.DATE">
												{STRINGS['P2P.DATE']}
											</EditWrapper>
										</th>
										<th>
											<EditWrapper stringId="P2P.USER">
												{STRINGS['P2P.USER']}
											</EditWrapper>
										</th>
										<th>
											<EditWrapper stringId="P2P.COMMENT">
												{STRINGS['P2P.COMMENT']}
											</EditWrapper>
										</th>
										<th>
											<EditWrapper stringId="P2P.RATING">
												{STRINGS['P2P.RATING']}
											</EditWrapper>
										</th>
									</tr>
								</thead>
								<tbody
									className={
										isMobile ? 'fs-16 important-text' : 'important-text'
									}
								>
									{myDeals.map((deal, index) => {
										return (
											<tr className="table-row" key={`deal-${index}`}>
												{isLoading ? (
													<Loading index={index} />
												) : (
													<td className="w-25 td-fit">
														{moment(deal.created_at).format(
															'DD/MMM/YYYY, hh:mmA'
														)}
													</td>
												)}
												<td className="w-25 td-fit">
													{isLoading ? (
														<Loading index={index} />
													) : (
														deal.user.full_name || (
															<EditWrapper stringId="P2P.ANONYMOUS">
																{STRINGS['P2P.ANONYMOUS']}
															</EditWrapper>
														)
													)}
												</td>
												<td className="w-25 td-fit">
													{isLoading ? <Loading index={index} /> : deal.comment}
												</td>
												<td className="w-25 td-fit">
													{isLoading ? (
														<Loading index={index} />
													) : (
														<Rate
															disabled
															allowHalf={false}
															autoFocus={false}
															allowClear={false}
															value={deal.rating}
														/>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				)}
				<Dialog
					className="add-payment-method-detail-popup"
					isOpen={!!addMethodDetails}
					footer={null}
					onCloseDialog={() => {
						setAddMethodDetails(false);
					}}
					label="add-payment-method-detail-popup"
				>
					<div className="whiteTextP2P add-payment-title">
						<EditWrapper stringId="P2P.ADD_PAYMENT_METHOD_DETAILS">
							{STRINGS.formatString(
								STRINGS['P2P.ADD_PAYMENT_METHOD_DETAILS'],
								STRINGS['EDIT_TEXT']
							)}
						</EditWrapper>
					</div>

					{selectedMethod?.fields?.map((x, index) => {
						return (
							<div
								className="whiteTextP2P selected-payment-method-field-wrapper"
								key={`selected-field-${index}`}
							>
								<div className="payment-method-title">{x?.name}:</div>
								<Input
									className="custom-input-field"
									value={x.value}
									onChange={(e) => {
										if (!selectedMethod.fields[index].value)
											selectedMethod.fields[index].value = '';

										selectedMethod.fields[index].value = e.target.value;

										const newSelected = [
											...(myMethods?.map((x) => x.details) || []),
										];

										const Index = newSelected.findIndex(
											(x) => x.system_name === selectedMethod.system_name
										);

										newSelected[Index].fields = selectedMethod.fields;

										setPaymentMethods(newSelected);
									}}
								/>
							</div>
						);
					})}

					<div className="new-payment-popup-button-container">
						<Button
							onClick={() => {
								setAddMethodDetails(false);
							}}
							className="purpleButtonP2P back-btn"
							type="default"
						>
							<EditWrapper stringId="P2P.BACK_UPPER">
								{STRINGS['P2P.BACK_UPPER']}
							</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								try {
									const newSelected = [
										...(myMethods?.map((x) => x.details) || []),
									];

									const Index = newSelected.findIndex(
										(x) => x.system_name === selectedMethod.system_name
									);

									newSelected[Index].fields = selectedMethod.fields;

									const payload = newSelected[Index];

									const found = myMethods.find(
										(x) =>
											x?.details?.system_name === selectedMethod?.system_name
									);

									await updateP2PPaymentMethod({
										id: found.id,
										details: payload,
									});

									fetchP2PPaymentMethods({ is_p2p: true })
										.then((res) => {
											setMyMethods(res.data);
										})
										.catch((err) => err);

									message.success(STRINGS['P2P.PAYMENT_METHOD_UPDATED']);
									setRefresh(!refresh);
									setAddMethodDetails(false);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
							className="purpleButtonP2P complete-btn"
							type="default"
						>
							<EditWrapper stringId="P2P.COMPLETE">
								{STRINGS['P2P.UPDATE'].toUpperCase()}
							</EditWrapper>
						</Button>
					</div>
				</Dialog>

				{displayNewPayment && (
					<Dialog
						className="p2p-new-payment-pop-up"
						isOpen={!!displayNewPayment}
						onCloseDialog={() => {
							setDisplayNewPayment(false);
						}}
						shouldCloseOnOverlayClick={true}
						showCloseText={true}
						label="p2p-new-payment-pop-up"
					>
						<h1 className="new-payment-method-title">
							<EditWrapper stringId="P2P.CREATE_NEW_PAYMENT_METHODS">
								{STRINGS['P2P.CREATE_NEW_PAYMENT_METHODS']}
							</EditWrapper>
						</h1>
						<div>
							<EditWrapper stringId="P2P.MANUAL_PAYMENT_METHOD_ENTRY">
								{STRINGS['P2P.MANUAL_PAYMENT_METHOD_ENTRY']}
							</EditWrapper>{' '}
						</div>
						<div className="mt-3 mb-3">
							<EditWrapper stringId="P2P.USERS_PAYMENT_SELECTION">
								{STRINGS['P2P.USERS_PAYMENT_SELECTION']}
							</EditWrapper>
						</div>
						<div className="custom-line mb-3"></div>
						<div className="name-detail-title">
							<EditWrapper stringId="P2P.METHOD_NAME_AND_DETAIL">
								{STRINGS['P2P.METHOD_NAME_AND_DETAIL']}
							</EditWrapper>
						</div>
						<div className="mt-3 mb-3 new-payment-field-container">
							<div>
								<EditWrapper stringId="P2P.ADD_NEW_PAYMENT_METHODS">
									{STRINGS['P2P.ADD_NEW_PAYMENT_METHODS']}
								</EditWrapper>
							</div>
							{/* <Input
									placeholder="Enter your system name"
									value={paymentMethod.system_name}
									onChange={(e) => {
									setPaymentMethod({
									...paymentMethod,
									system_name: e.target.value,
									});
								}}
							/> */}

							<Select
								showSearch
								className="new-payment-field"
								dropdownClassName="p2p-custom-style-dropdown"
								placeholder={STRINGS['P2P.SELECT_PAYMENT_SYSTEM_LABEL']}
								value={paymentMethod?.system_name}
								onChange={(e) => {
									setPaymentMethod({
										...paymentMethod,
										system_name: e,
									});
									setCustomFields(
										p2p_config?.bank_payment_methods.find(
											(method) => method.system_name === e
										).fields
									);
								}}
							>
								{p2p_config?.bank_payment_methods.map((method, index) => {
									return (
										<Select.Option value={method.system_name} key={index}>
											{method.system_name}
										</Select.Option>
									);
								})}
							</Select>
						</div>

						{customFields?.map((field, index) => {
							return (
								<div
									className="new-payment-details-input-wrapper mb-3"
									key={`custom-field-${index}`}
								>
									<div className="font-weight-bold fs-16">
										{STRINGS['P2P.FIELD']}
										{field.id}#
									</div>
									<div className="payment-method-title">
										{/* <EditWrapper stringId="P2P.DETAIL_NAME">
											{STRINGS['P2P.DETAIL_NAME']}
										</EditWrapper> */}
										{field.name}
									</div>
									{/* <Input
											placeholder="Input the payment detail name"
											readOnly
											value={field.name}
											onChange={(e) => {
											const newCustomFields = [...customFields];
											const found = newCustomFields.find(
											(x) => x.id === field.id
											);
											if (found) {
											found.name = e?.target?.value;
											}

											setCustomFields(newCustomFields);
											}}
										/> */}
									<div className="payment-detail-title mb-2">
										<EditWrapper stringId="P2P.DETAIL_VALUE">
											{STRINGS['P2P.DETAIL_VALUE']}
										</EditWrapper>
									</div>
									<Input
										className="custom-input-field"
										placeholder={STRINGS['P2P.NEW_PAYMENT_PLACEHOLDER']}
										value={field.value}
										onChange={(e) => {
											const newCustomFields = [...customFields];
											const found = newCustomFields.find(
												(x) => x.id === field.id
											);
											if (found) {
												found.value = e?.target?.value;
											}
											setCustomFields(newCustomFields);
										}}
									/>
								</div>
							);
						})}

						{/* <div
								style={{
								fontWeight: 'bold',
								cursor: 'pointer',
								}}
								onClick={() => {
								setPaymentFieldAdd(true);
								}}
								>
									<EditWrapper stringId="P2P.ADD_NEW_PAYMENT_FIELD">
									<span style={{ textDecoration: 'underline' }}>
									{STRINGS['P2P.ADD_NEW_PAYMENT_FIELD']}
									</span>
									</EditWrapper>
						</div> */}
						<div className="new-payment-popup-button-container">
							<Button
								onClick={() => {
									setDisplayNewPayment(false);
								}}
								className="purpleButtonP2P back-btn"
								type="default"
							>
								{STRINGS['BACK_TEXT'].toUpperCase()}
							</Button>

							<Button
								onClick={async () => {
									if (isPaymentMethod?.length === 0) {
										const payload = {
											system_name: paymentMethod.system_name,
											fields: customFields,
										};
										paymentMethods.push(payload);

										if (!payload.system_name) {
											message.error(STRINGS['P2P.INPUT_METHOD_NAME_TEXT']);
											return;
										}

										let hasValidation = true;
										payload.fields?.forEach((field) => {
											if (!field.name || !field.value) {
												message.error(STRINGS['P2P.FIELD_VALIDATION_TEXT']);
												hasValidation = false;
											}
										});
										if (!hasValidation) return;
										await createP2PPaymentMethod({
											name: payload.system_name,
											details: payload,
											is_p2p: true,
										});

										message.success(STRINGS['P2P.PAYMENT_METHOD_CREATED']);

										fetchP2PPaymentMethods({ is_p2p: true })
											.then((res) => {
												setMyMethods(res.data);
											})
											.catch((err) => err);

										setPaymentMethods(paymentMethods);
										setDisplayNewPayment(false);
										setDefaultPaymentMethod();
										setCustomFields([
											{
												id: 1,
												name: null,
												required: true,
											},
										]);
										setRefresh(!refresh);
									} else {
										message.error(
											STRINGS.formatString(
												STRINGS['P2P.EXIST_PAYMENT_METHOD_DESC'],
												paymentMethod?.system_name
											)
										);
										setDisplayNewPayment(false);
									}
								}}
								className="purpleButtonP2P add-btn"
								type="default"
							>
								{STRINGS['DEVELOPERS_TOKEN.ADD_IP'].toUpperCase()}
							</Button>
						</div>
					</Dialog>
				)}

				{paymentFieldAdd && (
					<Dialog
						className="additional-payment-detail-popup"
						isOpen={!!paymentFieldAdd}
						onCloseDialog={() => {
							setPaymentFieldAdd(false);
						}}
						label="additional-payment-detail-popup"
					>
						<h1 className="new-payment-method-title">
							<EditWrapper stringId="P2P.ADDITIONAL_PAYMENT_DETAILS">
								{STRINGS['P2P.ADDITIONAL_PAYMENT_DETAILS']}
							</EditWrapper>
						</h1>
						<div className="mt-3">
							<EditWrapper stringId="P2P.PAYMENT_FIELD_INFO">
								{STRINGS['P2P.PAYMENT_FIELD_INFO']}
							</EditWrapper>{' '}
						</div>

						<div className="new-payment-details-input-wrapper mt-3">
							<div className="payment-detail-label">
								<EditWrapper stringId="P2P.PAYMENT_DETAIL_NAME">
									{STRINGS['P2P.PAYMENT_DETAIL_NAME']}
								</EditWrapper>
							</div>
							<Input
								className="custom-input-field mt-2"
								placeholder={STRINGS['P2P.INPUT_PAYMENT_DETAIL_TEXT']}
								value={customField?.name}
								onChange={(e) => {
									setCustomField({
										...customField,
										name: e.target.value,
									});
								}}
							/>
						</div>

						<div className="new-payment-popup-button-container">
							<Button
								onClick={() => {
									setPaymentFieldAdd(false);
									setCustomField({});
								}}
								className="purpleButtonP2P back-btn"
								type="default"
							>
								{STRINGS['BACK_TEXT'].toUpperCase()}
							</Button>

							<Button
								onClick={() => {
									customField.id = customFields[customFields.length - 1].id + 1;

									setCustomFields([...customFields, customField]);
									setPaymentFieldAdd(false);
									setCustomField({});
								}}
								className="purpleButtonP2P add-btn"
								type="default"
							>
								{STRINGS['DEVELOPERS_TOKEN.ADD_IP'].toUpperCase()}
							</Button>
						</div>
					</Dialog>
				)}
				{displayConfirmation && (
					<Dialog
						className="p2p-new-payment-pop-up confirm-delete-popup-wrapper"
						isOpen={!!displayConfirmation}
						onCloseDialog={() => {
							setDisplayConfirmation(false);
						}}
						shouldCloseOnOverlayClick={true}
						showCloseText={true}
						label="p2p-new-payment-pop-up"
					>
						<div className="confirm-delete-popup-container">
							<div className="confirm-popup-delete-title">
								<EditWrapper stringId="P2P.DELETE_WARNING">
									{STRINGS['P2P.DELETE_WARNING']}
								</EditWrapper>
							</div>
							<div className="confirm-popup-button-container">
								<Button
									className="back-btn"
									onClick={() => setDisplayConfirmation(false)}
								>
									{STRINGS['P2P.NO']}
								</Button>
								<Button
									className="confirm-btn"
									onClick={async () => {
										const found = myMethods.find(
											(x) =>
												x?.details?.system_name === selectedMethod?.system_name
										);
										await deleteP2PPaymentMethod({ id: found.id });
										message.success(STRINGS['P2P.PAYMENT_METHOD_DELETED']);
										fetchP2PPaymentMethods({ is_p2p: true })
											.then((res) => {
												setMyMethods(res.data);
											})
											.catch((err) => err);
										setDisplayConfirmation(false);
									}}
								>
									{STRINGS['REFERRAL_LINK.CONFIRM']}
								</Button>
							</div>
						</div>
					</Dialog>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	user: state.user,
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withConfig(P2PProfile));
