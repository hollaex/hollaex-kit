import React, { useState, useEffect, Fragment } from 'react';
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
} from 'antd';
import { requestUserLogins, requestUserLoginsDownload } from './actions';
import { formatDate } from 'utils';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';
import {
	CloseOutlined,
	ExclamationCircleOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import Coins from '../Coins';
import './CeFi.scss';
const CeFi = () => {
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
		true
	);
	const [step, setStep] = useState(9);

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
		// setIsLoading(true);
		// requestSessions(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// requestSessions(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

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
								// value={filter.value}
								onChange={(e) => {}}
							></Select>
						</div>

						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={'xht'} />
								</div>
								<div>
									Description of the coin. This info is the same as the info
									used in the new /assets page.
								</div>
							</div>
						</div>
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
							onClick={() => {}}
							// value={}
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
							style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
							placeholder="Input the name of the staking pool"
							onClick={() => {}}
							// value={}
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
							style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
							placeholder="Input the days users should stake for"
							onClick={() => {}}
							// value={}
						/>
					</div>
					<div>
						<Checkbox
							onChange={(e) => {}}
							style={{ color: 'white', marginBottom: 5 }}
						>
							Perpetual staking
						</Checkbox>
					</div>
					<div style={{ marginLeft: 20, color: '#FFAA00', marginBottom: 30 }}>
						Note: Allow users to unstake at any time. Perpetual staking is
						intended for staking pools with a flexible, low-maintenance, and
						stable reward rate. Kindly set the APY accordingly.
					</div>
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
							onChange={() => {}}
							// value={value}
						>
							<Space direction="vertical">
								<Radio style={{ color: 'white' }} value={1}>
									Yes
								</Radio>
								<Radio style={{ color: 'white' }} value={2}>
									No
								</Radio>
							</Space>
						</Radio.Group>
						<div style={{ color: '#FFAA00', marginTop: 10 }}>
							Once users have committed to the staking pool, they won't be able
							to unstake their funds until the term is finished.
						</div>
						<div style={{ color: '#FFAA00', fontWeight: 'bold' }}>
							{' '}
							Use with Caution.
						</div>
					</div>

					<h3
						style={{
							fontWeight: '600',
							color: 'white',
							marginBottom: 40,
							marginTop: 30,
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
						}}
					>
						Principle
					</h4>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
							Slash on principle
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
							placeholder="Input the percentage to be deducted"
							onClick={() => {}}
							// value={}
						/>
					</div>

					<h4
						style={{
							fontWeight: '600',
							color: 'white',
							marginTop: 20,
							marginBottom: 20,
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
						}}
					>
						Deduct percentage of earnings
					</h5>
					<div style={{ marginBottom: 40 }}>
						<Radio.Group
							onChange={() => {}}
							// value={value}
							style={{ width: '100%' }}
						>
							<Space direction="vertical" style={{ width: '100%' }}>
								<Radio style={{ color: 'white' }} value={1}>
									Yes
								</Radio>

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
											width: '100%',
										}}
										placeholder="Input the percentage to be deducted"
										onClick={() => {}}
										// value={}
									/>
								</div>
								<Radio style={{ color: 'white' }} value={2}>
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
							onClick={() => {}}
							// value={}
						/>
					</div>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
							Maximum stake amount
						</div>
						<Input
							style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'white' }}
							placeholder="Input max amount that can be staked"
							onClick={() => {}}
							// value={}
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
							// value={}
							style={{
								color: 'white',
								backgroundColor: 'rgba(0,0,0,0.1)',
								border: '1px solid white',
								height: 120,
								marginBottom: 10,
								marginTop: 10,
							}}
							onChange={(e) => {}}
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
									ref={(inp) => {}}
									showSearch
									placeholder="admin@exchange.com"
									className="user-search-field"
									onSearch={(text) => {}}
									filterOption={() => true}
									// value={}
									onChange={(text) => {}}
									showAction={['focus', 'click']}
								></Select>
								<div className="edit-link" onClick={() => {}}>
									Edit
								</div>
							</div>
						</div>
						<div className="mb-4">Available balance on :</div>
						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={'xht'} />
								</div>
								<div>
									Bitcoin
									{0}
								</div>
							</div>
							{renderErrorMsg()}
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
								justifyContent: 'space-around',
							}}
						>
							<div className="d-flex flex-container left-container">
								<div>
									<Coins
										nohover
										large
										small
										type={'xht'}
										// fullname={getFullName(previewData && previewData.pair_base)}
									/>
								</div>
							</div>
							<div className="right-container">
								<div className="right-content">
									<div className="title font-weight-bold">Desk assets</div>
									<div>Base market pair:</div>
									<div>Price market pair:</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Parameters</div>

									<div>Max size:</div>
									<div>Min size: </div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Price</div>
									<div>Type: Static</div>
									<div>Sell at: </div>
									<div>buy at: </div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Hedge</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Fund Source</div>
									<div>Account: </div>
									<div></div>
									<div></div>
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
									<span style={{ fontWeight: 'bold' }}>Stake asset:</span> ABC
									Token (ABC)
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Pool name:</span> Test
									sake
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Min amount:</span> 1,000
									ABC{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Max amount:</span>{' '}
									1,000,000,000 ABC{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Duration: </span>3,000
									days
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>
										Slash on principle:
									</span>{' '}
									10%{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>
										Slash on earnings:{' '}
									</span>
									100%{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Disclamiers:</span>
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Account:</span>{' '}
									operator@account.com{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>ABC:</span> 1,000,000
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>APY:</span> 5%{' '}
								</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>Duration:</span> 1,000
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
								onClick={() => {}}
								// value={}
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
						}}
					>
						<Button
							onClick={() => {
								let currentStep = step - 1;
								setStep(currentStep <= 0 ? 1 : currentStep);
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
								setStep(currentStep === 10 ? 9 : currentStep);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
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
						<span>Off</span>
						<Switch
						// checked={}
						// onClick={}
						/>
						<span>On</span>
					</div>
				</div>
			</div>
			<div>
				<div style={{ marginTop: 20 }}>
					{/* <SessionFilters
						applyFilters={(filters) => {
							setQueryValues(filters);
						}}
						fieldKeyValue={fieldKeyValue}
						defaultFilters={defaultFilters}
					/> */}
				</div>
				<div className="mt-5">
					{/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span
							onClick={(e) => {
								requestDownload();
							}}
							className="mb-2 underline-text cursor-pointer"
							style={{ cursor: 'pointer' }}
						>
							Download below CSV table
						</span>
						<div>
							<span>
								<Button
									onClick={() => {
										requestSessions(queryFilters.page, queryFilters.limit);
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
									Refresh
								</Button>
							</span>
							<span>Total: {queryFilters.total || '-'}</span>
						</div>
					</div> */}

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
