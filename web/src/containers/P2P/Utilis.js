import React, { useEffect, useRef, useState } from 'react';
import { Rate } from 'antd';

import icons from 'config/icons/dark';
import STRINGS from 'config/localizedStrings';
import { IconTitle } from 'hollaex-web-lib';
import { Dialog, EditWrapper } from 'components';

const NoDealsData = ({ trade }) => {
	return (
		<div className="no-deals-data">
			<IconTitle
				stringId="ACCOUNTS.P2P"
				textType="title"
				iconPath={icons['TAB_P2P']}
				iconId={STRINGS['ACCOUNTS.P2P']}
			/>
			<span className="important-text">
				{trade === 'deals' ? (
					<EditWrapper stringId="P2P.NO_DEALS_DESC">
						{STRINGS['P2P.NO_DEALS_DESC']}
					</EditWrapper>
				) : (
					<EditWrapper stringId="P2P.NO_ORDERS_DESC">
						{STRINGS['P2P.NO_ORDERS_DESC']}
					</EditWrapper>
				)}
			</span>
		</div>
	);
};

export const renderFeedback = (
	displayUserFeedback,
	setDisplayUserFeedback,
	selectedProfile,
	userProfile,
	userFeedback
) => {
	return (
		<Dialog
			className="display-user-feedback-popup-wrapper"
			isOpen={displayUserFeedback}
			onCloseDialog={() => {
				setDisplayUserFeedback(false);
			}}
		>
			<div className="display-user-feedback-popup-container">
				<div className="user-feedback">
					<div className="profile-title">
						{selectedProfile?.full_name || (
							<EditWrapper stringId="P2P.ANONYMOUS">
								{STRINGS['P2P.ANONYMOUS']}
							</EditWrapper>
						)}
						<span className="ml-2">
							(
							<EditWrapper stringId="P2P.TAB_PROFILE">
								{STRINGS['P2P.TAB_PROFILE']}
							</EditWrapper>
							)
						</span>
					</div>
					<div className="user-feedback-details-container">
						<div className="user-feedback-card-container">
							<div className="user-feedback-card-list">
								<div className="user-feedback-card">
									<div className="total-order-text fs-16">
										<EditWrapper stringId="P2P.TOTAL_ORDERS">
											{STRINGS['P2P.TOTAL_ORDERS']}
										</EditWrapper>
									</div>
									<div className="order-times-text">
										<span>{userProfile?.totalTransactions} </span>
										<span>
											<EditWrapper stringId="P2P.TIMES">
												{STRINGS['P2P.TIMES']}
											</EditWrapper>
										</span>
									</div>
								</div>
								<div className="user-feedback-card">
									<div className="total-order-text fs-16">
										<EditWrapper stringId="P2P.COMPLETION_RATE">
											{STRINGS['P2P.COMPLETION_RATE']}
										</EditWrapper>
									</div>
									<div className="order-times-text">
										{(userProfile?.completionRate || 0).toFixed(2)}%
									</div>
								</div>
								<div className="user-feedback-card">
									<div className="total-order-text fs-16">
										<EditWrapper stringId="P2P.POSITIVE_FEEDBACK">
											{STRINGS['P2P.POSITIVE_FEEDBACK']}
										</EditWrapper>
									</div>
									<div className="order-times-text">
										{(userProfile?.positiveFeedbackRate || 0).toFixed(2)}%
									</div>
									<div className="feedback-count">
										<EditWrapper stringId="P2P.POSITIVE">
											{STRINGS['P2P.POSITIVE']}
										</EditWrapper>
										{userProfile?.positiveFeedbackCount} /
										<EditWrapper stringId="P2P.NEGATIVE">
											{STRINGS['P2P.NEGATIVE']}
										</EditWrapper>
										{userProfile?.negativeFeedbackCount}
									</div>
								</div>
							</div>
						</div>
						<div className="total-feedback-count">
							<span>
								<EditWrapper stringId="P2P.FEEDBACK">
									{STRINGS['P2P.FEEDBACK']}
								</EditWrapper>
							</span>
							<span className="ml-2">({userFeedback?.length || 0})</span>
						</div>
						{userFeedback?.length === 0 ? (
							<div className="no-feedback-container">
								<EditWrapper stringId="P2P.NO_FEEDBACK">
									{STRINGS['P2P.NO_FEEDBACK']}
								</EditWrapper>
							</div>
						) : (
							<table className="feedback-table-container w-100">
								<thead>
									<tr className="table-header-row">
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
								<tbody>
									{userFeedback?.map((deal) => {
										return (
											<tr className="table-bottom-row">
												<td className="td-fit">{deal?.comment}</td>
												<td className="td-fit">
													<Rate
														disabled
														allowHalf={false}
														autoFocus={false}
														allowClear={false}
														value={deal?.rating}
													/>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</Dialog>
	);
};

export const Timer = ({ order }) => {
	const orderCreatedDate = new Date(order?.created_at)?.getTime();
	const [time, setTime] = useState({ min: 30, sec: 0 });
	const [startTime] = useState(orderCreatedDate);
	const [timeLimitReached, setTimeLimitReached] = useState(false);
	const frameIdRef = useRef();

	const cancelTimer = () => {
		if (frameIdRef.current) {
			cancelAnimationFrame(frameIdRef.current);
			frameIdRef.current = null;
		}
	};

	useEffect(() => {
		const update = () => {
			const now = Date.now();
			const elapsed = Math.floor((now - startTime) / 1000);
			const totalSeconds = 30 * 60 - elapsed;

			if (totalSeconds <= 0) {
				setTime({ min: 0, sec: 0 });
				setTimeLimitReached(true);
				cancelTimer();
			} else {
				const min = Math.floor(totalSeconds / 60);
				const sec = totalSeconds % 60;
				setTime({ min, sec });
				setTimeLimitReached(false);
				frameIdRef.current = requestAnimationFrame(update);
				if (
					order?.user_status === 'confirmed' ||
					order?.transaction_status === 'expired'
				) {
					setTime({ min: 0, sec: 0 });
					setTimeLimitReached(true);
					cancelTimer();
				}
			}
		};

		frameIdRef.current = requestAnimationFrame(update);

		return () => cancelTimer();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startTime, order]);

	const totalSeconds = 30 * 60;
	const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
	const percentage = (elapsedSeconds / totalSeconds) * 100;

	return (
		<div className="timer-container">
			<div className="timer-details">
				{!timeLimitReached && (
					<div
						className="timer-circle"
						style={{
							background: `conic-gradient(var(--labels_important-active-labels-text-graphics) ${percentage}%, var(--base_background) 0%)`,
						}}
					></div>
				)}
				<div>
					{timeLimitReached ? (
						<div>
							<EditWrapper stringId="P2P.TIME_LIMIT_REACHED">
								{STRINGS['P2P.TIME_LIMIT_REACHED']}
							</EditWrapper>
						</div>
					) : (
						<div>
							{time?.min < 10 ? `0${time?.min}` : time?.min}:
							{time?.sec < 10 ? `0${time?.sec}` : time?.sec}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NoDealsData;
