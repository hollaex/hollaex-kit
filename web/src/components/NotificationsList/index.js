import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import {
	getAnnouncement,
	setIsActiveSelectedAnnouncement,
	setSelectedAnnouncement,
} from '../../actions/appActions';
import Image from '../Image';
import STRINGS from 'config/localizedStrings';
import EditWrapper from 'components/EditWrapper';

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
const NotificationsList = ({
	ICONS = {},
	announcements,
	getAnnouncement,
	setOpen,
	setIsActiveSelectedAnnouncement,
	setSelectedAnnouncement,
}) => {
	useEffect(() => {
		getAnnouncement();
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onHandleNavigate = (detail) => {
		setSelectedAnnouncement(detail);
		setIsActiveSelectedAnnouncement(true);
		setOpen(false);
		browserHistory.push('/announcement');
	};

	const filteredAnnouncement = announcements?.filter(
		(data) => data?.is_dropdown
	);

	if (!announcements?.length || !filteredAnnouncement?.length) {
		return (
			<div className="notifications_list-wrapper">
				<div className="notifications_list-wrapper text-align-center py-3">
					No data
				</div>
				<div className="view-announcement-link">
					<EditWrapper stringId="ANNOUNCEMENT_TAB.VIEW_ALL_ANNOUNCEMENT">
						<span
							className="blue-link text-decoration-underline"
							onClick={() => {
								browserHistory.push('/announcement');
								setOpen(false);
							}}
						>
							{STRINGS['ANNOUNCEMENT_TAB.VIEW_ALL_ANNOUNCEMENT'].toUpperCase()}
						</span>
					</EditWrapper>
				</div>
			</div>
		);
	}

	return (
		<div className="h-100">
			<div className="notifications_list-wrapper">
				{filteredAnnouncement?.map((announcement, index) => (
					<span
						onClick={() => onHandleNavigate(announcement)}
						className="pointer"
						key={index}
					>
						<NotificationItem
							key={announcement?.id}
							ICONS={ICONS}
							{...announcement}
						/>
					</span>
				))}
			</div>
			<div className="view-announcement-link">
				<EditWrapper stringId="ANNOUNCEMENT_TAB.VIEW_ALL_ANNOUNCEMENT">
					<span
						className="blue-link text-decoration-underline"
						onClick={() => {
							browserHistory.push('/announcement');
							setOpen(false);
						}}
					>
						{STRINGS['ANNOUNCEMENT_TAB.VIEW_ALL_ANNOUNCEMENT'].toUpperCase()}
					</span>
				</EditWrapper>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	activeLanguage: store.app.language,
	announcements: store.app.announcements,
});

const mapDispatchToProps = (dispatch) => ({
	getAnnouncement: bindActionCreators(getAnnouncement, dispatch),
	setSelectedAnnouncement: bindActionCreators(
		setSelectedAnnouncement,
		dispatch
	),
	setIsActiveSelectedAnnouncement: bindActionCreators(
		setIsActiveSelectedAnnouncement,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList);
