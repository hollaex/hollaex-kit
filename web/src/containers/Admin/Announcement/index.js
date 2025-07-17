import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactQuill from 'react-quill';
import { ReactSVG } from 'react-svg';
import { browserHistory } from 'react-router';
import {
	Button,
	DatePicker,
	Input,
	message,
	Modal,
	Select,
	Table,
	Tabs,
} from 'antd';
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

const TabPane = Tabs.TabPane;

const announcementHeader = (
	onHandleRemoveAnnouncement,
	onHandleSelectedAnnouncement
) => [
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
					onClick={() => onHandleRemoveAnnouncement(data)}
					className="green-btn"
				>
					Remove
				</Button>
			</div>
		),
	},
];

const Editor = ({ announcement, onHandleChange }) => {
	const quillRef = useRef(null);

	useEffect(() => {
		if (quillRef.current) {
			const quill = quillRef.current.getEditor();

			quill.on('selection-change', function (range, oldRange, source) {
				const inputLink = document.querySelector('.ql-tooltip input');
				if (inputLink && inputLink.type === 'text') {
					inputLink.setAttribute('data-link', 'https://website.here');
					inputLink.value = '';
				}
			});
		}
	}, []);

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
				ref={quillRef}
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
	getAnnouncements,
}) => {
	const [activeTab, setActiveTab] = useState('0');

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	return (
		<div className="w-100 announcement-tab-wrapper">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
				className="announcement-tabs"
			>
				<TabPane tab="Active" key="0">
					<AnnouncementDetails
						activeTab={'active announcement'}
						constants={constants}
						setAppAnnouncements={setAppAnnouncements}
						setIsAdminAnnouncementFeature={setIsAdminAnnouncementFeature}
						getAnnouncements={getAnnouncements}
					/>
				</TabPane>
				<TabPane tab="Display Locations" key="1">
					<AnnouncementDetails
						activeTab={'display location'}
						constants={constants}
						setAppAnnouncements={setAppAnnouncements}
						setIsAdminAnnouncementFeature={setIsAdminAnnouncementFeature}
						getAnnouncements={getAnnouncements}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

const AnnouncementDetails = ({
	constants,
	setAppAnnouncements,
	setIsAdminAnnouncementFeature,
	activeTab,
	getAnnouncements,
}) => {
	const [isDisplayAddDetailPopup, setIsDisplayAddDetailPopup] = useState(false);
	const [isDisplayRemoveAnnouncement, setIsRemoveAnnouncement] = useState(
		false
	);

	const [isDisplayEditAnnouncement, setIsDisplayEditAnnouncement] = useState(
		false
	);
	const [
		isDropdownAnnouncementpopup,
		setIsDropdownAnnouncementPopup,
	] = useState(false);
	const [
		renderHighlightAnnouncement,
		setRenderHighlightAnnouncement,
	] = useState({
		isHighlightPopup: false,
		isHighlightTopbar: false,
	});

	const [selectedAnnouncementType, setSelectedAnnouncementType] = useState(
		null
	);
	const [selectedHighlightPopup, setSelectedHighlightPopup] = useState({});
	const [selectedHighlightTopbar, setSelectedHighlightTopbar] = useState({});

	const [addAnnouncement, setAddAnnouncement] = useState({
		type: null,
		message: null,
		title: null,
		is_dropdown: false,
		is_popup: false,
		is_navbar: false,
		start_date: null,
		end_date: null,
	});

	const [selectHighlightLifeSpan, setSelectedHighlightLifeSpan] = useState({
		isDisplayPopupIndefinitely: true,
		isPopupSelectRange: false,
	});

	const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
	const { RangePicker } = DatePicker;

	const highlightDropdowndetails = getAnnouncements?.filter(
		(data) => data?.is_dropdown
	);

	const highlightDetails = renderHighlightAnnouncement?.isHighlightPopup
		? selectedHighlightPopup
		: renderHighlightAnnouncement?.isHighlightTopbar
		? selectedHighlightTopbar
		: {};

	const getDate = (date) => (date ? moment(date) : null);

	const isHighlightDetailIndefinitely =
		!highlightDetails?.start_date && !highlightDetails?.end_date;
	const isHighlightDateSelected =
		highlightDetails?.start_date && highlightDetails?.end_date;
	const selectedHighlightStartDate = getDate(highlightDetails?.start_date);
	const selectedHighlightEndDate = getDate(highlightDetails?.end_date);

	const defaultAnnouncementType = [
		'updates',
		'listing',
		'events',
		'news',
		'more',
		'custom',
	];

	const filteredPopupAnnouncement = getAnnouncements?.filter(
		(data) => data?.is_popup
	);
	const filteredTopbarAnnouncement = getAnnouncements?.filter(
		(data) => data?.is_navbar
	);

	const getAnnouncement = async () => {
		try {
			const detail = await getAdminAnnouncement();
			setAppAnnouncements(detail?.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getAnnouncement();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setSelectedHighlightPopup(filteredPopupAnnouncement[0]);
		setSelectedHighlightTopbar(filteredTopbarAnnouncement[0]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getAnnouncements]);

	useEffect(() => {
		setSelectedHighlightLifeSpan({
			isDisplayPopupIndefinitely: isHighlightDetailIndefinitely,
			isPopupSelectRange: isHighlightDateSelected,
		});
	}, [isHighlightDateSelected, isHighlightDetailIndefinitely]);

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

	const onHandleRemoveAnnouncement = (detail) => {
		setIsRemoveAnnouncement(true);
		setSelectedAnnouncement(detail);
	};

	const removeDetail = async () => {
		const { id } = selectedAnnouncement;
		const filteredDetail = getAnnouncements?.filter((data) => {
			return data.id !== id;
		});
		try {
			setAppAnnouncements(filteredDetail);
			await deleteAdminAnnouncementDetail({ id });
			message.success('Announcement Removed successfully');
		} catch (error) {
			console.error(error);
		}
		setIsRemoveAnnouncement(false);
	};

	const onHandleSubmitAnnouncement = async () => {
		if (isDisplayAddDetailPopup) {
			try {
				await setAdminAnnouncementDetails(addAnnouncement);
				await getAnnouncement();
				message.success('Announcement Added successfully');
			} catch (error) {
				console.error(error);
			}
			setIsDisplayAddDetailPopup(false);
		} else {
			editDetail(selectedAnnouncement);
			setIsDisplayEditAnnouncement(false);
		}
	};

	const onHandleToggle = (detail) => {
		const updatedDetail = {
			...detail,
			is_dropdown: !detail?.is_dropdown,
		};
		editDetail(updatedDetail);
	};

	const editDetail = async (filteredDetails) => {
		const filteredAnnouncement = getAnnouncements?.filter((detail) => {
			return detail?.id !== filteredDetails?.id;
		});
		const editedAnnouncementDetails = [
			filteredDetails,
			...filteredAnnouncement,
		]?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

		try {
			await editAdminAnnouncementDetails(filteredDetails);
			setAppAnnouncements(editedAnnouncementDetails);
			message.success('Updated successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const updateAnnouncement = (field, value) => {
		const updateFunc = isDisplayAddDetailPopup
			? setAddAnnouncement
			: setSelectedAnnouncement;
		updateFunc((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleDateUpdate = (dates) => ({
		start_date: dates?.[0] || null,
		end_date: dates?.[1] || null,
	});

	const onHandleHighlightDateSelect = (dates) => {
		const updateDates = handleDateUpdate(dates);

		if (renderHighlightAnnouncement?.isHighlightPopup) {
			setSelectedHighlightPopup((prev) => ({ ...prev, ...updateDates }));
		} else if (renderHighlightAnnouncement?.isHighlightTopbar) {
			setSelectedHighlightTopbar((prev) => ({ ...prev, ...updateDates }));
		}
	};

	const onHandleHighlightDetail = (e) => {
		const { id } = e.target;
		const isIndefinitely = id === 'recent';

		setSelectedHighlightLifeSpan({
			isDisplayPopupIndefinitely: isIndefinitely,
			isPopupSelectRange: !isIndefinitely,
		});

		if (isIndefinitely) {
			const updateDates = { start_date: null, end_date: null };
			if (renderHighlightAnnouncement?.isHighlightPopup) {
				setSelectedHighlightPopup((prev) => ({ ...prev, ...updateDates }));
			} else {
				setSelectedHighlightTopbar((prev) => ({ ...prev, ...updateDates }));
			}
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
			'select dropdown': () => updateAnnouncement('is_dropdown', data),
			default: () => updateAnnouncement('type', data),
		};

		(handlers[text] || handlers['default'])();
	};

	const onHandleProceed = () => {
		if (renderHighlightAnnouncement?.isHighlightPopup) {
			editDetail(selectedHighlightPopup);
			setRenderHighlightAnnouncement((prev) => ({
				...prev,
				isHighlightPopup: false,
			}));
		} else if (renderHighlightAnnouncement?.isHighlightTopbar) {
			editDetail(selectedHighlightTopbar);
			setRenderHighlightAnnouncement((prev) => ({
				...prev,
				isHighlightTopbar: false,
			}));
		}
	};

	const onHandleSelectedAnnouncement = (detail) => {
		setSelectedAnnouncement(detail);
		setIsDisplayEditAnnouncement(true);
	};

	const onHandleConfigure = (text) => {
		if (text === 'highlight popup') {
			setRenderHighlightAnnouncement((prev) => ({
				...prev,
				isHighlightPopup: true,
			}));
		} else if (text === 'highlight topbar') {
			setRenderHighlightAnnouncement((prev) => ({
				...prev,
				isHighlightTopbar: true,
			}));
		}
	};

	const onHandleBack = () => {
		if (isDisplayAddDetailPopup) {
			setIsDisplayAddDetailPopup(false);
			setAddAnnouncement({
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
		setSelectedAnnouncementType(null);
	};

	const onHandleOpenPopup = () => {
		setIsDisplayAddDetailPopup(true);
		setSelectedAnnouncementType(null);
	};

	const onHandleNavigate = () => {
		setIsAdminAnnouncementFeature(true);
		browserHistory.push('/admin/general');
	};

	const onHandleDropdownConfigure = () => {
		setIsDropdownAnnouncementPopup(true);
	};

	const onHandleHighlightAnnouncement = (id) => {
		const filteredAnnuouncement = getAnnouncements?.filter(
			(data) => data?.id === id
		);
		renderHighlightAnnouncement?.isHighlightPopup
			? setSelectedHighlightPopup(filteredAnnuouncement[0])
			: setSelectedHighlightTopbar(filteredAnnuouncement[0]);
	};

	const onHandleAnnouncementDetails = (value) => {
		renderHighlightAnnouncement?.isHighlightPopup
			? setSelectedHighlightPopup((prev) => ({
					...prev,
					is_popup: value,
			  }))
			: setSelectedHighlightTopbar((prev) => ({
					...prev,
					is_navbar: value,
			  }));
	};

	const onHandleHighlightPopupClose = () => {
		if (renderHighlightAnnouncement?.isHighlightPopup) {
			setRenderHighlightAnnouncement((prev) => ({
				...prev,
				isHighlightPopup: false,
			}));
			setSelectedHighlightPopup(filteredPopupAnnouncement[0]);
		} else if (renderHighlightAnnouncement?.isHighlightTopbar) {
			setRenderHighlightAnnouncement((prev) => ({
				...prev,
				isHighlightTopbar: false,
			}));
			setSelectedHighlightTopbar(filteredTopbarAnnouncement[0]);
		}
	};

	const isEnterpriseUpgrade = handleEnterpriseUpgrade(constants?.info);

	const selectedAnnouncementDetail = isDisplayAddDetailPopup
		? addAnnouncement
		: selectedAnnouncement;

	const highlightDateRange = [
		selectedHighlightStartDate,
		selectedHighlightEndDate,
	];

	const selectedType = isDisplayAddDetailPopup
		? addAnnouncement?.type
		: defaultAnnouncementType?.filter(
				(data) =>
					data?.toLowerCase() === selectedAnnouncement?.type?.toLowerCase()
		  );

	const isDisabled =
		!selectedAnnouncementDetail?.title ||
		!selectedAnnouncementDetail?.message ||
		!selectedAnnouncementDetail?.type;

	const isDisplayLifeSpanAnnouncement =
		renderHighlightAnnouncement?.isHighlightPopup ||
		renderHighlightAnnouncement?.isHighlightTopbar;

	const isDisabledHighlightProceed =
		!highlightDetails?.title ||
		(selectHighlightLifeSpan?.isPopupSelectRange &&
			!highlightDetails?.start_date) ||
		(selectHighlightLifeSpan?.isDisplayPopupIndefinitely &&
			!isHighlightDetailIndefinitely);

	return (
		<div
			className={
				constants?.features?.announcement
					? 'w-100 pb-5 announcement-wrapper'
					: 'w-100 pb-5 announcement-wrapper announcement-wrapper-disabled'
			}
		>
			<Modal
				visible={isDisplayRemoveAnnouncement}
				className="bg-model blue-admin-billing-model admin-announcement-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => setIsRemoveAnnouncement(false)}
				footer={null}
			>
				<div className="announcement-life-span-popup-container">
					<span className="title">
						Are you sure you want to remove this announcement?
					</span>
					<div className="button-container">
						<Button
							type="primary"
							onClick={() => setIsRemoveAnnouncement(false)}
							className="green-btn"
							size="medium"
						>
							Back
						</Button>
						<Button
							type="primary"
							onClick={() => removeDetail()}
							className="green-btn"
							size="medium"
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isDropdownAnnouncementpopup}
				className="bg-model blue-admin-billing-model admin-announcement-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => setIsDropdownAnnouncementPopup(false)}
				footer={null}
			>
				<div className="announcement-life-span-popup-container">
					<div className="title font-weight-bold">Select Announcement</div>
					<div className="d-flex flex-column mt-2">
						<span>Select the announcement you'd like to display.</span>
						<span>
							These will be displayed within the drop down in the main
							navigation bar.
						</span>
					</div>

					<div className="select-announcement-wrapper">
						<span>Select Announcement</span>
						<div className="announcement-details mt-2">
							{getAnnouncements?.map((data) => {
								return (
									<span
										key={data?.title}
										className={
											data?.is_dropdown
												? 'd-flex justify-content-between align-items-center caps-first'
												: 'd-flex justify-content-between align-items-center disabled-announcement caps-first'
										}
									>
										<label>{data?.title}</label>
										<input
											type="checkbox"
											checked={!!data?.is_dropdown || false}
											onChange={() => onHandleToggle(data)}
										/>
									</span>
								);
							})}
						</div>
					</div>
					<div className="button-container">
						<Button
							type="primary"
							onClick={() => setIsDropdownAnnouncementPopup(false)}
							className="green-btn"
							size="medium"
						>
							Back
						</Button>
						<Button
							type="primary"
							onClick={() => setIsDropdownAnnouncementPopup(false)}
							className="green-btn"
							size="medium"
						>
							Proceed
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isDisplayLifeSpanAnnouncement}
				className="bg-model blue-admin-billing-model admin-announcement-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => onHandleHighlightPopupClose()}
				footer={null}
			>
				<div className="announcement-life-span-popup-container">
					<div className="d-flex flex-column mt-2">
						<span className="title font-weight-bold">
							Highlight Announcement
						</span>
						<span>
							Select the announcement you'd like to highlight as a{' '}
							<b>
								{renderHighlightAnnouncement?.isHighlightPopup
									? 'Popup'
									: 'Topbar'}
							</b>
						</span>
						<Select
							className="my-2"
							size="middle caps-first"
							value={highlightDetails?.title}
							onChange={(value) => onHandleHighlightAnnouncement(value)}
							placeholder="Select Announcement"
						>
							{getAnnouncements?.map((data, index) => {
								return (
									<Select.Option
										key={index}
										value={data?.id}
										className="caps-first"
									>
										{data?.title}
									</Select.Option>
								);
							})}
						</Select>
					</div>
					<div className="title font-weight-bold mt-3">Life Span</div>
					<div className="description-text mt-2">
						The length of time the recent announcement will be displayed to the
						user
					</div>
					<div className="announcement-display-option mt-2">
						<input
							type="radio"
							id="recent"
							name="recentAnnouncement"
							checked={!!selectHighlightLifeSpan?.isDisplayPopupIndefinitely}
							onChange={onHandleHighlightDetail}
						/>
						<label className="ml-1" htmlFor="recent">
							Show the announcement indefinitely
						</label>
					</div>
					<div className="mt-2 announcement-display-option ">
						<input
							type="radio"
							id="selectDate"
							name="dateRangeAnnouncement"
							checked={!!selectHighlightLifeSpan?.isPopupSelectRange}
							onChange={onHandleHighlightDetail}
						/>
						<label className="ml-1" htmlFor="selectDate">
							Select date
						</label>
						<div>
							<RangePicker
								size="small"
								value={highlightDateRange}
								onChange={(dates) => onHandleHighlightDateSelect(dates)}
							/>
						</div>
					</div>
					<div className="d-flex flex-column mt-3">
						<span className="font-weight-bold">Display</span>
						<span className="mt-2">
							Set if you'd like to display the announcement
						</span>
						<div className="d-flex mt-2">
							<input
								id="announcementCheckbox"
								type="checkbox"
								checked={
									renderHighlightAnnouncement?.isHighlightPopup
										? !!highlightDetails?.is_popup
										: !!highlightDetails?.is_navbar
								}
								onChange={() =>
									onHandleAnnouncementDetails(
										renderHighlightAnnouncement?.isHighlightPopup
											? !highlightDetails?.is_popup
											: !highlightDetails?.is_navbar
									)
								}
							/>
							<label htmlFor="announcementCheckbox" className="ml-2">
								Yes, display this announcement.
							</label>
						</div>
					</div>
					<div className="button-container">
						<Button
							type="primary"
							onClick={() => onHandleHighlightPopupClose()}
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
							disabled={isDisabledHighlightProceed}
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
					<div className="title font-weight-bold">
						{isDisplayAddDetailPopup ? 'Add' : 'Edit'} Announcement Details
					</div>
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
					<div className="mt-3 d-flex flex-column">
						<span className="font-weight-bold">Message/Content:</span>
						<div className="d-flex link-description">
							<ReactSVG
								src={STATIC_ICONS.BLUE_SCREEN_LINK}
								className="link-icon"
							/>
							<span className="mt-2">
								(Note: Adding links will require adding https://)
							</span>
						</div>
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
						<div className="d-flex announcement-display-feature mt-3">
							<input
								type="checkbox"
								checked={!!selectedAnnouncementDetail?.is_dropdown}
								onChange={() =>
									onHandleChange(
										!selectedAnnouncementDetail?.is_dropdown,
										'select dropdown'
									)
								}
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
					{activeTab === 'active announcement' && (
						<div>
							<div>
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
								<div className="d-flex justify-content-between w-100 mt-3">
									<div className="d-flex flex-column">
										<span className="font-weight-bold">
											Active announcements
										</span>
										<span>
											Below are active announcements. You can add an
											announcement{' '}
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
											onHandleRemoveAnnouncement,
											onHandleSelectedAnnouncement
										)}
										dataSource={getAnnouncements}
										rowKey={(data) => {
											return data.id;
										}}
									/>
								</div>
							</div>
						</div>
					)}
					{activeTab === 'display location' && (
						<div className="w-100 mt-3">
							<div className="display-title">
								<span className="font-weight-bold ">
									Announcement Display Options
								</span>
								<span>
									Control where your announcements are displayed to the user
								</span>
							</div>
							<div className="display-title mt-5">
								<span className="font-weight-bold">Highlight Announcement</span>
								<span>
									Select a announcement that you'd like to highlight for a set
									period of time.
								</span>
							</div>
							<div className="announcement-filters">
								<div className="d-flex announcement-display-feature mt-3 mr-3">
									<div className="feature-trade-box">
										<ReactSVG
											src={STATIC_ICONS.POPUP_ANNOUNCEMENT}
											className="feature-icon popup-feature-icon w-100 mr-1"
										/>
									</div>
									<div className="announcement-features">
										<span className="font-weight-bold">
											Highlight as a Pop up
										</span>
										<span>(As a pop-up upon login)</span>
										{selectedHighlightPopup &&
											filteredPopupAnnouncement[0]?.is_popup && (
												<div>
													<div className="d-flex mt-2">
														<span>Announcement: </span>
														<span className="ml-1">
															{selectedHighlightPopup?.title}
														</span>
													</div>
													<div className="mt-1 d-flex">
														<span>Time:</span>
														{!selectedHighlightPopup?.start_date ? (
															<div className="ml-1">Show ∞ indefinitely</div>
														) : (
															<div className="ml-1">
																Show from{' '}
																{getFormattedDate(
																	selectedHighlightPopup?.start_date
																)}{' '}
																to{' '}
																{getFormattedDate(
																	selectedHighlightPopup?.end_date
																)}
															</div>
														)}
													</div>
													<div className="d-flex">
														<span>Display: </span>
														<span className="ml-1">ON</span>
													</div>
												</div>
											)}
										<div className="mt-3">
											<Button
												type="primary"
												onClick={() => onHandleConfigure('highlight popup')}
												className="green-btn ml-1"
												size="small"
											>
												Configure
											</Button>
										</div>
									</div>
								</div>
								<div className="d-flex announcement-display-feature mt-3 mr-3">
									<div className="feature-trade-box">
										<ReactSVG
											src={STATIC_ICONS.TOP_BAR_ANNOUNCEMENT}
											className="feature-icon w-100 mr-1"
										/>
									</div>
									<div className="announcement-features">
										<span className="font-weight-bold">
											Highlight Top of page
										</span>
										<span>
											(Bar at the very top of the page, above main nav)
										</span>
										{selectedHighlightTopbar &&
											filteredTopbarAnnouncement[0]?.is_navbar && (
												<div>
													<div className="d-flex mt-2">
														<span>Announcement: </span>
														<span className="ml-1">
															{selectedHighlightTopbar?.title}
														</span>
													</div>
													<div className="mt-1 d-flex">
														<span>Time:</span>
														{!selectedHighlightTopbar?.start_date ? (
															<div className="ml-1">Show ∞ indefinitely</div>
														) : (
															<div className="ml-1">
																Show from{' '}
																{getFormattedDate(
																	selectedHighlightTopbar?.start_date
																)}{' '}
																to{' '}
																{getFormattedDate(
																	selectedHighlightTopbar?.end_date
																)}
															</div>
														)}
													</div>
													<div className="d-flex">
														<span>Display: </span>
														<span className="ml-1">ON</span>
													</div>
												</div>
											)}
										<div className="mt-3">
											<Button
												type="primary"
												onClick={() => onHandleConfigure('highlight topbar')}
												className="green-btn ml-1"
												size="small"
											>
												Configure
											</Button>
										</div>
									</div>
								</div>
								<span className="line-separator"></span>
							</div>
							<div className="display-title mt-5">
								<span className="font-weight-bold">Dropdown</span>
								<span>
									All announcements can be viewed on the top Main navigation bar
									within a drop down.
								</span>
							</div>
							<div className="announcement-filters">
								<div className="d-flex announcement-display-feature mt-3">
									<div className="feature-trade-box">
										<ReactSVG
											src={STATIC_ICONS.NAV_BAR_ANNOUNCEMENT}
											className="feature-icon w-100 mr-1"
										/>
									</div>
									<div className="d-flex flex-column">
										<div className="announcement-features">
											<span>
												<span className="font-weight-bold">
													Main Navigation{' '}
												</span>
												(On by default)
											</span>
											<span>(Top main navigation bar)</span>
										</div>
										<div className="announcement-features mt-3">
											<span className="font-weight-bold">
												ANNOUNCEMENT ADDED TO DROP DOWN:
											</span>
											<div className="selected-dropdown-announcement-wrapper">
												{highlightDropdowndetails?.map((data) => (
													<span className="caps-first">{data?.title}</span>
												))}
											</div>
										</div>
										<div className="mt-3">
											<Button
												type="primary"
												onClick={() => onHandleDropdownConfigure()}
												className="green-btn ml-1"
												size="small"
											>
												Configure
											</Button>
										</div>
									</div>
								</div>
								<span className="line-separator"></span>
							</div>
							<div className="display-title mt-5">
								<span>
									Want to turn the visibility off for all announcement?
								</span>
								<span>
									Adjust visibility on the
									<span
										className="text-decoration-underline ml-2 pointer"
										onClick={() => onHandleNavigate()}
									>
										Features page.
									</span>
								</span>
							</div>
						</div>
					)}
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
	getAnnouncements: state.app.announcements,
});

const mapDispatchToProps = (dispatch) => ({
	setAppAnnouncements: bindActionCreators(setAppAnnouncements, dispatch),
	setIsAdminAnnouncementFeature: bindActionCreators(
		setIsAdminAnnouncementFeature,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminAnnouncement);
