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
				<li>${VAULTWITHDRAWALFAIL.BODY[3](data.userEmail)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[4](data.withdrawalId)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[5](data.currency)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[6](data.amount)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[7](data.side)}</li>
				<li>${VAULTWITHDRAWALFAIL.BODY[8](data.address)}</li>
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
		${VAULTWITHDRAWALFAIL.BODY[3](data.userEmail)}
		${VAULTWITHDRAWALFAIL.BODY[4](data.withdrawalId)}
		${VAULTWITHDRAWALFAIL.BODY[5](data.currency)}
		${VAULTWITHDRAWALFAIL.BODY[6](data.amount)}
		${VAULTWITHDRAWALFAIL.BODY[7](data.side)}
		${VAULTWITHDRAWALFAIL.BODY[8](data.address)}
		${VAULTWITHDRAWALFAIL.BODY[9]}
	`;
};

module.exports = fetchMessage;
