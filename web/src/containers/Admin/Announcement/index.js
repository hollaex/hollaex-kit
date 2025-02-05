import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactQuill from 'react-quill';
import { ReactSVG } from 'react-svg';
import { browserHistory } from 'react-router';
import { Button, DatePicker, Input, message, Modal, Select, Table } from 'antd';
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
import {
	setAppAnnouncements,
	setIsAdminAnnouncementFeature,
} from 'actions/appActions';

const announcementHeader = (removeDetail, onHandleSelectedAnnouncement) => [
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
			<div
				className="message-content-wrapper mr-2"
				dangerouslySetInnerHTML={{ __html: message }}
			/>
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
		title: 'Edit',
		render: (data) => (
			<div className="d-flex">
				<Button
					type="primary"
					onClick={() => onHandleSelectedAnnouncement(data)}
					className="green-btn"
				>
					Edit
				</Button>
			</div>
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
				className="mt-2"
				placeholder="Input Announcement Message"
			/>
		</>
	);
};

const AdminAnnouncement = ({
	constants,
	setAppAnnouncements,
	setIsAdminAnnouncementFeature,
}) => {
	const [announcementList, setAnnouncementList] = useState([]);
	const [isAnnouncementLifeSpan, setIsAnnouncementLifeSpan] = useState(false);
	const [isDisplayAddDetailPopup, setIsDisplayAddDetailPopup] = useState(false);
	const [isDisplayEditAnnouncement, setIsDisplayEditAnnouncement] = useState(
		false
	);
	const [selectedPopup, setSelectedPopup] = useState('add');
	const [selectedAnnouncementType, setSelectedAnnouncementType] = useState(
		null
	);

	const [announcement, setAnnouncement] = useState({
		type: null,
		message: null,
		title: null,
		is_dropdown: false,
		is_popup: false,
		is_navbar: false,
		start_date: null,
		end_date: null,
	});

	const [selectedOption, setSelectedOption] = useState({
		isDisplayIndefinitely: true,
		isSelectRange: false,
	});

	const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
	const { RangePicker } = DatePicker;

	const topAnnouncementDetail = announcementList[0];

	const isDropdown = topAnnouncementDetail?.is_dropdown || false;

	const isDetailIndefinitely =
		selectedAnnouncement &&
		!selectedAnnouncement?.start_date &&
		!selectedAnnouncement?.end_date;
	const isDateSelected =
		selectedAnnouncement &&
		selectedAnnouncement?.start_date &&
		selectedAnnouncement?.end_date;

	const selectedStartDate =
		selectedAnnouncement && selectedAnnouncement?.start_date
			? moment(selectedAnnouncement?.start_date)
			: null;
	const selectedEndDate =
		selectedAnnouncement && selectedAnnouncement?.end_date
			? moment(selectedAnnouncement?.end_date)
			: null;

	const defaultAnnouncementType = [
		'updates',
		'listing',
		'events',
		'news',
		'more',
		'custom',
	];

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
			setAnnouncement((prev) => ({
				...prev,
				is_dropdown: isDropdown,
			}));
		}
		setAppAnnouncements(announcementList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [announcementList]);

	useEffect(() => {
		if (selectedPopup === 'edit') {
			setSelectedOption({
				isDisplayIndefinitely: isDetailIndefinitely,
				isSelectRange: isDateSelected,
			});
		} else {
			setSelectedOption({
				isDisplayIndefinitely: true,
				isSelectRange: false,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPopup]);

	useEffect(() => {
		const isDefaultType = defaultAnnouncementType?.filter(
			(type) =>
				type?.toLowerCase() !== selectedAnnouncement?.type?.toLowerCase()
		);
		if (
			isDefaultType?.length === defaultAnnouncementType?.length &&
			selectedAnnouncement
		) {
			setSelectedAnnouncementType('custom');
		} else {
			setSelectedAnnouncementType(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAnnouncement]);

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
		if (selectedPopup === 'add') {
			try {
				await setAdminAnnouncementDetails(announcement);
				await getAnnouncement();
				message.success('Announcement Added successfully');
			} catch (error) {
				console.error(error);
			}
			setIsDisplayAddDetailPopup(false);
		} else {
			const filteredAnnouncement = announcementList?.filter((detail) => {
				return detail?.id !== selectedAnnouncement?.id;
			});
			const editedAnnouncementDetails = [
				selectedAnnouncement,
				...filteredAnnouncement,
			]?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
			setAnnouncementList(editedAnnouncementDetails);
			editDetail(selectedAnnouncement);
			setIsDisplayEditAnnouncement(false);
		}
	};

	const onHandleToggle = (key) => {
		setAnnouncement((prev) => ({
			...prev,
			[`is_${key}`]: !prev?.[`is_${key}`],
		}));

		const updatedDetail = {
			...topAnnouncementDetail,
			[`is_${key}`]: !announcement?.[`is_${key}`],
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

	const updateAnnouncement = (field, value) => {
		const updateFunc =
			selectedPopup === 'add' ? setAnnouncement : setSelectedAnnouncement;
		updateFunc((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onHandleDateSelect = (dates) => {
		const updateDates = dates
			? {
					start_date: dates[0],
					end_date: dates[1],
			  }
			: {
					start_date: null,
					end_date: null,
			  };

		updateAnnouncement('start_date', updateDates?.start_date);
		updateAnnouncement('end_date', updateDates?.end_date);
	};

	const onHandleSelect = (e) => {
		const { id } = e.target;
		if (id === 'recent') {
			setSelectedOption({
				isDisplayIndefinitely: true,
				isSelectRange: false,
			});

			updateAnnouncement('start_date', null);
			updateAnnouncement('end_date', null);
		} else if (id === 'selectDate') {
			setSelectedOption({
				isDisplayIndefinitely: false,
				isSelectRange: true,
			});
		}
	};

	const onHandleChange = (data, text) => {
		const handlers = {
			title: () => updateAnnouncement(text, data),
			message: () => updateAnnouncement(text, data),
			'default type': () => {
				if (data === 'custom') {
					setSelectedAnnouncementType(data);
					updateAnnouncement('type', null);
				} else {
					setSelectedAnnouncementType(null);
					updateAnnouncement('type', data);
				}
			},
			'select navbar': () => updateAnnouncement('is_navbar', data),
			'select popup': () => updateAnnouncement('is_popup', data),
			default: () => updateAnnouncement('type', data),
		};

		(handlers[text] || handlers['default'])();
	};

	const onHandleProceed = () => {
		setIsAnnouncementLifeSpan(false);
		selectedPopup === 'add'
			? setIsDisplayAddDetailPopup(true)
			: setIsDisplayEditAnnouncement(true);
	};

	const onHandleSelectedAnnouncement = (detail) => {
		setSelectedAnnouncement(detail);
		setIsDisplayEditAnnouncement(true);
		setSelectedPopup('edit');
	};

	const onHandleConfigure = () => {
		setIsAnnouncementLifeSpan(true);
		selectedPopup === 'add'
			? setIsDisplayAddDetailPopup(false)
			: setIsDisplayEditAnnouncement(false);
	};

	const onHandleBack = () => {
		if (selectedPopup === 'add') {
			setIsDisplayAddDetailPopup(false);
			setAnnouncement({
				type: null,
				message: null,
				title: null,
				is_dropdown: false,
				is_popup: false,
				is_navbar: false,
				start_date: null,
				end_date: null,
			});
		} else {
			setIsDisplayEditAnnouncement(false);
			setSelectedAnnouncement({});
		}
		setSelectedOption({
			isDisplayIndefinitely: true,
			isSelectRange: false,
		});
		setSelectedAnnouncementType(null);
		setSelectedPopup(isDisplayAddDetailPopup ? 'add' : 'edit');
	};

	const onHandleOpenPopup = () => {
		setIsDisplayAddDetailPopup(true);
		setSelectedPopup('add');
		setSelectedAnnouncementType(null);
	};

	const onHandleNavigate = () => {
		setIsAdminAnnouncementFeature(true);
		browserHistory.push('/admin/general');
	};

	const isEnterpriseUpgrade = handleEnterpriseUpgrade(constants?.info);

	const selectedAnnouncementDetail =
		selectedPopup === 'add' ? announcement : selectedAnnouncement;

	const dateRange =
		selectedPopup === 'add'
			? [announcement?.start_date, announcement?.end_date]
			: [selectedStartDate, selectedEndDate];

	const selectedType =
		selectedPopup === 'add'
			? announcement?.type
			: defaultAnnouncementType?.filter(
					(data) =>
						data?.toLowerCase() === selectedAnnouncement?.type?.toLowerCase()
			  );

	const isDisabled =
		!selectedAnnouncementDetail?.title ||
		!selectedAnnouncementDetail?.message ||
		!selectedAnnouncementDetail?.type;

	return (
		<div
			className={
				constants?.features?.announcement
					? 'w-100 mt-5 pb-5 announcement-wrapper'
					: 'w-100 mt-5 pb-5 announcement-wrapper announcement-wrapper-disabled'
			}
		>
			<Modal
				visible={isAnnouncementLifeSpan}
				className="bg-model blue-admin-billing-model admin-announcement-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => onHandleProceed()}
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
							checked={selectedOption?.isDisplayIndefinitely}
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
								value={dateRange}
								onChange={(dates) => onHandleDateSelect(dates)}
								disabled={!selectedOption?.isSelectRange}
							/>
						</div>
					</div>
					<div className="button-container">
						<Button
							type="primary"
							onClick={() => onHandleProceed()}
							className="green-btn"
							size="medium"
						>
							Back
						</Button>
						<Button
							type="primary"
							onClick={() => onHandleProceed()}
							className="green-btn"
							size="medium"
						>
							Proceed
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isDisplayAddDetailPopup || isDisplayEditAnnouncement}
				className="bg-model blue-admin-billing-model admin-announcement-message-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => onHandleBack()}
				footer={null}
			>
				<div className="announcement-message-popup-wrapper">
					<div className="title font-weight-bold">Add Announcement Details</div>
					<div className="mt-3 ">
						<span className="font-weight-bold">Title:</span>
						<Input
							type="small"
							value={selectedAnnouncementDetail?.title}
							onChange={(e) => onHandleChange(e.target.value, 'title')}
							className="mt-2"
							placeholder="Input Announcement Title"
						/>
					</div>
					<div className="mt-3">
						<span className="font-weight-bold">Message/Content:</span>
						<Editor
							announcement={selectedAnnouncementDetail}
							onHandleChange={onHandleChange}
						/>
					</div>
					<div className="mt-3 d-flex flex-column">
						<span className="font-weight-bold">Type:</span>
						<Select
							placeholder="Select Default Announcement Type"
							className="mt-2"
							value={
								selectedAnnouncementType === 'custom'
									? selectedAnnouncementType
									: selectedType
							}
							onChange={(value) => onHandleChange(value, 'default type')}
						>
							{defaultAnnouncementType?.map((detail) => (
								<Select.Option key={detail} value={detail}>
									{detail}
								</Select.Option>
							))}
						</Select>
						{selectedAnnouncementType === 'custom' && (
							<Input
								type="small"
								value={selectedAnnouncementDetail?.type}
								onChange={(e) => onHandleChange(e.target.value, 'type')}
								className="mt-2"
								placeholder="Custom Announcement Type"
							/>
						)}
					</div>
					<div className="announcement-display-options mt-3">
						<span className="font-weight-bold">
							Announcement Display Options:
						</span>
						<div className="d-flex announcement-display-feature mt-3 mr-3">
							<input
								type="checkbox"
								checked={selectedAnnouncementDetail?.is_popup}
								onChange={() =>
									onHandleChange(
										!selectedAnnouncementDetail?.is_popup,
										'select popup'
									)
								}
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
											{getFormattedDate(selectedAnnouncementDetail?.start_date)}{' '}
											to{' '}
											{getFormattedDate(selectedAnnouncementDetail?.end_date)}
										</div>
									)}
									<Button
										type="primary"
										onClick={() => onHandleConfigure()}
										className="green-btn ml-1"
										size="small"
									>
										Configure
									</Button>
								</div>
							</div>
						</div>
						<div className="d-flex announcement-display-feature mt-3 mr-3">
							<input
								type="checkbox"
								checked={selectedAnnouncementDetail?.is_navbar}
								onChange={() =>
									onHandleChange(
										!selectedAnnouncementDetail?.is_navbar,
										'select navbar'
									)
								}
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
					<div className="button-container">
						<Button
							type="primary"
							onClick={() => onHandleBack()}
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
							disabled={isDisabled}
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
						{!constants?.features?.announcement && (
							<div className="w-100 my-3 d-flex flex-column align-items-center justify-content-center announcement-description-active">
								<span>Announcement feature is currently disabled</span>
								<span>
									Turn on the announcements:{' '}
									<span
										className="text-decoration-underline feature-link"
										onClick={() => onHandleNavigate()}
									>
										here
									</span>
								</span>
							</div>
						)}
						<div className="mt-3 d-flex justify-content-between">
							<div className="d-flex announcement-display-feature">
								<input
									type="checkbox"
									checked={announcement?.is_dropdown}
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
						</div>
					</div>
					<div className="d-flex justify-content-between w-100 mt-3">
						<div className="d-flex flex-column">
							<span className="font-weight-bold">Active announcements</span>
							<span>
								Below are active announcements. You can add an announcement{' '}
								<span
									className="text-decoration-underline pointer"
									onClick={() => onHandleOpenPopup()}
								>
									here
								</span>
							</span>
						</div>
						<Button
							className="mt-2 green-btn"
							onClick={() => onHandleOpenPopup()}
							type="medium"
						>
							Add
						</Button>
					</div>
					<div className="mt-5 h-100">
						<Table
							className="blue-admin-table"
							columns={announcementHeader(
								removeDetail,
								onHandleSelectedAnnouncement
							)}
							dataSource={announcementList}
							rowKey={(data) => {
								return data.id;
							}}
						/>
					</div>
				</div>
			) : (
				<div className="d-flex align-items-center w-100 justify-content-center">
					<div className="d-flex align-items-center justify-content-between upgrade-section my-4">
						<div>
							<div className="font-weight-bold">Public Announcement</div>
							<div>Display a custom public announcement.</div>
						</div>
						<div className="ml-5 button-wrapper">
							<a
								href="https://dash.hollaex.com/billing"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button type="primary" className="w-100 upgrade-btn">
									Upgrade Now
								</Button>
							</a>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	setAppAnnouncements: bindActionCreators(setAppAnnouncements, dispatch),
	setIsAdminAnnouncementFeature: bindActionCreators(
		setIsAdminAnnouncementFeature,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminAnnouncement);
