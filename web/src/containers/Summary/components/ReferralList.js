import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// eslint-disable-next-line
import {
	// Coin,
	EditWrapper,
} from 'components';
// import { Link } from 'react-router';
import {
	Button as AntButton,
	Spin,
	DatePicker,
	message,
	Modal,
	Input,
	Tabs,
} from 'antd';
import {
	fetchReferralHistory,
	fetchUnrealizedFeeEarnings,
	postSettleFees,
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
import DumbField from 'components/Form/FormFields/DumbField';
import {
	Table,
	// Button, IconTitle
} from 'components';
import { getUserReferrals } from 'actions/userAction';
import { setSnackNotification } from 'actions/appActions';
import ICONS from 'config/icons';

import './_ReferralList.scss';

const TabPane = Tabs.TabPane;

const RenderDumbField = (props) => <DumbField {...props} />;
const RECORD_LIMIT = 20;

const ReferralList = ({
	affiliation_code,
	affiliation,
	setSnackNotification,
	coins,
	referral_history_config,
	goBackReferral,
}) => {
	const month = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const [balanceHistory, setBalanceHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentDay, setCurrentDay] = useState(100);
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
	const [latestBalance, setLatestBalance] = useState();
	const [current, setCurrent] = useState(0);
	const [graphData, setGraphData] = useState([]);
	const [customDate, setCustomDate] = useState(false);
	const [customDateValues, setCustomDateValues] = useState();

	// const [showReferrals, setShowReferrals] = useState(false);
	const [referees, setReferees] = useState([]);
	const [mappedAffiliations, setMappedAffilications] = useState([]);
	const [unrealizedEarnings, setUnrealizedEarnings] = useState(0);

	const [displayCreateLink, setDisplayCreateLink] = useState(false);
	const [displaySettle, setDisplaySettle] = useState(false);
	const [linkStep, setLinkStep] = useState(0);

	useEffect(() => {
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
		fetchReferralHistory({ order_by: 'referee', format: 'all' })
			.then((earnings) => {
				setReferees(earnings.data);
			})
			.catch((err) => err);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const newData = JSON.parse(JSON.stringify(affiliation));
		for (const affliate of newData.data) {
			const foundEarning = referees?.find(
				(referee) => referee.referee === affliate.user.id
			);
			affliate.earning = getSourceDecimals(
				referral_history_config?.currency || 'usdt',
				foundEarning?.accumulated_fees
			);
		}
		setMappedAffilications(newData);
		// eslint-disable-next-line
	}, [affiliation, referees]);

	const HEADERS = [
		{
			stringId: 'REFERRAL_LINK.TIME',
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
						.../signup?affiliation_code=G0SDfs
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
							{data?.earning || '-'}
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

	const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;

	const options = {
		title: {
			text: '',
		},
		tooltip: {
			enabled: false,
		},
		xAxis: {
			visible: queryValues?.format === 'all' ? false : true,
			type: 'category',
			labels: {
				formatter: (item) => {
					const color =
						graphData?.[current || 0]?.[0] === item.value ? '#5D63FF' : 'white';
					const fontWeight =
						graphData?.[current || 0]?.[0] === item.value ? 'bold' : 'normal';
					return `<span style="color: ${color}; font-weight: ${fontWeight}">${item.value}</span>`;
				},
			},
		},
		yAxis: {
			title: false,
		},
		plotOptions: {
			series: {
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: false,
						},
					},
				},
			},
		},
		series: [
			{
				data: graphData,
				color: '#FFFF00',
				cursor: 'pointer',
				showInLegend: false,
				point: {
					events: {
						click: (e, x, y) => {
							setCurrent(e.point.x);
							// const balance = balanceHistory.find(
							// 	(history) =>
							// 		`${moment(history.created_at).date()} ${
							// 			month[moment(history.created_at).month()]
							// 		}` === graphData[e.point.x || 0][0]
							// );

							// setCurrentBalance(balance);
						},
					},
				},
			},
		],
	};
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

				let length = currentDay - 1;
				if (response.data.length > length) length = response.data.length;
				// const balanceData = response.data.find(
				// 	(history) =>
				// 		moment(history.date).format('YYYY-MM-DD') ===
				// 		moment(queryValues.end_date)
				// 			.subtract(length, 'days')
				// 			.format('YYYY-MM-DD')
				// );
				// let balance = balanceData || response.data[length];

				let newGraphData = [];
				for (let i = 0; i < length; i++) {
					if (currentDay === 7) {
						const balanceData = response.data.find(
							(history) =>
								moment(history.date).format('YYYY-MM-DD') ===
								moment(queryValues.end_date)
									.subtract(i, 'days')
									.format('YYYY-MM-DD')
						);

						if (!balanceData) continue;
						newGraphData.push([
							`${moment(queryValues.end_date).subtract(i, 'days').date()} ${
								month[moment(queryValues.end_date).subtract(i, 'days').month()]
							}`,
							balanceData ? balanceData.accumulated_fees : 0,
						]);
					} else if (currentDay === 30) {
						const balanceData = response.data.find(
							(history) =>
								moment(history.date).format('YYYY-MM-DD') ===
								moment(queryValues.end_date)
									.subtract(i, 'days')
									.format('YYYY-MM-DD')
						);
						if (!balanceData) continue;
						newGraphData.push([
							`${moment(queryValues.end_date).subtract(i, 'days').date()} ${
								month[moment(queryValues.end_date).subtract(i, 'days').month()]
							}`,
							balanceData ? balanceData.accumulated_fees : 0,
						]);
					} else if (currentDay === 90) {
						const balanceData = response.data.find(
							(history) =>
								moment(history.date).format('YYYY-MM-DD') ===
								moment(queryValues.end_date)
									.subtract(i, 'days')
									.format('YYYY-MM-DD')
						);
						if (!balanceData) continue;
						newGraphData.push([
							`${moment(queryValues.end_date).subtract(i, 'days').date()} ${
								month[moment(queryValues.end_date).subtract(i, 'days').month()]
							}`,
							balanceData ? balanceData.accumulated_fees : 0,
						]);
					} else if (currentDay > 90) {
						const balanceData = response?.data?.[i];
						if (!balanceData) continue;
						newGraphData.push([
							`${moment(balanceData.date).date()} ${
								month[moment(balanceData.date).month()]
							}`,
							balanceData ? balanceData.accumulated_fees : 0,
						]);
					}
				}

				if (currentDay <= 90) newGraphData.reverse();

				setGraphData(newGraphData);
				// setCurrentBalance(balance);
				if (response.total) setLatestBalance(response.total);
				// setLatestBalance(response?.data?.sort(
				// 	function(a,b){
				// 		return moment(b.date) - moment(a.date);
				// 	  }
				// )?.[0]);
				// setSelectedDate(balance.created_at);
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

	const customDateModal = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={customDate}
					width={400}
					footer={null}
					onCancel={() => {
						setCustomDate(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							className="stake_theme"
							style={{
								width: '100%',
							}}
						>
							<div style={{ marginTop: 20, marginBottom: 20 }}>
								<EditWrapper stringId="REFERRAL_LINK.HISTORY_DESCRIPTION">
									{STRINGS['REFERRAL_LINK.HISTORY_DESCRIPTION']}
								</EditWrapper>
							</div>
							<div style={{ marginTop: 5 }}>
								<div>
									<EditWrapper stringId="REFERRAL_LINK.START_DATE">
										{STRINGS['REFERRAL_LINK.START_DATE']}
									</EditWrapper>
								</div>
								<DatePicker
									suffixIcon={null}
									className="pldatePicker"
									placeholder={STRINGS['REFERRAL_LINK.SELECT_START_DATE']}
									style={{
										width: 200,
									}}
									onChange={(date, dateString) => {
										setCustomDateValues({
											...customDateValues,
											start_date: dateString,
										});
									}}
									format={'YYYY/MM/DD'}
								/>
							</div>
							<div style={{ marginTop: 5 }}>
								<div>
									<EditWrapper stringId="REFERRAL_LINK.END_DATE">
										{STRINGS['REFERRAL_LINK.END_DATE']}
									</EditWrapper>
								</div>
								<DatePicker
									suffixIcon={null}
									className="pldatePicker"
									placeholder={STRINGS['REFERRAL_LINK.SELECT_END_DATE']}
									style={{
										width: 200,
									}}
									onChange={(date, dateString) => {
										setCustomDateValues({
											...customDateValues,
											end_date: dateString,
										});
									}}
									format={'YYYY/MM/DD'}
								/>
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
								setCustomDate(false);
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
									if (!customDateValues.end_date) {
										message.error('Please choose an end date');
										return;
									}
									if (!customDateValues.start_date) {
										message.error('Please choose a start date');
										return;
									}
									const duration = moment.duration(
										moment(customDateValues.end_date).diff(
											moment(customDateValues.start_date)
										)
									);
									const months = duration.asMonths();

									if (months > 3) {
										message.error(
											'Date difference cannot go further than 3 months'
										);
										return;
									}

									setCurrentDay(90);
									setQueryValues({
										start_date: moment(customDateValues.start_date)
											.startOf('day')
											.toISOString(),
										end_date: moment(customDateValues.end_date)
											.endOf('day')
											.toISOString(),
									});
									setCustomDate(false);
								} catch (error) {
									console.log({ error });
									message.error('Something went wrong');
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
							<EditWrapper stringId="REFERRAL_LINK.PROCEED">
								{STRINGS['REFERRAL_LINK.PROCEED']}
							</EditWrapper>
						</AntButton>
					</div>
				</Modal>
			</>
		);
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
										Create new referral code/link
									</div>
									<div>
										Create a unique referral link with a code that you can share
										and earn passive income with.
									</div>
									<div style={{ marginTop: 10, marginBottom: 5 }}>
										Referral code / link
									</div>
									<div
										style={{
											padding: 10,
											width: '100%',
											border: '1px solid #ccc',
										}}
									>
										G0SDfs
									</div>
									<div style={{ marginTop: 10, fontWeight: 'bold' }}>
										Example:
									</div>
									<div>
										https://sandbox.hollaex.com/signup?affiliation_code=G0SDfs
									</div>
									<div style={{ marginTop: 5, color: '#ccc' }}>
										(No special character and spaces)
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
									NEXT
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
										Earnings vs. discount rate
									</div>
									<div style={{ marginBottom: 10 }}>
										Share your earnings by adding a discount to your referral
										link. This discount will be applied to the trading fees of
										your referred friends.
									</div>
									<div
										style={{
											marginTop: 10,
											marginBottom: 5,
											fontWeight: 'bold',
										}}
									>
										Discount Ratio:
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
										<div>
											<div style={{ fontSize: 11 }}>YOUR EARNINGS RATE:</div>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<div>14%</div>
												<div>:</div>
											</div>
										</div>
										<div>
											<div style={{ fontSize: 11 }}>
												DISCOUNT GIVEN TO YOUR FRIEND:
											</div>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<div>5%</div>
												<div>:</div>
											</div>
										</div>
										<div style={{ backgroundColor: '#303236' }}>
											<div>
												<CaretUpOutlined />
											</div>
											<div>
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
									NEXT
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
										Review and confirm
									</div>
									<div style={{ marginBottom: 10 }}>
										Please carefully check and confirm below:
									</div>
									<div
										style={{
											marginTop: 10,
											marginBottom: 5,
											fontWeight: 'bold',
										}}
									>
										Discount Ratio:
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
												<div>Referral code:</div>
												<div>G0SDfs</div>
											</div>

											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													gap: 10,
													justifyContent: 'space-between',
												}}
											>
												<div>Your earnings rate:</div>
												<div>30%</div>
											</div>
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													gap: 10,
													justifyContent: 'space-between',
												}}
											>
												<div>Discount given:</div>
												<div>10%</div>
											</div>
										</div>
									</div>

									<div style={{ marginTop: 20 }}>
										<div>Example:</div>
										<div>
											https://sandbox.hollaex.com/signup?affiliation_code=G0SDfs
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
										setLinkStep(3);
									}}
									style={{
										backgroundColor: '#5D63FF',
										color: 'white',
										flex: 1,
										height: 35,
									}}
									type="default"
								>
									CONFIRM
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
										Link created successfully!
									</div>
									<div style={{ marginBottom: 10 }}>
										To start earning simply share the link below with your
										friends:
									</div>

									<div style={{ marginTop: 15 }}>Referral Link:</div>
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
											https://sandbox.hollaex.com/signup?affiliation_code=GGFS@#
										</div>
										<div style={{ textDecoration: 'underline', fontSize: 11 }}>
											COPY
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
									onClick={async () => {
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
									OKAY
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
									Referral Earnings Settlement
								</div>
								<div style={{ marginBottom: 10 }}>
									<span style={{ fontWeight: 'bold' }}>Amount to settle:</span>{' '}
									2 USDT
								</div>

								<div style={{ marginTop: 15 }}>
									Do you want to settle all your earnings now?
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
								onClick={async () => {
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
								SETTLE
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

			<Tabs>
				<TabPane tab="Summary" key="0">
					<>
						<div
							className="summary-block_wrapper"
							style={{ marginTop: -1, paddingTop: 20 }}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>
									<div style={{ fontWeight: 'bold', fontSize: 18 }}>
										Earnings
									</div>
									<div style={{ marginTop: 5 }}>
										Earnings are generated overtime from all your referred users
										trading activity.
									</div>
									<div
										style={{
											color: '#4E54BE',
											cursor: 'pointer',
											fontWeight: 'bold',
										}}
									>
										View earning history.
									</div>
									<div style={{ marginTop: 10 }}>
										Data collected starting: March 25, 2024.
									</div>
									<div>
										To get the most up-to-date earnings report please{' '}
										<span
											style={{
												textDecoration: 'underline',
												color: '#4E54BE',
												cursor: 'pointer',
												fontWeight: 'bold',
											}}
										>
											settle your earnings here.
										</span>
									</div>
								</div>
								<div>
									<div
										style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}
									></div>
									<div>
										<span style={{ fontWeight: 'bold', fontSize: 17 }}>
											Total earnt:
										</span>{' '}
										2.1 USDT
									</div>
									<div
										style={{
											borderBottom: '1px solid #ccc',
											marginBottom: 10,
											marginTop: 10,
										}}
									></div>
									<div style={{ marginBottom: 10 }}>
										Unsettled earnings: 0.0 USDT
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
												style={{
													backgroundColor: '#5E63F6',
													color: 'white',
													display: 'flex',
													alignItems: 'flex-end',
													fontSize: 13,
													border: 'none',
												}}
											>
												SETTLE
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
									Your referral invite links
								</div>
								<div style={{ marginTop: 5 }}>
									Share a link below with friends to start earning commissions
									on their trading:
								</div>
								<div
									onClick={() => {
										setDisplayCreateLink(true);
									}}
									style={{
										color: '#4E54BE',
										cursor: 'pointer',
										fontWeight: 'bold',
										textDecoration: 'underline',
										marginTop: 5,
									}}
								>
									Create a new referral link
								</div>
							</div>

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
									You've not created any referral links yet.
								</div>
								<div
									style={{
										color: '#4E54BE',
										cursor: 'pointer',
										fontWeight: 'bold',
										textDecoration: 'underline',
										marginTop: 5,
									}}
								>
									Create a new referral link
								</div>
							</div>
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
									All settlement events
								</div>
								<div style={{ marginBottom: 15 }}>
									Below are all the earning settlement events from your invited
									referrals.
								</div>
								<div>Below table data collected Marc25 Feb 23, 2024.</div>
								<div>
									To get the most up-to-date earnings report please{' '}
									<span
										style={{
											color: '#4E54BE',
											cursor: 'pointer',
											fontWeight: 'bold',
											textDecoration: 'underline',
										}}
									>
										settle your earnings.
									</span>
								</div>
								<div style={{ marginTop: 10 }}>
									<span style={{ fontWeight: 'bold' }}>Total earnt:</span> 22
									USDT
								</div>
							</div>
							<div></div>
						</div>

						<div
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
						</div>
						<div className="my-2">
							<Table
								rowClassName="pt-2 pb-2"
								headers={HEADERS}
								data={mappedAffiliations.data}
								count={mappedAffiliations.count}
								handleNext={handleNext}
								pageSize={10}
								displayPaginator={!mappedAffiliations.loading}
							/>
							{mappedAffiliations.loading && (
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
