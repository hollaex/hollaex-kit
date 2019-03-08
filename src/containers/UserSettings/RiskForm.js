import React from 'react';
import { reduxForm } from 'redux-form';

import { Accordion, Table, Button } from '../../components';
import renderFields from '../../components/Form/factoryFields';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';

export const generateHeaders = (onAdjustPortfolio) => {
	return [
		{
			label: STRINGS.USER_SETTINGS.RISK_MANAGEMENT.PORTFOLIO,
			key: 'percentage',
			renderCell: ({ id, percentage }, key, index) => (
				<td key={`${key}-${id}-percentage`}>
					{percentage}
				</td>
			)
		},
		{
			label: STRINGS.USER_SETTINGS.RISK_MANAGEMENT.TOMAN_ASSET,
			key: 'assetValue',
			renderCell: ({ id, assetValue }, key, index) => (
				<td key={`${key}-${id}-assetValue`}>
					{assetValue}
				</td>
			)
		},
		{
			label: '',
			key: 'adjust',
			className: 'text-center',
			renderCell: ({ id }, key, index) => (
				<td key={`${key}-${id}-adjusted`} className="text-center pointer blue-link" onClick={onAdjustPortfolio}>
					{STRINGS.USER_SETTINGS.RISK_MANAGEMENT.ADJUST}
				</td>
			)
		}
	];
};

export const generateWarningFormValues = () => ({
	popup_warning: {
		type: 'toggle',
		label: STRINGS.USER_SETTINGS.RISK_MANAGEMENT.WARNING_POP_UP,
		className: 'toggle-wrapper'
	}
});

const Form = ({
	handleSubmit,
	submitting,
	pristine,
	error,
	valid,
	initialValues,
	formFields
}) => (
		<form onSubmit={handleSubmit}>
			{renderFields(formFields)}
			{error && <div className="warning_text">{getErrorLocalized(error)}</div>}
			<Button
				className="mt-4"
				label={STRINGS.SETTING_BUTTON}
				disabled={pristine || submitting || !valid}
			/>
		</form>
	);

const WarningForm = reduxForm({
	form: 'WarningForm'
})(Form);

const RiskForm = ({ onAdjustPortfolio, totalAssets, percentageOfPortfolio, ...rest }) => {
	const { initialValues = {} } = rest;
	const assetData = [
		{
			id: 1,
			percentage: initialValues.order_portfolio_percentage ? `${initialValues.order_portfolio_percentage}%` : '',
			assetValue: totalAssets
		}
	];
    const sections = [
        {
            title: STRINGS.USER_SETTINGS.CREATE_ORDER_WARING,
            content: <div>
                <p>{STRINGS.USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT}</p>
				<p>{STRINGS.formatString(STRINGS.USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT_1, totalAssets).join('')}</p>
                <Table
                    rowClassName="pt-2 pb-2"
					headers={generateHeaders(onAdjustPortfolio)}
                    data={assetData}
                    count={1}
                    displayPaginator= {false}
                />
            </div>
        }, {
			title: STRINGS.USER_SETTINGS.RISK_MANAGEMENT.WARNING_POP_UP,
			content: <WarningForm {...rest} />
		}
    ];
    return <Accordion sections={sections} />;
};

export default RiskForm;