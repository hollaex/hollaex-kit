import React from 'react';
import { dotifyString } from 'utils/eth';

const Transaction = ({ id, network }) => {
	const open = (url) => {
		if (window) {
			window.open(url, '_blank');
		}
	};

	const url = `https://${
		network !== 'main' ? `${network}.` : ''
	}etherscan.io/tx/${id}`;

	if (!id) {
		return <div />;
	} else {
		const displayString = dotifyString(id, 5, 5);

		return (
			<span
				className="blue-link underline-text pointer"
				onClick={() => open(url)}
			>
				{displayString}
			</span>
		);
	}
};

export default Transaction;
