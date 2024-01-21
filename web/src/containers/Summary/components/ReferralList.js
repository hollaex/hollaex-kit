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
import { Button as AntButton, Spin, DatePicker, message, Modal } from 'antd';
import { fetchReferralHistory } from './actions';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import STRINGS from 'config/localizedStrings';
import { CloseOutlined } from '@ant-design/icons';

import { bindActionCreators } from 'redux';
import { LoadingOutlined } from '@ant-design/icons';
import DumbField from 'components/Form/FormFields/DumbField';
import {
	Table,
	// Button, IconTitle
} from 'components';
import { getUserReferrals } from 'actions/userAction';
import { setSnackNotification } from 'actions/appActions';
import ICONS from 'config/icons';

import './_ReferralList.scss';

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
	const [currentDay, setCurrentDay] = useState(7);
	const [queryValues, setQueryValues] = useState({
		start_date: moment().subtract(currentDay, 'days').toISOString(),
		end_date: moment().subtract().toISOString(),
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
	const [currentBalance, setCurrentBalance] = useState();
	const [latestBalance, setLatestBalance] = useState();
	const [current, setCurrent] = useState(0);
	const [graphData, setGraphData] = useState([]);
	const [customDate, setCustomDate] = useState(false);
	const [customDateValues, setCustomDateValues] = useState();

	// const [showReferrals, setShowReferrals] = useState(false);
	const [referees, setReferees] = useState([]);
	const [mappedAffiliations, setMappedAffilications] = useState([]);

	useEffect(() => {
		getUserReferrals();
		fetchReferralHistory({ order_by: 'referee', format: 'all' }).then(
			(earnings) => {
				setReferees(earnings.data);
			}
		);
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
			stringId: 'REFERRAL_LINK.USER',
			label: STRINGS['REFERRAL_LINK.USER'],
			key: 'email',
			renderCell: ({ user: { email } }, key, index) => (
				<td key={key}>
					<div className="d-flex justify-content-start">{email}</div>
				</td>
			),
		},
		{
			stringId: 'REFERRAL_LINK.CODE',
			label: STRINGS['REFERRAL_LINK.CODE'],
			key: 'code',
			renderCell: (data, key, index) => (
				<td key={key}>
					<div className="d-flex justify-content-start">
						{data?.code || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'REFERRAL_LINK.TIME',
			label: STRINGS['REFERRAL_LINK.TIME'],
			key: 'time',
			renderCell: ({ created_at }, key, index) => (
				<td key={key}>
					<div className="d-flex justify-content-start">{created_at}</div>
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
							const balance = balanceHistory.find(
								(history) =>
									`${moment(history.created_at).date()} ${
										month[moment(history.created_at).month()]
									}` === graphData[e.point.x || 0][0]
							);

							setCurrentBalance(balance);
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

				const length =
					response.data.length > currentDay
						? currentDay - 1
						: response.data.length - 1;
				const balanceData = response.data.find(
					(history) =>
						moment(history.date).format('YYYY-MM-DD') ===
						moment(queryValues.end_date)
							.subtract(length, 'days')
							.format('YYYY-MM-DD')
				);
				let balance = balanceData || response.data[length];

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
					}
				}

				newGraphData.reverse();

				setGraphData(newGraphData);
				setCurrentBalance(balance);
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
								setCustomDateValues();
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
									setCustomDateValues();
								} catch (error) {
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
			<div className="summary-block_wrapper">
				<div className="invite_friends_wrapper mx-auto">
					{/* <IconTitle
					stringId="REFERRAL_LINK.TITLE"
					text={STRINGS['REFERRAL_LINK.TITLE']}
					iconId="REFER_ICON"
					iconPath={ICONS['REFER_ICON']}
					textType="title"
					underline={true}
				/> */}
					<div>
						<div className="my-2">
							<div
								className="field-label"
								style={{ fontSize: 18, marginBottom: 10 }}
							>
								<EditWrapper stringId="REFERRAL_LINK.INVITE_LINK">
									{STRINGS['REFERRAL_LINK.INVITE_LINK']}
								</EditWrapper>
							</div>
							<div>
								<EditWrapper stringId="REFERRAL_LINK.INFO_TEXT">
									{STRINGS['REFERRAL_LINK.INFO_TEXT']}
								</EditWrapper>
							</div>
						</div>
						<div className="my-4">
							<RenderDumbField
								stringId="REFERRAL_LINK.COPY_FIELD_LABEL"
								label={STRINGS['REFERRAL_LINK.COPY_FIELD_LABEL']}
								value={referralLink}
								fullWidth={true}
								allowCopy={true}
								copyOnClick={true}
								onCopy={handleCopy}
							/>
						</div>

						{/* <div className="d-flex my-5">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="mr-5"
							onClick={onBack}
						/>
						<CopyToClipboard text={referralLink} onCopy={handleCopy}>
							<Button
								label={
									state.copied
										? STRINGS['SUCCESFUL_COPY']
										: STRINGS['REFERRAL_LINK.COPY_LINK_BUTTON']
								}
								onClick={() => {}}
							/>
						</CopyToClipboard>
					</div> */}
					</div>
				</div>
			</div>
			<div
				className="summary-block_wrapper"
				style={{ marginTop: 20, paddingTop: 20 }}
			>
				{customDateModal()}
				<div style={{ position: 'absolute', top: -25, left: -5 }}>
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

				<div style={{ fontSize: 18 }} className="field-label">
					<EditWrapper stringId="REFERRAL_LINK.EARNINGS">
						{STRINGS['REFERRAL_LINK.EARNINGS']}
					</EditWrapper>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 10,
					}}
				>
					<div style={{}}>
						<EditWrapper stringId="REFERRAL_LINK.EARNINGS_DESCRIPTION">
							{STRINGS['REFERRAL_LINK.EARNINGS_DESCRIPTION']}
						</EditWrapper>
					</div>
					<div>
						<div style={{ fontSize: 15 }} className="field-label">
							<EditWrapper stringId="REFERRAL_LINK.TOTAL_EARNT">
								{STRINGS['REFERRAL_LINK.TOTAL_EARNT']}
							</EditWrapper>
							:
						</div>
						<div style={{ fontSize: 15 }} className="field-label">
							{getSourceDecimals(
								referral_history_config?.currency || 'usdt',
								latestBalance
							)}{' '}
							{(referral_history_config?.currency || 'usdt').toUpperCase()}{' '}
						</div>
					</div>
				</div>
				<div
					style={{ display: 'flex', gap: 5, marginTop: 15, marginBottom: 15 }}
				>
					<AntButton
						style={{
							fontWeight: currentDay === 7 ? 'bold' : '400',
							fontSize: '1em',
						}}
						className="plButton"
						ghost
						onClick={() => {
							setCurrentDay(90);
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
				<div className="highChartColor">
					<HighchartsReact highcharts={Highcharts} options={options} />
				</div>

				<div className="invite_friends_wrapper mx-auto">
					{/* <IconTitle
					stringId="REFERRAL_LINK.TABLE_TITLE"
					text={STRINGS['REFERRAL_LINK.TABLE_TITLE']}
					iconId="REFER_ICON"
					iconPath={ICONS['REFER_ICON']}
					textType="title"
					underline={true}
				/> */}
					<div>
						<div className="field-label">
							<EditWrapper stringId="REFERRAL_LINK.USERS_LIST">
								{STRINGS['REFERRAL_LINK.USERS_LIST']}
							</EditWrapper>
						</div>
						<div>
							<EditWrapper stringId="REFERRAL_LINK.USERS_LIST_DESC">
								{STRINGS['REFERRAL_LINK.USERS_LIST_DESC']}
							</EditWrapper>
						</div>

						<div style={{ marginTop: 20 }}>
							<EditWrapper stringId="REFERRAL_LINK.DATA_COLLECTION">
								{STRINGS['REFERRAL_LINK.DATA_COLLECTION']}
							</EditWrapper>
							:{' '}
							{moment(referral_history_config?.start_date).format('YYYY-MM-DD')}
							.
						</div>

						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<div className="referralLabel" style={{ fontSize: 16 }}>
								<EditWrapper stringId="REFERRAL_LINK.REFERRED_USER_COUT">
									{STRINGS.formatString(
										STRINGS['REFERRAL_LINK.REFERRED_USER_COUT'],
										affiliation.loading ? (
											<LoadingOutlined className="px-2" />
										) : (
											affiliation.count
										)
									)}
								</EditWrapper>
							</div>
							{/* <div
							className="underline-text caps pointer referralLabel"
							style={{ padding: 10, marginLeft: 20 }}
							onClick={() => viewReferrals(true)}
						>
							<EditWrapper stringId="REFERRAL_LINK.VIEW">
								{STRINGS['REFERRAL_LINK.VIEW']}
							</EditWrapper>
						</div> */}
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
						{/* <div className="d-flex my-5">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="mr-5"
							onClick={() => viewReferrals(false)}
						/>
					</div> */}
					</div>
				</div>
			</div>
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
