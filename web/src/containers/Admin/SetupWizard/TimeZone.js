import React, { useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import { Select, Form, Button } from 'antd';

import { minimalTimezoneSet } from '../Settings/Utils';
import LANGUAGES from '../../../config/languages';
import { STATIC_ICONS } from 'config/icons';

const { Item } = Form;
const { Option } = Select;

const renderOptions = (values = []) =>
	values.map((value, index) => (
		<Option key={index} value={value.value}>
			{value.label}
		</Option>
	));

const TimeZone = ({ initialValues, handleNext, updateConstants }) => {
	const [form] = Form.useForm();
	useEffect(() => {
		form.setFieldsValue(initialValues);
	}, [initialValues, form]);
	const handleSubmit = (values) => {
		const formValues = {};
		if (values.language) {
			formValues.kit = {};
			formValues.kit.defaults = {
				language: values.language,
			};
		}
		if (values.timezone) {
			formValues.secrets = {};
			formValues.secrets.emails = {
				timezone: values.timezone,
			};
		}
		updateConstants(formValues, () => handleNext(1));
	};
	return (
		<div>
			<ReactSVG src={STATIC_ICONS.TIMEZONE_WORLD_MAP} className="world-map" />
			<div className="form-wrapper">
				<Form
					name="timezone"
					form={form}
					initialValues={initialValues}
					onFinish={handleSubmit}
				>
					<div className="setup-field-wrapper setup-field-content">
						<div className="setup-field-label">Time zone</div>
						<Item name="timezone">
							<Select>{renderOptions(minimalTimezoneSet)}</Select>
						</Item>
						<div className="setup-field-label">Language</div>
						<Item name="language">
							<Select>{renderOptions(LANGUAGES)}</Select>
						</Item>
					</div>
					<div className="btn-container">
						<Button htmlType="submit">Proceed</Button>
					</div>
					<span className="step-link" onClick={() => handleNext(1)}>
						Skip this step
					</span>
				</Form>
			</div>
		</div>
	);
};

TimeZone.defaultProps = {
	initialValues: {
		timezone: 'UTC',
		language: 'en',
	},
};

export default TimeZone;
