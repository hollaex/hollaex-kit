import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import Scrollbars from 'react-custom-scrollbars';

import { EditWrapper, NotificationsList, Image } from 'components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	getAnnouncement,
	setAppAnnouncements,
	setIsMarketDropdownVisible,
	setIsToolsVisible,
} from 'actions/appActions';
import { LAST_UPDATED_NOTIFICATION_KEY } from '../../config/constants';
import { getAnnouncementDetails } from 'containers/Announcement/actions';

const AnnouncementList = ({
	icons: ICONS,
	user,
	announcements,
	getAnnouncement,
	plugins,
	setIsMarketDropdownVisible,
	setIsToolsVisible,
	setAppAnnouncements,
}) => {
	const [isOpen, setOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isAnnouncementInstalled, setisAnnouncementInstalled] = useState(false);
	const elementRef = useRef(null);

	const getAnnouncements = async () => {
		try {
			const detail = await getAnnouncementDetails();
			setisAnnouncementInstalled(detail?.data);
			setAppAnnouncements(detail?.data);
		} catch (error) {
			console.error(error);
		}
	};

	const getAnnouncementList = useCallback(() => {
		getAnnouncements();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getAnnouncement]);

	useEffect(() => {
		// const announceMentPlugin = plugins.filter((plugin) => {
		// 	return plugin.name === 'announcements';
		// }).length
		// 	? true
		// 	: false;
		// setisAnnouncementInstalled(announceMentPlugin);
		document.addEventListener('mouseenter', onOutsideClick, true);
		document.addEventListener('mouseleave', onOutsideClick, true);
		return () => {
			document.removeEventListener('mouseenter', onOutsideClick, true);
			document.removeEventListener('mouseleave', onOutsideClick, true);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		if (elementRef.current) {
			if (
				event.target !== elementRef.current &&
				!elementRef.current.contains(event.target)
			) {
				setOpen(false);
			} else {
				setOpen(true);
				setIsMarketDropdownVisible(false);
				setIsToolsVisible(false);
			}
		}
	};

	return (
		<div
			className={
				isAnnouncementInstalled
					? 'd-flex app-bar-account-content mx-3'
					: 'd-flex app-bar-account-content'
			}
			ref={elementRef}
		>
			{isAnnouncementInstalled && (
				<div className="d-flex announcement-tab">
					<div>
						<Image
							icon={ICONS['TOP_BAR_ANNOUNCEMENT']}
							wrapperClassName="app-bar-account-icon mr-3"
						/>
						{unreadCount ? (
							<div className="app-bar-account-notification">{unreadCount}</div>
						) : null}
					</div>
					<div
						className={
							isOpen
								? 'd-flex align-items-center active-text'
								: 'd-flex align-items-center'
						}
					>
						<EditWrapper
							stringId="TRADE_TAB_POSTS"
							iconId="TOP_BAR_ANNOUNCEMENT"
						>
							{STRINGS['TRADE_TAB_POSTS']}
						</EditWrapper>
						<span className="ml-1 app-bar-dropdown-icon">
							{isOpen ? <CaretUpFilled /> : <CaretDownFilled />}
						</span>
					</div>
				</div>
			)}
			{isOpen && (
				<div className="app-bar-account-menu apply_rtl opacity-1">
					<div className="app-announcement-list">
						<Scrollbars>
							<NotificationsList ICONS={ICONS} setOpen={setOpen} />
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
	plugins: state.app.plugins,
});
const mapDispatchToProps = (dispatch) => ({
	getAnnouncement: bindActionCreators(getAnnouncement, dispatch),
	setIsMarketDropdownVisible: bindActionCreators(
		setIsMarketDropdownVisible,
		dispatch
	),
	setIsToolsVisible: bindActionCreators(setIsToolsVisible, dispatch),
	setAppAnnouncements: bindActionCreators(setAppAnnouncements, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AnnouncementList));
