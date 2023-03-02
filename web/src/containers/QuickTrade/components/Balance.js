import React from 'react';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

const Balance = ({ balance = 0, text, onClick }) => {
	return (
		<div className="small-text">
			{text}{' '}
			<EditWrapper stringId="BALANCE_TEXT">
				{STRINGS['BALANCE_TEXT']}
			</EditWrapper>
			:{' '}
			<span className="ml-2 pointer" onClick={() => onClick(balance)}>
				{balance}
			</span>
		</div>
	);
};

export default Balance;
