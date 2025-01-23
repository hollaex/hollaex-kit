import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import { ReactSVG } from 'react-svg';
import { Button, DatePicker, Input, message, Modal, Table } from 'antd';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

import { STATIC_ICONS } from 'config/icons';
import { handleEnterpriseUpgrade } from 'utils/utils';
import { formatDate } from 'utils';
import { getFormattedDate } from 'utils/string';
import {
	deleteAdminAnnouncementDetail,
	editAdminAnnouncementDetails,
	getAdminAnnouncement,
	setAdminAnnouncementDetails,
} from './action';
import './index.scss';

const announcementHeader = (removeDetail) => [
	{
		title: 'Type',
		className: 'description-header',
		key: 'type',
		dataIndex: 'type',
	},
	{
		title: 'Title',
		className: 'description-header',
		key: 'title',
		dataIndex: 'title',
	},
	{
		title: 'Message/Content',
		className: 'description-header',
		dataIndex: 'message',
		key: 'message',
		render: (message) => (
			<div className="d-flex">
				<div
					className="message-content-wrapper mr-2"
					dangerouslySetInnerHTML={{ __html: message }}
				/>
			</div>
		),
	},
	{
		title: 'Time',
		dataIndex: 'created_at',
		key: 'created_at',
		render: (created_at) => (
			<div className="d-flex">{formatDate(created_at)}</div>
		),
	},
	{
		title: 'Remove',
		render: (data) => (
			<div className="d-flex">
				<Button
					type="primary"
					onClick={() => removeDetail(data?.id)}
					className="green-btn"
				>
					Remove
				</Button>
			</div>
		),
	},
];

const Editor = ({ announcement, onHandleChange }) => {
	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, false] }],
			[{ size: ['small', 'large', 'huge'] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['link', 'image'],
			['clean'],
		],
	};

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'size',
		'link',
		'image',
	];

	return (
		<>
			<ReactQuill
				theme="snow"
				value={announcement?.message}
				onChange={(value) => onHandleChange(value, 'message')}
				modules={modules}
				formats={formats}
			/>
		</>
	);
};

