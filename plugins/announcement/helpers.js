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

const deleteAnnouncement = (id) => {
	return Announcement.destroy({ id });
};

module.exports = {
	postAnnouncement,
	deleteAnnouncement
};