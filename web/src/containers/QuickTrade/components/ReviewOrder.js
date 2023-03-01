import React from 'react';
import ReviewBlock from 'components/QuickTrade/ReviewBlock';
import STRINGS from 'config/localizedStrings';
import { Button } from 'components';

const ReviewOrder = ({
	onCloseDialog,
	onExecuteTrade,
	selectedSource,
	decimalPoint,
	sourceAmount,
	targetAmount,
	selectedTarget,
	disabled,
}) => {
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
				</div>
				<div>
					<ReviewBlock
						symbol={selectedSource}
						text={STRINGS['SPEND_AMOUNT']}
						amount={sourceAmount}
						decimalPoint={decimalPoint}
					/>
					<ReviewBlock
						symbol={selectedTarget}
						text={STRINGS['ESTIMATE_RECEIVE_AMOUNT']}
						amount={targetAmount}
						decimalPoint={decimalPoint}
					/>
				</div>
				<footer className="d-flex pt-4">
					<Button
						label={STRINGS['CLOSE_TEXT']}
						onClick={onCloseDialog}
						className="mr-2"
					/>
					<Button
						label={STRINGS['CONFIRM_TEXT']}
						onClick={onExecuteTrade}
						className="ml-2"
						disabled={disabled}
					/>
				</footer>
			</div>
		</div>
	);
};

export default ReviewOrder;
