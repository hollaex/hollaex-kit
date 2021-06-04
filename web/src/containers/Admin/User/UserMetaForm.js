import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { reduxForm, reset } from 'redux-form';

import {
	validateBoolean,
	validateNumber,
	validateRequired,
} from 'components/AdminForm/validations';
import { updateUserMeta, addMeta, deleteMeta } from './actions';
import UserForm from './UserForm';
import renderFields from 'components/AdminForm/utils';
import moment from 'moment';

const UserMetaForm = ({ constants, userData, handleSubmit, onSubmitFail, dispatch }) => {
	const [user_meta, setUserMeta] = useState(constants.user_meta);
	const [meta, setMeta] = useState(userData.meta);
	const [isVisible, setVisible] = useState(false);
	const [metaType, setMetaType] = useState('');
	const [modalType, setModalType] = useState('');
	const [formValues, setFormValues] = useState({});
	const [formFields, setFormFields] = useState([]);
	const [btnDisable, setBtnDisable] = useState(false);

	useEffect(() => {
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
		setFormFields(fieldData);
	}, [user_meta]);

	const renderField = (key, metaDesc) => {
		let fieldData = {};
		const fields = metaDesc[key];
		if (fields && typeof fields === 'object') {
			fieldData[key] = {
				type: fields.type,
				label: fields.required ?
					<div>{key}<span className="m-1 required-label">(required)</span></div>
					: key,
				placeholder: key,
				description: fields.description,
			};
			if (fields.type === 'date') {
				fieldData[key].dateFormat = 'YYYY-MM-DD h:mm';
				fieldData[key].showTime = true;
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
		setBtnDisable(true);
		addUserMeta(formProps, userData);
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

	const add_meta_field = {
		type: {
			type: 'select',
			options: ['String', 'Boolean', 'Number', 'Date'],
			onSelect: (value) => setMetaType(value),
			validate: validateRequired,
			placeholder: 'Select meta type',
		},
	};

	if (metaType !== '') {
		add_meta_field.required = {
			type: 'boolean',
			label: 'Required',
			validate: validateBoolean,
		};
		add_meta_field.name = {
			type: 'text',
			label: 'Name',
			validate: validateRequired,
		};
		add_meta_field.description = {
			type: 'text',
			label: 'Description',
			validate: validateRequired,
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
			onSubmitFail('', dispatch);
		}
	};

	const renderContent = (type, formValues) => {
		switch (type) {
			case 'add_meta':
				return (
					<form onSubmit={handleSubmit} className="modal-wrapper">
						<div className="title">Add new meta</div>
						<div className="w-50">{renderFields(add_meta_field)}</div>
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
								onClick={handleSubmit(onSubmit)}
								className="green-btn"
								block
								disabled={btnDisable || metaType === ""}
							>
								Confirm
							</Button>
						</div>
					</form>
				);
			case 'remove_meta':
				let key = Object.keys(formValues);
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
			case 'save_meta':
				let name = Object.keys(formValues)[0] || '';
				let formValue = formValues
				let data = user_meta[name] || {};
				let print = {};

				if (data.type === 'string') {
					print = { type: 'text', label: 'String data' };
				} else if (data.type === 'boolean') {
					print = { type: 'boolean', label: 'Boolean state' };
				} else if (data.type === 'date') {
					print = { type: 'date', label: 'Date Selected' };
					formValue = { [name]: formValues[name] ? formValues[name].toString() : formValues[name] }
				} else if (data.type === 'number') {
					print = { type: 'number', label: 'Number data' };
				}

				return (
					<div className="modal-wrapper">
						<div className="title">Save Meta</div>
						<div>Are you sure you want to save?</div>
						<div className="small-box my-5">
							<div>
								<b>{print.label}: </b>
								{data.type !== 'date'
									? formValue[name].toString()
									: moment(formValue[name]).format('DD/MMM/YYYY h:mm')}
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

	return (
		<div className="w-50 user_meta-form">
			<div className="mb-3 title">User meta data</div>
			<div>
				Add meta data to this users by clicking{' '}
				<span
					className="anchor"
					onClick={() => toggleVisibility('add_meta')}
				>
					'Add new meta'
				</span>
			</div>
			<Button
				type="primary"
				className="green-btn mt-3"
				onClick={() => toggleVisibility('add_meta')}
			>
				Add new meta
			</Button>
			{formFields.map((data, index) => {
				let Form = data.component;
				let initialValues = {};
				Object.keys(data.field).forEach(
					(fieldKey) => {
						(initialValues[fieldKey] = meta[fieldKey])
						if (data.field[fieldKey].type === 'date') {
							initialValues[fieldKey] = moment(meta[fieldKey])
						}
					}
				);

				return (
					<div key={index} className="user-form-wrapper">
						<div>
							<Form
								onSubmit={(formProps) => {
									toggleVisibility('save_meta', formProps);
								}}
								fields={data.field}
								initialValues={initialValues}
								toggleVisibility={toggleVisibility}
							/>
							<div className="divider-line"></div>
						</div>
					</div>
				);
			})}
			<Modal visible={isVisible} footer={null} onCancel={toggleVisibility}>
				{renderContent(modalType, formValues)}
			</Modal>
		</div>
	);
};

export default reduxForm({
	form: 'AddMetaForm',
	enableReinitialize: true,
	onSubmitFail: (result, dispatch) => dispatch(reset('AddMetaForm')),
})(UserMetaForm);
