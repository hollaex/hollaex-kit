import React from 'react';
import { Field } from 'redux-form';
import {
	renderSelectField,
	renderNumberField,
	renderDateField,
	renderRangeField,
	renderInputField
} from './fields';
import { FileField } from './FileField';
import CaptchaField from './captchaField';

const renderFields = (fields) => {
	return (
		<div>
			{Object.keys(fields).map((key) => {
				const field = fields[key];
				const options = {
					...field,
					validate: field.validate || [],
					name: key,
					key
				};

				let component;
				switch (field.type) {
					case 'select':
						component = renderSelectField;
						break;
					case 'number':
						component = renderNumberField;
						break;
					case 'date':
						component = renderDateField;
						break;
					case 'range':
						component = renderRangeField;
						break;
					case 'captcha':
						component = CaptchaField;
						break;
					case 'file':
						component = FileField;
						break;
					case 'password':
					case 'input':
					case 'email':
					default:
						component = renderInputField;
						break;
				}
				return <Field component={component} {...options} />;
			})}
		</div>
	);
};

export default renderFields;
