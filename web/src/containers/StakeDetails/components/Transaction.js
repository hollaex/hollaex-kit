import React from 'react';
import { dotifyString } from 'utils/eth';

const Transaction = ({ id }) => {
	if (!id) {
		return <div />;
	} else {
		const displayString = dotifyString(id, 5, 5);

		return (
			<div className="blue-link underline-text pointer">{displayString}</div>
		);
	}
};

export default Transaction;
