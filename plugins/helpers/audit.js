'use strict';

const { Audit } = require('../../db/models');

/**
	* Create an audit.
	* @param {string} admin_id - Admin id.
	* @param {string} event - Event being audited.
	* @param {string} description - Description of event.
	* @param {string} ip - IP address.
	* @param {string} domain - Domain.
	* @return {promise} - Promise with new audit.
*/
const createAudit = (admin_id, event, description, ip, domain) => {
	return Audit.create({
		admin_id,
		event,
		description,
		ip,
		domain
	});
};

module.exports = {
	createAudit
};