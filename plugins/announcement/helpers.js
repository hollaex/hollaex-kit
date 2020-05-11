'use strict';

const { Announcement } = require('../../db/models');

const postAnnouncement = (created_by, title, message, type) => {
	return Announcement.create({
		created_by,
		title,
		message,
		type
	});
};

module.exports = {
	postAnnouncement
};