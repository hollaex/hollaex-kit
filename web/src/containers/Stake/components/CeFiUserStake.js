import React, { useState, useEffect } from 'react';

import {
	Button as AntBtn,
	Tabs,
	Input,
	Spin,
	Table,
	message,
	Progress,
} from 'antd';

import {
	requestUserStakePools,
	createStaker,
	requestStakers,
	deleteStaker,
	getSlashEstimate,
} from 'containers/Admin/Stakes/actions';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import STRINGS from 'config/localizedStrings';
import { formatToCurrency } from 'utils/currency';
import '../CeFiStake.scss';
import { Dialog, Image, NotLoggedIn } from 'components';
import { EditWrapper } from 'components';
import icons from 'config/icons/dark';

const TabPane = Tabs.TabPane;

const CeFiUserStake = ({ balance, coins, theme }) => {
	const [activeTab, setActiveTab] = useState('0');

	const [readBeforeAction, setReadBeforeAction] = useState(false);
	const [stakeAmount, setStakeAmount] = useState(false);
	const [duration, setDuration] = useState(false);
	const [stakeDetails, setStakeDetails] = useState(false);
	const [confirmStake, setConfirmStake] = useState(false);
	const [confirmation, setConfirmation] = useState(false);
	const [reviewUnstake, setReviewUnstake] = useState(false);
	const [unstakeConfirm, setUnstakeConfirm] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [userStakeData, setUserStakeData] = useState([]);
	const [stakePools, setStakePools] = useState([]);
	const [selectedPool, setSelectedPool] = useState();
	const [confirmText, setConfirmText] = useState();
	const [stakerAmount, setStakerAmount] = useState();
	const [selectedStaker, setSelectedStaker] = useState();
	const [queryValues] = useState();
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const [tabOption, setTabOption] = useState('active');

	const columns = [
		{
			title: 'POOL',
			dataIndex: 'name',
			key: 'name',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.stake?.name}</div>;
			},
		},
		{
			title: 'AMOUNT',
			dataIndex: 'amount',
			key: 'amount',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.amount} {data?.currency.toUpperCase()}
					</div>
				);
			},
		},
		{
			title: 'RATE',
			dataIndex: 'apy',
			key: 'apy',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.stake?.apy}%</div>;
			},
		},
		{
			title: 'DURATION',
			dataIndex: 'duration',
			key: 'duration',
			render: (_user_id, data) => {
				return (
					<div className="d-flex">
						{data?.stake?.duration ? (
							<span className="duration-field">
								<div className="w-100">
									<Progress
										percent={
											((data?.stake?.duration -
												calculateRemainingDays(
													data?.stake?.duration,
													data?.created_at
												)) *
												100) /
											data?.stake?.duration
										}
										showInfo={false}
									/>
								</div>
								<div className="w-100">{data?.stake?.duration} days</div>
							</span>
						) : (
							'∞ Perpetual'
						)}{' '}
					</div>
				);
			},
		},
		{
			title: 'STARTED',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (_user_id, data) => {
				return <div className="d-flex">{formatDate(data?.created_at)}</div>;
			},
		},
		{
			title: 'END',
			dataIndex: 'expiry_date',
			key: 'expiry_date',
			render: (_user_id, data) => {
				return (
					<div className="d-flex">
						{data?.closing ? formatDate(data?.closing) : '∞ Perpetual'}
					</div>
				);
			},
		},
		{
			title: 'EARNT',
			dataIndex: 'earnt',
			key: 'earnt',
			render: (_user_id, data) => {
				// const incrementUnit =
				//  coins[data.reward_currency || data.currency].increment_unit;

				const min = coins[data.reward_currency || data.currency].min;
				// const decimalPoint = new BigNumber(incrementUnit).dp();
				// const sourceAmount =
				//  data?.reward &&
				//  new BigNumber(data?.reward - data?.slashed)
				//      .decimalPlaces(decimalPoint)
				//      .toNumber();

				const formattedAmount =
					data?.reward && formatToCurrency(data?.reward - data?.slashed, min);

				return (
					<div className="d-flex">
						{formattedAmount}{' '}
						{(data?.reward_currency || data?.currency).toUpperCase()}
					</div>
				);
			},
		},
		{
			title: 'Stake',
			dataIndex: 'status',
			key: 'status',
			render: (_user_id, data) => {
				return (
					<div className="stake-status-field">
						{data.status === 'unstaking' ? (
							<span className="stake-status-content font-weight-bold">
								UNSTAKING...
							</span>
						) : data.status === 'closed' ? (
							'UNSTAKED'
						) : (
							<AntBtn
								disabled={
									data.stake.duration
										? data.stake.early_unstake
											? false
											: isUnstackable(data.stake, data.created_at) < 0
											? true
											: false
										: false
								}
								onClick={async () => {
									try {
										const slashedEstimate = await getSlashEstimate(data.id);
										data.slashedValues = slashedEstimate;
										setSelectedStaker(data);
										setReviewUnstake(true);
									} catch (error) {
										message.error(error.response.data.message);
									}
								}}
								className="ant-btn green-btn ant-tooltip-open ant-btn-primary stake_theme stake-table-button"
							>
								{data.stake.early_unstake &&
								calculateRemainingDays(data?.stake?.duration, data.created_at)
									? 'UNSTAKE EARLY'
									: 'UNSTAKE'}
							</AntBtn>
						)}
					</div>
				);
			},
		},
	];

	useEffect(() => {
		requestUserStakePools()
			.then((res) => {
				setStakePools(res.data);
			})
			.catch((err) => {
				return err;
			});

		requestExchangeStakers();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestExchangeStakers(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestExchangeStakers = (page = 1, limit = 50) => {
		setIsLoading(true);
		// requestStakers({ page, limit, ...queryValues })
		requestStakers({ ...queryValues })
			.then((response) => {
				setUserStakeData(
					page === 1 ? response.data : [...userStakeData, ...response.data]
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

	// const pageChange = (count, pageSize) => {
	//  const { page, limit, isRemaining } = queryFilters;
	//  const pageCount = count % 5 === 0 ? 5 : count % 5;
	//  const apiPageTemp = Math.floor(count / 5);
	//  if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
	//      requestExchangeStakers(page + 1, limit);
	//  }
	//  setQueryFilters({ ...queryFilters, currentTablePage: count });
	// };

	const formatDate = (date) => {
		return moment(date).format('DD/MMM/YYYY').toUpperCase();
	};

	const isUnstackable = (stakePool, createdAt) => {
		const startingDate = moment(createdAt);
		const now = moment();
		const numberOfDaysPassed = now.diff(startingDate, 'days');

		const isUnstacklable = numberOfDaysPassed - stakePool.duration;
		return isUnstacklable;
	};

	const roundToIncrementUnit = (number, currency) => {
		const incrementUnit = coins[currency].increment_unit;
		const decimalPoint = new BigNumber(incrementUnit).dp();

		return new BigNumber(number).decimalPlaces(decimalPoint).toNumber();
	};

	const readBeforeActionModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme terms_condition_dialog_wrapper"
					isOpen={readBeforeAction}
					onCloseDialog={() => {
						setReadBeforeAction(false);
					}}
				>
					<div className="action_model_popup_wrapper">
						<div className="action_model_popup_content">
							<h1 className="stake_theme">Staking 101</h1>
						</div>
						<div className={`w-100 ${isMobile && 'action_model_content'}`}>
							<h4
								className={`stake_theme font-weight-bold ${
									isMobile && 'action_model_header'
								}`}
							>
								{STRINGS['CEFI_STAKE.READ_BEFORE_AGREE_AND_EARN']}
							</h4>
							<div
								className={`${isMobile && 'action_model_agreement_wrapper'}`}
							>
								<div
									className={`stake_theme stake_detail_text ${
										isMobile && 'action_model_agreement_content '
									}`}
								>
									{STRINGS['CEFI_STAKE.AGREEMENT_INTRODUCTION_1']}{' '}
									<span className="font-weight-bold stake_theme">
										{STRINGS['CEFI_STAKE.AGREEMENT_INTRODUCTION_2']}
									</span>{' '}
									{STRINGS['CEFI_STAKE.AGREEMENT_INTRODUCTION_3']}
								</div>
							</div>
						</div>
					</div>
					<div className="stake_popup_button_wrapper">
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setReadBeforeAction(false);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							className="stake_popup_button"
							onClick={async () => {
								setReadBeforeAction(false);
								setStakeAmount(true);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.I_UNDERSTAND_BUTTON']}
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const stakeAmountModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme stake_amount_dialog"
					isOpen={stakeAmount}
					footer={null}
					onCloseDialog={() => {
						setStakeAmount(false);
					}}
				>
					<div className="stake_amount_popup_wrapper">
						<div className="stake_theme stake_amount_theme">
							<h3 className="stake_theme">{selectedPool.name}</h3>
							<div>-</div>
							<div>APY: {selectedPool.apy}%</div>
						</div>
						<div className="stake_theme stake_amount_popup_content">
							<div>
								<span className="font-weight-bold">
									{selectedPool.currency.toUpperCase()} available:
								</span>{' '}
								<span className="blue-link underline-text">
									{balance[`${selectedPool.currency}_available`]}
								</span>
							</div>
							<div className={`${isMobile && 'mt-4 mb-3'}`}>
								<span className="font-weight-bold">
									{STRINGS['CEFI_STAKE.AMOUNT_TO_STAKE_LABEL']}:
								</span>
							</div>
							<div className={`mt-2 ${!isMobile && 'mb-3'}`}>
								<Input
									className="stake_theme stake_amount_field"
									placeholder="Input amount"
									onChange={(e) => {
										setStakerAmount(e.target.value);
									}}
									prefix={stakePools
										.filter(
											(pool) => pool.status === 'active' && pool.onboarding
										)
										.map((pool) => {
											return (
												<div className="stakepool_card_icon">
													<img
														src={coins?.[pool?.currency]?.logo}
														width={20}
														height={20}
														alt=""
													/>
												</div>
											);
										})}
									suffix={selectedPool.currency.toUpperCase()}
									value={stakerAmount}
								/>
							</div>
							{/* <div style={{ color: '#FF0000', marginTop: 10 }}>
                                Staking pool's maximum amount allowed is 1,000 ABC
                            </div> */}
						</div>
					</div>
					<div className="stake_popup_button_wrapper">
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setReadBeforeAction(true);
								setStakeAmount(false);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							className="stake_popup_button"
							onClick={async () => {
								if (stakerAmount < selectedPool.min_amount) {
									message.error(
										`Staking pool's minimum amount allowed is ${
											selectedPool.min_amount
										} ${selectedPool.currency.toUpperCase()}`
									);
									return;
								}

								if (stakerAmount > selectedPool.max_amount) {
									message.error(
										`Staking pool's maximum amount allowed is ${
											selectedPool.max_amount
										} ${selectedPool.currency.toUpperCase()} `
									);
									return;
								}

								setStakeAmount(false);
								setDuration(true);
							}}
							type="default"
							disabled={!stakerAmount}
						>
							{STRINGS['CEFI_STAKE.NEXT_BUTTON']}
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const durationModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme duartion_model_dialog_wrapper"
					isOpen={duration}
					onCloseDialog={() => {
						setDuration(false);
					}}
				>
					<div className="stake_duration_model_wrapper">
						<div className="d-flex">
							<Image
								iconId="STAKING__LOCK"
								icon={icons['STAKING__LOCK']}
								wrapperClassName="cefi-logo"
							/>
							<h1 className="stake_theme ml-2 mt-3">
								{STRINGS['CEFI_STAKE.DURATION_LABEL']}
							</h1>
						</div>
						<div className="stake_theme stake_text">
							{STRINGS['CEFI_STAKE.LOCKUP_DURATION_LABEL']}:{' '}
							<span className="stake_detail_text">
								{selectedPool.duration
									? `${selectedPool.duration} days`
									: 'Perpetual'}
							</span>
						</div>
						<div className="stake_theme stake_text">-</div>

						{selectedPool.slashing && (
							<>
								<h4 className="stake_theme stake_text_header">Slashing</h4>
								<div className="stake_theme stake_text">
									{
										STRINGS[
											'CEFI_STAKE.PENALTY_UPON_INITIAL_STAKE_PRINCIPLE_LABEL'
										]
									}
									:
									<span className="stake_detail_text">
										{' '}
										-{selectedPool.slashing_principle_percentage}%{' '}
									</span>
								</div>
								<div className="stake_theme stake_text">
									{STRINGS['CEFI_STAKE.FORFEITURE_OF_EARNINGS_LABEL']}: -
									<span className="stake_detail_text">
										{selectedPool.slashing_earning_percentage}%
									</span>
								</div>
							</>
						)}

						{selectedPool.slashing && (
							<div className="danger_message_wrapper">
								<div>{STRINGS['CEFI_STAKE.SLASHING_RULES_ENFORCED_LABEL']}</div>
								<div>{STRINGS['CEFI_STAKE.SLASHING_RULES_NOTICE']}</div>
							</div>
						)}

						{!selectedPool.duration && (
							<div className="success_message_wrapper">
								<div>{STRINGS['CEFI_STAKE.UNSTAKE_ANYTIME_LABEL']}</div>
							</div>
						)}

						{selectedPool.duration && !selectedPool.early_unstake ? (
							<div className="warning_message_wrapper">
								<div>{STRINGS['CEFI_STAKE.FULL_DURATION_LOCK_LABEL']}</div>
							</div>
						) : (
							<></>
						)}
					</div>
					<div className="stake_popup_button_wrapper">
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setStakeAmount(true);
								setDuration(false);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							className="stake_popup_button"
							onClick={async () => {
								setDuration(false);
								setStakeDetails(true);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.PROCEED_BUTTON']}
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const stakeDetailsModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme stake_details_dialog_wrapper"
					isOpen={stakeDetails}
					onCloseDialog={() => {
						setStakeDetails(false);
					}}
				>
					<div className="stake_detail_popup_wrapper">
						<h1 className="stake_theme">
							{STRINGS['CEFI_STAKE.CHECK_STAKE_DETAILS_BUTTON']}
						</h1>
						<div className="stake_theme">
							{STRINGS['CEFI_STAKE.STAKING_POOL_LABEL']}:{' '}
							<span className="stake_detail_text">{selectedPool.name}</span>
						</div>
						<div className="stake_theme">
							{STRINGS['CEFI_STAKE.ANNUAL_PERCENTAGE_YIELD_LABEL']}:
							<span className="stake_detail_text">
								{' '}
								{selectedPool.apy}% APY
							</span>
						</div>
						<div className="stake_theme">
							{STRINGS['CEFI_STAKE.DURATION_LABEL']}:{' '}
							<span className="stake_detail_text">
								{selectedPool.duration} days{' '}
							</span>
						</div>
						<div className="stake_theme">
							{STRINGS['CEFI_STAKE.PENALTY_UPON_INITIAL_STAKE_PRINCIPLE_LABEL']}
							:{' '}
							<span className="stake_detail_text">
								-{selectedPool.slashing_principle_percentage}%
							</span>
						</div>
						<div className="stake_theme">
							{STRINGS['CEFI_STAKE.FORFEITURE_OF_EARNINGS_DETAILS_LABEL']}:{' '}
							<span className="stake_detail_text">
								-{selectedPool.slashing_earning_percentage}%
							</span>
						</div>

						<div className={`stake_theme ${!isMobile && 'mt-4'}`}>
							{STRINGS['CEFI_STAKE.STAKE_AMOUNT_LABEL']}:{' '}
							<span className="stake_detail_text">
								{stakerAmount} {selectedPool.currency.toUpperCase()}
							</span>
						</div>
						<hr />
						{isMobile && <div className="stake_detail_line"></div>}
						<div className="stake_theme mt-4 mb-3 stake_detail_text">
							{selectedPool.disclaimer}
						</div>
						<div className="stake_theme stake_detail_text">
							{STRINGS.formatString(
								STRINGS['CEFI_STAKE.SETTLEMENT_NOTICE'],
								<span className="stake_theme">
									{STRINGS['CEFI_STAKE.SETTLEMENT_NOTICE_TITLE']}
								</span>
							)}
						</div>
					</div>
					<div className={`stake_popup_button_wrapper  ${!isMobile && 'mt-5'}`}>
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setDuration(true);
								setStakeDetails(false);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							className="stake_popup_button"
							onClick={async () => {
								setStakeDetails(false);
								setConfirmStake(true);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.PROCEED_BUTTON']}
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const confirmStakeModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme confirm_stake_dialog_wrapper"
					isOpen={confirmStake}
					onCloseDialog={() => {
						setConfirmStake(false);
					}}
				>
					<div className="stake_theme confirm_stake_popup_wrapper">
						<div className="stake_theme confirm_stake_theme mb-2">
							<h3 className="stake_theme">
								{STRINGS['CEFI_STAKE.CONFIRM_BUTTON']}{' '}
								{selectedPool.currency.toUpperCase()} Stake
							</h3>
						</div>
						{isMobile &&
							stakePools
								.filter((pool) => pool.status === 'active' && pool.onboarding)
								.map((pool) => {
									return (
										<div className="stakepool_card_icon">
											<img
												src={coins?.[pool?.currency]?.logo}
												width={30}
												height={30}
												alt=""
											/>
										</div>
									);
								})}
						<div className="confirm_stake_content_wrapper">
							<div className={isMobile && 'confirm_stake_content'}>
								<div>
									<span className="stake_theme font-weight-bold mt-5">
										Here we go!{' '}
									</span>
								</div>
								<div className="stake_theme rules_notice_text stake_detail_text">
									{STRINGS['CEFI_STAKE.STAKE_RULES_NOTICE']}
								</div>
							</div>
							<div className="stake_theme mt-5  stake_detail_text">
								{' '}
								Do you understand?
							</div>
							<div className="stake_theme mt-2">
								<Input
									className="stake_theme confirm_stake_field"
									placeholder="Type 'I UNDERSTAND'"
									onChange={(e) => setConfirmText(e.target.value)}
									value={confirmText}
								/>
							</div>
						</div>
					</div>

					<div className="stake_popup_button_wrapper">
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setStakeDetails(true);
								setConfirmStake(false);
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.BACK_BUTTON']}
						</AntBtn>
						<AntBtn
							className={`stake_popup_button ${
								confirmText !== 'I UNDERSTAND'
									? 'stake_half_opacity'
									: 'stake_opacity'
							}`}
							onClick={async () => {
								try {
									await createStaker({
										stake_id: selectedPool.id,
										amount: Number(stakerAmount),
									});
									message.success(`Successfuly staked in ${selectedPool.name}`);
								} catch (error) {
									message.error(error.response.data.message);
									return;
								}

								const stakes = await requestUserStakePools();
								setStakePools(stakes.data);

								requestExchangeStakers();
								setConfirmText();
								setStakerAmount();
								setConfirmStake(false);

								setConfirmation(false);
								setStakeDetails(false);
								setDuration(false);
								setStakeAmount(false);
								setReadBeforeAction(false);
							}}
							disabled={confirmText !== 'I UNDERSTAND'}
							type="default"
						>
							I UNDERSTAND, STAKE
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const confirmationModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme confirmation_model_dialog_wrapper"
					isOpen={confirmation}
					onCloseDialog={() => {
						setConfirmation(false);
					}}
				>
					<div className="confirmation_model_popup_wrapper">
						<div className="confirmation_model_content">
							{isMobile &&
								stakePools
									.filter((pool) => pool.status === 'active' && pool.onboarding)
									.map((pool) => {
										return (
											<div className="stakepool_card_icon mb-5">
												<img
													src={coins?.[pool?.currency]?.logo}
													width={50}
													height={50}
													alt=""
												/>
											</div>
										);
									})}
							<h3 className="stake_theme confirmation_amount_text">
								{stakerAmount} {selectedPool.currency.toUpperCase()}
							</h3>
							<div className="successful_stack_text">Successfully staked</div>
							<div className="mt-5 mb-5 stake_detail_line"></div>
							<div className="confirmation_label congrats_text mb-3">
								{STRINGS['CEFI_STAKE.CONGRATULATIONS_NOTICE']}
							</div>
							<div className="confirmation_label mb-3">
								{STRINGS['CEFI_STAKE.EARNINGS_START_NOTICE']}
							</div>
							<div className="confirmation_label mb-3">
								{' '}
								{STRINGS.formatString(
									STRINGS['CEFI_STAKE.REVIEW_PROGRESS_LABEL'],
									<span
										className="active_link"
										onClick={async () => {
											setConfirmation(false);
											handleTabChange('1');
											setStakerAmount();
											setSelectedPool();
										}}
									>
										{STRINGS['CEFI_STAKE.REVIEW_PROGRESS_ACTIVE_LINK']}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="stake_popup_button_wrapper">
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setConfirmation(false);
								setStakerAmount();
								setSelectedPool();
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.CLOSE_BUTTON']}
						</AntBtn>
						<AntBtn
							className="stake_popup_button"
							onClick={async () => {
								setConfirmation(false);
								handleTabChange('1');
								setStakerAmount();
								setSelectedPool();
							}}
							type="default"
						>
							VIEW ACTIVE STAKES
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const reviewUnstakeModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme"
					isOpen={reviewUnstake}
					onCloseDialog={() => {
						setReviewUnstake(false);
					}}
				>
					<div className="review_unstake_popup_wrapper">
						<div className="review_unstake_content">
							<h3 className="stake_theme">Review and unstake</h3>
							{isMobile && (
								<div className="review_unstack_wrapper mb-4">
									{isMobile &&
										stakePools
											.filter(
												(pool) => pool.status === 'active' && pool.onboarding
											)
											.map((pool) => {
												return (
													<div className="stakepool_card_icon">
														<img
															src={coins?.[pool?.currency]?.logo}
															width={30}
															height={30}
															alt=""
														/>
													</div>
												);
											})}
									<div className="review_unstack_amount_wrapper">
										<div>
											<span className="font-weight-normal">
												{STRINGS['UNSTAKE.AMOUNT_TO_RECEIVE']}:
											</span>{' '}
											<span className="stake_detail_text">
												{selectedStaker.reward_currency
													? selectedStaker.reward > 0
														? `${roundToIncrementUnit(
																new BigNumber(selectedStaker.reward)
																	.minus(
																		new BigNumber(
																			selectedStaker.slashedValues.slashingEarning
																		)
																	)
																	.toNumber(),
																selectedStaker.reward_currency
														  )} ${selectedStaker.reward_currency.toUpperCase()}`
														: 'No reward amount to receive'
													: `${new BigNumber(selectedStaker.amount)
															.minus(
																new BigNumber(
																	selectedStaker.slashedValues.slashingPrinciple
																)
															)
															.plus(
																new BigNumber(selectedStaker.reward).minus(
																	new BigNumber(
																		selectedStaker.slashedValues.slashingEarning
																	)
																)
															)
															.toNumber()} ${selectedStaker.currency.toUpperCase()}`}
											</span>
										</div>
										<span className="review_settle_notice stake_detail_text">
											({STRINGS['CEFI_STAKE.REQUIRES_24H_TO_SETTLE_NOTICE']})
										</span>
									</div>
								</div>
							)}
							<div className={isMobile && 'mb-4'}>
								<span>{STRINGS['CEFI_STAKE.TIME_REMAINING_LABEL']}:</span>{' '}
								<span className="stake_detail_text">
									{selectedStaker?.stake?.duration ? (
										<>
											{calculateRemainingDays(
												selectedStaker?.stake?.duration,
												selectedStaker.created_at
											)}{' '}
											days (
											{selectedStaker?.stake?.duration &&
												formatDate(selectedStaker?.closing)}
											)
										</>
									) : (
										'Perpetual'
									)}
								</span>
							</div>
							<div className={isMobile && 'mb-4'}>
								<span>
									{STRINGS['CEFI_STAKE.PENALTY_UPON_INITIAL_STAKE_PRINCIPLE']}:
								</span>{' '}
								<span className="stake_detail_text">
									{roundToIncrementUnit(
										selectedStaker.slashedValues.slashingPrinciple,
										selectedStaker.currency
									)}{' '}
									{selectedStaker.currency.toUpperCase()} (-
									{selectedStaker?.stake?.slashing_principle_percentage
										? `${selectedStaker?.stake?.slashing_principle_percentage}%`
										: '-'}
									)
								</span>
							</div>
							<div>
								<span>
									{STRINGS['CEFI_STAKE.FORFEITURE_OF_EARNINGS_LABEL']}:
								</span>{' '}
								<span className="stake_detail_text">
									{roundToIncrementUnit(
										selectedStaker.slashedValues.slashingEarning,
										selectedStaker.reward_currency || selectedStaker.currency
									)}{' '}
									{(
										selectedStaker.reward_currency || selectedStaker.currency
									).toUpperCase()}{' '}
									(-
									{selectedStaker?.stake?.slashing_earning_percentage
										? `${selectedStaker?.stake?.slashing_earning_percentage}%`
										: '-'}
									)
								</span>
							</div>
							{isMobile && <div className="mt-4 stake_detail_line"></div>}
							<div className="mt-4">
								<span>
									{selectedStaker.reward_currency && 'Reward'}{' '}
									{STRINGS['CEFI_STAKE.AMOUNT_TO_RECEIVE_LABEL']}:
								</span>{' '}
								<span className="stake_detail_text">
									{selectedStaker.reward_currency
										? selectedStaker.reward > 0
											? `${roundToIncrementUnit(
													new BigNumber(selectedStaker.reward)
														.minus(
															new BigNumber(
																selectedStaker.slashedValues.slashingEarning
															)
														)
														.toNumber(),
													selectedStaker.reward_currency
											  )} ${selectedStaker.reward_currency.toUpperCase()}`
											: 'No reward amount to receive'
										: `${new BigNumber(selectedStaker.amount)
												.minus(
													new BigNumber(
														selectedStaker.slashedValues.slashingPrinciple
													)
												)
												.plus(
													new BigNumber(selectedStaker.reward).minus(
														new BigNumber(
															selectedStaker.slashedValues.slashingEarning
														)
													)
												)
												.toNumber()} ${selectedStaker.currency.toUpperCase()}`}
								</span>
							</div>
							<div className="stake_detail_text">
								({STRINGS['CEFI_STAKE.REQUIRES_24H_TO_SETTLE_NOTICE']})
							</div>
						</div>
					</div>
					<div className="stake_popup_button_wrapper">
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setReviewUnstake(false);
							}}
							type="default"
						>
							Cancel
						</AntBtn>
						<AntBtn
							className="stake_popup_button"
							onClick={async () => {
								try {
									await deleteStaker({ id: selectedStaker.id });

									requestExchangeStakers();

									const stakes = await requestUserStakePools();
									setStakePools(stakes.data);

									// message.success(
									//  `Successfuly unstaked in ${selectedStaker.id}`
									// );
								} catch (error) {
									message.error(error.response.data.message);
									return;
								}

								setReviewUnstake(false);
								setUnstakeConfirm(true);
							}}
							type="default"
						>
							UNSTAKE
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const unstakeConfirmModel = () => {
		return (
			<>
				<Dialog
					className="stake_table_theme stake_theme unstack_confirm_dialog_wrapper"
					isOpen={unstakeConfirm}
					onCloseDialog={() => {
						setUnstakeConfirm(false);
					}}
				>
					<div className="unstake_confirm_popup_wrapper">
						<div className="unstake_confirm_content">
							<div className="unstake_header">
								<Image
									iconId="STAKING_UNLOCK"
									icon={icons['STAKING_UNLOCK']}
									wrapperClassName="unstaked-logo"
								/>
								<h2 className="stake_theme">
									You've successfully unstaked{' '}
									{selectedStaker.currency.toUpperCase()}
								</h2>
							</div>
							{isMobile && (
								<div className="review_unstack_wrapper mb-4">
									{isMobile &&
										stakePools
											.filter(
												(pool) => pool.status === 'active' && pool.onboarding
											)
											.map((pool) => {
												return (
													<div className="stakepool_card_icon">
														<img
															src={coins?.[pool?.currency]?.logo}
															width={30}
															height={30}
															alt=""
														/>
													</div>
												);
											})}
									<div className="review_unstack_amount_wrapper">
										<div>
											<span className="font-weight-normal">
												{STRINGS['UNSTAKE.AMOUNT_TO_RECEIVE']}:
											</span>{' '}
											<span className="stake_detail_text">
												{selectedStaker.reward_currency
													? selectedStaker.reward > 0
														? `${roundToIncrementUnit(
																new BigNumber(selectedStaker.reward)
																	.minus(
																		new BigNumber(
																			selectedStaker.slashedValues.slashingEarning
																		)
																	)
																	.toNumber(),
																selectedStaker.reward_currency
														  )} ${selectedStaker.reward_currency.toUpperCase()}`
														: 'No reward amount to receive'
													: `${new BigNumber(selectedStaker.amount)
															.minus(
																new BigNumber(
																	selectedStaker.slashedValues.slashingPrinciple
																)
															)
															.plus(
																new BigNumber(selectedStaker.reward).minus(
																	new BigNumber(
																		selectedStaker.slashedValues.slashingEarning
																	)
																)
															)
															.toNumber()} ${selectedStaker.currency.toUpperCase()}`}
											</span>
										</div>
									</div>
								</div>
							)}
							{isMobile && <div className="mt-4 mb-4 stake_detail_line"></div>}
							<div className="mt-4">
								<span>
									{selectedStaker.reward_currency && 'Reward'}{' '}
									{STRINGS['CEFI_STAKE.AMOUNT_TO_RECEIVE_LABEL']}:
								</span>{' '}
								<span className="stake_detail_text">
									{selectedStaker.reward_currency
										? selectedStaker.reward > 0
											? `${roundToIncrementUnit(
													new BigNumber(selectedStaker.reward)
														.minus(
															new BigNumber(
																selectedStaker.slashedValues.slashingEarning
															)
														)
														.toNumber(),
													selectedStaker.reward_currency
											  )} ${selectedStaker.reward_currency.toUpperCase()}`
											: 'No reward amount to receive'
										: `${new BigNumber(selectedStaker.amount)
												.minus(
													new BigNumber(
														selectedStaker.slashedValues.slashingPrinciple
													)
												)
												.plus(
													new BigNumber(selectedStaker.reward).minus(
														new BigNumber(
															selectedStaker.slashedValues.slashingEarning
														)
													)
												)
												.toNumber()} ${selectedStaker.currency.toUpperCase()}`}
								</span>
							</div>
							<div className="stake_detail_text">
								({STRINGS['CEFI_STAKE.REQUIRES_24H_TO_SETTLE_NOTICE']})
							</div>
						</div>
					</div>
					<div className="stake_popup_button_wrapper">
						<AntBtn
							className="stake_popup_button"
							onClick={() => {
								setUnstakeConfirm(false);
								setSelectedStaker();
							}}
							type="default"
						>
							{STRINGS['CEFI_STAKE.CLOSE_BUTTON']}
						</AntBtn>
						<AntBtn
							className="stake_popup_button"
							onClick={async () => {
								setUnstakeConfirm(false);
								setSelectedStaker();
							}}
							type="default"
						>
							<Link to="/wallet">
								{STRINGS['CEFI_STAKE.VISIT_WALLET_BUTTON']}
							</Link>
						</AntBtn>
					</div>
				</Dialog>
			</>
		);
	};

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const accumulateAmount = (stakes) => {
		const res = Array.from(
			stakes.reduce(
				//eslint-disable-next-line
				(m, { currency, amount }) =>
					m.set(currency, (m.get(currency) || 0) + amount),
				new Map()
			),
			([currency, amount]) => ({ currency, amount })
		);

		return res;
	};

	const accumulateReward = (stakes) => {
		const res = Array.from(
			stakes.reduce(
				//eslint-disable-next-line
				(m, { currency, reward_currency, reward, slashed }) =>
					m.set(
						reward_currency || currency,
						(m.get(reward_currency || currency) || 0) + (reward - slashed)
					),
				new Map()
			),
			([currency, reward]) => ({ currency, reward })
		);

		return res;
	};

	const calculateRemainingDays = (duration, createdAt) => {
		const startingDate = moment(createdAt);
		const stakinDays = moment().diff(startingDate, 'days');
		const remaininDays = duration - stakinDays;

		return remaininDays;
	};

	return (
		<div className="stake_table_wrapper">
			{readBeforeAction && readBeforeActionModel()}
			{stakeAmount && stakeAmountModel()}
			{duration && durationModel()}
			{stakeDetails && stakeDetailsModel()}
			{confirmStake && confirmStakeModel()}
			{confirmation && confirmationModel()}
			{reviewUnstake && reviewUnstakeModel()}
			{unstakeConfirm && unstakeConfirmModel()}

			<NotLoggedIn>
				<Tabs
					defaultActiveKey="0"
					activeKey={activeTab}
					onChange={handleTabChange}
				>
					<TabPane tab="POOLS" key="0">
						<div className="stake_table_theme stake-tabs">
							<div className="stake-cefi-content-wrapper">
								<div>
									{isMobile && (
										<Image
											iconId="STAKING_CEFI_LOGO"
											icon={icons['STAKING_CEFI_LOGO']}
											wrapperClassName="cefi-logo"
										/>
									)}
								</div>
								<div>
									<div className="stake_theme font-weight-bold">
										{STRINGS['CEFI_STAKE.STAKE_POOL_TITLE']}
									</div>
									<div>{STRINGS['CEFI_STAKE.INTRODUCTION_1']}</div>
								</div>
								{!isMobile && (
									<div className="stake-cefi-value">
										{/* <div>
                                        {userStakeData?.length > 0 && (
                                            <div>{STRINGS['CEFI_STAKE.CURRENT_STAKING_VALUE']}:</div>
                                        )}
                                        <div>
                                            {accumulateAmount(userStakeData).map((stake) => (
                                                <div>
                                                    {stake.currency.toUpperCase()}: {stake.amount}
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
									</div>
								)}
							</div>

							<div className="stakepool_card_wrapper">
								{stakePools
									.filter((pool) => pool.status === 'active' && pool.onboarding)
									.map((pool) => {
										// const alreadyStaked =
										//  (userStakeData || [])?.filter(
										//      (staker) =>
										//          staker.stake_id == pool.id && staker.status !== 'closed'
										//  )?.length > 0;

										const alreadyStaked = false;

										return (
											<div className="stakepool_card">
												<div className="stakepool_card_icon">
													<img
														src={coins?.[pool?.currency]?.logo}
														width={30}
														height={30}
														alt=""
													/>
												</div>
												{isMobile ? (
													<h2 className="stake_theme">{pool.name}</h2>
												) : (
													<h3 className="stake_theme">{pool.name}</h3>
												)}
												<div>
													{pool.duration ? (
														<>
															<span className="stake_theme font-weight-bold">
																{STRINGS['CEFI_STAKE.DURATION_LABEL']}:
															</span>{' '}
															{pool.duration} days
														</>
													) : (
														'Perpetual Staking'
													)}
												</div>
												<div>
													<span className="stake_theme font-weight-bold">
														APY:
													</span>{' '}
													{pool.apy}%
												</div>
												<div>-</div>
												<div>
													<span className="font-weight-bold">Min:</span>{' '}
													{pool.min_amount} {pool.currency.toUpperCase()}
												</div>
												<div>
													<span className="font-weight-bold">Max:</span>{' '}
													{pool.max_amount} {pool.currency.toUpperCase()}
												</div>
												{pool?.reward_currency && (
													<div className="stake_theme">
														{STRINGS['CEFI_STAKE.REWARDS_IN_LABEL']}{' '}
														<span className="font-weight-bold">
															{pool.reward_currency.toUpperCase()}
														</span>
													</div>
												)}
												<div>
													<AntBtn
														className={`stakepool_button ${
															alreadyStaked
																? 'stake-half-opacity'
																: 'stake-opacity'
														}`}
														onClick={() => {
															setReadBeforeAction(true);
															setSelectedPool(pool);
														}}
														disabled={alreadyStaked}
													>
														{' '}
														{alreadyStaked ? 'STAKED' : 'STAKE'}{' '}
													</AntBtn>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</TabPane>
					<TabPane tab="MY STAKES" key="1">
						<div className="stake_table_theme mystakes-tab">
							<div className="mystakes-content-wrapper">
								<div className="w-100">
									<div className="stake_theme font-weight-bold">
										{STRINGS['CEFI_STAKE.ALL_STAKING_EVENTS']}
									</div>
									<div>{STRINGS['CEFI_STAKE.MONITOR_ACTIVE_STAKES']}</div>
									<div className={`mt-4 ${isMobile && 'mb-4'}`}>
										{STRINGS['CEFI_STAKE.USE_FILTERS_FOR_HISTORICAL_EVENTS']}
									</div>
								</div>
								{!isMobile && (
									<div className="estimated-total-stake">
										<div>
											<div className="mb-4">
												{userStakeData?.length > 0 && (
													<div>
														{STRINGS['CEFI_STAKE.ESTIMATED_TOTAL_STAKED']}
													</div>
												)}
												<div className="stack-amount">
													{accumulateAmount(
														userStakeData.filter((staker) =>
															['staking', 'unstaking'].includes(staker.status)
														)
													).map((stake) => (
														<div>
															{stake.currency.toUpperCase()}: {stake.amount}
														</div>
													))}
												</div>
											</div>
											<div>
												{userStakeData?.length > 0 && (
													<div>
														{STRINGS['CEFI_STAKE.ESTIMATED_EARNINGS_VALUE']}
													</div>
												)}
												<div className="stack-reward">
													{accumulateReward(userStakeData).map((stake) => {
														const min = coins[stake.currency].min;

														// const incrementUnit =
														//  coins[stake.currency].increment_unit;
														// const decimalPoint = new BigNumber(
														//  incrementUnit
														// ).dp();
														// const sourceAmount =
														//  stake?.reward &&
														//  new BigNumber(stake?.reward)
														//      .decimalPlaces(decimalPoint)
														//      .toNumber();

														const formattedAmount =
															stake?.reward &&
															formatToCurrency(stake?.reward, min);

														return (
															<div>
																{(
																	stake.reward_currency || stake.currency
																).toUpperCase()}
																: {formattedAmount}
															</div>
														);
													})}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>

							<div className={`d-flex ${isMobile && 'mb-5'}`}>
								<span
									className={`tabOption ${
										tabOption === 'active'
											? 'font-weight-bold stake_opacity'
											: 'font-weight-normal tabOption-half-opacity'
									}`}
									onClick={() => {
										setTabOption('active');
									}}
								>
									<EditWrapper stringId="CEFI_STAKE.ACTIVE_STAKES">
										{STRINGS['CEFI_STAKE.ACTIVE_STAKES']}
									</EditWrapper>
								</span>
								<span
									className={`tabOption ${
										tabOption === 'history'
											? 'font-weight-bold stake_opacity'
											: 'font-weight-normal tabOption-half-opacity'
									}`}
									onClick={() => {
										setTabOption('history');
									}}
								>
									<EditWrapper stringId="CEFI_STAKE.STAKES_HISTORY">
										{STRINGS['CEFI_STAKE.STAKES_HISTORY']}
									</EditWrapper>
								</span>
							</div>
							<div className="mt-4 mystakes-table-wrapper">
								<Spin spinning={isLoading}>
									<Table
										className={classnames(
											...['cefi_stake', isMobile ? 'mobileZoom' : '']
										)}
										columns={columns}
										dataSource={userStakeData?.filter((staker) => {
											if (tabOption === 'active') {
												return ['staking', 'unstaking'].includes(staker.status);
											} else {
												return staker.status === 'closed';
											}
										})}
										expandRowByClick={true}
										rowKey={(data) => {
											return data.id;
										}}
										// pagination={{
										//  current: queryFilters.currentTablePage,
										//  onChange: pageChange,
										// }}
										pagination={false}
									/>
								</Spin>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</NotLoggedIn>
		</div>
	);
};

export default CeFiUserStake;
