import React, { useEffect, useState } from 'react';
import ReviewBlock from 'components/QuickTrade/ReviewBlock';
import STRINGS from 'config/localizedStrings';
import moment from 'moment';
import classnames from 'classnames';
import { Button } from 'components';
import { Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const ReviewOrder = ({
	onCloseDialog,
	onExecuteTrade,
	selectedSource,
	sourceDecimalPoint,
	targetDecimalPoint,
	sourceAmount,
	targetAmount,
	selectedTarget,
	disabled,
	time,
	expiry,
}) => {
	const [totalTime] = useState(moment(time).seconds());
	const [timeToExpiry, setTimeToExpiry] = useState(
		moment(expiry).diff(moment(time), 'seconds')
	);
	const [isExpired, setIsExpired] = useState(timeToExpiry <= 0);

	useEffect(() => {
		// Update the timer every second
		const timerInterval = setInterval(() => {
			const newTimeToExpiry = moment(expiry).diff(moment(), 'seconds');
			setTimeToExpiry(newTimeToExpiry);
			setIsExpired(newTimeToExpiry <= 0);
		}, 1000);

		// Clear the interval on unmount
		return () => clearInterval(timerInterval);
	}, [expiry]);

	return (
		<div className="quote-review-wrapper">
			<div>
				<div className="mb-4">
					<div className="quote_header">{STRINGS['CONFIRM_TEXT']}</div>
					<div className="quote_content">
						{STRINGS['QUOTE_CONFIRMATION_MSG_TEXT_1']}
					</div>
					<div className="quote_content">
						{STRINGS['QUOTE_CONFIRMATION_MSG_TEXT_2']}
					</div>
					<div
						className={classnames('quote_expiry_content d-flex', {
							'expired-content': isExpired,
						})}
					>
						<div className="clock-icon">
							<ClockCircleOutlined />
						</div>
						{isExpired ? (
							<div>
								<p>{STRINGS['QUOTE_CONFIRMATION_EXPIRED_MSG_TEXT_1']}</p>
								<p>{STRINGS['QUOTE_CONFIRMATION_EXPIRED_MSG_TEXT_2']}</p>
							</div>
						) : (
							STRINGS.formatString(
								STRINGS['QUOTE_CONFIRMATION_EXPIRY_MSG'],
								timeToExpiry,
								timeToExpiry > 1 ? STRINGS['SECONDS'] : STRINGS['SECOND']
							)
						)}
					</div>
				</div>
				<div className="expiry-progress">
					<Progress
						percent={Math.max((timeToExpiry / totalTime) * 100)}
						showInfo={false}
						size="small"
						strokeColor="#fff"
					/>
				</div>
				<div
					className={classnames({
						'expired-block': isExpired,
					})}
				>
					<ReviewBlock
						symbol={selectedSource}
						text={STRINGS['SPEND_AMOUNT']}
						amount={sourceAmount}
						decimalPoint={sourceDecimalPoint}
					/>
					<ReviewBlock
						symbol={selectedTarget}
						text={STRINGS['ESTIMATE_RECEIVE_AMOUNT']}
						amount={targetAmount}
						decimalPoint={targetDecimalPoint}
					/>
				</div>
				<footer className="d-flex pt-4">
					<Button
						label={isExpired ? STRINGS['BACK'] : STRINGS['CLOSE_TEXT']}
						onClick={onCloseDialog}
						className="mr-2"
					/>
					<Button
						label={STRINGS['CONFIRM_TEXT']}
						onClick={onExecuteTrade}
						className="ml-2"
						disabled={disabled || isExpired}
					/>
				</footer>
			</div>
		</div>
	);
};

export default ReviewOrder;
