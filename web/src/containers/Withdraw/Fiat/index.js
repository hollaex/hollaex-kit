import React from 'react';
import { connect } from 'react-redux';
import { SmartTarget, UnderConstruction } from 'components';
import Form from './Form';

const Fiat = ({ ultimate_fiat, ...rest }) => {
	const { currency, titleSection } = rest;
	return (
		<SmartTarget {...rest}>
			{ultimate_fiat ? (
				<Form titleSection={titleSection} currency={currency} />
			) : (
				<UnderConstruction />
			)}
		</SmartTarget>
	);
};

const mapStateToProps = ({
	app: {
		features: { ultimate_fiat },
	},
}) => ({
	ultimate_fiat,
});

export default connect(mapStateToProps)(Fiat);
