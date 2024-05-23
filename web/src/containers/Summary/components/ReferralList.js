import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';
// eslint-disable-next-line
import {
	// Coin,
	EditWrapper,
} from 'components';
// import { Link } from 'react-router';
import {
	Button as AntButton,
	Spin,
	// DatePicker,
	// message,
	Modal,
	// Input,
	Tabs,
} from 'antd';
import {
	fetchReferralHistory,
	fetchUnrealizedFeeEarnings,
	postReferralCode,
	fetchReferralCodes,
	postSettleFees,
	fetchRealizedFeeEarnings,
} from './actions';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import STRINGS from 'config/localizedStrings';
import { CloseOutlined } from '@ant-design/icons';

import { bindActionCreators } from 'redux';
import {
	LoadingOutlined,
	CaretUpOutlined,
	CaretDownOutlined,
} from '@ant-design/icons';
// import DumbField from 'components/Form/FormFields/DumbField';
import {
	Table,
	// Button, IconTitle
} from 'components';
import { getUserReferrals } from 'actions/userAction';
import { setSnackNotification } from 'actions/appActions';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ICONS from 'config/icons';

import './_ReferralList.scss';

const TabPane = Tabs.TabPane;

// const RenderDumbField = (props) => <DumbField {...props} />;
const RECORD_LIMIT = 20;

