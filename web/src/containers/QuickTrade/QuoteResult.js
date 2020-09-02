import React from 'react';
import { object, func } from 'prop-types';
import { Loader, IconTitle, Button } from 'components';
import { formatToCurrency } from 'utils/currency';

import STRINGS from 'config/localizedStrings';
import { ICONS } from 'config/constants';

const QuoteResult = ({ onClose, onConfirm, pairData, data: { fetching, error, data } }) => {

	if (fetching) {
		return <Loader relative={true} background={false} />;
	} else if (error) {
		return (
			<div className="base_negative_balance">
				<div className="quote-success-review-text">{error}</div>
				<Button label={STRINGS.CLOSE_TEXT} onClick={onClose} />
			</div>
		);
	} else {
    const [pair_base, pair_2] = data.symbol.split('-');

		return (
			<div className='success-review'>
				<IconTitle
					iconPath={ICONS.QUICK_TRADE_SUCCESSFUL}
					text={STRINGS.QUICK_TRADE_SUCCESS}
					underline={true}
					className="w-100"
					useSvg={true}
				/>
				<div className="quote-success-review-text">
					{STRINGS.formatString(
						STRINGS.QUOTE_SUCCESS_REVIEW_MESSAGE,
						STRINGS.SIDES_VERBS[data.side],
						formatToCurrency(data.size, pairData.increment_size),
            pair_base,
						formatToCurrency(data.price, pairData.increment_price),
            pair_2
					)}
				</div>
				<footer className="d-flex">
					<Button label={STRINGS.CLOSE_TEXT} onClick={onClose} />
					<Button label={STRINGS.USER_VERIFICATION.GOTO_WALLET} onClick={onConfirm} />
				</footer>
			</div>
		);
	}
};

QuoteResult.propTypes = {
	onClose: func.isRequired,
	onConfirm: func.isRequired,
	pairData: object.isRequired,
  data: object.isRequired,
}

export default QuoteResult;
