import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Table,
	Spin,
	Alert,
	message,
	Select,
	Modal,
	Button,
	Tooltip,
} from 'antd';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';

import {
	getUserReferer,
	getUserAffiliation,
	fetchReferralCodesByAdmin,
	postReferralCodeByAdmin,
} from './actions';
import { formatTimestampGregorian, DATETIME_FORMAT } from 'utils/date';
import './index.css';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { setIsDisplayCreateReferral } from 'actions/appActions';

const AFF_COLUMNS = [
	{
		title: 'Time referred /signed up',
		dataIndex: 'created_at',
		key: 'created_at',
		render: (value) => (
			<div>{formatTimestampGregorian(value, DATETIME_FORMAT)}</div>
		),
	},
	{
		title: 'Refereed user',
		dataIndex: 'user',
		key: 'user',
		render: ({ id, email }) => (
			<div className="d-flex">
				<div className="d-flex justify-content-center align-items-center green-badge">
					{id}
				</div>
				<div className="px-2">{email}</div>
			</div>
		),
	},
];

const REF_COLUMNS = [
	{
		title: 'Creation Date',
		dataIndex: 'created_at',
		key: 'created_at',
		render: (value) => (
			<div className="d-flex justify-content-start">
				{formatTimestampGregorian(value, DATETIME_FORMAT)}
			</div>
		),
	},
	{
		title: 'Code',
		dataIndex: 'code',
		key: 'code',
		render: (data, key, index) => (
			<div className="d-flex justify-content-start">{data || '-'}</div>
		),
	},
	{
		title: 'Referral Count',
		dataIndex: 'referral_count',
		key: 'referral_count',

		render: (data, key, index) => {
			return <div className="d-flex justify-content-start">{data}</div>;
		},
	},
	{
		title: 'Earning rate',
		dataIndex: 'earning_rate',
		key: 'earning_rate',

		render: (data, key, index) => {
			return <div className="d-flex justify-content-start">{data}%</div>;
		},
	},
	{
		title: 'Discount given',
		dataIndex: 'discount',
		key: 'discount',

		render: (data, key, index) => {
			return <div className="d-flex justify-content-start">{data}%</div>;
		},
	},
	{
		title: 'Link',
		label: 'link',
		key: 'link',
		className: 'd-flex justify-content-end',
		render: (data, key, index) => {
			return (
				<div
					className="d-flex justify-content-end"
					style={{ gap: 10, textAlign: 'center', alignItems: 'center' }}
				>
					<span>.../signup?affiliation_code={data?.code}</span>{' '}
				</div>
			);
		},
	},
];
const renderRowContent = ({ affiliations }) => {
	return (
		<div>
			<div>
				Affiliated User Ids to this referral code:{' '}
				{(affiliations || []).map((aff) => aff.user_id).join(', ') || 'None'}
			</div>
		</div>
	);
};

const LIMIT = 50;

