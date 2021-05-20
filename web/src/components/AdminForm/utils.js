import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import {
	renderSelectField,
	renderNumberField,
	renderDateField,
	renderRangeField,
	renderInputField,
	renderTextAreaField,
	renderCheckField,
	renderBooleanField,
} from './fields';
import { FileField } from './FileField';
import CaptchaField from './captchaField';
import Editor from './Editor';

const renderFields = (fields, disableAllFields) => {
	return (
		<Fragment>
			{Object.keys(fields).map((key) => {
				const field = fields[key];
				const options = {
					...field,
					validate: field.validate || [],
					name: key,
					key,
					...(disableAllFields ? { disabled: true } : {}),
				};
				if (field.type === 'number') {
					options.parse = (value) =>
						isNaN(Number(value)) ? null : Number(value);
				}

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
					case 'checkbox':
						component = renderCheckField;
						break;
					case 'textarea':
						component = renderTextAreaField;
						break;
					case 'editor':
						component = Editor;
						break;
					case 'boolean':
						component = renderBooleanField;
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
		</Fragment>
	);
};

export default renderFields;
