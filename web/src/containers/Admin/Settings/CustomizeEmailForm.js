import React, { useCallback, useEffect, useState } from 'react';
import { Button, Select, Form, Input, message, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import _isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';

import { updateEmailStrings } from '../General/action';
import { STATIC_ICONS } from 'config/icons';

const { TextArea } = Input;
const { Option } = Select;

const CustomizeEmailForm = ({
	emailInfo,
	requestEmail,
	selectedLanguages,
	defaultLanguage,
	emailType,
	defaultEmailData,
}) => {
	const [form] = Form.useForm();
	const [isDisable, setIsDisable] = useState(false);
	const [isEmailTypeActive, setEmailTypeActive] = useState(false);
	const [emailOptions, setEmailOptions] = useState(emailType);
	const [selectedEmail, setSelectedEmail] = useState(emailType[0]);
	const [buttonSubmitting, setButtonSubmitting] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);
	const [formData, setFormData] = useState({});
	const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
	const [lastEdit, setLastEdit] = useState(moment().format('DD/MM/YYYY'));
	const [modalType, setModalType] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const [isReset, setIsReset] = useState(false);

	const initialValues = {
		language: defaultLanguage,
		mailType: emailType[0],
	};

	let originalInitialValue = {
		...initialValues,
		format: defaultEmailData.html.replace(/@@_BIT_@@/g, "'"),
		title: defaultEmailData.title,
	};

	useEffect(() => {
		if (form.getFieldsValue().hasOwnProperty('mailType') && selectedEmail) {
			form.setFieldsValue({ mailType: selectedEmail });
		}
	}, [form, selectedEmail]);

	useEffect(() => {
		setButtonSubmitting(true);
	}, []);

	const mailType = form.getFieldValue('mailType');
	useEffect(() => {
		if (
			typeof form.getFieldsValue().format !== 'undefined' &&
			typeof form.getFieldsValue().title !== 'undefined' &&
			!_isEqual(form.getFieldsValue(), originalInitialValue)
		) {
			setButtonSubmitting(false);
		} else {
			setButtonSubmitting(true);
		}
		// eslint-disable-next-line
	}, [mailType]);

	const constructedData = useCallback(() => {
		if (emailInfo && emailInfo.html) {
			let replacedJSON = emailInfo.html.replace(/@@_BIT_@@/g, "'");
			form.setFieldsValue({
				format: replacedJSON,
			});
			form.setFieldsValue({ title: emailInfo.title });
		}
	}, [emailInfo, form]);

	useEffect(() => {
		constructedData();
	}, [constructedData]);

	const handleConfirmOpen = (type) => {
		setModalVisible(!isModalVisible);
		if (type) {
			setModalType(type);
		}
	};

	const handleSubmit = (formProps) => {
		handleConfirmOpen('save');
		setFormData(formProps);
	};

	const handleDisable = () => {
		if (isEdit) {
			setIsDisable(!isDisable);
			setIsReset(true);
		} else {
			setIsDisable(!isDisable);
		}
	};

	const handleSearch = (e) => {
		if (e.target.value) {
			const filterData = emailOptions.filter((data) =>
				data.includes(e.target.value.toUpperCase())
			);
			setEmailOptions(filterData);
		} else {
			setEmailOptions(emailType);
		}
	};

	const handleOpenOption = () => {
		setEmailTypeActive(!isEmailTypeActive);
		setEmailOptions(emailType);
	};

	const handleSelectEmail = (option) => {
		if (option) {
			setSelectedEmail(option);
			requestEmail({
				language: selectedLanguage,
				type: option.toLowerCase(),
			});
			handleOpenOption();
		}
	};

	const handleSelectLanguage = (selectedLanguage) => {
		setSelectedLanguage(selectedLanguage);
		requestEmail({
			language: selectedLanguage,
			type: selectedEmail.toLowerCase(),
		});
	};

	const handleReset = () => {
		setIsEdit(false);
		setIsReset(false);
		setIsDisable(false);
		handleConfirmOpen();
	};

	const handleConfirmation = (formProps) => {
		const { language, mailType, format, title } = formProps;
		const body = {
			language,
			type: mailType.toLowerCase(),
			html: format.replace(/"/g, "'"),
			title,
		};
		setButtonSubmitting(true);
		updateEmailStrings(body)
			.then((res) => {
				message.success('Updated successfully');
				requestEmail({
					language: body.language,
					type: body.type,
				});
				handleDisable();
				setLastEdit(moment().format('DD/MM/YYYY HH:mm UTC'));
				setIsEdit(true);
				handleConfirmOpen();
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				handleConfirmOpen();
			});
	};

	const renderModalContent = (formProps, modalType) => {
		if (modalType === 'reset-email') {
			return (
				<div className="confirm_modal_wrapper">
					<div className="heading"> Reset email</div>
					<div>Reset this email to the default state.</div>
					<div className="box-container">
						{' '}
						Email to reset: {formData.mailType}{' '}
					</div>
					<div className="mb-5">
						Are you sure you want to reset this email to its original state?
					</div>
					<div className="btn-wrapper">
						<Button type="primary" onClick={handleConfirmOpen}>
							Back
						</Button>
						<Button type="primary" onClick={handleReset}>
							Confirm
						</Button>
					</div>
				</div>
			);
		} else {
			return (
				<div className="confirm_modal_wrapper">
					<div className="heading">Check and confirm</div>
					<div>
						After confirming the changes they will be saved and visible in
						future emails sent to your users.
					</div>
					<div className="mb-4 mt-4">
						<b>Email preview</b>
						<TextArea rows={10} value={formProps.format} />
					</div>
					<div className="mb-4 mt-4">
						Are you sure you want to save and apply the changes?
					</div>
					<div className="btn-wrapper">
						<Button type="primary" onClick={handleConfirmOpen}>
							Back
						</Button>
						<Button
							type="primary"
							onClick={() => handleConfirmation(formProps)}
							disabled={buttonSubmitting}
						>
							Confirm
						</Button>
					</div>
				</div>
			);
		}
	};

	const onValuesChange = () => {
		if (!_isEqual(form.getFieldsValue(), originalInitialValue)) {
			setButtonSubmitting(false);
		} else {
			setButtonSubmitting(true);
		}
	};

	const onChange = debounce(() => onValuesChange(), 500);

	useEffect(() => {
		if (form.getFieldsValue().hasOwnProperty('mailType') && selectedEmail) {
			form.setFieldsValue({ mailType: selectedEmail });
		}
	}, [form, selectedEmail]);

	useEffect(() => {
		setButtonSubmitting(true);
	}, []);

	return (
		<div className="custom-email-wrapper">
			<Form
				form={form}
				name="EditEmailForm"
				onFinish={handleSubmit}
				initialValues={initialValues}
				onValuesChange={onChange}
			>
				<div className="sub-title">Language</div>
				<Form.Item name="language">
					<Select
						placeholder="Select the language"
						className="user-search-field"
						onChange={handleSelectLanguage}
					>
						{selectedLanguages.map((language) => (
							<Option key={language.value} value={language.value}>
								{language.label}
							</Option>
						))}
					</Select>
				</Form.Item>
				<div className="sub-title">Email type to edit</div>
				{!isEmailTypeActive ? (
					<Form.Item
						name="mailType"
						rules={[
							{
								required: true,
								message: 'Please enter the mail type',
							},
						]}
					>
						<Select
							placeholder="Select the mail type"
							className="user-search-field"
							onClick={handleOpenOption}
						>
							{emailOptions.map((value, index) => (
								<Option key={index}>{value}</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					<div className="option-wrapper">
						<div className="d-flex justify-content-between">
							<div className="first-title">Select email to customize</div>
							<CloseOutlined
								style={{ fontSize: '15px', height: '18px' }}
								onClick={handleOpenOption}
							/>
						</div>
						<div className="mb-1">Select an email:</div>
						<Input placeholder={'Search email'} onChange={handleSearch} />
						<div className="mt-3">Emails:</div>
						<div className="email-option-wrapper">
							<div className="table-header">
								<div>TYPE</div>
								<div>PREVIEW</div>
							</div>
							<div className="overflow">
								{emailOptions.map((emailOption, index) => {
									// const preview = emailInfo[selectedLanguages[0].value][emailOption] && emailInfo[selectedLanguages[0].value][emailOption].BODY ? emailInfo[selectedLanguages[0].value][emailOption].BODY[1] : '';
									return (
										<div
											key={index}
											className="email-option"
											onClick={() => handleSelectEmail(emailOption)}
										>
											<div className="d-flex">
												<div className="w-50">{emailOption}</div>
												<div className="w-50 preview_text">
													{/* {preview} */}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
				<div className="sub-title">Title</div>
				<div>
					<Form.Item name="title">
						<Input />
					</Form.Item>
				</div>
				<div className="sub-title">HTML content</div>
				<div className="text-area">
					<Form.Item name="format">
						<TextArea placeholder="format" rows={20} disabled={!isDisable} />
					</Form.Item>
				</div>
				<div
					className={
						isDisable ? 'footer-section border-none' : 'footer-section'
					}
				>
					<div className="d-flex align-items-end">
						{isDisable ? (
							<div onClick={handleDisable}>
								<div className="anchor">CANCEL</div>
							</div>
						) : (
							<div
								className="d-flex align-items-center"
								onClick={handleDisable}
							>
								<div className="anchor">EDIT EMAIL</div>
								<img
									src={STATIC_ICONS.EDIT_PENCIL_ICON}
									alt="edit_pen"
									className="edit-pen-icon"
								/>
							</div>
						)}
						{isEdit && (
							<div className="small-text">
								<div>
									Last edit: <span>{lastEdit}</span>
								</div>
							</div>
						)}
						{isReset && (
							<div
								className="small-text anchor"
								onClick={() => handleConfirmOpen('reset-email')}
							>
								<div>RESET TO DEFAULT</div>
							</div>
						)}
					</div>
				</div>
				<Button
					type="primary"
					className="green-btn"
					htmlType="submit"
					disabled={buttonSubmitting}
				>
					Save
				</Button>
			</Form>
			<Modal
				visible={isModalVisible}
				footer={null}
				onCancel={handleConfirmOpen}
			>
				{renderModalContent(formData, modalType)}
			</Modal>
		</div>
	);
};

export default CustomizeEmailForm;
