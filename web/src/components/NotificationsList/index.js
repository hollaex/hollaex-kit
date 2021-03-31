import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';

import Image from '../Image';
import { getAnnouncement } from '../../actions/appActions';

const createMarkup = (msg) => {
	return { __html: msg };
};

export const NotificationItem = ({
	title = '',
	message = '',
	type,
	created_at,
	ICONS,
}) => {
	return (
		<div className="announcement-notification-list-item">
			<div>
				<div className="d-flex my-2">
					<div className="mr-2">
						<Image
							iconId="TRADE_ANNOUNCEMENT"
							icon={ICONS['TRADE_ANNOUNCEMENT']}
							wrapperClassName="trade_post_icon"
						/>
					</div>
					<div>
						<div className="post_header">{title}</div>
						{/* {type && (
							<div className="notifications_list-item-title">{type}</div>
						)} */}
						<div className="post-content">
							<div className="notifications_list-item-timestamp">
								{moment(created_at).format('MMMM DD, YYYY')}
							</div>
							<div
								className="notifications_list-item-text"
								dangerouslySetInnerHTML={createMarkup(message)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		// <div className="notifications_list-item-container">
		// 	<div>hii</div>
		// 	{type && <div className="notifications_list-item-title">{type}</div>}
		// 	<div className="notifications_list-item-text">{message}</div>
		// 	{timestamp && (
		// 		<div className="notifications_list-item-timestamp">
		// 			{formatTimestamp(timestamp)}
		// 		</div>
		// 	)}
		// </div>
	);
};

// TODO create announcement item style
const NotificationsList = ({ ICONS = {}, announcements, getAnnouncement }) => {
	useEffect(() => {
		getAnnouncement();
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (!announcements.length) {
		return <div className="notifications_list-wrapper">No data</div>;
	}
	return (
		<div className="notifications_list-wrapper">
			{announcements.map(({ id, ...rest }, index) => (
				<NotificationItem key={id} ICONS={ICONS} {...rest} />
			))}
		</div>
	);
};

const mapStateToProps = (store) => ({
	activeLanguage: store.app.language,
	announcements: store.app.announcements,
});

const mapDispatchToProps = (dispatch) => ({
	getAnnouncement: bindActionCreators(getAnnouncement, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList);
