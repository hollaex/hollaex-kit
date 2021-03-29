import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Scrollbars from 'react-custom-scrollbars';

import { EditWrapper, NotificationsList, Image } from 'components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { getAnnouncement } from 'actions/appActions';
import { LAST_UPDATED_NOTIFICATION_KEY } from '../../config/constants';

const AnnouncementList = ({
	icons: ICONS,
	user,
	announcements,
	getAnnouncement,
}) => {
	const [isOpen, setOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const elementRef = useRef(null);

	const getAnnouncementList = useCallback(() => {
		getAnnouncement();
	}, [getAnnouncement]);

	useEffect(() => {
		document.addEventListener('click', onOutsideClick);
		return () => {
			document.removeEventListener('click', onOutsideClick);
		};
	}, []);

	useEffect(() => {
		if (user) {
			getAnnouncementList();
		}
	}, [user, getAnnouncementList]);

	useEffect(() => {
		if (isOpen) {
			let notificationTemp = announcements.sort((a, b) => {
				return new Date(b.updated_at) - new Date(a.updated_at);
			});
			let notificationData = notificationTemp[0] || {};
			if (notificationData.updated_at) {
				localStorage.setItem(
					LAST_UPDATED_NOTIFICATION_KEY,
					notificationData.updated_at
				);
			}
		} else {
			const lastUpdated = localStorage.getItem(LAST_UPDATED_NOTIFICATION_KEY);
			if (!lastUpdated) {
				setUnreadCount(announcements.length);
			} else {
				const newData = announcements.filter(
					(data) => new Date(data.updated_at) > new Date(lastUpdated)
				);
				setUnreadCount(newData.length);
			}
		}
	}, [isOpen, announcements]);

	const onOutsideClick = (event) => {
		if (
			elementRef.current &&
			event.target !== elementRef.current &&
			!elementRef.current.contains(event.target)
		) {
			setOpen(false);
		}
		if (
			elementRef.current &&
			event.target !== elementRef.current &&
			elementRef.current.contains(event.target)
		) {
			setOpen((val) => !val);
		}
	};

	return (
		<div className="d-flex app-bar-account-content mx-3" ref={elementRef}>
			<div className="d-flex">
				<div>
					<Image
						icon={ICONS['TOP_BAR_ANNOUNCEMENT']}
						wrapperClassName="app-bar-account-icon mr-3"
					/>
					{unreadCount ? (
						<div className="app-bar-account-notification">{unreadCount}</div>
					) : null}
				</div>
				<div className="d-flex align-items-center">
					<EditWrapper stringId="TRADE_TAB_POSTS" iconId="TOP_BAR_ANNOUNCEMENT">
						{STRINGS['TRADE_TAB_POSTS']}
					</EditWrapper>
				</div>
			</div>
			{isOpen && (
				<div className="app-bar-account-menu apply_rtl">
					<div className="app-announcement-list">
						<Scrollbars>
							<NotificationsList ICONS={ICONS} />
						</Scrollbars>
					</div>
				</div>
			)}
		</div>
	);
};
const mapStateToProps = (state) => ({
	announcements: state.app.announcements,
	activeLanguage: state.app.language,
});
const mapDispatchToProps = (dispatch) => ({
	getAnnouncement: bindActionCreators(getAnnouncement, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AnnouncementList));
