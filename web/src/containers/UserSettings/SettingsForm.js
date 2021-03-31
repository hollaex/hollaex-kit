import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle } from '../../components';
import {
	required,
	minValue,
	maxValue,
	step,
} from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

const orderbook_level_step = 1;
const orderbook_level_min = 1;
const orderbook_level_max = 20;

export const generateFormValues = ({ options = [] }) => ({
	theme: {
		type: 'select',
		stringId: 'SETTINGS_THEME_LABEL',
		label: STRINGS['SETTINGS_THEME_LABEL'],
		options,
		ishorizontalfield: true,
	},
	order_book_levels: {
		type: 'number',
		stringId: 'USER_SETTINGS.ORDERBOOK_LEVEL',
		validate: [
			required,
			minValue(orderbook_level_min),
			maxValue(orderbook_level_max),
			step(orderbook_level_step),
		],
		label: STRINGS['USER_SETTINGS.ORDERBOOK_LEVEL'],
		step: orderbook_level_step,
		min: orderbook_level_min,
		max: orderbook_level_max,
		fullWidth: isMobile,
		// notification: {
		// 		status: 'information',
		// 		iconPath: ICONS.BLUE_PLUS,
		// 		className: 'file_upload_icon',
		// 		useSvg: true,
		// 		onClick: calculateMin
		// 	}
		ishorizontalfield: true,
	},
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
			formFields,
			ICONS,
		} = this.props;
		return (
			<form onSubmit={handleSubmit} className="settings-form-wrapper">
				<div className="settings-form">
					<IconTitle
						stringId="USER_SETTINGS.TITLE_INTERFACE"
						text={STRINGS['USER_SETTINGS.TITLE_INTERFACE']}
						textType="title"
						iconPath={ICONS['SETTING_INTERFACE_ICON']}
					/>
					<div className="pr-3">
						{renderFields(formFields)}
						{error && (
							<div className="warning_text">{getErrorLocalized(error)}</div>
						)}
					</div>
				</div>
				<div className="d-flex align-items-center justify-content-center">
					<EditWrapper stringId="SETTING_BUTTON" />
					<Button
						label={STRINGS['SETTING_BUTTON']}
						disabled={pristine || submitting || !valid}
					/>
				</div>
			</form>
		);
	}
}

export default reduxForm({
	form: 'SettingsForm',
})(Form);
