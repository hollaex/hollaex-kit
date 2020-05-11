import React from 'react';
import STRINGS from '../../config/localizedStrings';

const getContent = (strings, type) => {
	switch (type) {
		case 'terms':
			return strings.LEGAL.GENERAL_TERMS;
		case 'legal':
			return strings.LEGAL.GENERAL_TERMS;
		default:
			return {};
	}
};

const Legal = ({ type, constants = {} }) => {
	const { TITLE, SUBTITLE, TEXTS } = getContent(STRINGS, type);
	return (
		<div className="d-flex legal-wrapper justify-content-center">
			<div className="d-flex flex-column legal-content-wrapper">
				<div className="legal-logo-wrapper">
					<img
						src={constants.logo_path}
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
