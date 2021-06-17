import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Table, Breadcrumb } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
	validateBoolean,
	validateNumber,
	validateRequired,
} from 'components/AdminForm/validations';
import { updateUserMeta, addMeta, deleteMeta, updateMeta } from './actions';
import UserForm from './UserForm';
import AddMetaForm from './AddMetaForm';

const { Item } = Breadcrumb;

const UserMetaForm = ({ constants, userData }) => {
	const [user_meta, setUserMeta] = useState(constants.user_meta);
	const [meta, setMeta] = useState(userData.meta);
	const [isVisible, setVisible] = useState(false);
	const [metaType, setMetaType] = useState('');
	const [modalType, setModalType] = useState('');
	const [formValues, setFormValues] = useState({});
	const [formFields, setFormFields] = useState([]);
	const [btnDisable, setBtnDisable] = useState(false);
	const [isConfigure, setConfigure] = useState(false);

	const columns = [
		{ title: 'Meta Type', dataIndex: 'type', key: 'type' },
		{ title: 'Required', dataIndex: 'required', key: 'required' },
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Description', dataIndex: 'description', key: 'description' },
		{ title: 'Data/input', dataIndex: 'data', key: 'data' },
		{ title: 'Configure', dataIndex: 'configure', key: 'configure' },
	];
	useEffect(() => {
		let deletedFieldData = [];

		Object.keys(meta).forEach((key, index) => {
			if (!Object.keys(user_meta).includes(key) && meta[key]) {
				const field = renderDeletedField(key, meta);
				const firstPart = key.split(' ')[0];
				deletedFieldData = [
					...deletedFieldData,
					{
						field,
						component: UserForm(`${firstPart}_${index}_form`),
					},
				];
			}
		});

		const userMetaFields = user_meta ? Object.keys(user_meta) : [];
		let fieldData = [];
		userMetaFields.forEach((key, index) => {
			const field = renderField(key, user_meta);
			const firstPart = key.split(' ')[0];
			fieldData = [
				...fieldData,
				{
					field,
					component: UserForm(`${firstPart}_${index}_form`),
				},
			];
		});
		setFormFields([...fieldData, ...deletedFieldData]);
	}, [user_meta, meta]);

	const renderDeletedField = (key, meta) => {
		let fieldData = {};
		fieldData[key] = { type: 'boolean', label: `${key} (deleted)` };

		if (
			typeof meta[key] === 'string' &&
			isNaN(parseInt(meta[key])) &&
			Date.parse(meta[key])
		) {
			fieldData[key].type = 'date';
			fieldData[key].dateFormat = 'YYYY-MM-DD h:mm';
			fieldData[key].showTime = true;
			fieldData[key].clearIcon = null;
		} else if (typeof meta[key] === 'boolean') {
			fieldData[key].type = 'boolean';
		} else if (typeof meta[key] === 'number') {
			fieldData[key].type = 'number';
		} else if (typeof meta[key] === 'string') {
			fieldData[key].type = 'input';
		} else if (typeof meta[key] === 'string') {
			fieldData[key].type = 'input';
		}
		return fieldData;
	};

	const renderField = (key, metaDesc) => {
		let fieldData = {};
		const fields = metaDesc[key];
		if (fields && typeof fields === 'object') {
			fieldData[key] = {
				type: fields.type,
				label: fields.required ? (
					<div>
						{key}
						<span className="m-1 required-label">(required)</span>
					</div>
				) : (
					key
				),
				placeholder: key,
				description: fields.description,
			};
			if (fields.type === 'date') {
				fieldData[key].dateFormat = 'YYYY-MM-DD h:mm';
				fieldData[key].showTime = true;
				fieldData[key].clearIcon = null;
			}
			if (fields.required) {
				if (fields.type === 'boolean') {
					fieldData[key].validate = [validateBoolean];
				} else if (fields.type === 'number') {
					fieldData[key].validate = [validateNumber];
				} else {
					fieldData[key].validate = [validateRequired];
				}
			}
		} else {
			fieldData[key] = {
				type: 'text',
				label: key,
				placeholder: key,
				description: fields.description,
			};
			if (fields.required) {
				fieldData[key].validate = [validateRequired];
			}
		}
		return fieldData;
	};

	const addUserMeta = (meta, userData) => {
		const metaField = {
			...meta,
			type: meta.type.toLowerCase(),
		};

		return addMeta(metaField, userData)
			.then((res) => {
				setBtnDisable(false);
				setVisible(false);
				setUserMeta(res);
				message.success('Field added successfully');
			})
			.catch((error) => {
				setBtnDisable(false);
				const messageTxt = error.data ? error.data.message : error.message;
				message.error(messageTxt);
			});
	};
	const onSubmit = (formProps) => {
		if (modalType === 'update_meta') {
			editUserMeta(formProps);
		} else if (modalType === 'add_meta') {
			setBtnDisable(true);
			addUserMeta(formProps, userData);
		}
	};

	const onDeleteUserMeta = (meta, key) => {
		setBtnDisable(true);
		return deleteMeta(meta, key)
			.then((res) => {
				setBtnDisable(false);
				setVisible(false);
				setModalType('');
				setUserMeta(res);
				message.success('Field deleted successfully');
			})
			.catch((error) => {
				setBtnDisable(false);
				const messageTxt = error.data ? error.data.message : error.message;
				message.error(messageTxt);
			});
	};

	const onSaveUserMeta = (formProps, userData) => {
		setBtnDisable(true);
		let data = { meta: formProps };
		if (modalType === 'clear_meta') {
			data = { meta: { [Object.keys(formProps)[0]]: null } };
		}

		return updateUserMeta(data, userData.id)
			.then((res) => {
				setBtnDisable(false);
				setVisible(false);
				setModalType('');
				setMeta(res.meta);
				message.success('Data saved successfully');
			})
			.catch((error) => {
				setBtnDisable(false);
				const messageTxt = error.data ? error.data.message : error.message;
				message.error(messageTxt);
			});
	};
	const editUserMeta = (meta) => {
		const metaField = {
			...meta,
			type: meta.type.toLowerCase(),
		};
		return updateMeta(metaField)
			.then((res) => {
				setBtnDisable(false);
				setVisible(false);
				setModalType('');
				setUserMeta(res);
				message.success('Data saved successfully');
			})
			.catch((error) => {
				setBtnDisable(false);
				const messageTxt = error.data ? error.data.message : error.message;
				message.error(messageTxt);
			});
	};

	const add_meta_field = {
		type: {
			type: 'select',
			options: ['String', 'Boolean', 'Number', 'Date'],
			onSelect: (value) => setMetaType(value),
			validate: validateRequired,
			placeholder: 'Select meta type',
		},
	};
	let updateInitialValue = {};
	if (metaType !== '' || modalType === 'update_meta') {
		add_meta_field.required = {
			type: 'boolean',
			label: 'Required',
			validate: validateBoolean,
		};
		add_meta_field.name = {
			type: 'text',
			label: 'Name',
			disabled: modalType === 'update_meta' ? true : false,
			validate: validateRequired,
		};
		add_meta_field.description = {
			type: 'text',
			label: 'Description',
			validate: validateRequired,
		};
	}
	if (modalType === 'update_meta') {
		updateInitialValue = {
			...Object.values(formValues)[0],
			name: Object.keys(formValues)[0],
		};
	}

	const toggleVisibility = (type, formProps) => {
		setVisible(!isVisible);
		if (type) {
			setModalType(type);
		}
		if (formProps) {
			setFormValues(formProps);
		}
		if (!isVisible) {
			setMetaType('');
		}
	};

	const renderContent = (type, formValues) => {
		switch (type) {
			case 'update_meta':
			case 'add_meta':
				return (
					<AddMetaForm
						add_meta_field={add_meta_field}
						btnDisable={btnDisable}
						metaType={metaType}
						onSubmit={onSubmit}
						isVisible={isVisible}
						toggleVisibility={toggleVisibility}
						initialValues={updateInitialValue}
						isAddMeta={type === 'add_meta' ? true : false}
					/>
				);
			case 'remove_meta':
				let key = Object.keys(formValues)[0];
				return (
					<div className="modal-wrapper">
						<div className="title">Remove Meta</div>
						<div className="box-content my-5">
							<div>
								<b>Name: </b>
								{key}
							</div>
							<div>
								<b>Required: </b>
								{user_meta[key].required.toString()}
							</div>
							<div>
								<b>Description: </b>
								{user_meta[key].description}
							</div>
							<div>
								<b>Type: </b>
								{user_meta[key].type}
							</div>
						</div>
						<div className="d-flex">
							<Button
								type="primary"
								className="green-btn"
								block
								onClick={toggleVisibility}
							>
								Back
							</Button>
							<div className="m-1" />
							<Button
								type="primary"
								onClick={() => onDeleteUserMeta(formValues, key)}
								className="green-btn"
								block
								disabled={btnDisable}
							>
								Confirm
							</Button>
						</div>
					</div>
				);
			case 'clear_meta':
			case 'save_meta':
				let isSaveMeta = type === 'save_meta' ? true : false;
				let name = Object.keys(formValues)[0] || '';
				let formValue = isSaveMeta ? formValues : { [name]: null };
				let data =
					user_meta[name] || renderDeletedField(name, meta)[name] || {};
				let print = {};
				if (data.type === 'string' || data.type === 'input') {
					print = { type: 'text', label: 'String data' };
				} else if (data.type === 'boolean') {
					print = { type: 'boolean', label: 'Boolean state' };
				} else if (data.type === 'date') {
					print = { type: 'date', label: 'Date Selected' };
					formValue = {
						[name]: formValues[name]
							? formValues[name].toString()
							: formValues[name],
					};
				} else if (data.type === 'number') {
					print = { type: 'number', label: 'Number data' };
				}

				return (
					<div className="modal-wrapper">
						<div className="title">
							{isSaveMeta ? 'Save Meta' : 'Clear Meta'}{' '}
						</div>
						<div>
							Are you sure you want to {isSaveMeta ? 'save' : 'clear this meta'}
							?
						</div>
						<div className="small-box my-5">
							<div>
								<b>{print.label}: </b>
								{data.type !== 'date'
									? formValues[name].toString()
									: moment(formValues[name]).format('DD/MMM/YYYY h:mm')}
							</div>
						</div>
						<div className="d-flex">
							<Button
								type="primary"
								className="green-btn"
								block
								onClick={toggleVisibility}
							>
								Back
							</Button>
							<div className="m-1" />
							<Button
								type="primary"
								className="green-btn"
								block
								onClick={() => onSaveUserMeta(formValue, userData)}
								disabled={btnDisable}
							>
								Confirm
							</Button>
						</div>
					</div>
				);
			default:
				return <div></div>;
		}
	};
	const userMetaFields = user_meta ? Object.keys(user_meta) : [];
	let fieldData = [];
	userMetaFields.forEach((key, index) => {
		const currentMeta = user_meta[key];

		fieldData.push({
			name: key,
			description: currentMeta.description,
			required: currentMeta.required.toString(),
			type: currentMeta.type,
			data: meta[key],
			configure: (
				<div>
					<span
						className="info-link"
						onClick={() =>
							toggleVisibility('update_meta', { [key]: currentMeta })
						}
					>
						Edit
					</span>{' '}
					<span
						className="info-link"
						onClick={() =>
							toggleVisibility('remove_meta', { [key]: currentMeta })
						}
					>
						Remove
					</span>
				</div>
			),
		});
	});

	return (
		<div className=" user_meta-form">
			{isConfigure ? (
				<div>
					<Breadcrumb separator={<RightOutlined />}>
						<Item>Home</Item>
						<Item>Users</Item>
						<Item className="info-link" onClick={() => setConfigure(false)}>
							User profile
						</Item>
						<Item>Configure meta</Item>
					</Breadcrumb>
					<div className="d-flex justify-content-between mt-2">
						<div>
							The meta data in the table below will be added to all users. Add
							new meta, edit and remove currently active meta data.
						</div>
						<Button
							type="primary"
							className="green-btn mt-3"
							onClick={() => toggleVisibility('add_meta')}
						>
							Add new meta
						</Button>
					</div>
					<div className="admin-user-container my-2">
						<Table
							className="blue-admin-table"
							columns={columns}
							dataSource={fieldData}
						/>
					</div>
				</div>
			) : (
				<div>
					<div className="mb-3 title">User meta data</div>
					<div className="d-flex justify-content-between">
						<div>
							User meta data To add new meta data to this user you must go to
							the 'Configure Meta' page and click 'Add new meta'.
						</div>
						<Button
							type="primary"
							className="green-btn mt-3"
							onClick={() => setConfigure(true)}
						>
							Configure meta
						</Button>
					</div>
					{formFields.map((data, index) => {
						let Form = data.component;
						let initialValues = {};
						let isRemovable = true;
						Object.keys(data.field).forEach((fieldKey) => {
							initialValues[fieldKey] = meta[fieldKey];
							if (data.field[fieldKey].type === 'date' && meta[fieldKey]) {
								initialValues[fieldKey] = moment(meta[fieldKey]);
							}
							if (
								/* !data.field[fieldKey].description ||  */ data.field[fieldKey]
									.validate ||
								!meta[fieldKey]
							) {
								isRemovable = false;
							}
						});
						return (
							<div key={index} className="user-form-wrapper">
								<div className="w-50">
									<Form
										onSubmit={(formProps) => {
											toggleVisibility('save_meta', formProps);
										}}
										fields={data.field}
										initialValues={initialValues}
										toggleVisibility={toggleVisibility}
										isRemovable={isRemovable}
									/>
									<div className="divider-line"></div>
								</div>
							</div>
						);
					})}
				</div>
			)}
			<Modal visible={isVisible} footer={null} onCancel={toggleVisibility}>
				{renderContent(modalType, formValues)}
			</Modal>
		</div>
	);
};

export default UserMetaForm;
