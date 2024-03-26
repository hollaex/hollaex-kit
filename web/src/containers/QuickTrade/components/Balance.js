import React from 'react';
import STRINGS from 'config/localizedStrings';
import { formatCurrency } from 'utils/currency';

const Balance = ({ balance = 0, text, onClick }) => {
	return (
		<div className="balance-text font-weight-normal">
			{text}
			&nbsp;
			{STRINGS['BALANCE_TEXT']}:{' '}
			<span
				className="ml-2 pointer balance-value-text"
				onClick={() => onClick(balance)}
			>
				{formatCurrency(balance)}
			</span>
		</div>
	);
};

export default Balance;