const AdminAnnouncement = ({ constants }) => {
	const [announcementList, setAnnouncementList] = useState([]);
	const [isAnnouncementLifeSpan, setIsAnnouncementLifeSpan] = useState(false);
	const [isDisplayAnnouncement, setIsDisplayAnnouncement] = useState({
		is_dropdown: false,
		is_popup: false,
		is_navbar: false,
	});
	const [isDisplayAddDetailPopup, setIsDisplayAddDetailPopup] = useState(false);
	const [announcement, setAnnouncement] = useState({
		type: null,
		message: null,
		title: null,
	});

	const [selectedOption, setSelectedOption] = useState({
		isDisplayIndefinitely: true,
		isSelectRange: false,
	});

	const [dateRange, setDateRange] = useState({
		startDate: null,
		endDate: null,
	});

	const { RangePicker } = DatePicker;

	const topAnnouncementDetail = announcementList[0];

	const isDropdown = topAnnouncementDetail?.is_dropdown || false;
	const isPopup = topAnnouncementDetail?.is_popup || false;
	const isNavbar = topAnnouncementDetail?.is_navbar || false;

	const isDetailIndefinitely =
		!topAnnouncementDetail?.start_date && !topAnnouncementDetail?.end_date;
	const isDateSelected =
		topAnnouncementDetail?.start_date && topAnnouncementDetail?.end_date;

	const startDate = topAnnouncementDetail?.start_date
		? moment(topAnnouncementDetail?.start_date)
		: null;
	const endDate = topAnnouncementDetail?.end_date
		? moment(topAnnouncementDetail?.end_date)
		: null;

	const getAnnouncement = async () => {
		try {
			const detail = await getAdminAnnouncement();
			setAnnouncementList(detail?.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getAnnouncement();
	}, []);

	useEffect(() => {
		if (announcementList?.length > 0) {
			setIsDisplayAnnouncement({
				is_dropdown: isDropdown,
				is_popup: isPopup,
				is_navbar: isNavbar,
			});
			setSelectedOption({
				isDisplayIndefinitely: isDetailIndefinitely,
				isSelectRange: isDateSelected,
			});
			setDateRange({
				startDate: startDate,
				endDate: endDate,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [announcementList]);

	const removeDetail = async (id) => {
		const filteredDetail = announcementList?.filter((data) => {
			return data.id !== id;
		});
		try {
			setAnnouncementList(filteredDetail);
			await deleteAdminAnnouncementDetail({ id });
			message.success('Announcement Removed successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleSubmitAnnouncement = async () => {
		try {
			await setAdminAnnouncementDetails(announcement);
			await getAnnouncement();
			message.success('Announcement Added successfully');
		} catch (error) {
			console.error(error);
		}
		setIsDisplayAddDetailPopup(false);
	};

	const onHandleToggle = (key) => {
		setIsDisplayAnnouncement((prev) => ({
			...prev,
			[`is_${key}`]: !prev?.[`is_${key}`],
		}));

		const updatedDetail = {
			...topAnnouncementDetail,
			[`is_${key}`]: !isDisplayAnnouncement?.[`is_${key}`],
		};
		const filteredAnnouncement = announcementList?.filter((detail) => {
			return detail?.id !== updatedDetail?.id;
		});
		const editedAnnouncementDetails = [updatedDetail, ...filteredAnnouncement];
		setAnnouncementList(editedAnnouncementDetails);
		editDetail(updatedDetail);
	};

	const editDetail = async (filteredDetails) => {
		try {
			await editAdminAnnouncementDetails(filteredDetails);
			message.success('Updated successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleDateSelect = (dates) => {
		if (dates) {
			const [startDate, endDate] = dates;

			setDateRange((prev) => ({
				...prev,
				startDate,
				endDate,
			}));
		} else {
			setDateRange({
				startDate: null,
				endDate: null,
			});
		}
	};

	const onHandleSelect = (e) => {
		const { id } = e.target;
		if (id === 'recent') {
			setSelectedOption({
				isDisplayIndefinitely: true,
				isSelectRange: false,
			});

			setDateRange({
				startDate: null,
				endDate: null,
			});
		} else if (id === 'selectDate') {
			setSelectedOption({
				isDisplayIndefinitely: false,
				isSelectRange: true,
			});
		}
	};

	const onHandleChange = (data, text) => {
		if (text === 'title') {
			setAnnouncement((prev) => ({
				...prev,
				title: data,
			}));
		} else if (text === 'message') {
			setAnnouncement((prev) => ({
				...prev,
				message: data,
			}));
		} else {
			setAnnouncement((prev) => ({
				...prev,
				type: data,
			}));
		}
	};

	const onHandleSave = () => {
		setIsAnnouncementLifeSpan(false);
		editDetail({
			...topAnnouncementDetail,
			start_date: dateRange?.startDate,
			end_date: dateRange?.endDate,
		});
	};

	const isEnterpriseUpgrade = handleEnterpriseUpgrade(constants.info);

	return (
		<div className="w-100 mt-5 pb-5 announcement-wrapper">
			<Modal
				visible={isAnnouncementLifeSpan}
				className="bg-model blue-admin-billing-model admin-announcement-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => setIsAnnouncementLifeSpan(false)}
				footer={null}
			>
				<div className="announcement-life-span-popup-container">
					<div className="title font-weight-bold">Pop up Life Span</div>
					<div className="description-text mt-2">
						The length of time the recent announcement will be displayed to the
						user
					</div>
					<div className="announcement-display-option mt-2">
						<input
							type="radio"
							id="recent"
							name="announcementOption"
							checked={selectedOption.isDisplayIndefinitely}
							onChange={onHandleSelect}
						/>
						<label className="ml-1" htmlFor="recent">
							Show the most recent announcement indefinitely
						</label>
					</div>
					<div className="mt-2 announcement-display-option ">
						<input
							type="radio"
							id="selectDate"
							name="announcementOption"
							checked={selectedOption?.isSelectRange}
							onChange={onHandleSelect}
						/>
						<label className="ml-1" htmlFor="selectDate">
							Select date
						</label>
						<div>
							<RangePicker
								size="small"
								value={[dateRange?.startDate, dateRange?.endDate]}
								onChange={(dates) => onHandleDateSelect(dates)}
								disabled={!selectedOption?.isSelectRange}
							/>
						</div>
					</div>
					<div className="button-container">
						<Button
							type="primary"
							onClick={() => setIsAnnouncementLifeSpan(false)}
							className="green-btn"
							size="medium"
						>
							Back
						</Button>
						<Button
							type="primary"
							onClick={() => onHandleSave()}
							className="green-btn"
							size="medium"
						>
							Proceed
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isDisplayAddDetailPopup}
				className="bg-model blue-admin-billing-model admin-announcement-message-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => setIsDisplayAddDetailPopup(false)}
				footer={null}
			>
				<div className="announcement-message-popup-wrapper">
					<div className="title font-weight-bold">Add Announcement Details</div>
					<div className="mt-3 ">
						<span>Title:</span>
						<Input
							type="small"
							value={announcement?.title}
							onChange={(e) => onHandleChange(e.target.value, 'title')}
						/>
					</div>
					<div className="mt-3">
						<span>Message/Content:</span>
						<Editor
							announcement={announcement}
							onHandleChange={onHandleChange}
						/>
					</div>
					<div className="mt-3">
						<span>Type:</span>
						<Input
							type="small"
							value={announcement?.type}
							onChange={(e) => onHandleChange(e.target.value, 'type')}
						/>
					</div>
					<div className="button-container">
						<Button
							type="primary"
							onClick={() => setIsDisplayAddDetailPopup(false)}
							className="green-btn"
							size="medium"
						>
							Back
						</Button>
						<Button
							type="primary"
							onClick={() => onHandleSubmitAnnouncement()}
							className="green-btn"
							size="medium"
							disabled={
								!announcement?.title ||
								!announcement?.message ||
								!announcement?.type
							}
						>
							Submit
						</Button>
					</div>
				</div>
			</Modal>
			{!isEnterpriseUpgrade ? (
				<div>
					<div className="announcement-filters">
						<div className="display-title">
							<span className="font-weight-bold">Display Location</span>
							<span>
								Set where you'd like your announcements to be displayed
							</span>
						</div>
						<div className="mt-3 d-flex justify-content-between">
							<div className="d-flex announcement-display-feature">
								<input
									type="checkbox"
									checked={isDisplayAnnouncement?.is_dropdown}
									onChange={() => onHandleToggle('dropdown')}
								/>
								<div className="feature-trade-box">
									<ReactSVG
										src={STATIC_ICONS.NAV_BAR_ANNOUNCEMENT}
										className="feature-icon w-100 mr-1"
									/>
								</div>
								<div className="announcement-features">
									<span className="font-weight-bold">Main Navigation</span>
									<span>(Top main navigation bar)</span>
								</div>
							</div>
							<div className="d-flex announcement-display-feature mr-3">
								<input
									type="checkbox"
									checked={isDisplayAnnouncement?.is_popup}
									onChange={() => onHandleToggle('popup')}
								/>
								<div className="feature-trade-box">
									<ReactSVG
										src={STATIC_ICONS.POPUP_ANNOUNCEMENT}
										className="feature-icon popup-feature-icon w-100 mr-1"
									/>
								</div>
								<div className="announcement-features">
									<span className="font-weight-bold">Pop up</span>
									<span>(As a pop-up upon login)</span>
									<div className="mt-2 d-flex align-items-end">
										{selectedOption?.isDisplayIndefinitely && (
											<div className="ml-1">Show ∞ indefinitely</div>
										)}
										{selectedOption?.isSelectRange && (
											<div className="ml-1">
												Show from{' '}
												{getFormattedDate(topAnnouncementDetail?.start_date)} to{' '}
												{getFormattedDate(topAnnouncementDetail?.end_date)}
											</div>
										)}
										<Button
											type="primary"
											onClick={() => setIsAnnouncementLifeSpan(true)}
											className="green-btn ml-1"
											size="small"
										>
											Configure
										</Button>
									</div>
								</div>
							</div>
							<div className="d-flex announcement-display-feature mr-3">
								<input
									type="checkbox"
									checked={isDisplayAnnouncement?.is_navbar}
									onChange={() => onHandleToggle('navbar')}
								/>
								<div className="feature-trade-box">
									<ReactSVG
										src={STATIC_ICONS.TOP_BAR_ANNOUNCEMENT}
										className="feature-icon w-100 mr-1"
									/>
								</div>
								<div className="announcement-features">
									<span className="font-weight-bold">Top of page</span>
									<span>(Bar at the very top of the page, above main nav)</span>
								</div>
							</div>
						</div>
					</div>
					<div className="d-flex justify-content-end">
						<Button
							className="mt-2 green-btn"
							onClick={() => setIsDisplayAddDetailPopup(true)}
							type="medium"
						>
							Add
						</Button>
					</div>
					<div className="mt-5 h-100">
						<Table
							className="blue-admin-table"
							columns={announcementHeader(removeDetail)}
							dataSource={announcementList}
							rowKey={(data) => {
								return data.id;
							}}
						/>
					</div>
				</div>
			) : (
				<div className="text-align-center">Upgrade required</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

export default connect(mapStateToProps)(AdminAnnouncement);
