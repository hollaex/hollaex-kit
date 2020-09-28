import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import {
	required,
	minValue,
	maxValue,
	step
} from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';

const orderbook_level_step = 1;
const orderbook_level_min = 1;
const orderbook_level_max = 20;

export const generateFormValues = () => ({
	theme: {
		type: 'select',
		label: STRINGS["SETTINGS_THEME_LABEL"],
		options: STRINGS["SETTINGS_THEME_OPTIONS"]
	},
	order_book_levels: {
		type: 'number',
		validate: [
			required,
			minValue(orderbook_level_min),
			maxValue(orderbook_level_max),
			step(orderbook_level_step)
		],
		label: STRINGS["USER_SETTINGS.ORDERBOOK_LEVEL"],
		step: orderbook_level_step,
		min: orderbook_level_min,
		max: orderbook_level_max,
		fullWidth: isMobile
		// notification: {
		// 		status: 'information',
		// 		iconPath: ICONS.BLUE_PLUS,
		// 		className: 'file_upload_icon',
		// 		useSvg: true,
		// 		onClick: calculateMin
		// 	}
	}
});

class Form extends Component {
	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(this.props.initialValues) !==
			JSON.stringify(prevProps.initialValues)
		) {
			this.props.initialize(this.props.initialValues);
		}
	}

	render() {
		const {
			handleSubmit,
			submitting,
			pristine,
			error,
			valid,
			formFields
		} = this.props;
		return (
			<form onSubmit={handleSubmit}>
				{renderFields(formFields)}
				{error && (
					<div className="warning_text">{getErrorLocalized(error)}</div>
				)}
				<Button
					label={STRINGS["SETTING_BUTTON"]}
					disabled={pristine || submitting || !valid}
				/>
			</form>
		);
	}
}

export default reduxForm({
	form: 'SettingsForm'
})(Form);
