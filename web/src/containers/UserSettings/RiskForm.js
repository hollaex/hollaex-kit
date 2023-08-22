import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import classnames from 'classnames';
import { Table, Button, IconTitle } from 'components';
import renderFields from 'components/Form/factoryFields';
import STRINGS from 'config/localizedStrings';
import { formatBaseAmount } from 'utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { EditWrapper } from 'components';

const FORM_NAME = 'WarningForm';
const selector = formValueSelector(FORM_NAME);

export const generateHeaders = (onAdjustPortfolio) => {
	return [
		{
			stringId: 'USER_SETTINGS.RISK_MANAGEMENT.PORTFOLIO',
			label: STRINGS['USER_SETTINGS.RISK_MANAGEMENT.PORTFOLIO'],
			key: 'percentage',
			renderCell: ({ id, percentage, status }, key, index) => (
				<td
					key={`${key}-${id}-percentage`}
					className={classnames({ 'half-opacity': !status })}
				>
					<span className={percentage.popupWarning ? '' : 'deactive_risk_data'}>
						{percentage.portfolioPercentage}
						<span
							className={
								percentage.popupWarning
									? 'ml-2 pointer blue-link'
									: 'ml-2 deactive_risk_data'
							}
							onClick={percentage.popupWarning ? onAdjustPortfolio : () => {}}
						>
							<EditWrapper stringId="USER_SETTINGS.RISK_MANAGEMENT.ADJUST">
								{STRINGS['USER_SETTINGS.RISK_MANAGEMENT.ADJUST']}
							</EditWrapper>
						</span>
					</span>
				</td>
			),
		},
		{
			stringId: 'USER_SETTINGS.RISK_MANAGEMENT.VALUE_ASSET',
			label: STRINGS['USER_SETTINGS.RISK_MANAGEMENT.VALUE_ASSET'],
			key: 'assetValue',
			renderCell: ({ id, assetValue, status }, key, index) => (
				<td
					key={`${key}-${id}-assetValue.percentPrice`}
					className={classnames({ 'half-opacity': !status })}
				>
					<span className={assetValue.popupWarning ? '' : 'deactive_risk_data'}>
						{' '}
						{assetValue.percentPrice}
					</span>
				</td>
			),
		},
		{
			stringId: 'USER_SETTINGS.RISK_MANAGEMENT.ACTIVATE_RISK_MANAGEMENT',
			label: STRINGS['USER_SETTINGS.RISK_MANAGEMENT.ACTIVATE_RISK_MANAGEMENT'],
			key: 'adjust',
			className: 'text-right',
			renderCell: ({ id, adjust }, key, index) => (
				<td key={`${key}-${id}-adjusted`}>
					<div className="d-flex justify-content-end">
						{renderFields(adjust)}
					</div>
				</td>
			),
		},
	];
};

export const generateWarningFormValues = (DEFAULT_TOGGLE_OPTIONS) => ({
	popup_warning: {
		type: 'toggle',
		stringId: 'USER_SETTINGS.RISK_MANAGEMENT.WARNING_POP_UP',
		label: STRINGS['USER_SETTINGS.RISK_MANAGEMENT.WARNING_POP_UP'],
		// className: 'toggle-wrapper',
		toggleOnly: true,
		options: DEFAULT_TOGGLE_OPTIONS,
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
			onAdjustPortfolio,
			totalAssets,
			initialValues = {},
			handleSubmit,
			submitting,
			pristine,
			// error,
			valid,
			formFields,
			coins,
			ICONS,
			popup_warning,
		} = this.props;

		const percentPrice =
			(totalAssets / 100) * initialValues.order_portfolio_percentage;
		const { fullname, display_name } =
			coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const assetData = [
			{
				id: 1,
				percentage: {
					portfolioPercentage: initialValues.order_portfolio_percentage
						? `${initialValues.order_portfolio_percentage}%`
						: '',
					popupWarning: initialValues.popup_warning,
				},
				assetValue: {
					percentPrice: percentPrice
						? `${formatBaseAmount(percentPrice)} ${display_name}`
						: 0,
					popupWarning: initialValues.popup_warning,
				},
				adjust: formFields,
				warning: initialValues.popup_warning,
				status: popup_warning,
			},
		];
		const sections = [
			{
				stringId:
					'USER_SETTINGS.CREATE_ORDER_WARING,USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT,USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT_1',
				title: STRINGS['USER_SETTINGS.CREATE_ORDER_WARING'],
				content: (
					<div>
						<EditWrapper
							stringId="USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT"
							renderWrapper={(children) => <p>{children}</p>}
						>
							{STRINGS['USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT']}
						</EditWrapper>
						<EditWrapper
							stringId="USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT_1"
							renderWrapper={(children) => <p>{children}</p>}
						>
							{STRINGS.formatString(
								STRINGS['USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT_1'],
								fullname,
								totalAssets
							)}
						</EditWrapper>
						<Table
							rowClassName="pt-2 pb-2"
							headers={generateHeaders(onAdjustPortfolio)}
							data={assetData}
							count={1}
							displayPaginator={false}
						/>
					</div>
				),
				isOpen: true,
			},
		];
		return (
			<div>
				<form onSubmit={handleSubmit} className="settings-form-wrapper">
					{/* <Accordion sections={sections} /> */}
					<div className="settings-form">
						<IconTitle
							stringId="USER_SETTINGS.TITLE_MANAGE_RISK"
							text={STRINGS['USER_SETTINGS.TITLE_MANAGE_RISK']}
							textType="title"
							iconPath={ICONS['SETTING_RISK_ICON']}
						/>
						{sections.map((data, index) => {
							return <div key={index}>{data.content}</div>;
						})}
					</div>
					<div className="d-flex align-items-center justify-content-center">
						<EditWrapper stringId="SETTING_BUTTON" />
						<Button
							label={STRINGS['SETTING_BUTTON']}
							disabled={pristine || submitting || !valid}
						/>
					</div>
				</form>
			</div>
		);
	}
}

const RiskForm = reduxForm({
	form: FORM_NAME,
	enableReinitialize: true,
})(Form);

const mapStateToForm = (state) => ({
	popup_warning: selector(state, 'popup_warning'),
});

const RiskFormValues = connect(mapStateToForm)(RiskForm);

export default RiskFormValues;
