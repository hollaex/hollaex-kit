import React from 'react';
import { Field } from 'redux-form';

import InputField from './TradeFormFields/InputField';
import ChoiceSelector from './TradeFormFields/ChoiceSelector';
import TabSelector from './TradeFormFields/TabSelector';
import Slider from './TradeFormFields/Slider';
import CheckField from './FormFields/CheckField';
import DropDown from './TradeFormFields/DropDown';

const renderFields = ([key, values], index) => {
	const props = {
		...values,
	};

	switch (values.type) {
		case 'select':
			props.component = ChoiceSelector;
			break;
		case 'tab':
			props.component = TabSelector;
			break;
		case 'slider':
			props.component = Slider;
			break;
		case 'checkbox':
			props.component = CheckField;
			break;
		case 'dropdown':
			props.component = DropDown;
			break;
		default:
			props.component = InputField;
			break;
	}

	return <Field {...props} key={index} />;
};

export default renderFields;
