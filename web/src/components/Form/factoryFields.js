import React from 'react';
import { Field } from 'redux-form';
import InputField from './FormFields/InputField';
import TextAreaField from './FormFields/TextAreaField';
import FileField from './FormFields/FileField';
import DropdownField from './FormFields/DropdownField';
import DateField from './FormFields/DateField';
import DropdownDateField from './FormFields/DropdownDateField';
import CheckField from './FormFields/CheckField';
import EditableInputField from './FormFields/EditableInputField';
import CaptchaField from './FormFields/Captcha';
import ToggleField from './FormFields/ToggleField';
import DumbField from './FormFields/DumbFieldForm';

const renderFields = (fields = {}, callback) => {
	return (
		<div>
			{Object.keys(fields).map((key, index) => {
				const { type, validate = [], ishorizontalfield, ...rest } = fields[key];
				const commonProps = {
					callback,
					key,
					name: key,
					type,
					validate,
					ishorizontalfield,
					...rest,
				};

				switch (type) {
					case 'captcha':
						return <Field component={CaptchaField} {...commonProps} />;
					case 'hidden':
						return (
							<Field
								component={() => <div className="hidden" />}
								{...commonProps}
							/>
						);
					case 'file':
						return <Field component={FileField} {...commonProps} />;
					case 'dumb':
						return <Field component={DumbField} {...commonProps} />;
					case 'select':
					case 'autocomplete':
						return (
							<Field
								component={DropdownField}
								autocomplete={type === 'autocomplete'}
								{...commonProps}
							/>
						);
					case 'date-dropdown':
						return <Field component={DropdownDateField} {...commonProps} />;
					case 'date':
						return <Field component={DateField} {...commonProps} />;
					case 'checkbox':
						return <Field component={CheckField} {...commonProps} />;
					case 'editable':
						return <Field component={EditableInputField} {...commonProps} />;
					case 'textarea':
						return <Field component={TextAreaField} {...commonProps} />;
					case 'toggle':
						return <Field component={ToggleField} {...commonProps} />;
					case 'text':
					case 'password':
					case 'email':
					default:
						return <Field component={InputField} {...commonProps} />;
				}
			})}
		</div>
	);
};

export default renderFields;
