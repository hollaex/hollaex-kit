import React from 'react';
import { Loader, IconTitle, Button } from '../../components';
import { formatToCurrency } from '../../utils/currency';

import STRINGS from '../../config/localizedStrings';
import { ICONS, BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';

const QuoteResult = ({ name, onClose, coins, pairData, ...props }) => {
	const { fetching, error, data } = props.data;
	const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	if (fetching) {
		return <Loader relative={true} background={false} />;
	} else if (error) {
		return (
			<div className="base_negative_balance">
				<div className="quote-success-review-text">{error}</div>
				{onClose && <Button label={STRINGS.CLOSE_TEXT} onClick={onClose} />}
			</div>
		);
	} else {
		return (
			<div className='success-review'>
				<IconTitle
					iconPath={ICONS.SQUARE_DOTS}
					text={STRINGS.QUOTE_SUCCESS_REVIEW_TITLE}
					underline={true}
					className="w-100"
					useSvg={true}
				/>
				<div className="quote-success-review-text">
					{STRINGS.formatString(
						STRINGS.QUOTE_SUCCESS_REVIEW_MESSAGE,
						STRINGS.SIDES_VALUES[data.side],
						formatToCurrency(data.size, pairData.increment_size),
						name,
						formatToCurrency(data.price, pairData.increment_price),
						fullname
					)}
				</div>
				{onClose && <Button label={STRINGS.CLOSE_TEXT} onClick={onClose} />}
			</div>
		);
	}
};

export default QuoteResult;
