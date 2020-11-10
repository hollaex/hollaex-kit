import React from 'react';
import { reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { getErrorLocalized } from '../../utils/errors';
import {
	required,
	minValue,
	maxValue,
} from '../../components/Form/validations';
import { IconTitle, Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const fields = {
	order_portfolio_percentage: {
		type: 'number',
		label: STRINGS['USER_SETTINGS.ORDER_PORTFOLIO_LABEL'],
		validate: [required, minValue(1), maxValue(100)],
		min: 1,
		max: 100,
		fullWidth: true,
	},
};

const Form = ({
	handleSubmit,
	submitting,
	pristine,
	error,
	valid,
	initialValues,
	onClose,
}) => (
	<form onSubmit={handleSubmit}>
		<div className="w-75 my-3">{renderFields(fields)}</div>
		{error && <div className="warning_text">{getErrorLocalized(error)}</div>}
		<div className="d-flex mt-3">
			<Button label={STRINGS['BACK_TEXT']} onClick={onClose} />
			<div className="mx-2"></div>
			<Button
				label={STRINGS['USER_SETTINGS.SET_TXT']}
				disabled={pristine || submitting || !valid}
			/>
		</div>
	</form>
);

const OrderPortfolioForm = reduxForm({
	form: 'WarningForm',
})(Form);

const SetOrderPortfolio = ({ data, icons: ICONS, ...rest }) => {
	const { initialValues = {} } = data;
	const portfolioPercent = initialValues.order_portfolio_percentage
		? `${initialValues.order_portfolio_percentage}%`
		: '';

	return (
		<div className="portfolio-wrapper">
			<IconTitle
				stringId="USER_SETTINGS.CREATE_ORDER_WARING"
				text={STRINGS['USER_SETTINGS.CREATE_ORDER_WARING']}
				iconId="SETTING_RISK_ADJUST_ICON"
				iconPath={ICONS['SETTING_RISK_ADJUST_ICON']}
				textType="title"
				underline={true}
			/>
			<div className="mt-1">
				{STRINGS.formatString(
					STRINGS['USER_SETTINGS.CREATE_ORDER_WARING_TEXT'],
					portfolioPercent
				).join('')}
			</div>
			<OrderPortfolioForm {...data} {...rest} />
		</div>
	);
};

export default withConfig(SetOrderPortfolio);
