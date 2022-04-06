import React from 'react';
import { connect } from 'react-redux';
import { STAKING_INDEX_COIN } from 'config/contracts';
import { dotifyString } from 'utils/eth';
import { open } from 'helpers/link';

const Transaction = ({ id, contracts }) => {
	const network = contracts[STAKING_INDEX_COIN].network;

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

const mapStateToProps = (store) => ({
	contracts: store.app.contracts,
});

export default connect(mapStateToProps)(Transaction);
