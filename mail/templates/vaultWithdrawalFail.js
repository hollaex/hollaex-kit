'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const { VAULTWITHDRAWALFAIL } = require('../strings').languageFile(language);
	return `
		<div>
			<p>
				${VAULTWITHDRAWALFAIL.BODY[1]}
			</p>
			<ul>
				<li>${VAULTWITHDRAWALFAIL.BODY[2](data.userId)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[3](data.withdrawalId)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[4](data.currency)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[5](data.amount)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[6](data.address)}</li>
			</ul>
			<p>
				${VAULTWITHDRAWALFAIL.BODY[9]}
			</p>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const { VAULTWITHDRAWALFAIL } = require('../strings').languageFile(language);
	return `
		${VAULTWITHDRAWALFAIL.BODY[1]}
		${VAULTWITHDRAWALFAIL.BODY[2](data.userId)}
		${VAULTWITHDRAWALFAIL.BODY[3](data.withdrawalId)}
		${VAULTWITHDRAWALFAIL.BODY[4](data.currency)}
		${VAULTWITHDRAWALFAIL.BODY[5](data.amount)}
		${VAULTWITHDRAWALFAIL.BODY[6](data.address)}
		${VAULTWITHDRAWALFAIL.BODY[7]}
	`;
};

module.exports = fetchMessage;
