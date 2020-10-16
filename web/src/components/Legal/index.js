import React from 'react';
import STRINGS from 'config/localizedStrings';

const getType = (type) => {
	switch (type) {
		case 'terms':
			return 'GENERAL_TERMS';
		case 'legal':
			return 'PRIVACY_POLICY';
		default:
			return '';
	}
};

const Legal = ({ type, constants = {}, logoPath }) => {
	const keys = ['TITLE', 'SUBTITLE', 'TEXTS'];
	const TYPE = getType(type);

	const [TITLE, SUBTITLE, TEXTS] = keys.map(key => STRINGS[`LEGAL.${TYPE}.${key}`])

	return (
		<div className="d-flex legal-wrapper justify-content-center">
			<div className="d-flex flex-column legal-content-wrapper">
				<div className="legal-logo-wrapper">
					<img
						src={logoPath}
						alt={constants.api_name || ''}
						className="legal-logo"
					/>
				</div>
				<div className="legal-title">{TITLE}</div>
				<div className="legal-subtitle">{SUBTITLE}</div>
				<div className="legal-content">
					{TEXTS.map((text, index) => <p key={index}>{text}</p>)}
				</div>
			</div>
		</div>
	);
};

export default Legal;
