import React from 'react';
import { LevelsBlock } from './LevelsBlock';
import { FeesBlock } from './FeesBlock';

const Limits = ({ fetching, fetched, data, error, verification_level }) => {
	if (fetching || !fetched) {
		return <div />;
	} else {
		return <LevelsBlock userLevel={verification_level} limits={data} />;
	}
};

const Fees = ({ fetching, fetched, data, error, verification_level }) => {
	if (fetching || !fetched) {
		return <div />;
	} else {
		return <FeesBlock userLevel={verification_level} fees={data} />;
	}
};

export const LevelSection = ({
	children,
	limits,
	fees,
	verification_level,
}) => {
	return (
		<div>
			{children}
			<Limits {...limits} verification_level={verification_level} />
			<Fees {...fees} verification_level={verification_level} />
		</div>
	);
};
