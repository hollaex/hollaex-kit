/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	Button,
	Checkbox,
	message,
	Rate,
	Modal,
	Input,
	Radio,
	Space,
} from 'antd';
import {
	fetchFeedback,
	fetchP2PProfile,
	fetchP2PPaymentMethods,
	createP2PPaymentMethod,
	updateP2PPaymentMethod,
	deleteP2PPaymentMethod,
} from './actions/p2pActions';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';
import './_P2P.scss';

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
}) => {
	const [myDeals, setMyDeals] = useState([]);
	const [checks, setCheks] = useState([]);
	const [myProfile, setMyProfile] = useState();
	const [selectedUser, setSelectedUser] = useState(user);
	const [selectedTab, setSelectedTab] = useState('0');
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [selectedMethod, setSelectedMethod] = useState({
		name: null,
		details: {},
		is_p2p: true,
	});
	const [addMethodDetails, setAddMethodDetails] = useState();
	const [myMethods, setMyMethods] = useState([]);
	const [displayPaymentAdd, setDisplayPaymentAdd] = useState(false);
	const [displayNewPayment, setDisplayNewPayment] = useState(false);
	const [paymentFieldAdd, setPaymentFieldAdd] = useState(false);
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
		fetchFeedback({ merchant_id: (selectedProfile || selectedUser).id })
			.then((res) => {
				setMyDeals(res.data);
			})
			.catch((err) => err);

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
	}, [refresh, selectedProfile]);

	return (
		<div
			className={classnames(...['P2pOrder', isMobile ? 'mobile-view-p2p' : ''])}
			style={{
				height: 600,
				overflowY: 'auto',
				width: '100%',
				padding: 20,
			}}
		>
			<div
				className="stake_theme"
				style={{ display: 'flex', marginTop: 20, flexDirection: 'column' }}
			>
				<div style={{ fontWeight: 'bold', fontSize: 17, marginTop: -25 }}>
					<EditWrapper stringId="P2P.DISPLAY_NAME">
						{STRINGS['P2P.DISPLAY_NAME']}
					</EditWrapper>
				</div>
				<div style={{ marginBottom: 20 }}>
					{(selectedProfile || selectedUser).full_name || (
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
				<div
					style={{
						textAlign: 'center',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: 10,
							marginBottom: 10,
							width: '70%',
						}}
					>
						<div
							style={{
								padding: 20,
								width: 200,
								textAlign: 'center',
								fontWeight: 'bold',
								borderRadius: 5,
								border: '1px solid grey',
							}}
						>
							<div style={{ fontSize: 16 }}>
								<EditWrapper stringId="P2P.TOTAL_ORDERS">
									{STRINGS['P2P.TOTAL_ORDERS']}
								</EditWrapper>
							</div>
							<div style={{ fontSize: 17 }}>
								{myProfile?.totalTransactions} times
							</div>
						</div>
						<div
							style={{
								padding: 20,
								width: 200,
								textAlign: 'center',
								fontWeight: 'bold',
								borderRadius: 5,
								border: '1px solid grey',
							}}
						>
							<div style={{ fontSize: 16 }}>
								<EditWrapper stringId="P2P.COMPLETION_RATE">
									{STRINGS['P2P.COMPLETION_RATE']}
								</EditWrapper>
							</div>
							<div style={{ fontSize: 17 }}>
								{(myProfile?.completionRate || 0).toFixed(2)}%
							</div>
						</div>
						<div
							style={{
								padding: 20,
								width: 200,
								textAlign: 'center',
								fontWeight: 'bold',
								borderRadius: 5,
								border: '1px solid grey',
							}}
						>
							<div style={{ fontSize: 16 }}>
								<EditWrapper stringId="P2P.POSITIVE_FEEDBACK">
									{STRINGS['P2P.POSITIVE_FEEDBACK']}
								</EditWrapper>
							</div>
							<div style={{ fontSize: 17 }}>
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

				<div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
					<div
						style={{
							marginTop: 10,
							marginBottom: 10,
							border: '1px solid grey',
							padding: 5,
							width: 200,
							borderRadius: 10,
							fontWeight: 'bold',
							cursor: 'pointer',
							textAlign: 'center',
						}}
						onClick={() => {
							setSelectedTab('0');
						}}
					>
						<EditWrapper stringId="P2P.P2P_METHODS">
							{STRINGS['P2P.P2P_METHODS']}
						</EditWrapper>
					</div>

					<div
						style={{
							marginTop: 10,
							marginBottom: 10,
							border: '1px solid grey',
							padding: 5,
							width: 150,
							borderRadius: 10,
							fontWeight: 'bold',
							cursor: 'pointer',
							textAlign: 'center',
						}}
						onClick={() => {
							setSelectedTab('1');
						}}
					>
						Feedback({myDeals.length || 0})
					</div>
				</div>
				{selectedTab === '0' && (
					<div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div style={{ flex: 1 }}>
								<div style={{ maxWidth: 500 }}>
									<div
										style={{
											fontSize: 15,
											fontWeight: 'bold',
											marginBottom: 10,
										}}
									>
										<EditWrapper stringId="P2P.PAYMENT_METHODS">
											{STRINGS['P2P.PAYMENT_METHODS']}
										</EditWrapper>
									</div>
									<div>
										<EditWrapper stringId="P2P.PAYMENT_METHODS_DEC">
											{STRINGS['P2P.PAYMENT_METHODS_DEC']}
										</EditWrapper>
									</div>
								</div>
							</div>
							<div style={{ flex: 1 }}>
								<div>
									<div
										style={{
											fontSize: 15,
											fontWeight: 'bold',
											marginBottom: 10,
										}}
									>
										<EditWrapper stringId="P2P.PAYMENT_METHODS_SEND_FIAT">
											{STRINGS['P2P.PAYMENT_METHODS_SEND_FIAT']}
										</EditWrapper>
									</div>

									<div style={{ marginBottom: 10 }}>
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
										.map((method) => {
											return (
												<div style={{ display: 'flex', gap: 5 }}>
													<div
														style={{
															width: 250,
															display: 'flex',
															justifyContent: 'space-between',
															border: '1px solid grey',
															padding: 5,
															cursor: 'pointer',
														}}
														className={'whiteTextP2P'}
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
													<div
														onClick={() => {
															setSelectedMethod(method);
															setAddMethodDetails(true);
														}}
														className="whiteTextP2P"
														style={{
															cursor: 'pointer',
															position: 'relative',
															top: 5,
														}}
													>
														<EditWrapper stringId="P2P.EDIT_UPPERCASE">
															<span style={{ textDecoration: 'underline' }}>
																{STRINGS['P2P.EDIT_UPPERCASE']}
															</span>
														</EditWrapper>
													</div>
													<div
														onClick={async () => {
															const found = myMethods.find(
																(x) =>
																	x?.details?.system_name ===
																	method?.system_name
															);
															await deleteP2PPaymentMethod({ id: found.id });
															message.success('Payment method deleted.');
															fetchP2PPaymentMethods({ is_p2p: true })
																.then((res) => {
																	setMyMethods(res.data);
																})
																.catch((err) => err);
														}}
														className="whiteTextP2P"
														style={{
															cursor: 'pointer',
															position: 'relative',
															top: 5,
														}}
													>
														<EditWrapper stringId="P2P.DELETE_UPPERCASE">
															<span style={{ textDecoration: 'underline' }}>
																{STRINGS['P2P.DELETE_UPPERCASE']}
															</span>
														</EditWrapper>
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
					<div>
						{myDeals.length == 0 ? (
							<div
								style={{
									textAlign: 'center',
									fontSize: 15,
									border: '1px solid grey',
									padding: 10,
									borderRadius: 5,
								}}
							>
								<EditWrapper stringId="P2P.NO_FEEDBACK">
									{STRINGS['P2P.NO_FEEDBACK']}
								</EditWrapper>
							</div>
						) : (
							<table
								style={{
									border: 'none',
									borderCollapse: 'collapse',
									width: '100%',
								}}
							>
								<thead>
									<tr
										className="table-bottom-border"
										style={{ borderBottom: 'grey 1px solid', padding: 10 }}
									>
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
								<tbody className="font-weight-bold">
									{myDeals.map((deal) => {
										return (
											<tr
												className="table-row"
												style={{
													borderBottom: 'grey 1px solid',
													padding: 10,
													position: 'relative',
												}}
											>
												<td style={{ width: '25%' }} className="td-fit">
													{moment(deal.created_at).format(
														'DD/MMM/YYYY, hh:mmA'
													)}
												</td>
												<td style={{ width: '25%' }} className="td-fit">
													{deal.user.full_name || (
														<EditWrapper stringId="P2P.ANONYMOUS">
															{STRINGS['P2P.ANONYMOUS']}
														</EditWrapper>
													)}
												</td>
												<td style={{ width: '25%' }} className="td-fit">
													{deal.comment}
												</td>
												<td style={{ width: '25%' }} className="td-fit">
													<Rate
														disabled
														allowHalf={false}
														autoFocus={false}
														allowClear={false}
														value={deal.rating}
													/>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				)}
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="whiteTextP2P" />}
					bodyStyle={{
						marginTop: 60,
					}}
					className="stake_theme"
					visible={addMethodDetails}
					footer={null}
					onCancel={() => {
						setAddMethodDetails(false);
					}}
				>
					<div
						style={{ marginBottom: 20, fontSize: 17 }}
						className="whiteTextP2P"
					>
						<EditWrapper stringId="P2P.ADD_PAYMENT_METHOD_DETAILS">
							{STRINGS['P2P.ADD_PAYMENT_METHOD_DETAILS']}
						</EditWrapper>
					</div>

					{selectedMethod?.fields?.map((x, index) => {
						return (
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: 10,
								}}
								className="whiteTextP2P"
							>
								<div>{x?.name}:</div>
								<Input
									style={{ width: 300 }}
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

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setAddMethodDetails(false);
							}}
							style={{
								flex: 1,
								height: 35,
							}}
							className="purpleButtonP2P"
							type="default"
						>
							<EditWrapper stringId="P2P.BACK_UPPER">
								{STRINGS['P2P.BACK_UPPER']}
							</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								const newSelected = [
									...(myMethods?.map((x) => x.details) || []),
								];

								const Index = newSelected.findIndex(
									(x) => x.system_name === selectedMethod.system_name
								);

								newSelected[Index].fields = selectedMethod.fields;

								const payload = newSelected[Index];

								const found = myMethods.find(
									(x) => x?.details?.system_name === selectedMethod?.system_name
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

								message.success('Payment method updated.');
								setRefresh(!refresh);
								setAddMethodDetails(false);
							}}
							style={{
								flex: 1,
								height: 35,
							}}
							className="purpleButtonP2P"
							type="default"
						>
							<EditWrapper stringId="P2P.COMPLETE">
								{STRINGS['P2P.COMPLETE']}
							</EditWrapper>
						</Button>
					</div>
				</Modal>

				{displayNewPayment && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							marginTop: 60,
						}}
						className="stake_theme"
						visible={displayNewPayment}
						width={600}
						footer={null}
						onCancel={() => {
							setDisplayNewPayment(false);
						}}
					>
						<h1 style={{ fontWeight: '600', color: 'white' }}>
							<EditWrapper stringId="P2P.CREATE_NEW_PAYMENT_METHODS">
								{STRINGS['P2P.CREATE_NEW_PAYMENT_METHODS']}
							</EditWrapper>
						</h1>
						<div>
							<EditWrapper stringId="P2P.MANUAL_PAYMENT_METHOD_ENTRY">
								{STRINGS['P2P.MANUAL_PAYMENT_METHOD_ENTRY']}
							</EditWrapper>{' '}
						</div>

						<div style={{ marginTop: 20, marginBottom: 30 }}>
							<EditWrapper stringId="P2P.USERS_PAYMENT_SELECTION">
								{STRINGS['P2P.USERS_PAYMENT_SELECTION']}
							</EditWrapper>
						</div>

						<div style={{ fontSize: 20 }}>
							<EditWrapper stringId="P2P.METHOD_NAME_AND_DETAIL">
								{STRINGS['P2P.METHOD_NAME_AND_DETAIL']}
							</EditWrapper>
						</div>

						<div style={{ marginBottom: 20 }}>
							<div style={{ fontWeight: 'bold' }}>
								<EditWrapper stringId="P2P.ADD_NEW_PAYMENT_METHODS">
									{STRINGS['P2P.ADD_NEW_PAYMENT_METHODS']}
								</EditWrapper>
							</div>
							<Input
								placeholder="Enter your system name"
								value={paymentMethod.system_name}
								onChange={(e) => {
									setPaymentMethod({
										...paymentMethod,
										system_name: e.target.value,
									});
								}}
							/>
						</div>

						{customFields.map((field) => {
							return (
								<div style={{ marginBottom: 30 }}>
									<div style={{ fontWeight: 'bold', fontSize: 17 }}>
										FIELD {field.id}#
									</div>
									<div style={{ fontWeight: 'bold' }}>
										<EditWrapper stringId="P2P.DETAIL_NAME">
											{STRINGS['P2P.DETAIL_NAME']}
										</EditWrapper>
									</div>
									<Input
										placeholder="Input the payment detail name"
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
									/>
									<div style={{ fontWeight: 'bold', marginTop: 5 }}>
										<EditWrapper stringId="P2P.DETAIL_VALUE">
											{STRINGS['P2P.DETAIL_VALUE']}
										</EditWrapper>
									</div>
									<Input
										placeholder="Input the payment detail value"
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

						<div
							style={{
								fontWeight: 'bold',
								textDecoration: 'underline',
								cursor: 'pointer',
							}}
							onClick={() => {
								setPaymentFieldAdd(true);
							}}
						>
							<EditWrapper stringId="P2P.ADD_NEW_PAYMENT_FIELD">
								{STRINGS['P2P.ADD_NEW_PAYMENT_FIELD']}
							</EditWrapper>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginTop: 30,
							}}
						>
							<Button
								onClick={() => {
									setDisplayNewPayment(false);
								}}
								style={{
									flex: 1,
									height: 35,
								}}
								className="purpleButtonP2P"
								type="default"
							>
								Back
							</Button>

							<Button
								onClick={async () => {
									const payload = {
										system_name: paymentMethod.system_name,
										fields: customFields,
									};
									paymentMethods.push(payload);

									if (!payload.system_name) {
										message.error('Please input method name');
										return;
									}

									let hasValidation = true;
									payload.fields?.forEach((field) => {
										console.log(field.name);
										if (!field.name || !field.value) {
											message.error('Please input all method fields');
											hasValidation = false;
										}
									});
									if (!hasValidation) return;
									await createP2PPaymentMethod({
										name: payload.system_name,
										details: payload,
										is_p2p: true,
									});

									message.success('Payment method created!');

									fetchP2PPaymentMethods({ is_p2p: true })
										.then((res) => {
											setMyMethods(res.data);
										})
										.catch((err) => err);

									setPaymentMethods(paymentMethods);
									setDisplayNewPayment(false);
									setPaymentMethod({
										system_name: null,
										fields: {},
									});
									setCustomFields([
										{
											id: 1,
											name: null,
											required: true,
										},
									]);
									setRefresh(!refresh);
								}}
								style={{
									flex: 1,
									height: 35,
								}}
								className="purpleButtonP2P"
								type="default"
							>
								Add
							</Button>
						</div>
					</Modal>
				)}

				{paymentFieldAdd && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							marginTop: 60,
						}}
						className="stake_theme"
						visible={paymentFieldAdd}
						width={450}
						footer={null}
						onCancel={() => {
							setPaymentFieldAdd(false);
						}}
					>
						<h1 style={{ fontWeight: '600', color: 'white' }}>
							<EditWrapper stringId="P2P.ADDITIONAL_PAYMENT_DETAILS">
								{STRINGS['P2P.ADDITIONAL_PAYMENT_DETAILS']}
							</EditWrapper>
						</h1>
						<div style={{ marginBottom: 20 }}>
							<EditWrapper stringId="P2P.PAYMENT_FIELD_INFO">
								{STRINGS['P2P.PAYMENT_FIELD_INFO']}
							</EditWrapper>{' '}
						</div>

						<div style={{ marginBottom: 20 }}>
							<div style={{ fontWeight: 'bold' }}>
								<EditWrapper stringId="P2P.PAYMENT_DETAIL_NAME">
									{STRINGS['P2P.PAYMENT_DETAIL_NAME']}
								</EditWrapper>
							</div>
							<Input
								placeholder="Input the payment detail name"
								value={customField?.name}
								onChange={(e) => {
									setCustomField({
										...customField,
										name: e.target.value,
									});
								}}
							/>
						</div>

						<div>
							<div style={{ fontWeight: '600' }}>
								<EditWrapper stringId="P2P.REQUIRED_OR_OPTIONAL">
									{STRINGS['P2P.REQUIRED_OR_OPTIONAL']}
								</EditWrapper>
							</div>
							<div style={{ marginLeft: 20, marginTop: 5 }}>
								<Radio.Group>
									<Space direction="vertical" style={{ color: 'white' }}>
										<Radio value={1} style={{ color: 'white' }}>
											<EditWrapper stringId="P2P.DETAIL_REQUIRED">
												{STRINGS['P2P.DETAIL_REQUIRED']}
											</EditWrapper>
										</Radio>
										<div style={{ marginLeft: 20 }}>
											<EditWrapper stringId="P2P.IMPORTANT_DETAIL">
												{STRINGS['P2P.IMPORTANT_DETAIL']}
											</EditWrapper>
										</div>
										<Radio value={2} style={{ color: 'white' }}>
											<EditWrapper stringId="P2P.DETAIL_OPTIONAL">
												{STRINGS['P2P.DETAIL_OPTIONAL']}
											</EditWrapper>
										</Radio>
										<div style={{ marginLeft: 20 }}>
											<EditWrapper stringId="P2P.OPTIONAL_DETAIL">
												{STRINGS['P2P.OPTIONAL_DETAIL']}
											</EditWrapper>
										</div>
									</Space>
								</Radio.Group>
							</div>
						</div>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginTop: 30,
							}}
						>
							<Button
								onClick={() => {
									setPaymentFieldAdd(false);
									setCustomField({});
								}}
								style={{
									flex: 1,
									height: 35,
								}}
								className="purpleButtonP2P"
								type="default"
							>
								Back
							</Button>

							<Button
								onClick={() => {
									customField.id = customFields[customFields.length - 1].id + 1;

									setCustomFields([...customFields, customField]);
									setPaymentFieldAdd(false);
									setCustomField({});
								}}
								style={{
									flex: 1,
									height: 35,
								}}
								className="purpleButtonP2P"
								type="default"
							>
								Add
							</Button>
						</div>
					</Modal>
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
});

export default connect(mapStateToProps)(withConfig(P2PProfile));
