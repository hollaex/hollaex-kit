import React from 'react';
import STRINGS from 'config/localizedStrings';

const Balance = ({ balance = 0, text, onClick }) => {
	return (
		<div className="balance-text font-weight-normal">
			{text}
			&nbsp;
			{STRINGS['BALANCE_TEXT']}:{' '}
			<span className="ml-2 pointer" onClick={() => onClick(balance)}>
				{balance}
			</span>
		</div>
	);
};

export default Balance;
