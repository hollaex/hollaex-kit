import React from 'react';
import STRINGS from 'config/localizedStrings';
import { formatCurrencyByIncrementalUnit } from 'utils/currency';

const Balance = ({ balance = 0, text, onClick, incrementUnit = 0 }) => {
	return (
		<div className="balance-text font-weight-normal">
			{text}
			&nbsp;
			{STRINGS['BALANCE_TEXT']}:{' '}
			<span
				className="ml-2 pointer balance-value-text"
				onClick={() => onClick(balance)}
			>
				{formatCurrencyByIncrementalUnit(balance, incrementUnit)}
			</span>
		</div>
	);
};

export default Balance;
