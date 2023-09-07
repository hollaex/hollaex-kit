import React, { useState, useEffect, Fragment, useRef } from 'react';
import {
	Table,
	Button,
	Spin,
	Switch,
	Modal,
	Input,
	Checkbox,
	Radio,
	Space,
	Select,
	message,
} from 'antd';
import {
	requestUserLogins,
	requestUserLoginsDownload,
	requestUsers,
	requestUserData,
	createStakePool,
} from './actions';
import { formatDate } from 'utils';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';
import _debounce from 'lodash/debounce';
import {
	CloseOutlined,
	ExclamationCircleOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import Coins from '../Coins';
import './CeFi.scss';
const { Option } = Select;

const CeFi = ({ coins }) => {
	const searchRef = useRef(null);
	const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues, setQueryValues] = useState({});
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const [displayStakePoolCreation, setDisplayStatePoolCreation] = useState(
		false
	);
	const [step, setStep] = useState(1);

	const [stakePoolCreation, setStakePoolCreation] = useState({
		name: null,
		currency: null,
		account_id: null,
		apy: null,
		duration: null,
		slashing: true,
		slashing_principle_percentage: null,
		slashing_earning_percentage: null,
		early_unstake: true,
		min_amount: null,
		max_amount: null,
		status: 'uninitialized',
		disclaimer: null,
		perpetual_stake: null,
		slash_earnings: null,
		onboarding: false,
	});
	const [emailOptions, setEmailOptions] = useState([]);
	const [selectedEmailData, setSelectedEmailData] = useState({});

	const [balanceData, setBalanceData] = useState({});

	const [selectedCurrencyBalance, setSelectedCurrencyBalance] = useState();
	const [confirmText, setConfirmText] = useState();

	const columns = [
		{
			title: 'Asset',
			dataIndex: 'currency',
			key: 'currency',
			render: (currency, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.currency}
						</Button>
						{/* <div className="ml-3">{data.User.email}</div> */}
					</div>
				);
			},
		},
		{
			title: 'Pool name',
			dataIndex: 'name',
			key: 'name',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.name}</div>;
			},
		},
		{
			title: 'Time created',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (user_id, data) => {
				return <div className="d-flex">{formatDate(data?.created_at)}</div>;
			},
		},
		{
			title: 'User / source wallet',
			dataIndex: 'status',
			key: 'status',
			render: (user_id, data) => {
				return <div className="d-flex">(Display Balance)</div>;
			},
		},
		{
			title: 'Stake amounts',
			dataIndex: 'amlunt',
			key: 'amlunt',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<div>Max: 12321</div>
						<div>Max: 12321</div>
					</div>
				);
			},
		},
		{
			title: 'Duration',
			dataIndex: 'duration',
			key: 'duration',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.duration}</div>;
			},
		},
		{
			title: 'Slashing',
			dataIndex: 'slashing',
			key: 'slashing',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.slashing}</div>;
			},
		},
		{
			title: 'APY',
			dataIndex: 'apy',
			key: 'apy',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.apy}</div>;
			},
		},
		{
			title: 'Earnings',
			dataIndex: 'earning',
			key: 'earning',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.earnings}</div>;
			},
		},
		{
			title: 'Config',
			dataIndex: 'edit',
			key: 'edit',
			render: (user_id, data) => {
				return <div className="d-flex">Edit</div>;
			},
		},
		{
			title: 'Onboarding',
			dataIndex: 'onboarding',
			key: 'onboarding',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.onboarding}</div>;
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.status}</div>;
			},
		},
	];

	useEffect(() => {
		let pairBase = balanceData[`${stakePoolCreation.currency}_available`] || 0;
		setSelectedCurrencyBalance(pairBase);
	}, [balanceData]);

	useEffect(() => {
		getAllUserData();
		// setIsLoading(true);
		// requestSessions(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// requestSessions(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const getUserBalance = async (id) => {
		try {
			const res = await requestUserData({ id });
			if (res && res.data) {
				setBalanceData(res.data[0]?.balance);
			}
		} catch (err) {
			let errMsg =
				err.data && err.data.message ? err.data.message : err.message;
			message.error(errMsg);
		}
	};

	const handleEditInput = () => {
		if (searchRef && searchRef.current && searchRef.current.focus) {
			searchRef.current.focus();
		}
	};

	const requestDownload = () => {
		return requestUserLoginsDownload({ ...queryValues, format: 'csv' });
	};

	const requestSessions = (page = 1, limit = 50) => {
		setIsLoading(true);
		requestUserLogins({ page, limit, ...queryValues })
			.then((response) => {
				setUserData(
					page === 1 ? response.data : [...userData, ...response.data]
				);

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

	const pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = queryFilters;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestSessions(page + 1, limit);
		}
		setQueryFilters({ ...queryFilters, currentTablePage: count });
	};

	const renderErrorMsg = () => {
		return (
			<div className="d-flex align-items-center error-container">
				<span className="error">
					{' '}
					<ExclamationCircleFilled />
				</span>
				<span className="balance-error-text pl-2">
					{' '}
					There doesn't seem to be any available balance for this coins.
				</span>
			</div>
		);
	};

	const handleEmailChange = (value) => {
		let emailId = parseInt(value);
		let emailData = {};
		emailOptions &&
			emailOptions.forEach((item) => {
				if (item.value === emailId) {
					emailData = item;
				}
			});

		setSelectedEmailData(emailData);
		getUserBalance(emailId);
		setStakePoolCreation({
			...stakePoolCreation,
			account_id: emailId,
		});

		handleSearch(emailData.label);
	};

	const getAllUserData = async (params = {}) => {
		try {
			const res = await requestUsers(params);
			if (res && res.data) {
				const userData = res.data.map((user) => ({
					label: user.email,
					value: user.id,
				}));
				setEmailOptions(userData);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	const searchUser = (searchText, type) => {
		getAllUserData({ search: searchText }, type);
	};

	const handleSearch = _debounce(searchUser, 1000);

	const onHandleCreateStakePool = async () => {
		try {
			await createStakePool(stakePoolCreation);
		} catch (error) {}
	};

	const renderStakePoolCreationModal = () => {
		if (step === 1) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create a stake pool
					</h1>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Select asset
					</h3>

					<div className="otc-Container">
						<div className="mb-5">
							<div className="mb-2">Asset</div>
							<Select
								showSearch
								className="select-box"
								placeholder="Select value"
								value={stakePoolCreation.currency}
								onChange={(e) => {
									setStakePoolCreation({
										...stakePoolCreation,
										currency: e,
									});
								}}
							>
								{Object.keys(coins).map((key) => (
									<Option value={key}>{coins[key].fullname}</Option>
								))}
							</Select>
						</div>

						{stakePoolCreation.currency && (
							<div className="mb-4">
								<div className="d-flex align-items-center coin-image">
									<div className=" mr-3">
										<Coins type={stakePoolCreation.currency} />
									</div>
									<div>
										<div
											dangerouslySetInnerHTML={{
												__html: coins[stakePoolCreation.currency].description,
											}}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</>
			);
		} else if (step === 2) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create a stake pool
					</h1>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Name
					</h3>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
							Name of staking pool
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
							placeholder="Input the name of the staking pool"
							onChange={(e) =>
								setStakePoolCreation({
									...stakePoolCreation,
									name: e.target.value,
								})
							}
							value={stakePoolCreation.name}
						/>
					</div>
				</>
			);
		} else if (step === 3) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create a stake pool
					</h1>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Distribution rate
					</h3>

					<h2 style={{ fontWeight: '600', color: 'white', marginTop: 20 }}>
						Annual Percentage Yield
					</h2>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
							Set APY reward rate to distribute
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
							placeholder="Set annual percentage yield rate"
							onChange={(e) =>
								setStakePoolCreation({
									...stakePoolCreation,
									apy: e.target.value,
								})
							}
							value={stakePoolCreation.apy}
						/>
					</div>

					<h2 style={{ fontWeight: '600', color: 'white', marginTop: 20 }}>
						Duration Term
					</h2>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
							Staking duration
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
							placeholder="Input the days users should stake for"
							onChange={(e) =>
								setStakePoolCreation({
									...stakePoolCreation,
									duration: e.target.value,
								})
							}
							value={stakePoolCreation.duration}
							disabled={stakePoolCreation.perpetual_stake}
						/>
					</div>
					<div>
						<Checkbox
							onChange={(e) => {
								setStakePoolCreation({
									...stakePoolCreation,
									perpetual_stake: e.target.checked,
								});
							}}
							style={{ color: 'white', marginBottom: 5 }}
							checked={stakePoolCreation.perpetual_stake}
						>
							Perpetual staking
						</Checkbox>
					</div>
					{stakePoolCreation.perpetual_stake && (
						<div style={{ marginLeft: 20, color: '#FFAA00', marginBottom: 30 }}>
							Note: Allow users to unstake at any time. Perpetual staking is
							intended for staking pools with a flexible, low-maintenance, and
							stable reward rate. Kindly set the APY accordingly.
						</div>
					)}
				</>
			);
		} else if (step === 4) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create a stake pool
					</h1>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Unstaking
					</h3>

					<h4
						style={{
							fontWeight: '600',
							color: 'white',
							marginTop: 20,
							marginBottom: 10,
						}}
					>
						Unstake early
					</h4>

					<h5
						style={{
							fontWeight: '600',
							color: 'white',
							marginTop: 20,
							marginBottom: 20,
						}}
					>
						Allow users to unstake early
					</h5>

					<div style={{ marginBottom: 40 }}>
						<Radio.Group
							onChange={(e) => {
								setStakePoolCreation({
									...stakePoolCreation,
									early_unstake: e.target.value,
								});
							}}
							value={stakePoolCreation.early_unstake}
						>
							<Space direction="vertical">
								<Radio style={{ color: 'white' }} value={true}>
									Yes
								</Radio>
								<Radio style={{ color: 'white' }} value={false}>
									No
								</Radio>
							</Space>
						</Radio.Group>
						{!stakePoolCreation.early_unstake && (
							<>
								<div style={{ color: '#FFAA00', marginTop: 10 }}>
									Once users have committed to the staking pool, they won't be
									able to unstake their funds until the term is finished.
								</div>
								<div style={{ color: '#FFAA00', fontWeight: 'bold' }}>
									{' '}
									Use with Caution.
								</div>
							</>
						)}
					</div>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
							opacity: !stakePoolCreation.early_unstake ? 0.4 : 1,
						}}
					>
						Slashing rules
					</h3>

					<h4
						style={{
							fontWeight: '600',
							color: 'white',
							marginTop: 20,
							marginBottom: 10,
							opacity: !stakePoolCreation.early_unstake ? 0.4 : 1,
						}}
					>
						Principle
					</h4>

					<div style={{ marginBottom: 30 }}>
						<div
							style={{
								fontWeight: 'bold',
								fontSize: 16,
								marginBottom: 4,
								opacity: !stakePoolCreation.early_unstake ? 0.4 : 1,
							}}
						>
							Slash on principle
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
							placeholder="Input the percentage to be deducted"
							disabled={!stakePoolCreation.early_unstake}
							onChange={(e) =>
								setStakePoolCreation({
									...stakePoolCreation,
									slashing_principle_percentage: e.target.value,
								})
							}
							value={stakePoolCreation.slashing_principle_percentage}
						/>
					</div>

					<h4
						style={{
							fontWeight: '600',
							color: 'white',
							marginTop: 20,
							marginBottom: 20,
							opacity: !stakePoolCreation.early_unstake ? 0.4 : 1,
						}}
					>
						Earnings
					</h4>

					<h5
						style={{
							fontWeight: '600',
							color: 'white',
							marginTop: 20,
							marginBottom: 10,
							opacity: !stakePoolCreation.early_unstake ? 0.4 : 1,
						}}
					>
						Deduct percentage of earnings
					</h5>
					<div
						style={{
							marginBottom: 40,
							opacity: !stakePoolCreation.early_unstake ? 0.4 : 1,
						}}
					>
						<Radio.Group
							onChange={(e) => {
								setStakePoolCreation({
									...stakePoolCreation,
									slash_earnings: e.target.value,
								});
							}}
							value={stakePoolCreation.slash_earnings}
							style={{ width: '100%' }}
						>
							<Space direction="vertical" style={{ width: '100%' }}>
								<Radio style={{ color: 'white' }} value={true}>
									Yes
								</Radio>

								{stakePoolCreation.slash_earnings && (
									<div
										style={{ marginBottom: 10, marginTop: 10, marginLeft: 20 }}
									>
										<div
											style={{
												fontWeight: 'bold',
												fontSize: 16,
												marginBottom: 4,
												color: 'white',
											}}
										>
											Slash on earnings
										</div>
										<Input
											style={{
												backgroundColor: 'rgba(0,0,0,0.1)',
												color: 'white',
												width: '100%',
											}}
											placeholder="Input the percentage to be deducted"
											onChange={(e) =>
												setStakePoolCreation({
													...stakePoolCreation,
													slashing_earning_percentage: e.target.value,
												})
											}
											value={stakePoolCreation.slashing_principle_percentage}
										/>
									</div>
								)}

								<Radio style={{ color: 'white' }} value={false}>
									No
								</Radio>
							</Space>
						</Radio.Group>
					</div>
				</>
			);
		} else if (step === 5) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create a stake pool
					</h1>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Min and max parameters
					</h3>

					<h5
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 20,
							marginTop: 30,
						}}
					>
						Amount
					</h5>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
							Minimum stake amount
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
							placeholder="Input min amount that can be staked"
							onChange={(e) =>
								setStakePoolCreation({
									...stakePoolCreation,
									min_amount: e.target.value,
								})
							}
							value={stakePoolCreation.min_amount}
						/>
					</div>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
							Maximum stake amount
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
							placeholder="Input max amount that can be staked"
							onChange={(e) =>
								setStakePoolCreation({
									...stakePoolCreation,
									max_amount: e.target.value,
								})
							}
							value={stakePoolCreation.max_amount}
						/>
					</div>
				</>
			);
		} else if (step === 6) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create a stake pool
					</h1>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Disclamiers
					</h3>

					<h4
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 20,
							marginTop: 30,
						}}
					>
						Warning disclamiers (optional)
					</h4>

					<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
						Add a disclamiers
					</div>
					<div style={{ marginBottom: 30, textAlign: 'center' }}>
						<Input.TextArea
							onChange={(e) =>
								setStakePoolCreation({
									...stakePoolCreation,
									disclaimer: e.target.value,
								})
							}
							value={stakePoolCreation.disclaimer}
							style={{
								color: 'white',
								backgroundColor: 'rgba(0,0,0,0.1)',
								border: '1px solid white',
								height: 120,
								marginBottom: 10,
								marginTop: 10,
							}}
							placeholder="Input a disclaimer or more details about the pool"
							rows={3}
						/>
					</div>
				</>
			);
		} else if (step === 7) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create a stake pool
					</h1>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Funding account source
					</h3>

					<h5
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 20,
							marginTop: 30,
						}}
					>
						Set rewards source
					</h5>

					<div className="otc-Container">
						<div>
							<div>Set the source of the inventory funds</div>
							{/* <div className="sub-content mb-3">
								<div>
									Inventory are funds used for satisfying all users orders.
								</div>
								<div>
									It is the responsibility of the operator to allocate an
									adequate amount of both assets.{' '}
								</div>
								<div>
									Simply define an account with sufficient balance that will
									be used to source inventory from.
								</div>
							</div> */}
						</div>

						<div className="mb-5">
							<div className="mb-2">Account to source inventory from</div>
							<div className="d-flex align-items-center">
								<Select
									ref={(inp) => {
										searchRef.current = inp;
									}}
									showSearch
									placeholder="admin@exchange.com"
									className="user-search-field"
									onSearch={(text) => handleSearch(text)}
									filterOption={() => true}
									value={selectedEmailData && selectedEmailData.label}
									onChange={(text) => handleEmailChange(text)}
									showAction={['focus', 'click']}
								>
									{emailOptions &&
										emailOptions.map((email) => (
											<Option key={email.value}>{email.label}</Option>
										))}
								</Select>
								<div className="edit-link" onClick={handleEditInput}>
									Edit
								</div>
							</div>
						</div>
						<div className="mb-4">Available balance on :</div>
						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={stakePoolCreation.currency} />
								</div>
								<div>
									{stakePoolCreation.currency &&
										coins[stakePoolCreation.currency].fullname}
									: {selectedCurrencyBalance}
								</div>
							</div>
							{!selectedCurrencyBalance && renderErrorMsg()}
						</div>

						<div className="message" style={{ marginBottom: 40 }}>
							<div className="icon">
								<ExclamationCircleOutlined />
							</div>
							<div className="message-subHeading">
								Please check if the amounts are sufficiently sustainable before
								proceeding.
							</div>
						</div>
					</div>
				</>
			);
		} else if (step === 8) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Review and confirm stake pool
					</h1>

					<div className="otc-Container">
						<Fragment>
							<div className="grey-warning">
								<div className="warning-text">!</div>
								<div>
									<div className="sub-title">
										Please check the details carefully.
									</div>
									<div className="description">
										To avoid delays it is important to take the time to review
										the accuracy of the details below
									</div>
								</div>
							</div>
						</Fragment>
						<div
							className="d-flex preview-container"
							style={{
								display: 'flex',
								// justifyContent: 'space-around',
							}}
						>
							<div
								className="d-flex flex-container left-container"
								style={{ marginLeft: 30 }}
							>
								<div>
									<Coins
										nohover
										large
										small
										type={stakePoolCreation.currency}
										// fullname={getFullName(previewData && previewData.pair_base)}
									/>
								</div>
							</div>
							<div className="right-container" style={{ marginLeft: 30 }}>
								<div className="right-content">
									<div className="title font-weight-bold">Asset</div>
									<div>
										Stake asset:{' '}
										{stakePoolCreation.currency &&
											coins[stakePoolCreation.currency].fullname}{' '}
										({stakePoolCreation.currency})
									</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">
										Min and max parameters
									</div>

									<div>
										Max size: {stakePoolCreation.min_amount}{' '}
										{stakePoolCreation.currency}
									</div>
									<div>
										Min size: {stakePoolCreation.max_amount}{' '}
										{stakePoolCreation.currency}
									</div>
								</div>

								<div className="right-content">
									<div className="title font-weight-bold">Duration</div>

									<div>
										Duration:{' '}
										{stakePoolCreation.duration ||
											'No duration, Perpetual staking'}
									</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Slashing rules</div>
									<div>
										Slash on principle:{' '}
										{stakePoolCreation.slashing_principle_percentage + '%' ||
											'-'}{' '}
									</div>
									<div>
										{' '}
										Slash on earnings:{' '}
										{stakePoolCreation.slashing_earning_percentage + '%' ||
											'-'}{' '}
									</div>
									<div>Disclamiers: {stakePoolCreation.disclaimer || '-'} </div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">
										Funding account source
									</div>
									<div>Account: {selectedEmailData?.label} </div>
									<div>
										{' '}
										{stakePoolCreation.currency}: {selectedCurrencyBalance}{' '}
									</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">
										Distribution rate
									</div>
									<div>APY: {stakePoolCreation.apy + '%'} </div>
								</div>
							</div>
						</div>
					</div>
				</>
			);
		} else if (step === 9) {
			return (
				<>
					<h1 style={{ fontWeight: '600', color: 'white' }}>Open pool</h1>

					<h5
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
						}}
					>
						Open this pool to the public for staking.
					</h5>

					<div style={{ color: 'white', marginBottom: 30, padding: 10 }}>
						<div
							style={{
								border: '1px solid grey',
								width: '100%',
								maxHeight: 400,
								padding: '0 20px',
							}}
						>
							<h1
								style={{
									width: 160,
									textAlign: 'center',
									fontSize: 14,
									marginTop: -10,
									marginLeft: -10,
									backgroundColor: '#27339D',
									color: 'white',
								}}
							>
								REVIEW POOL CONFIG
							</h1>

							<div style={{ overflowY: 'auto', height: 300, marginTop: 10 }}>
								<div>
									<span style={{ fontWeight: 'bold' }}>Stake asset: </span>
									{stakePoolCreation.currency &&
										coins[stakePoolCreation.currency].fullname}{' '}
									({stakePoolCreation.currency})
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Pool name: </span>
									{stakePoolCreation.name}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Min amount: </span>
									{stakePoolCreation.min_amount} {stakePoolCreation.currency}{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Max amount: </span>
									{stakePoolCreation.max_amount} {stakePoolCreation.currency}{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Duration: </span>
									{stakePoolCreation.duration} days
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>
										Slash on principle:
									</span>{' '}
									{stakePoolCreation.slashing_principle_percentage}%{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>
										Slash on earnings:{' '}
									</span>
									{stakePoolCreation.slashing_earning_percentage}%{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Disclamiers: </span>
									{stakePoolCreation.disclaimer}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Account:</span>{' '}
									{selectedEmailData.label}{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>
										{stakePoolCreation.currency}:{' '}
									</span>
									{selectedCurrencyBalance}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>APY:</span>{' '}
									{stakePoolCreation.apy}%{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Duration: </span>
									{stakePoolCreation.duration}
									days
								</div>
							</div>
						</div>

						<div style={{ marginTop: 15 }}>
							Want to change something within the pool?{' '}
							<span style={{ textDecoration: 'underline' }}>
								Reconfigure it here.
							</span>
						</div>
						<div
							style={{
								padding: 20,
								marginTop: 20,
								backgroundColor: '#FFFFFF',
								color: '#27339D',
								fontWeight: '500',
							}}
						>
							Note, the pool will be{' '}
							<span style={{ fontWeight: '700' }}>unconfigurable</span> upon
							opening.
						</div>

						<div style={{ marginBottom: 20, marginTop: 20 }}>
							<div
								style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}
							>
								Do you understand?
							</div>
							<Input
								style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
								placeholder="Type 'I UNDERSTAND' to proceed"
								onChange={(e) => setConfirmText(e.target.value)}
								value={confirmText}
							/>
						</div>
					</div>
				</>
			);
		}
	};
	return (
		<div>
			{displayStakePoolCreation && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayStakePoolCreation}
					footer={null}
					onCancel={() => {
						setDisplayStatePoolCreation(false);
					}}
				>
					<div>{renderStakePoolCreationModal()}</div>

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
								let currentStep = step - 1;
								if (currentStep <= 0) {
									setDisplayStatePoolCreation(false);
								} else {
									setStep(currentStep);
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
							Back
						</Button>
						<Button
							onClick={async () => {
								let currentStep = step + 1;
								if (currentStep >= 10) {
									await onHandleCreateStakePool();
									setDisplayStatePoolCreation(false);
								} else {
									setStep(currentStep);
								}
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
								opacity: step === 9 && confirmText !== 'I UNDERSTAND' ? 0.4 : 1,
							}}
							type="default"
							disabled={step === 9 && confirmText !== 'I UNDERSTAND'}
						>
							Next
						</Button>
					</div>
				</Modal>
			)}
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<div style={{ color: '#ccc' }}>
						Allow your users to grow their assets by rewarding them for locking
						up funds (staking) on your platform.
					</div>
					<div style={{ color: '#ccc', marginTop: 10 }}>
						To setup a staking pool please click →{' '}
						<span style={{ textDecoration: 'underline' }}>
							Create Stake Pool
						</span>
					</div>
				</div>
				<div>
					<Button
						onClick={() => {
							setDisplayStatePoolCreation(true);
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
							marginRight: 10,
						}}
						type="default"
					>
						Create CeFi Stake Pool
					</Button>
				</div>
			</div>

			<div style={{ marginLeft: 15, marginTop: 10 }}>
				<div style={{ fontSize: 18, marginBottom: 5 }}>Allow CeFi Staking</div>
				<div>
					Allow your users to CeFi stake and earn rewards on your exchange.
				</div>
				<div style={{ marginTop: 20 }}>
					<div className="d-flex">
						<span style={{ marginRight: 3 }}>Off</span>
						<Switch
							checked={true}
							// onClick={}
						/>
						<span style={{ marginLeft: 3 }}>On</span>
					</div>
				</div>
			</div>
			<div>
				<div style={{ marginTop: 20 }}></div>
				<div className="mt-5">
					<div className="mt-4 ">
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={userData}
								expandRowByClick={true}
								rowKey={(data) => {
									return data.id;
								}}
								pagination={{
									current: queryFilters.currentTablePage,
									onChange: pageChange,
								}}
							/>
						</Spin>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CeFi;