const ReferralList = ({
	affiliation_code,
	affiliation,
	setSnackNotification,
	coins,
	referral_history_config,
	goBackReferral,
}) => {
	const [balanceHistory, setBalanceHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	// const [currentDay, setCurrentDay] = useState(100);
	// eslint-disable-next-line
	const [queryValues, setQueryValues] = useState({
		// start_date: moment().subtract(currentDay, 'days').toISOString(),
		// end_date: moment().subtract().toISOString(),
		format: 'all',
	});
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});
	// eslint-disable-next-line
	// const [currentBalance, setCurrentBalance] = useState();
	// const [customDate, setCustomDate] = useState(false);
	// const [customDateValues, setCustomDateValues] = useState();

	// const [showReferrals, setShowReferrals] = useState(false);
	const [unrealizedEarnings, setUnrealizedEarnings] = useState(0);
	const [latestBalance, setLatestBalance] = useState();

	const [displayCreateLink, setDisplayCreateLink] = useState(false);
	const [displaySettle, setDisplaySettle] = useState(false);
	const [linkStep, setLinkStep] = useState(0);
	const [referralCode, setReferralCode] = useState();
	const [selectedOption, setSelectedOption] = useState(0);
	const [referralCodes, setReferralCodes] = useState([]);
	const [earningRate, setEarningRate] = useState(
		referral_history_config?.earning_rate
	);
	const [discount, setDiscount] = useState(0);
	const [activeTab, setActiveTab] = useState('0');
	const [realizedData, setRealizedData] = useState([]);

	const handleTabChange = (key) => {
		setActiveTab(key);
	};
	useEffect(() => {
		fetchReferralCodes()
			.then((res) => {
				setReferralCodes(res.data);
			})
			.catch((err) => err);

		fetchRealizedFeeEarnings()
			.then((res) => {
				setRealizedData(res);
			})
			.catch((err) => err);
		fetchUnrealizedFeeEarnings()
			.then((res) => {
				if (res?.data?.length > 0) {
					let earnings = 0;

					res.data.forEach((earning) => {
						earnings += earning.accumulated_fees;
					});

					setUnrealizedEarnings(
						getSourceDecimals(
							referral_history_config?.currency || 'usdt',
							earnings
						)
					);
				}
			})
			.catch((err) => err);
		getUserReferrals();
		// eslint-disable-next-line
	}, []);

	const HEADERS = [
		{
			stringId: 'REFERRAL_LINK.TIME_OF_SETTLEMENT',
			label: 'Time of settlement',
			key: 'time',
			renderCell: ({ created_at }, key, index) => (
				<td key={key}>
					<div className="d-flex justify-content-start">{created_at}</div>
				</td>
			),
		},
		{
			stringId: 'REFERRAL_LINK.CODE',
			label: STRINGS['REFERRAL_LINK.CODE'],
			key: 'code',
			renderCell: (data, key, index) => (
				<td key={key}>
					<div
						className="d-flex justify-content-start"
						style={{ color: '#5D63FF' }}
					>
						{/* {data?.code || '-'} */}
						.../signup?affiliation_code={data.code}
					</div>
				</td>
			),
		},

		{
			stringId: 'REFERRAL_LINK.EARNING',
			label: `${STRINGS['REFERRAL_LINK.EARNING']} (${(
				referral_history_config?.currency || 'usdt'
			).toUpperCase()})`,
			key: 'earning',
			className: 'd-flex justify-content-end',
			renderCell: (data, key, index) => {
				return (
					<td key={key}>
						<div className="d-flex justify-content-end">
							{data?.accumulated_fees || '-'}
						</div>
					</td>
				);
			},
		},
	];

	const HEADERSREFERRAL = [
		{
			stringId: 'REFERRAL_LINK.CREATION_DATE',
			label: STRINGS['REFERRAL_LINK.CREATION_DATE'],
			key: 'time',
			renderCell: ({ created_at }, key, index) => (
				<td key={key}>
					<div className="d-flex justify-content-start">{created_at}</div>
				</td>
			),
		},
		{
			stringId: 'REFERRAL_LINK.CODE',
			label: STRINGS['REFERRAL_LINK.CODE'],
			key: 'code',
			renderCell: (data, key, index) => (
				<td key={key}>
					<div
						className="d-flex justify-content-start"
						style={{ color: '#5D63FF' }}
					>
						{data?.code || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'REFERRAL_LINK.REFERRAL_COUNT',
			label: STRINGS['REFERRAL_LINK.REFERRAL_COUNT'],
			key: 'referral_count',

			renderCell: (data, key, index) => {
				return (
					<td key={key}>
						<div className="d-flex justify-content-start">
							{data?.referral_count}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'REFERRAL_LINK.YOUR_EARNING_RATE',
			label: STRINGS['REFERRAL_LINK.YOUR_EARNING_RATE'],
			key: 'earning_rate',

			renderCell: (data, key, index) => {
				return (
					<td key={key}>
						<div className="d-flex justify-content-start">
							{data?.earning_rate}%
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'REFERRAL_LINK.DISCOUNT_GIVEN',
			label: STRINGS['REFERRAL_LINK.DISCOUNT_GIVEN'],
			key: 'discount',

			renderCell: (data, key, index) => {
				return (
					<td key={key}>
						<div className="d-flex justify-content-start">
							{data?.discount}%
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'REFERRAL_LINK.LINK',
			label: STRINGS['REFERRAL_LINK.LINK'],
			key: 'link',
			className: 'd-flex justify-content-end',
			renderCell: (data, key, index) => {
				return (
					<td key={key}>
						<div
							className="d-flex justify-content-end"
							style={{ gap: 10, textAlign: 'center', alignItems: 'center' }}
						>
							<span>.../signup?affiliation_code={data?.code}</span>{' '}
							<CopyToClipboard
								text={`${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${data?.code}`}
								onCopy={() => {
									handleCopy();
								}}
							>
								<span
									style={{
										color: 'white',
										padding: 5,
										cursor: 'pointer',
										backgroundColor: '#5E63F6',
										borderRadius: 10,
									}}
								>
									<EditWrapper stringId="REFERRAL_LINK.COPY">
										{STRINGS['REFERRAL_LINK.COPY']}
									</EditWrapper>
								</span>
							</CopyToClipboard>
						</div>
					</td>
				);
			},
		},
	];

	const handleCopy = () => {
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: STRINGS['COPY_SUCCESS_TEXT'],
		});
	};

	const handleSettlementNotification = () => {
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: 'Settlement successful!',
		});
	};

	const showErrorMessage = (message) => {
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: message,
		});
	};

	// const viewReferrals = (showReferrals) => {
	// 	setShowReferrals(showReferrals);
	// };

	const handleNext = (pageCount, pageNumber) => {
		const pageTemp = pageNumber % 2 === 0 ? 2 : 1;
		const apiPageTemp = Math.floor((pageNumber + 1) / 2);

		if (
			RECORD_LIMIT === pageCount * pageTemp &&
			apiPageTemp >= affiliation.page &&
			affiliation.isRemaining
		) {
			getUserReferrals(affiliation.page + 1, RECORD_LIMIT);
		}
	};

	// const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;

	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
		} else {
			setIsLoading(true);

			requestHistory(queryFilters.page, queryFilters.limit);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
		} else {
			requestHistory(queryFilters.page, queryFilters.limit);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestHistory = (page = 1, limit = 50) => {
		setIsLoading(true);
		fetchReferralHistory({ ...queryValues })
			.then(async (response) => {
				setBalanceHistory(
					page === 1 ? response.data : [...balanceHistory, ...response.data]
				);

				if (response.total) setLatestBalance(response.total);
				setQueryFilters({
					total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
				});

				setIsLoading(false);
			})
			.catch((error) => {
				// const message = error.message;
				setIsLoading(false);
			});
	};

	const handleSettlement = async () => {
		try {
			await postSettleFees();
			fetchUnrealizedFeeEarnings()
				.then((res) => {
					if (res?.data?.length > 0) {
						let earnings = 0;

						res.data.forEach((earning) => {
							earnings += earning.accumulated_fees;
						});

						setUnrealizedEarnings(
							getSourceDecimals(
								referral_history_config?.currency || 'usdt',
								earnings
							)
						);
					}
				})
				.catch((err) => err);
			setDisplaySettle(false);
			handleSettlementNotification();
		} catch (error) {
			showErrorMessage(error.data.message);
		}
	};
	// const customDateModal = () => {
	// 	return (
	// 		<>
	// 			<Modal
	// 				maskClosable={false}
	// 				closeIcon={<CloseOutlined className="stake_theme" />}
	// 				className="stake_table_theme stake_theme"
	// 				bodyStyle={{}}
	// 				visible={customDate}
	// 				width={400}
	// 				footer={null}
	// 				onCancel={() => {
	// 					setCustomDate(false);
	// 				}}
	// 			>
	// 				<div
	// 					style={{
	// 						display: 'flex',
	// 						justifyContent: 'center',
	// 						flexDirection: 'column',
	// 						alignItems: 'center',
	// 					}}
	// 				>
	// 					<div
	// 						className="stake_theme"
	// 						style={{
	// 							width: '100%',
	// 						}}
	// 					>
	// 						<div style={{ marginTop: 20, marginBottom: 20 }}>
	// 							<EditWrapper stringId="REFERRAL_LINK.HISTORY_DESCRIPTION">
	// 								{STRINGS['REFERRAL_LINK.HISTORY_DESCRIPTION']}
	// 							</EditWrapper>
	// 						</div>
	// 						<div style={{ marginTop: 5 }}>
	// 							<div>
	// 								<EditWrapper stringId="REFERRAL_LINK.START_DATE">
	// 									{STRINGS['REFERRAL_LINK.START_DATE']}
	// 								</EditWrapper>
	// 							</div>
	// 							<DatePicker
	// 								suffixIcon={null}
	// 								className="pldatePicker"
	// 								placeholder={STRINGS['REFERRAL_LINK.SELECT_START_DATE']}
	// 								style={{
	// 									width: 200,
	// 								}}
	// 								onChange={(date, dateString) => {
	// 									setCustomDateValues({
	// 										...customDateValues,
	// 										start_date: dateString,
	// 									});
	// 								}}
	// 								format={'YYYY/MM/DD'}
	// 							/>
	// 						</div>
	// 						<div style={{ marginTop: 5 }}>
	// 							<div>
	// 								<EditWrapper stringId="REFERRAL_LINK.END_DATE">
	// 									{STRINGS['REFERRAL_LINK.END_DATE']}
	// 								</EditWrapper>
	// 							</div>
	// 							<DatePicker
	// 								suffixIcon={null}
	// 								className="pldatePicker"
	// 								placeholder={STRINGS['REFERRAL_LINK.SELECT_END_DATE']}
	// 								style={{
	// 									width: 200,
	// 								}}
	// 								onChange={(date, dateString) => {
	// 									setCustomDateValues({
	// 										...customDateValues,
	// 										end_date: dateString,
	// 									});
	// 								}}
	// 								format={'YYYY/MM/DD'}
	// 							/>
	// 						</div>
	// 					</div>
	// 				</div>
	// 				<div
	// 					style={{
	// 						display: 'flex',
	// 						flexDirection: 'row',
	// 						gap: 15,
	// 						justifyContent: 'space-between',
	// 						marginTop: 30,
	// 					}}
	// 				>
	// 					<AntButton
	// 						onClick={() => {
	// 							setCustomDate(false);
	// 						}}
	// 						style={{
	// 							backgroundColor: '#5D63FF',
	// 							color: 'white',
	// 							flex: 1,
	// 							height: 35,
	// 						}}
	// 						type="default"
	// 					>
	// 						<EditWrapper stringId="REFERRAL_LINK.BACK">
	// 							{STRINGS['REFERRAL_LINK.BACK']}
	// 						</EditWrapper>
	// 					</AntButton>
	// 					<AntButton
	// 						onClick={async () => {
	// 							try {
	// 								if (!customDateValues.end_date) {
	// 									message.error('Please choose an end date');
	// 									return;
	// 								}
	// 								if (!customDateValues.start_date) {
	// 									message.error('Please choose a start date');
	// 									return;
	// 								}
	// 								const duration = moment.duration(
	// 									moment(customDateValues.end_date).diff(
	// 										moment(customDateValues.start_date)
	// 									)
	// 								);
	// 								const months = duration.asMonths();

	// 								if (months > 3) {
	// 									message.error(
	// 										'Date difference cannot go further than 3 months'
	// 									);
	// 									return;
	// 								}

	// 								setCurrentDay(90);
	// 								setQueryValues({
	// 									start_date: moment(customDateValues.start_date)
	// 										.startOf('day')
	// 										.toISOString(),
	// 									end_date: moment(customDateValues.end_date)
	// 										.endOf('day')
	// 										.toISOString(),
	// 								});
	// 								setCustomDate(false);
	// 							} catch (error) {
	// 								console.log({ error });
	// 								message.error('Something went wrong');
	// 							}
	// 						}}
	// 						style={{
	// 							backgroundColor: '#5D63FF',
	// 							color: 'white',
	// 							flex: 1,
	// 							height: 35,
	// 						}}
	// 						type="default"
	// 					>
	// 						<EditWrapper stringId="REFERRAL_LINK.PROCEED">
	// 							{STRINGS['REFERRAL_LINK.PROCEED']}
	// 						</EditWrapper>
	// 					</AntButton>
	// 				</div>
	// 			</Modal>
	// 		</>
	// 	);
	// };
	const generateUniqueCode = () => {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let code = '';

		for (let i = 0; i < 6; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			code += characters[randomIndex];
		}

		return code?.toUpperCase();
	};

	const createReferralCode = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={displayCreateLink}
					width={450}
					footer={null}
					onCancel={() => {
						setDisplayCreateLink(false);
					}}
				>
					{linkStep === 0 && (
						<>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div className="stake_theme">
									<div style={{ fontSize: 17, marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.CREATE_REFERRAL_LINK">
											{STRINGS['REFERRAL_LINK.CREATE_REFERRAL_LINK']}
										</EditWrapper>
									</div>
									<div>
										<EditWrapper stringId="REFERRAL_LINK.CREATE_UNIQUE_REFERRAL">
											{STRINGS['REFERRAL_LINK.CREATE_UNIQUE_REFERRAL']}
										</EditWrapper>
									</div>
									<div style={{ marginTop: 10, marginBottom: 5 }}>
										<EditWrapper stringId="REFERRAL_LINK.REFERRAL_CODE">
											{STRINGS['REFERRAL_LINK.REFERRAL_CODE']}
										</EditWrapper>
									</div>
									<div
										style={{
											padding: 10,
											width: '100%',
											border: '1px solid #ccc',
										}}
									>
										{referralCode}
									</div>
									{/* <input
										style={{
											padding: 10,
											width: '100%',
											border: '1px solid #ccc',
											backgroundColor: 'transparent',
										}}
										type="text"
										value={referralCode}
										onChange={(e) => {
											if (e.target.value.length <= 6)
												setReferralCode(e.target.value?.toUpperCase());
										}}
									/> */}
									<div style={{ marginTop: 10, fontWeight: 'bold' }}>
										<EditWrapper stringId="REFERRAL_LINK.EXAMPLE">
											{STRINGS['REFERRAL_LINK.EXAMPLE']}
										</EditWrapper>
									</div>
									<div>
										{process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=
										{referralCode}
									</div>
									<div style={{ marginTop: 5, color: '#ccc' }}>
										<EditWrapper stringId="REFERRAL_LINK.NO_SPECIAL">
											{STRINGS['REFERRAL_LINK.NO_SPECIAL']}
										</EditWrapper>
									</div>
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
								<AntButton
									onClick={() => {
										setDisplayCreateLink(false);
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									<EditWrapper stringId="REFERRAL_LINK.BACK">
										{STRINGS['REFERRAL_LINK.BACK']}
									</EditWrapper>
								</AntButton>
								<AntButton
									onClick={async () => {
										if (referralCode.length === 0) {
											showErrorMessage(
												STRINGS['REFERRAL_LINK.REFERRAL_CODE_ZERO']
											);
											return;
										}
										setLinkStep(1);
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									<EditWrapper stringId="REFERRAL_LINK.NEXT">
										{STRINGS['REFERRAL_LINK.NEXT']}
									</EditWrapper>
								</AntButton>
							</div>
						</>
					)}
					{linkStep === 1 && (
						<>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div className="stake_theme">
									<div style={{ fontSize: 17, marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.EARNING_DISCOUNT">
											{STRINGS['REFERRAL_LINK.EARNING_DISCOUNT']}
										</EditWrapper>
									</div>
									<div style={{ marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.DESCRIPTION">
											{STRINGS['REFERRAL_LINK.DESCRIPTION']}
										</EditWrapper>
									</div>
									<div
										style={{
											marginTop: 10,
											marginBottom: 5,
											fontWeight: 'bold',
										}}
									>
										<EditWrapper stringId="REFERRAL_LINK.DISCOUNT_RATION">
											{STRINGS['REFERRAL_LINK.DISCOUNT_RATION']}
										</EditWrapper>
									</div>
									<div
										style={{
											padding: 10,
											width: '100%',
											border: '1px solid #ccc',
											borderRadius: 10,
											display: 'flex',
											flexDirection: 'row',
											gap: 10,
											justifyContent: 'space-between',
										}}
									>
										<div
											onClick={() => {
												setSelectedOption(0);
											}}
											style={{
												padding: 10,
												cursor: 'pointer',
												backgroundColor:
													selectedOption === 0 ? '#303236' : '#202020',
											}}
										>
											<div style={{ fontSize: 11 }}>
												<EditWrapper stringId="REFERRAL_LINK.YOUR_EARNING_RATE">
													{STRINGS['REFERRAL_LINK.YOUR_EARNING_RATE']}
												</EditWrapper>
											</div>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<div>{earningRate}%</div>
												<div>:</div>
											</div>
										</div>
										<div
											onClick={() => {
												setSelectedOption(1);
											}}
											style={{
												padding: 10,
												cursor: 'pointer',
												backgroundColor:
													selectedOption === 1 ? '#303236' : '#202020',
											}}
										>
											<div style={{ fontSize: 11 }}>
												<EditWrapper stringId="REFERRAL_LINK.DISCOUNT_GIVEN_TO_FRIEND">
													{STRINGS['REFERRAL_LINK.DISCOUNT_GIVEN_TO_FRIEND']}
												</EditWrapper>
											</div>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<div>{discount}%</div>
												<div>:</div>
											</div>
										</div>
										<div
											style={{
												backgroundColor: '#303236',
												cursor: 'pointer',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'space-between',
											}}
										>
											<div
												onClick={(e) => {
													e.stopPropagation();
													if (selectedOption === 0) {
														if (
															earningRate >= 0 &&
															earningRate <=
																referral_history_config.earning_rate
														) {
															let newDiscount = discount;
															if (discount >= 10) {
																newDiscount -= 10;
																setDiscount(newDiscount);
															}
															if (
																earningRate + newDiscount <
																referral_history_config.earning_rate
															)
																setEarningRate(earningRate + 10);
														}
													} else {
														if (
															discount >= 0 &&
															discount <= referral_history_config.earning_rate
														) {
															let newEarningRate = earningRate;
															if (earningRate >= 10) {
																newEarningRate -= 10;
																if (newEarningRate === 0) return;
																setEarningRate(newEarningRate);
															}
															if (
																newEarningRate + discount <
																referral_history_config.earning_rate
															)
																setDiscount(discount + 10);
														}
													}
												}}
											>
												<CaretUpOutlined />
											</div>
											<div
												onClick={(e) => {
													e.stopPropagation();
													if (selectedOption === 0) {
														if (
															earningRate > 0 &&
															earningRate <=
																referral_history_config.earning_rate
														) {
															const newEarningRate = earningRate - 10;
															if (newEarningRate === 0) return;
															if (earningRate >= 10)
																setEarningRate(newEarningRate);
															if (
																newEarningRate + discount <
																referral_history_config.earning_rate
															)
																setDiscount(discount + 10);
														}
													} else {
														if (
															discount > 0 &&
															discount <= referral_history_config.earning_rate
														) {
															const newDiscount = discount - 10;
															if (discount >= 10) setDiscount(newDiscount);
															if (
																earningRate + newDiscount <
																referral_history_config.earning_rate
															)
																setEarningRate(earningRate + 10);
														}
													}
												}}
											>
												<CaretDownOutlined />
											</div>
										</div>
									</div>
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
								<AntButton
									onClick={() => {
										setLinkStep(0);
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									<EditWrapper stringId="REFERRAL_LINK.BACK">
										{STRINGS['REFERRAL_LINK.BACK']}
									</EditWrapper>
								</AntButton>
								<AntButton
									onClick={async () => {
										setLinkStep(2);
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									<EditWrapper stringId="REFERRAL_LINK.NEXT">
										{STRINGS['REFERRAL_LINK.NEXT']}
									</EditWrapper>
								</AntButton>
							</div>
						</>
					)}

					{linkStep === 2 && (
						<>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div className="stake_theme">
									<div style={{ fontSize: 17, marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.REVIEW_AND_CONFIRM">
											{STRINGS['REFERRAL_LINK.REVIEW_AND_CONFIRM']}
										</EditWrapper>
									</div>
									<div style={{ marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.PLEASE_CHECK_BELOW">
											{STRINGS['REFERRAL_LINK.PLEASE_CHECK_BELOW']}
										</EditWrapper>
									</div>
									<div
										style={{
											marginTop: 10,
											marginBottom: 5,
											fontWeight: 'bold',
										}}
									>
										<EditWrapper stringId="REFERRAL_LINK.DISCOUNT_RATIO">
											{STRINGS['REFERRAL_LINK.DISCOUNT_RATIO']}
										</EditWrapper>
									</div>
									<div
										style={{
											padding: 10,
											width: '100%',
											border: '1px solid #ccc',
										}}
									>
										<div style={{ width: '50%' }}>
											<div
												style={{
													marginBottom: 10,
													display: 'flex',
													flexDirection: 'row',
													gap: 10,
													justifyContent: 'space-between',
												}}
											>
												<div>
													<EditWrapper stringId="REFERRAL_LINK.REFERRAL_CODE">
														{STRINGS['REFERRAL_LINK.REFERRAL_CODE']}
													</EditWrapper>
												</div>
												<div>{referralCode}</div>
											</div>

											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													gap: 10,
													justifyContent: 'space-between',
												}}
											>
												<div>
													<EditWrapper stringId="REFERRAL_LINK.YOUR_EARNING_RATE">
														{STRINGS['REFERRAL_LINK.YOUR_EARNING_RATE']}
													</EditWrapper>
												</div>
												<div>{earningRate}%</div>
											</div>
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													gap: 10,
													justifyContent: 'space-between',
												}}
											>
												<div>
													<EditWrapper stringId="REFERRAL_LINK.DISCOUNT_GIVEN">
														{STRINGS['REFERRAL_LINK.DISCOUNT_GIVEN']}
													</EditWrapper>
												</div>
												<div>{discount}%</div>
											</div>
										</div>
									</div>

									<div style={{ marginTop: 20 }}>
										<div>
											<EditWrapper stringId="REFERRAL_LINK.EXAMPLE">
												{STRINGS['REFERRAL_LINK.EXAMPLE']}
											</EditWrapper>
										</div>
										<div>
											{process.env.REACT_APP_PUBLIC_URL}
											/signup?affiliation_code={referralCode}
										</div>
									</div>
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
								<AntButton
									onClick={() => {
										setLinkStep(1);
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									<EditWrapper stringId="REFERRAL_LINK.BACK">
										{STRINGS['REFERRAL_LINK.BACK']}
									</EditWrapper>
								</AntButton>
								<AntButton
									onClick={async () => {
										try {
											if (referralCodes?.data?.length < 3) {
												await postReferralCode({
													earning_rate: earningRate,
													discount,
													code: referralCode,
												});
												fetchReferralCodes()
													.then((res) => {
														setReferralCodes(res.data);
													})
													.catch((err) => err);
											}
											setLinkStep(3);
										} catch (error) {
											showErrorMessage(error.data.message);
										}
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									<EditWrapper stringId="REFERRAL_LINK.CONFIRM">
										{STRINGS['REFERRAL_LINK.CONFIRM']}
									</EditWrapper>
								</AntButton>
							</div>
						</>
					)}

					{linkStep === 3 && (
						<>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div className="stake_theme">
									<div style={{ fontSize: 17, marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.LINK_CREATED">
											{STRINGS['REFERRAL_LINK.LINK_CREATED']}
										</EditWrapper>
									</div>
									<div style={{ marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.DESCRIPTION_2">
											{STRINGS['REFERRAL_LINK.DESCRIPTION_2']}
										</EditWrapper>
									</div>

									<div style={{ marginTop: 15 }}>
										<EditWrapper stringId="REFERRAL_LINK.REFERRAL_LINK">
											{STRINGS['REFERRAL_LINK.REFERRAL_LINK']}
										</EditWrapper>
									</div>
									<div
										style={{
											padding: 10,
											width: '100%',
											border: '1px solid #ccc',
											color: '#5D63FF',
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<div style={{ fontSize: 11 }}>
											{process.env.REACT_APP_PUBLIC_URL}
											/signup?affiliation_code={referralCode}
										</div>
										<CopyToClipboard
											text={`${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${referralCode}`}
											onCopy={() => {
												handleCopy();
											}}
										>
											<div
												style={{
													textDecoration: 'underline',
													fontSize: 11,
													cursor: 'pointer',
												}}
											>
												<EditWrapper stringId="REFERRAL_LINK.COPY">
													{STRINGS['REFERRAL_LINK.COPY']}
												</EditWrapper>
											</div>
										</CopyToClipboard>
									</div>
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
								<AntButton
									onClick={async () => {
										setDisplayCreateLink(false);
										setLinkStep(0);
										setReferralCode();
										setDiscount(0);
										setEarningRate(referral_history_config?.earning_rate);
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									<EditWrapper stringId="REFERRAL_LINK.OKAY">
										{STRINGS['REFERRAL_LINK.OKAY']}
									</EditWrapper>
								</AntButton>
							</div>
						</>
					)}
				</Modal>
			</>
		);
	};

	const settleReferral = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={displaySettle}
					width={450}
					footer={null}
					onCancel={() => {
						setDisplaySettle(false);
					}}
				>
					<>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<div className="stake_theme">
								<div style={{ fontSize: 17, marginBottom: 10 }}>
									<EditWrapper stringId="REFERRAL_LINK.EARNING_SETTLEMENT">
										{STRINGS['REFERRAL_LINK.EARNING_SETTLEMENT']}
									</EditWrapper>
								</div>
								<div style={{ marginBottom: 10 }}>
									<span style={{ fontWeight: 'bold' }}>Amount to settle:</span>{' '}
									{unrealizedEarnings}{' '}
									{(referral_history_config?.currency || 'usdt').toUpperCase()}
								</div>

								<div style={{ marginTop: 15 }}>
									<EditWrapper stringId="REFERRAL_LINK.DO_YOU_WANT_TO_SETTLE">
										{STRINGS['REFERRAL_LINK.DO_YOU_WANT_TO_SETTLE']}
									</EditWrapper>
								</div>
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
							<AntButton
								onClick={() => {
									setDisplaySettle(false);
								}}
								style={{
									backgroundColor: '#5D63FF',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								<EditWrapper stringId="REFERRAL_LINK.BACK">
									{STRINGS['REFERRAL_LINK.BACK']}
								</EditWrapper>
							</AntButton>
							<AntButton
								onClick={() => {
									handleSettlement();
								}}
								style={{
									backgroundColor: '#5D63FF',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								<EditWrapper stringId="REFERRAL_LINK.SETTLE">
									{STRINGS['REFERRAL_LINK.SETTLE']}
								</EditWrapper>
							</AntButton>
						</div>
					</>
				</Modal>
			</>
		);
	};

	const getSourceDecimals = (symbol, value) => {
		const incrementUnit = coins[symbol].increment_unit;
		const decimalPoint = new BigNumber(incrementUnit).dp();
		const sourceAmount = new BigNumber(value || 0)
			.decimalPlaces(decimalPoint)
			.toNumber();

		return sourceAmount;
	};
	return (
		<Spin spinning={isLoading}>
			{displayCreateLink && createReferralCode()}
			{displaySettle && settleReferral()}
			<div style={{}}>
				<span
					style={{
						cursor: 'pointer',
						textDecoration: 'underline',
						color: '#5257CD',
					}}
					onClick={() => goBackReferral(false)}
				>
					{'<'}
					<EditWrapper stringId="REFERRAL_LINK.BACK_LOWER">
						{STRINGS['REFERRAL_LINK.BACK_LOWER']}
					</EditWrapper>
				</span>
			</div>
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
			>
				<TabPane tab="Summary" key="0">
					<>
						<div
							className="summary-block_wrapper"
							style={{ marginTop: -1, paddingTop: 20 }}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>
									<div style={{ fontWeight: 'bold', fontSize: 18 }}>
										<EditWrapper stringId="REFERRAL_LINK.EARNINGS">
											{STRINGS['REFERRAL_LINK.EARNINGS']}
										</EditWrapper>
									</div>
									<div style={{ marginTop: 5 }}>
										<EditWrapper stringId="REFERRAL_LINK.EARNING_DESC">
											{STRINGS['REFERRAL_LINK.EARNING_DESC']}
										</EditWrapper>
									</div>
									<div
										onClick={() => {
											handleTabChange('1');
										}}
										style={{
											color: '#4E54BE',
											cursor: 'pointer',
											fontWeight: 'bold',
										}}
									>
										<EditWrapper stringId="REFERRAL_LINK.VIEW_HISTORY">
											{STRINGS['REFERRAL_LINK.VIEW_HISTORY']}
										</EditWrapper>
									</div>
									<div style={{ marginTop: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.DATA_COLLECTED">
											{STRINGS['REFERRAL_LINK.DATA_COLLECTED']}
										</EditWrapper>{' '}
										{moment(referral_history_config?.date_enabled).format(
											'YYYY/MM/DD'
										)}
										.
									</div>
									<div>
										<EditWrapper stringId="REFERRAL_LINK.DATA_DESC">
											{STRINGS['REFERRAL_LINK.DATA_DESC']}
										</EditWrapper>{' '}
										<span
											onClick={() => {
												if (unrealizedEarnings > 0) setDisplaySettle(true);
											}}
											style={{
												textDecoration: 'underline',
												color: '#4E54BE',
												cursor: 'pointer',
												fontWeight: 'bold',
											}}
										>
											<EditWrapper stringId="REFERRAL_LINK.SETTLE_HERE">
												{STRINGS['REFERRAL_LINK.SETTLE_HERE']}
											</EditWrapper>
										</span>
									</div>
								</div>
								<div>
									<div
										style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}
									></div>
									<div>
										<span style={{ fontWeight: 'bold', fontSize: 17 }}>
											<EditWrapper stringId="REFERRAL_LINK.EARNT">
												{STRINGS['REFERRAL_LINK.EARNT']}
											</EditWrapper>
										</span>{' '}
										<div style={{ fontSize: 15 }} className="field-label">
											{getSourceDecimals(
												referral_history_config?.currency || 'usdt',
												latestBalance
											)}{' '}
											{(
												referral_history_config?.currency || 'usdt'
											).toUpperCase()}{' '}
										</div>
									</div>
									<div
										style={{
											borderBottom: '1px solid #ccc',
											marginBottom: 10,
											marginTop: 10,
										}}
									></div>
									<div style={{ marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.UNSETTLED">
											{STRINGS['REFERRAL_LINK.UNSETTLED']}
										</EditWrapper>{' '}
										{unrealizedEarnings}{' '}
										{(
											referral_history_config?.currency || 'usdt'
										).toUpperCase()}
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
											flexDirection: 'column',
											alignItems: 'flex-end',
										}}
									>
										<div>
											<AntButton
												onClick={() => {
													setDisplaySettle(true);
												}}
												size="small"
												disabled={unrealizedEarnings === 0}
												style={{
													backgroundColor: '#5E63F6',
													color: 'white',
													display: 'flex',
													alignItems: 'flex-end',
													fontSize: 13,
													border: 'none',
												}}
											>
												<EditWrapper stringId="REFERRAL_LINK.SETTLE">
													{STRINGS['REFERRAL_LINK.SETTLE']}
												</EditWrapper>
											</AntButton>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div
							className="summary-block_wrapper"
							style={{ marginTop: 20, paddingTop: 20 }}
						>
							<div>
								<div style={{ fontWeight: 'bold', fontSize: 18 }}>
									<EditWrapper stringId="REFERRAL_LINK.INVITE_LINKS">
										{STRINGS['REFERRAL_LINK.INVITE_LINKS']}
									</EditWrapper>
								</div>
								<div style={{ marginTop: 5 }}>
									<EditWrapper stringId="REFERRAL_LINK.INVITE_LINKS_DESC">
										{STRINGS['REFERRAL_LINK.INVITE_LINKS_DESC']}
									</EditWrapper>
								</div>
								{referralCodes?.data?.length < 3 && (
									<div
										onClick={async () => {
											if (!referralCode) {
												try {
													const code = generateUniqueCode();
													setReferralCode(code);
													setDisplayCreateLink(true);
												} catch (error) {
													showErrorMessage(error.data.message);
												}
											} else setDisplayCreateLink(true);
										}}
										style={{
											color: '#4E54BE',
											cursor: 'pointer',
											fontWeight: 'bold',
											textDecoration: 'underline',
											marginTop: 5,
										}}
									>
										<EditWrapper stringId="REFERRAL_LINK.CREATE_LINK">
											{STRINGS['REFERRAL_LINK.CREATE_LINK']}
										</EditWrapper>
									</div>
								)}
							</div>

							{referralCodes?.data?.length === 0 && (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'column',
										minHeight: 500,
									}}
								>
									<div style={{ marginBottom: 10 }}>
										<EditWrapper stringId="REFERRAL_LINK.NO_LINK">
											{STRINGS['REFERRAL_LINK.NO_LINK']}
										</EditWrapper>
									</div>
									{referralCodes?.data?.length < 3 && (
										<div
											onClick={async () => {
												if (!referralCode) {
													try {
														const code = generateUniqueCode();
														setReferralCode(code);
														setDisplayCreateLink(true);
													} catch (error) {
														showErrorMessage(error.data.message);
													}
												} else setDisplayCreateLink(true);
											}}
											style={{
												color: '#4E54BE',
												cursor: 'pointer',
												fontWeight: 'bold',
												textDecoration: 'underline',
												marginTop: 5,
											}}
										>
											<EditWrapper stringId="REFERRAL_LINK.CREATE_LINK">
												{STRINGS['REFERRAL_LINK.CREATE_LINK']}
											</EditWrapper>
										</div>
									)}
								</div>
							)}

							{referralCodes?.data?.length > 0 && (
								<div className="my-2">
									<Table
										rowClassName="pt-2 pb-2"
										headers={HEADERSREFERRAL}
										data={referralCodes.data}
										count={referralCodes.count}
										handleNext={handleNext}
										pageSize={10}
										displayPaginator={!referralCodes.loading}
									/>
								</div>
							)}
						</div>
					</>
				</TabPane>
				<TabPane tab="History" key="1">
					<div
						className="summary-block_wrapper"
						style={{ marginTop: -1, paddingTop: 20 }}
					>
						<div>
							<div>
								<div style={{ fontSize: 17, fontWeight: 'bold' }}>
									<EditWrapper stringId="REFERRAL_LINK.ALL_EVENTS">
										{STRINGS['REFERRAL_LINK.ALL_EVENTS']}
									</EditWrapper>
								</div>
								<div style={{ marginBottom: 15 }}>
									<EditWrapper stringId="REFERRAL_LINK.EVENTS_DESC">
										{STRINGS['REFERRAL_LINK.EVENTS_DESC']}
									</EditWrapper>
								</div>
								<div>
									<EditWrapper stringId="REFERRAL_LINK.DATA_BELOW">
										{STRINGS['REFERRAL_LINK.DATA_BELOW']}
									</EditWrapper>{' '}
									{moment(referral_history_config?.date_enabled).format(
										'YYYY/MM/DD'
									)}
									.
								</div>
								<div>
									<EditWrapper stringId="REFERRAL_LINK.DATA_DESC">
										{STRINGS['REFERRAL_LINK.DATA_DESC']}
									</EditWrapper>{' '}
									<span
										onClick={() => {
											if (unrealizedEarnings > 0) setDisplaySettle(true);
										}}
										style={{
											color: '#4E54BE',
											cursor: 'pointer',
											fontWeight: 'bold',
											textDecoration: 'underline',
										}}
									>
										<EditWrapper stringId="REFERRAL_LINK.SETTLE_HERE">
											{STRINGS['REFERRAL_LINK.SETTLE_HERE']}
										</EditWrapper>
									</span>
								</div>
								<div style={{ marginTop: 10 }}>
									<span style={{ fontWeight: 'bold' }}>
										<EditWrapper stringId="REFERRAL_LINK.EARNT">
											{STRINGS['REFERRAL_LINK.EARNT']}
										</EditWrapper>
									</span>{' '}
									<span style={{ fontSize: 15 }} className="field-label">
										{getSourceDecimals(
											referral_history_config?.currency || 'usdt',
											latestBalance
										)}{' '}
										{(
											referral_history_config?.currency || 'usdt'
										).toUpperCase()}{' '}
									</span>
								</div>
							</div>
							<div></div>
						</div>

						{/* <div
							style={{
								display: 'flex',
								gap: 5,
								marginTop: 15,
								marginBottom: 15,
							}}
						>
							<AntButton
								style={{
									fontWeight: currentDay === 7 ? 'bold' : '400',
									fontSize: '1em',
								}}
								className="plButton"
								ghost
								onClick={() => {
									setCurrentDay(100);
									setQueryValues({
										format: 'all',
									});
								}}
							>
								<EditWrapper stringId="REFERRAL_LINK.ALL">
									{STRINGS['REFERRAL_LINK.ALL']}
								</EditWrapper>
							</AntButton>
							<AntButton
								style={{
									fontWeight: currentDay === 7 ? 'bold' : '400',
									fontSize: '1em',
								}}
								className="plButton"
								ghost
								onClick={() => {
									setCurrentDay(7);
									setQueryValues({
										start_date: moment().subtract(7, 'days').toISOString(),
										end_date: moment().subtract().toISOString(),
									});
								}}
							>
								<span style={{ marginRight: 3 }}>1</span>
								<EditWrapper stringId="REFERRAL_LINK.WEEK">
									{STRINGS['REFERRAL_LINK.WEEK']}
								</EditWrapper>
							</AntButton>
							<AntButton
								style={{
									fontWeight: currentDay === 30 ? 'bold' : '400',
									fontSize: '1em',
								}}
								className="plButton"
								ghost
								onClick={() => {
									setCurrentDay(30);
									setQueryValues({
										start_date: moment().subtract(30, 'days').toISOString(),
										end_date: moment().subtract().toISOString(),
									});
								}}
							>
								<span style={{ marginRight: 3 }}>1 </span>{' '}
								<EditWrapper stringId="REFERRAL_LINK.MONTH">
									{STRINGS['REFERRAL_LINK.MONTH']}
								</EditWrapper>
							</AntButton>
							<AntButton
								style={{
									fontWeight: currentDay === 90 ? 'bold' : '400',
									fontSize: '1em',
								}}
								className="plButton"
								ghost
								onClick={() => {
									setCurrentDay(90);
									setQueryValues({
										start_date: moment().subtract(90, 'days').toISOString(),
										end_date: moment().subtract().toISOString(),
									});
								}}
							>
								<span style={{ marginRight: 3 }}>3 </span>{' '}
								<EditWrapper stringId="REFERRAL_LINK.MONTHS">
									{STRINGS['REFERRAL_LINK.MONTHS']}
								</EditWrapper>
							</AntButton>
							<AntButton
								style={{
									fontWeight: currentDay === 'custom' ? 'bold' : '400',
									fontSize: '1em',
								}}
								className="plButton"
								ghost
								onClick={() => {
									setCustomDate(true);
								}}
							>
								<EditWrapper stringId="REFERRAL_LINK.CUSTOM">
									{STRINGS['REFERRAL_LINK.CUSTOM']}
								</EditWrapper>
							</AntButton>
						</div> */}
						<div className="my-2">
							<Table
								rowClassName="pt-2 pb-2"
								headers={HEADERS}
								data={realizedData.data}
								count={realizedData.count}
								handleNext={handleNext}
								pageSize={10}
								displayPaginator={!realizedData.loading}
							/>
							{realizedData.loading && (
								<div className="d-flex my-5 py-5 align-items-center justify-content-center">
									<LoadingOutlined style={{ fontSize: '3rem' }} />
								</div>
							)}
						</div>
					</div>
				</TabPane>
			</Tabs>
		</Spin>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	balances: state.user.balance,
	pricesInNative: state.asset.oraclePrices,
	dust: state.app.constants.dust,
	referral_history_config: state.app.constants.referral_history_config,
	affiliation: state.user.affiliation || {},
	is_hap: state.user.is_hap,
});

const mapDispatchToProps = (dispatch) => ({
	getUserReferrals: bindActionCreators(getUserReferrals, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ReferralList));
