import React, { useState, useEffect, useCallback } from 'react';
import { STATIC_ICONS } from 'config/icons';
import { Link } from 'react-router';
import { Alert, Button, Modal, Select, Spin, Table } from 'antd';
// import { Icon as LegacyIcon } from '@ant-design/compatible';
// import { RightOutlined } from '@ant-design/icons';
// import moment from 'moment';

import { Image } from 'components';
// import IconToolTip from '../IconToolTip';
import Coins from '../Coins';
import { requestDeposits, requestBurn, requestMint } from '../Deposits/actions';
import {
	renderContent,
	renderRowContent,
	renderStatus,
	renderUser,
} from '../Deposits/utils';

import './index.css';
import ValidateDismiss from '../Deposits/ValidateDismiss';

const Summarycontent = ({
	handleTabChange,
	coins,
	isUpgrade,
	user_payments = {},
	exchange = {},
	onramp = {},
	offramp = {},
	isGetExchange = true,
}) => {
	const [page, setPage] = useState(1);
	const [limit] = useState(50);
	const [currentTablePage, setCurrentTablePage] = useState(1);
	const [isRemaining, setIsRemaining] = useState(true);
	const [queryParams, setQueryParams] = useState({});
	const [deposits, setDeposits] = useState([]);
	const [withdrawal, setWithdrawal] = useState([]);
	const [fiatCoins, setFiatCoins] = useState([]);
	const [selectedDepositAsset, setSelectedDepositAsset] = useState('');
	const [selectedWithdrawalAsset, setSelectedWithdrawalAsset] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [statusType, setStatusType] = useState('');
	const [validateData, setValidateData] = useState({});
	const [queryType, setQueryType] = useState('');
	const [error, setError] = useState('');
	let onRampData = Object.values(onramp).filter((d) => Object.keys(d).length);
	let offRampData = Object.values(offramp).filter((d) => Object.keys(d).length);

	useEffect(() => {
		let exchangeCoins =
			coins &&
			coins.filter(
				(val) =>
					exchange && exchange.coins && exchange.coins.includes(val.symbol)
			);
		let filteredFiatCoins = [];
		exchangeCoins &&
			exchangeCoins.forEach((item) => {
				if (item.type === 'fiat') {
					filteredFiatCoins = [
						...filteredFiatCoins,
						{ symbol: item?.symbol, color: item?.meta?.color },
					];
				}
			});
		setFiatCoins(filteredFiatCoins);
		setSelectedDepositAsset(filteredFiatCoins[0]?.symbol);
		setSelectedWithdrawalAsset(filteredFiatCoins[0]?.symbol);
	}, [coins, exchange]);

	const requestDepositData = useCallback(
		(values = {}, queryParams = { type: 'deposit' }, page = 1, limit = 50) => {
			if (Object.keys(queryParams).length === 0) {
				setQueryParams({});
			}
			setQueryType(queryParams.type);
			requestDeposits({
				...values,
				...queryParams,
				page,
				limit,
			})
				.then((data) => {
					if (queryParams.type === 'deposit') {
						setDeposits(page === 1 ? data.data : [...deposits, ...data.data]);
					} else {
						setWithdrawal(
							page === 1 ? data.data : [...withdrawal, ...data.data]
						);
					}
					setPage(page);
					setCurrentTablePage(page === 1 ? 1 : currentTablePage);
					setIsRemaining(data.count > page * limit);
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					console.log('message', message);
				});
		},
		[currentTablePage, deposits, withdrawal]
	);

	const getHistory = useCallback(async () => {
		if (fiatCoins.length) {
			await requestDepositData(
				{
					currency: fiatCoins && fiatCoins[0]?.symbol,
					dismissed: false,
					rejected: false,
				},
				{ type: 'deposit' },
				page,
				limit
			);
			await requestDepositData(
				{
					currency: fiatCoins && fiatCoins[0]?.symbol,
					dismissed: false,
					rejected: false,
				},
				{ type: 'withdrawal' },
				page,
				limit
			);
		}
		// eslint-disable-next-line
	}, [page, limit, fiatCoins]);

	useEffect(() => {
		getHistory();
	}, [getHistory]);

	const pageChange = (count, pageSize) => {
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestDeposits(queryParams, queryParams, page + 1, limit);
		}
		setCurrentTablePage(count);
	};

	// const renderVerification = (value) => (
	// 	<LegacyIcon type={value ? 'check-circle-o' : 'close-circle'} />
	// );

	const handleSelect = async (currency, type) => {
		if (type === 'deposit') {
			setSelectedDepositAsset(currency);
			await requestDepositData(
				{ currency, dismissed: false, rejected: false },
				{ type: 'deposit' },
				page,
				limit
			);
		} else {
			setSelectedWithdrawalAsset(currency);
			await requestDepositData(
				{ currency, dismissed: false, rejected: false },
				{ type: 'withdrawal' },
				page,
				limit
			);
		}
	};

	// const renderLink = (value) => (
	// 	<Button type="primary" className="green-btn">
	// 		<Link to={`/admin/user?id=${value}`}>
	// 			GO
	// 			<RightOutlined />
	// 		</Link>
	// 	</Button>
	// );

	const onOpenModal = (validateData, statusType) => {
		setIsOpen(true);
		setStatusType(statusType);
		setValidateData(validateData);
	};

	const onCancelModal = () => {
		setIsOpen(false);
		setStatusType('');
	};

	const handleConfirm = (formValues) => {
		let body = {
			transaction_id: formValues.transaction_id,
			updated_transaction_id: formValues.updated_transaction_id,
			rejected: false,
			processing: false,
			waiting: false,
		};
		if (formValues.description) {
			body = {
				...body,
				description: formValues.description,
			};
		}
		if (statusType === 'validate') {
			body = {
				...body,
				status: true,
				dismissed: false,
			};
		} else {
			body = {
				...body,
				dismissed: true,
				status: false,
			};
		}
		if (queryType === 'deposit') {
			requestMint(body)
				.then((data) => {
					onSuccess(queryParams, queryType);
				})
				.catch((error) => {
					onFailure(error);
				});
		} else {
			requestBurn(body)
				.then((data) => {
					onSuccess(queryParams, queryType);
				})
				.catch((error) => {
					onFailure(error);
				});
		}
	};

	const onFailure = (errObj) => {
		const message = errObj.data ? errObj.data.message : errObj.message;
		setError(message);
		onCancelModal();
	};

	const onSuccess = (queryParams, queryType) => {
		requestDeposits(queryParams, { type: queryType });
		onCancelModal();
	};

	const onCloseErrorAlert = () => {
		setError('');
	};

	const renderSelect = (type) => {
		return (
			<Select
				onChange={(e) => handleSelect(e, type)}
				size="small"
				value={
					type === 'deposit' ? selectedDepositAsset : selectedWithdrawalAsset
				}
				className="ml-3 mb-2"
			>
				{fiatCoins.map((option, index) => (
					<Select.Option value={option.symbol} key={index}>
						<div className="d-flex align-items-center mt-1 summary-coin">
							<Coins
								type={option?.symbol?.toLowerCase()}
								small={true}
								color={option?.color || ''}
							/>
							<div className="ml-2">{option?.symbol}</div>
						</div>
					</Select.Option>
				))}
			</Select>
		);
	};

	const columns = [
		{
			title: 'User Id',
			dataIndex: 'user_id',
			key: 'user_id',
			render: renderUser,
		},
		{
			title: 'Transaction Id',
			dataIndex: 'transaction_id',
			key: 'transaction_id',
		},
		{ title: 'Currency', dataIndex: 'currency', key: 'currency' },
		{
			title: 'Status',
			key: 'status',
			render: renderStatus,
		},
		{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
		{
			title: 'Validate/dismiss',
			render: (renderData) => renderContent(renderData, onOpenModal),
		},
	];

	// const kycColumns = [
	// 	{
	// 		title: '',
	// 		dataIndex: 'tooltip',
	// 		key: 'tooltip',
	// 		render: () => (
	// 			<IconToolTip
	// 				type="warning"
	// 				tip="This market is in pending verification"
	// 			/>
	// 		),
	// 	},
	// 	{
	// 		title: 'Account created',
	// 		dataIndex: 'actcreated',
	// 		key: 'actcreated',
	// 		render: (date) => (
	// 			<span>
	// 				Created at:{' '}
	// 				{moment(date).format('DD/MMM/YYYY, hh:mmA ').toUpperCase() +
	// 					new Date(date).toTimeString().slice(9)}
	// 			</span>
	// 		),
	// 	},
	// 	{
	// 		title: 'ID',
	// 		dataIndex: 'id',
	// 		key: 'id',
	// 	},
	// 	{
	// 		title: 'Username',
	// 		dataIndex: 'username',
	// 		key: 'username',
	// 	},
	// 	{
	// 		title: 'Email',
	// 		dataIndex: 'email',
	// 		key: 'email',
	// 	},
	// 	{
	// 		title: 'Verification Level',
	// 		dataIndex: 'vlevel',
	// 		key: 'vlevel',
	// 	},
	// 	{
	// 		title: 'Activated',
	// 		dataIndex: 'ac',
	// 		key: 'act',
	// 		render: renderVerification,
	// 	},
	// 	{
	// 		title: 'See Data',
	// 		dataIndex: 'seedata',
	// 		key: 'seedata',
	// 		render: renderLink,
	// 	},
	// ];
	let locale = {
		emptyText: (
			<span className="gray-txt">
				<div>
					<Image
						icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
						wrapperClassName="limit-status-icon"
					/>
				</div>
				There seems to be no fiat deposits that are pending yet. Connect a fiat
				on-ramp{' '}
				<span onClick={() => handleTabChange('2')} className="underline">
					here
				</span>
				.
			</span>
		),
	};
	let withDrawalLocale = {
		emptyText: (
			<span className="gray-txt">
				<div>
					<Image
						icon={STATIC_ICONS['WITHDRAW_TIERS_SECTION']}
						wrapperClassName="limit-status-icon mr-2"
					/>
				</div>
				There seems to be no fiat withdrawals that are pending yet. Connect a
				fiat off-ramp{' '}
				<span onClick={() => handleTabChange('3')} className="underline">
					here
				</span>
				.
			</span>
		),
	};
	// let kycLocale = {
	// 	emptyText: (
	// 		<span className="gray-txt">
	// 			<div>
	// 				<Image
	// 					icon={STATIC_ICONS['FIAT_KYC_ICON']}
	// 					wrapperClassName="limit-status-icon mr-2"
	// 				/>
	// 			</div>
	// 			<div>No pending KYC information here yet.</div>
	// 			<div>Invite users to your exchange and/or turn on KYC plugins.</div>
	// 			<div>
	// 				{' '}
	// 				<Link to="/admin/fiat?tab=4" className="underline">
	// 					Visit KYC section
	// 				</Link>
	// 			</div>
	// 		</span>
	// 	),
	// };

	// const kycData = [];

	if (!isGetExchange) {
		return (
			<div className="d-flex align-items-center justify-content-center">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="summary-content-wrapper">
			<div className="d-flex">
				<Image
					icon={STATIC_ICONS['CURRENCY_SYMBOL']}
					wrapperClassName="fiatcurrency"
				/>
				<div className="centercontent">
					Fiat currencies like USD, EUR, YEN, etc can be managed here. To allow
					your users to make fiat deposits and withdrawals you must add payment
					system account details.
				</div>
			</div>
			{!isUpgrade ? (
				<div className="d-flex mb-4">
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
				{!user_payments ? (
					<div>
						<div className="payment mt-5">
							<div className="d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center">
									<Image
										icon={STATIC_ICONS['DOLLAR_GEAR']}
										wrapperClassName="fiatcurrency"
									/>
									<div>
										We've noticed that there hasn't been any Payment Accounts
										added yet. To start it is recommended to{' '}
										<Link to="/admin/fiat?tab=1" className="underline">
											add a Payment Account
										</Link>
										.
									</div>
								</div>
								<Button type="primary" className="green-btn">
									<Link to="/admin/fiat?tab=1">Add payment account</Link>
								</Button>
							</div>
						</div>
					</div>
				) : null}
				<div className="body-container mt-3">
					<div className="box-outerDesign">
						<div className="d-flex justify-content-between ramp-heading">
							<span>
								<b>On-ramps </b>(exchange banks and payment processors)
							</span>
							<span className="d-flex">
								<Image
									icon={STATIC_ICONS['ONRAMP_SIMPLE_DOLLAR']}
									wrapperClassName="withdrawalIcon"
								/>
								<Link to="/admin/fiat?tab=2" className="underline  ml-1">
									View on-ramps
								</Link>
							</span>
						</div>
						<div className="box-content">
							{onRampData.length ? (
								<div>
									{Object.keys(onramp).map((key, ind) => {
										return Object.keys(onramp[key]).length ? (
											<div className="d-flex" key={ind}>
												<div>Fiat {key && key.toUpperCase()}:</div>
												<div className="ml-3 text-left">
													<div className="text-capitalize">
														{Object.keys(onramp[key]).map((name, index) => {
															return (
																<div key={index}>
																	on-ramp {index + 1} : {name}
																</div>
															);
														})}
													</div>
												</div>
											</div>
										) : null;
									})}
								</div>
							) : (
								<>
									<Image
										icon={STATIC_ICONS['ONRAMP_DOLLAR_ICON']}
										wrapperClassName="withdrawalIcon green"
									/>
									<div className="txtpad">
										There seems to be no fiat on-ramp systems connected to your
										exchange yet. Connect a way for your users to deposit fiat{' '}
										<Link to="/admin/fiat?tab=2" className="underline">
											here
										</Link>
										.
									</div>
								</>
							)}
							{/* <div  className="d-flex">
							<div className="small-circle mr-2 d-flex"></div>
							<div className='d-flex'>
							<div className='mr-5'>PUBLISHED </div>
							<div><b>On-ramp 1: NMB (National Mongolian Bank)</b></div>
							</div>
						</div>
						<div className="d-flex">
							<div className="small-circle mr-2 d-flex"></div>
							<div className='d-flex'>
							<div className='mr-4 mb-5'>UNPUBLISHED </div>
							<div><b>On-ramp 2: PayPal</b></div>
							</div>
						</div> */}
						</div>
					</div>
					<div className="box-outerDesign">
						<div className="d-flex justify-content-between ramp-heading">
							<span>
								<b>Off-ramps </b>(user banks and payment processors)
							</span>
							<span style={{ display: 'flex' }}>
								<Image
									icon={STATIC_ICONS['OFFRAMP_SIMPLE_DOLLAR']}
									wrapperClassName="withdrawalIcon"
								/>{' '}
								<Link to="/admin/fiat?tab=3" className="underline  ml-1">
									View off-ramps
								</Link>
							</span>
						</div>
						<div className="box-content">
							{offRampData.length ? (
								<div>
									{Object.keys(offramp).map((key, ind) => {
										return Object.keys(offramp[key]).length ? (
											<div className="d-flex" key={ind}>
												<div>Fiat {key && key.toUpperCase()}:</div>
												<div className="ml-3 text-left">
													<div className="text-capitalize">
														{offramp[key].map((name, index) => {
															return (
																<div key={index}>
																	off-ramp {index + 1} : {name}
																</div>
															);
														})}
													</div>
												</div>
											</div>
										) : null;
									})}
								</div>
							) : (
								<>
									<Image
										icon={STATIC_ICONS['OFFRAMP_DOLLAR_ICON']}
										wrapperClassName="withdrawalIcon"
									/>
									<div className="txtpad">
										There seems to be no fiat off-ramp systems connected to your
										exchange yet. Connect a way for your users to withdraw fiat{' '}
										<Link to="/admin/fiat?tab=3" className="underline">
											here
										</Link>
										.
									</div>
								</>
							)}
							{/* <div  className="d-flex">
							<div className="small-circle mr-2 d-flex"></div>
							<div className='d-flex'>
							<div className='mr-5'>PUBLISHED </div>
							<div><b>On-ramp 1: NMB (National Mongolian Bank)</b></div>
							</div>
						</div>
						<div className="d-flex">
							<div className="small-circle mr-2 d-flex"></div>
							<div className='d-flex'>
							<div className='mr-4 mb-5'>UNPUBLISHED </div>
							<div><b>On-ramp 2: PayPal</b></div>
							</div>
						</div> */}
						</div>
					</div>
				</div>
				<div className="body-container flex-column">
					<div className="box-outerDesign w-100">
						<div className="d-flex justify-content-between align-items-center ramp-heading">
							<span className="d-flex align-items-center">
								<b>Recent fiat pending deposits</b>
								{!fiatCoins.length ? (
									<Spin size="small" className="ml-2" />
								) : (
									<span>{renderSelect('deposit')}</span>
								)}
							</span>
							<span className="d-flex align-items-center">
								<Image
									icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
									wrapperClassName="withdrawalIcon"
								/>
								<Link to="/admin/financials?tab=2" className="underline ml-1">
									View fiat deposits
								</Link>
							</span>
						</div>
						<div
							className={
								deposits.length
									? 'fiattable mb-5 blue-admin-table'
									: 'fiattable1 mb-5'
							}
						>
							<Table
								columns={columns}
								locale={locale}
								dataSource={deposits.map((deposit) => {
									return { ...deposit };
								})}
								rowKey={(data) => {
									return data.id;
								}}
								pagination={{
									current: currentTablePage,
									onChange: pageChange,
								}}
								expandedRowRender={(vals) =>
									renderRowContent({ ...vals, coins })
								}
								expandRowByClick={true}
							/>
						</div>
					</div>
					<div className="box-outerDesign w-100">
						<div className="d-flex justify-content-between align-items-center ramp-heading">
							<span className="d-flex align-items-center">
								<b>Recent fiat pending withdrawals</b>
								{!fiatCoins.length ? (
									<Spin size="small" className="ml-2" />
								) : (
									<span>{renderSelect('withdrawal')}</span>
								)}
							</span>
							<span className="d-flex align-items-center">
								<Image
									icon={STATIC_ICONS['WITHDRAW_TIERS_SECTION']}
									wrapperClassName="withdrawalIcon "
								/>
								<Link to="/admin/financials?tab=3" className="underline ml-1">
									View fiat withdrawals
								</Link>
							</span>
						</div>
						<div
							className={
								withdrawal.length
									? 'fiattable mb-5 blue-admin-table'
									: 'fiattable1 mb-5'
							}
						>
							{error && (
								<Alert
									message={error}
									type="error"
									showIcon
									onClose={onCloseErrorAlert}
									closable={true}
									closeText="Close"
								/>
							)}
							<Table
								columns={columns}
								dataSource={withdrawal.map((item) => {
									return { ...item };
								})}
								rowKey={(data) => {
									return data.id;
								}}
								locale={withDrawalLocale}
								pagination={{
									current: currentTablePage,
									onChange: pageChange,
								}}
								expandedRowRender={(vals) =>
									renderRowContent({ ...vals, coins })
								}
								expandRowByClick={true}
							/>
						</div>
					</div>
				</div>
				{/* <div>
					<div className="d-flex justify-content-between kyc-heading">
						<span>
							<b>KYC - recent pending user verifications </b>
						</span>
						<span className="d-flex">
							<IconToolTip
								type="warning"
								tip="This market is in pending verification"
							/>
							<Link to="/admin/fiat?tab=4" className="underline  ml-1">
								View KYC page
							</Link>
						</span>
					</div>
					<div
						className={
							kycData.length ? 'fiattable1 mb-5' : 'fiattable1 mb-5 kyc-table'
						}
					>
						<Table
							columns={kycColumns}
							dataSource={kycData}
							rowKey={(data) => {
								return data.id;
							}}
							locale={kycLocale}
							pagination={false}
						/>
					</div>
				</div> */}
			</div>
			<Modal
				visible={isOpen}
				footer={null}
				onCancel={onCancelModal}
				width="37rem"
			>
				{isOpen ? (
					<ValidateDismiss
						validateData={validateData}
						statusType={statusType}
						onCancel={onCancelModal}
						handleConfirm={handleConfirm}
					/>
				) : null}
			</Modal>
		</div>
	);
};

export default Summarycontent;
