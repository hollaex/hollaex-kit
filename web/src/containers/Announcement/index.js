import React, { useEffect, useState } from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import moment from 'moment';

import { EditWrapper, Image, Table } from 'components';
import { getAnnouncementDetails } from './actions';
import { MarketsSelector } from 'containers/Trade/utils';
import {
	setAppAnnouncements,
	setIsActiveSelectedAnnouncement,
	setSelectedAnnouncement,
} from 'actions/appActions';
import {
	renderAnnouncementMessage,
	renderRemoveEmptyTag,
} from 'components/AppBar/Utils';
import icons from 'config/icons/dark';
import STRINGS from 'config/localizedStrings';
import './Announcement.scss';

const announcementData = (formatDate, onHandleSelectAnnouncement) => {
	return [
		{
			stringId: 'ORDER_TYPE',
			label: STRINGS['ORDER_TYPE'],
			className: 'description-header',
			key: 'type',
			renderCell: (data, key) => (
				<td key={key} className="announcement-type">
					<div className="d-flex justify-content-start table_text">
						{data?.type || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'ANNOUNCEMENT_TAB.TITLE',
			label: STRINGS['ANNOUNCEMENT_TAB.TITLE'],
			className: isMobile ? 'announcement-title-header' : 'description-header',
			key: 'title',
			renderCell: (data, key) => (
				<td key={key} className="announcement-title">
					<div className="d-flex justify-content-start table_text">
						{data?.title || '-'}
					</div>
				</td>
			),
		},
		!isMobile && {
			stringId: 'ANNOUNCEMENT_TAB.MESSAGE_CONTENTS',
			label: <span>{STRINGS['ANNOUNCEMENT_TAB.MESSAGE_CONTENTS']}</span>,
			className: 'description-header',
			key: 'message',
			renderCell: (data, key) => (
				<td key={key} className="message-description">
					<div className="d-flex">
						{renderAnnouncementMessage(
							renderRemoveEmptyTag(data?.message),
							isMobile ? 60 : 70
						)}
						<EditWrapper stringId="HOLLAEX_TOKEN.VIEW">
							<span
								className="blue-link text-decoration-underline"
								onClick={() => onHandleSelectAnnouncement(data)}
							>
								{STRINGS['HOLLAEX_TOKEN.VIEW']}
							</span>
						</EditWrapper>
					</div>
				</td>
			),
		},
		isMobile && {
			stringId: 'ANNOUNCEMENT_TAB.MESSAGE_CONTENTS',
			label: STRINGS['VIEW'],
			className: 'view-header',
			key: 'message',
			renderCell: (data, key) => (
				<td key={key} className="message-description">
					<EditWrapper stringId="HOLLAEX_TOKEN.VIEW">
						<span
							className="blue-link text-decoration-underline"
							onClick={() => onHandleSelectAnnouncement(data)}
						>
							{STRINGS['HOLLAEX_TOKEN.VIEW']}
						</span>
					</EditWrapper>
				</td>
			),
		},
		{
			stringId: 'TIME',
			label: STRINGS['TIME'],
			key: 'created_at',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-start table_text">
						{data?.created_at
							? new Date(data?.created_at)
									.toISOString()
									.slice(0, 10)
									.replace(/-/g, '/')
							: '-'}
					</div>
				</td>
			),
		},
	];
};

const Announcement = ({
	features,
	favourites,
	pair,
	getMarkets,
	setAppAnnouncements,
	setSelectedAnnouncement,
	getSelectedAnnouncement,
	isActiveSelectedAnnouncement,
	setIsActiveSelectedAnnouncement,
}) => {
	const announcementType = [
		STRINGS['ALL'],
		STRINGS['ANNOUNCEMENT_TAB.LISTING_TEXT'],
		STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.UPDATES'],
		STRINGS['ANNOUNCEMENT_TAB.NEWS'],
		STRINGS['ANNOUNCEMENT_TAB.EVENTS'],
		STRINGS['HOLLAEX_TOKEN.MORE'],
	];
	const [selectedOption, setSelectedOption] = useState(STRINGS['ALL']);
	const [announcementList, setAnnouncementList] = useState([]);

	const getAnnouncement = async () => {
		try {
			const detail = await getAnnouncementDetails();
			setAnnouncementList(detail?.data);
			setAppAnnouncements(detail?.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (features?.announcement) {
			getAnnouncement();
		} else {
			return browserHistory?.push('/summary');
		}
		return () => {
			setIsActiveSelectedAnnouncement(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isActiveSelectedAnnouncement && getSelectedAnnouncement?.id) {
			const params = new URLSearchParams(window.location.search);
			params.set('id', getSelectedAnnouncement.id);
			const updatedUrl = `${window.location.pathname}?${params.toString()}`;
			window.history.pushState({}, '', updatedUrl);
		} else {
			const defaultUrl = `${window.location.pathname}`;
			window.history.pushState({}, '', defaultUrl);
		}
	}, [isActiveSelectedAnnouncement, getSelectedAnnouncement]);

	const formatDate = (date) => {
		return moment(date).format('DD/MMM/YYYY, HH:MM:SS ').toUpperCase();
	};

	const onHandleSelect = (option) => {
		setSelectedOption(option);
		setIsActiveSelectedAnnouncement(false);
	};

	const onHandleSelectAnnouncement = (announcement) => {
		setIsActiveSelectedAnnouncement(true);
		setSelectedAnnouncement(announcement);
	};

	const updatedAnnouncementType = [
		...announcementType,
		...announcementList
			?.map((announcement) => announcement?.type)
			?.filter(
				(type) =>
					!announcementType?.some(
						(data) => data?.toLowerCase() === type?.toLowerCase()
					)
			),
	];

	const filteredType = updatedAnnouncementType?.filter(
		(item, index, type) =>
			type?.findIndex((data) => data?.toLowerCase() === item?.toLowerCase()) ===
			index
	);

	const optionMap = {
		[STRINGS['ALL']]: () => true,
		[STRINGS['ANNOUNCEMENT_TAB.LISTING_TEXT']]: (data) =>
			data?.type?.toLowerCase() === 'listing',
		[STRINGS['ANNOUNCEMENT_TAB.EVENTS']]: (data) =>
			data?.type?.toLowerCase() === 'events',
		[STRINGS['ANNOUNCEMENT_TAB.NEWS']]: (data) =>
			data?.type?.toLowerCase() === 'news',
		[STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.UPDATES']]: (data) =>
			data?.type?.toLowerCase() === 'updates',
		[STRINGS['HOLLAEX_TOKEN.MORE']]: (data) =>
			data?.type?.toLowerCase() === 'more',
	};

	const filteredAnnouncement = announcementList
		?.filter((data) => {
			const filterCondition = optionMap[selectedOption];
			return filterCondition
				? filterCondition(data)
				: data?.type?.toLowerCase() === selectedOption?.toLowerCase();
		})
		?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));

	const onHandleTrade = () => {
		if (features?.pro_trade) {
			browserHistory.push(
				favourites && favourites?.length
					? `/trade/${favourites[0]}`
					: `/trade/${getMarkets[0]?.key}`
			);
		} else if (features?.quick_trade) {
			browserHistory.push(`/quick-trade/${pair}`);
		} else {
			browserHistory.push('/prices');
		}
	};

	const AnnouncementEmptyTable = ({ icons: ICONS }) => {
		return (
			<div>
				<div className="empty-content-display">
					<div className="no-link-icon">
						<Image
							iconId="ANNOUNCEMENT_ICON"
							icon={ICONS['ANNOUNCEMENT_ICON']}
							wrapperClassName="form_currency-ball margin-aligner"
						/>
					</div>
					<div className="empty-description">
						<EditWrapper stringId="ANNOUNCEMENT_TAB.NO_DATA_TEXT">
							{STRINGS['ANNOUNCEMENT_TAB.NO_DATA_TEXT']}
						</EditWrapper>
						<EditWrapper stringId="ANNOUNCEMENT_TAB.VIEW_PRICE_UPDATES">
							<span
								className="blue-link text-decoration-underline"
								onClick={() => browserHistory.push('/prices')}
							>
								{STRINGS['ANNOUNCEMENT_TAB.VIEW_PRICE_UPDATES']}
							</span>
						</EditWrapper>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="announcement-container">
			<div className="annuoncement-title-container">
				<Image
					icon={icons['NOTIFICATION_OPTION_ICON']}
					wrapperClassName="notification-icon"
				/>
				<EditWrapper stringId="TRADE_TAB_POSTS">
					<span className="title">{STRINGS['TRADE_TAB_POSTS']}</span>
				</EditWrapper>
			</div>
			<div className="announcement-line-container">
				<EditWrapper stringId="ACCOUNTS.TAB_SUMMARY">
					{!isActiveSelectedAnnouncement ? (
						<span
							className="blue-link"
							onClick={() => browserHistory?.push('/summary')}
						>
							{'<'}{' '}
							<span className="text-decoration-underline">
								{STRINGS['ACCOUNTS.TAB_SUMMARY']}
							</span>
						</span>
					) : (
						<span
							className="blue-link"
							onClick={() => {
								setIsActiveSelectedAnnouncement(false);
								setSelectedOption(STRINGS['ALL']);
							}}
						>
							{'<'}{' '}
							<span className="text-decoration-underline">
								{STRINGS['ANNOUNCEMENT_TAB.VIEW_ALL_ANNOUNCEMENT']}
							</span>
						</span>
					)}
				</EditWrapper>
				<div className="link-wrapper">
					<EditWrapper stringId="SUMMARY.DEPOSIT">
						<span
							className="blue-link deposit-link"
							onClick={() => browserHistory.push('/wallet/deposit')}
						>
							{STRINGS['SUMMARY.DEPOSIT']?.toUpperCase()}
						</span>
					</EditWrapper>
					<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW">
						<span
							className="blue-link withdraw-link"
							onClick={() => browserHistory.push('/wallet/withdraw')}
						>
							{STRINGS['WITHDRAW_PAGE.WITHDRAW']?.toUpperCase()}
						</span>
					</EditWrapper>
					<EditWrapper stringId="TRADE_TAB_TRADE">
						<span
							className="blue-link market-link"
							onClick={() => onHandleTrade()}
						>
							{STRINGS['TRADE_TAB_TRADE']?.toUpperCase()}
						</span>
					</EditWrapper>
				</div>
			</div>
			<div className="announcement-details-container">
				<div className="announcement-filter">
					{filteredType?.map((data, index) => {
						return (
							<div
								key={index}
								className={
									selectedOption?.toLowerCase() === data?.toLowerCase()
										? 'filter-text selected-notification'
										: 'filter-text'
								}
								onClick={() => onHandleSelect(data)}
							>
								{data === STRINGS['ALL'] && (
									<Image
										icon={icons['NOTIFICATION_OPTION_ICON']}
										wrapperClassName="mr-1 notification-all-icon"
									/>
								)}
								<EditWrapper stringId={data}>
									<span className="caps-first">{data}</span>
								</EditWrapper>
							</div>
						);
					})}
				</div>
				{!isActiveSelectedAnnouncement ? (
					<div className="announcement-list">
						<div>
							<EditWrapper stringId="ANNOUNCEMENT_TAB.ANNOUNCEMENT_LIST_HEADING">
								<span className="font-weight-bold">
									{STRINGS['ANNOUNCEMENT_TAB.ANNOUNCEMENT_LIST_HEADING']}
								</span>
							</EditWrapper>
						</div>
						<div className="mt-1">
							<EditWrapper stringId="ANNOUNCEMENT_TAB.ANNOUNCEMENT_DESC">
								<span className="secondary-text">
									{STRINGS['ANNOUNCEMENT_TAB.ANNOUNCEMENT_DESC']}
								</span>
							</EditWrapper>
						</div>
						<div className="mt-3">
							<EditWrapper stringId="ANNOUNCEMENT_TAB.VIEW_PRICE_UPDATES">
								<span
									className="blue-link text-decoration-underline"
									onClick={() => browserHistory?.push('/prices')}
								>
									{STRINGS['ANNOUNCEMENT_TAB.VIEW_PRICE_UPDATES']}
								</span>
							</EditWrapper>
						</div>
						<div>
							<Table
								className="announcement-table-wrapper"
								showHeaderNoData={true}
								headers={announcementData(
									formatDate,
									onHandleSelectAnnouncement
								)}
								rowKey={(data) => {
									return data.id;
								}}
								data={filteredAnnouncement}
								count={filteredAnnouncement?.length}
								pageSize={12}
								noData={<AnnouncementEmptyTable icons={icons} />}
							/>
						</div>
					</div>
				) : (
					<div className="announcement-list">
						<div className="selected-announcement-title font-weight-bold">
							{getSelectedAnnouncement?.title}
						</div>
						<div className="d-flex justify-content-between align-items-center secondary-text selected-announcement-type ">
							<div className="d-flex">
								<EditWrapper stringId="ORDER_TYPE">
									<span>{STRINGS['ORDER_TYPE']}:</span>
								</EditWrapper>
								<span
									className="ml-1 blue-link text-decoration-underline caps-first"
									onClick={() => {
										setIsActiveSelectedAnnouncement(false);
										setSelectedOption(getSelectedAnnouncement?.type);
									}}
								>
									{getSelectedAnnouncement?.type}
								</span>
							</div>
							<span className="selected-announcement-time">
								{formatDate(getSelectedAnnouncement?.created_at)}
							</span>
						</div>
						<div
							className="selected-announcement-message"
							dangerouslySetInnerHTML={{
								__html: renderRemoveEmptyTag(getSelectedAnnouncement?.message),
							}}
						></div>
					</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	features: state.app.features,
	favourites: state.app.favourites,
	getMarkets: MarketsSelector(state),
	pair: state.app.pair,
	getSelectedAnnouncement: state.app.selectedAnnouncement,
	isActiveSelectedAnnouncement: state.app.isActiveSelectedAnnouncement,
});

const mapDispatchToProps = (dispatch) => ({
	setAppAnnouncements: bindActionCreators(setAppAnnouncements, dispatch),
	setSelectedAnnouncement: bindActionCreators(
		setSelectedAnnouncement,
		dispatch
	),
	setIsActiveSelectedAnnouncement: bindActionCreators(
		setIsActiveSelectedAnnouncement,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(Announcement);