const Referrals = ({
	userInformation: { id: userId, affiliation_code },
	referral_history_config,
	isDisplayCreateReferral,
	setIsDisplayCreateReferral = () => {},
}) => {
	const [loading, setLoading] = useState(true);
	const [invitedBy, setInvitedBy] = useState();
	const [data, setData] = useState([]);
	const [currentTablePage, setCurrentTablePage] = useState(1);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState();
	const [isRemaining, setIsRemaining] = useState(true);
	const [error, setError] = useState();
	const [displayCreateReferralCode, setDisplayCreateReferralCode] = useState(
		false
	);
	const [referralPayload, setReferralPayload] = useState({});
	const [referralCode, setReferralCode] = useState();

	let invitedByEmail = '';
	if (typeof invitedBy === 'object') {
		invitedByEmail = invitedBy?.referer?.email;
	} else {
		invitedByEmail = invitedBy;
	}
	const requestAffiliations = useCallback(
		(page, limit) => {
			let action = referral_history_config?.active
				? fetchReferralCodesByAdmin
				: getUserAffiliation;
			action(userId, page, limit)
				.then((response) => {
					setData((prevData) =>
						page === 1 ? response.data : [...prevData, ...response.data]
					);
					setLoading(false);
					setCurrentTablePage((prevCurrentTablePage) =>
						page === 1 ? 1 : prevCurrentTablePage
					);
					setPage(page);
					setIsRemaining(response.count > page * limit);
					setCount(response.count);
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					setLoading(false);
					setError(message);
				});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[userId, referral_history_config?.active]
	);

	const onPageChange = (count, pageSize) => {
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);

		if (LIMIT === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestAffiliations(page + 1, LIMIT);
		}

		setCurrentTablePage(count);
	};

	useEffect(() => {
		getUserReferer(userId).then(({ email }) => {
			setInvitedBy(email);
			setLoading(false);
			requestAffiliations(1, LIMIT);
		});
	}, [userId, requestAffiliations]);

	const generateUniqueCode = () => {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let code = '';

		for (let i = 0; i < 6; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			code += characters[randomIndex];
		}

		return code;
	};

	const debounceTimeout = debounce(() => {
		setIsDisplayCreateReferral(false);
	}, 1000);

	useEffect(() => {
		if (isDisplayCreateReferral && !displayCreateReferralCode) {
			setDisplayCreateReferralCode(true);
			if (!referralCode) {
				const code = generateUniqueCode();
				setReferralCode(code);
				debounceTimeout();
			}
		}
		return () => {
			debounceTimeout.cancel();
		};
		//eslint-disable-next-line
	}, [isDisplayCreateReferral]);

	if (loading) {
		return (
			<div className="app_container-content">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="admin-user-container">
			{displayCreateReferralCode && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayCreateReferralCode}
					footer={null}
					onCancel={() => {
						setDisplayCreateReferralCode(false);
					}}
				>
					<h2 style={{ fontWeight: '600', color: 'white' }}>
						Create Referral Code
					</h2>
					<div style={{ fontWeight: '400', color: 'white' }}>
						You can create referral code for the selected user below
					</div>
					<div style={{ marginBottom: 30, marginTop: 10 }}>
						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">Code</div>
							<input
								style={{
									padding: 10,
									width: '100%',
									border: '1px solid #ccc',
									backgroundColor: 'transparent',
									overflowX: 'auto',
								}}
								type="text"
								value={referralCode}
								onChange={(e) => {
									setReferralCode(e.target.value);
								}}
							/>
						</div>

						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">
								<span className="mr-2">Earning Rate %</span>
								<Tooltip
									title={
										'This percentage represents the commission that the user earns from the trading fees generated by all the people they refer'
									}
									placement="topLeft"
								>
									<ExclamationCircleOutlined />
								</Tooltip>
							</div>
							<Select
								onChange={(value) =>
									setReferralPayload({
										...referralPayload,
										earning_rate: value,
									})
								}
								value={referralPayload?.earning_rate}
								style={{ width: '100%' }}
								placeholder="Select Earning Rate"
							>
								{[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
									<Select.Option value={value}>{value}</Select.Option>
								))}
							</Select>
						</div>

						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">
								<span className="mr-2">Discount %</span>
								<Tooltip
									title={
										'This percentage is the discount on trading fees that will be offered to everyone the user refers'
									}
									placement="topLeft"
								>
									<ExclamationCircleOutlined />
								</Tooltip>
							</div>
							<Select
								onChange={(value) =>
									setReferralPayload({
										...referralPayload,
										discount: value,
									})
								}
								value={referralPayload?.discount}
								style={{ width: '100%' }}
								placeholder="Select Discount"
							>
								{[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
									<Select.Option value={value}>{value}</Select.Option>
								))}
							</Select>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
						}}
					>
						<Button
							onClick={() => {
								setReferralPayload({
									type: 'limit',
								});
								setDisplayCreateReferralCode(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
						<Button
							onClick={async () => {
								try {
									if (!referralPayload.earning_rate) {
										message.error('Please select earning rate');
										return;
									}
									if (referralPayload.discount == null) {
										message.error('Please select discount');
										return;
									}

									if (referralCode.length === 0) {
										message.error('Referral input referral code');
										return;
									}

									await postReferralCodeByAdmin({
										...referralPayload,
										user_id: userId,
										code: referralCode,
									});
									message.success('Referral code successfully created');
									setDisplayCreateReferralCode(false);
									setReferralPayload({});
									setReferralCode();
									requestAffiliations(1, LIMIT);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Create Referral code
						</Button>
					</div>
				</Modal>
			)}
			<div className="mt-2">
				Referral affiliation information and table displaying all the successful
				referrals that were onboarded onto the platform from this user.
			</div>
			<div className="d-flex align-items-center m-4">
				<div className="d-flex">
					<div className="bold">Invited by: </div>
					<div className="px-2">{invitedByEmail}</div>
				</div>
				<div className="user-info-separator" />
				<div className="d-flex">
					<div className="bold">
						{referral_history_config?.active
							? 'Number of generated codes:'
							: 'Total referred:'}
					</div>
					<div className="px-2">{count}</div>
				</div>
				{/* <div className="user-info-separator" /> */}
				{/* <div className="d-flex">
					<div className="bold">Referral link: </div>
					<div className="px-2">{referralLink}</div>
				</div> */}
				{referral_history_config?.active && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							flex: 1,
							alignItems: 'flex-end',
						}}
					>
						<Button
							className="green-btn"
							type="primary"
							onClick={() => {
								setDisplayCreateReferralCode(true);
								if (!referralCode) {
									const code = generateUniqueCode();
									setReferralCode(code);
								}
							}}
						>
							Create Referral Code
						</Button>
					</div>
				)}
			</div>
			<div>
				{error && (
					<Alert
						message={error}
						type="error"
						showIcon
						onClose={setError}
						closable={true}
						closeText="Close"
					/>
				)}
				<Table
					className="blue-admin-table"
					columns={referral_history_config?.active ? REF_COLUMNS : AFF_COLUMNS}
					dataSource={data}
					pagination={{
						current: currentTablePage,
						onChange: onPageChange,
					}}
					expandable={
						referral_history_config?.active
							? {
									expandedRowRender: renderRowContent,
									expandRowByClick: referral_history_config?.active
										? true
										: false,
									expandIcon: ({ expanded, onExpand, record }) =>
										expanded ? (
											<MinusCircleOutlined
												onClick={(e) => onExpand(record, e)}
												style={{ marginRight: 8 }}
											/>
										) : (
											<PlusCircleOutlined
												onClick={(e) => onExpand(record, e)}
												style={{ marginRight: 8 }}
											/>
										),
							  }
							: false
					}
					rowKey={(data) => {
						return data.id;
					}}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isDisplayCreateReferral: state.app.isDisplayCreateReferral,
});

const mapDispatchToProps = (dispatch) => ({
	setIsDisplayCreateReferral: bindActionCreators(
		setIsDisplayCreateReferral,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(Referrals);
