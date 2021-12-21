'use strict';

const { GET_EMAIL } = require('../../constants');

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['LOGIN']) {
		const stringDynamic = emailConfigurations[language]['LOGIN'];
		return {
			html: htmlDynamic(email, data, language, domain, stringDynamic),
			text: textDynamic(email, data, language, domain, stringDynamic)
		};
	}
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
  const LOGIN = require('../strings').getStringObject(language, 'LOGIN');
	return `
    <div>
      <p>
        ${LOGIN.GREETING(email)}
      </p>
      <p>
        ${LOGIN.BODY[1]}
      </p>
      <div>
        ${data.time ? `<div>${LOGIN.BODY[2](data.time)}</div>` : ''}
        ${data.country ? `<div>${LOGIN.BODY[3](data.country)}</div>` : ''}
        ${
          false && data.device
            ? `<div>${LOGIN.BODY[4](data.device)}</div>`
            : ''
			  }
        ${data.ip ? `<div>${LOGIN.BODY[5](data.ip)}</div>` : ''}
      </div>
      <p>
        ${LOGIN.BODY[6]}
      </p>
      <p>
        ${LOGIN.CLOSING[1]}<br />
        ${LOGIN.CLOSING[2]()}
      </p>
    </div>
  `;
};

const text = (email, data, language, domain) => {
  const LOGIN = require('../strings').getStringObject(language, 'LOGIN');
	return `
    ${LOGIN.GREETING(email)}
    ${LOGIN.BODY[1]}
    ${data.time ? `<div>${LOGIN.BODY[2](data.time)}</div>` : ''}
    ${data.country ? `<div>${LOGIN.BODY[3](data.country)}</div>` : ''}
    ${false && data.device ? `<div>${LOGIN.BODY[4](data.device)}</div>` : ''}
    ${data.ip ? `<div>${LOGIN.BODY[5](data.ip)}</div>` : ''}
    ${LOGIN.BODY[6]}
    ${LOGIN.CLOSING[1]} ${LOGIN.CLOSING[2]()}
  `;
};

const htmlDynamic = async (email, data, language, domain, stringDynamic) => {
	return `
    <div>
      <p>
        ${stringDynamic.GREETING.format(email)}
      </p>
      <p>
        ${stringDynamic.BODY[1]}
      </p>
      <div>
        ${data.time ? `<div>${stringDynamic.BODY[2].format(data.time)}</div>` : ''}
        ${data.country ? `<div>${stringDynamic.BODY[3].format(data.country)}</div>` : ''}
        ${
		false && data.device
			? `<div>${stringDynamic.BODY[4].format(data.device)}</div>`
			: ''
	}
        ${data.ip ? `<div>${stringDynamic.BODY[5].format(data.ip)}</div>` : ''}
      </div>
      <p>
        ${stringDynamic.BODY[6]}
      </p>
      <p>
        ${stringDynamic.CLOSING[1]}<br />
        ${stringDynamic.CLOSING[2]}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	return `
    ${stringDynamic.GREETING.format(email)}
    ${stringDynamic.BODY[1]}
    ${data.time ? `<div>${stringDynamic.BODY[2].format(data.time)}</div>` : ''}
    ${data.country ? `<div>${stringDynamic.BODY[3].format(data.country)}</div>` : ''}
    ${false && data.device ? `<div>${stringDynamic.BODY[4].format(data.device)}</div>` : ''}
    ${data.ip ? `<div>${stringDynamic.BODY[5].format(data.ip)}</div>` : ''}
    ${stringDynamic.BODY[6]}
    ${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2]}
  `;
};

module.exports = fetchMessage;
