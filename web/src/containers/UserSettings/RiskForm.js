import React, { Component } from "react";
import { reduxForm } from "redux-form";

import { Accordion, Table, Button } from "../../components";
import renderFields from "../../components/Form/factoryFields";
import STRINGS from "../../config/localizedStrings";
import { formatBaseAmount } from "../../utils/currency";
import { BASE_CURRENCY, DEFAULT_COIN_DATA, IS_XHT } from "../../config/constants";

export const generateHeaders = onAdjustPortfolio => {
	return [
		{
			label: STRINGS["USER_SETTINGS.RISK_MANAGEMENT.PORTFOLIO"],
			key: "percentage",
			renderCell: ({ id, percentage }, key, index) => (
				<td key={`${key}-${id}-percentage`}>
					<span
						className={
							percentage.popupWarning ? "" : "deactive_risk_data"
						}
					>
						{percentage.portfolioPercentage}
						<span
							className={
								percentage.popupWarning
									? "ml-2 pointer blue-link"
									: "ml-2 deactive_risk_data"
							}
							onClick={
								percentage.popupWarning ? onAdjustPortfolio : () => { }
							}
						>
							{STRINGS["USER_SETTINGS.RISK_MANAGEMENT.ADJUST"]}
						</span>
					</span>
				</td>
			)
		},
		!IS_XHT
			? {
				label: STRINGS["USER_SETTINGS.RISK_MANAGEMENT.TOMAN_ASSET"],
				key: "assetValue",
				renderCell: ({ id, assetValue }, key, index) => (
					<td key={`${key}-${id}-assetValue.percentPrice`}>
						<span
							className={
								assetValue.popupWarning ? "" : "deactive_risk_data"
							}
						>
							{" "}
							{assetValue.percentPrice}
						</span>
					</td>
				)
			}
			: {},
		{
			label: STRINGS["USER_SETTINGS.RISK_MANAGEMENT.ACTIVATE_RISK_MANAGMENT"],
			key: "adjust",
			className: "text-right",
			renderCell: ({ id, adjust }, key, index) => (
				<td key={`${key}-${id}-adjusted`}>
					<div className="d-flex justify-content-end">
						{renderFields(adjust)}
					</div>
				</td>
			)
		}
	];
};

export const generateWarningFormValues = () => ({
	popup_warning: {
		type: "toggle",
		label: STRINGS["USER_SETTINGS.RISK_MANAGEMENT.WARNING_POP_UP"],
		className: "toggle-wrapper",
		toggleOnly: true
	}
});

class RiskForm extends Component {
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
			coins
		} = this.props;
		const percentPrice =
			(totalAssets / 100) * initialValues.order_portfolio_percentage;
		const { fullname, symbol = '' } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const assetData = [
			{
				id: 1,
				percentage: {
					portfolioPercentage: initialValues.order_portfolio_percentage
						? `${initialValues.order_portfolio_percentage}%`
						: "",
					popupWarning: initialValues.popup_warning
				},
				assetValue: {
					percentPrice: percentPrice
						? `${formatBaseAmount(percentPrice)} ${symbol.toUpperCase()}`
						: 0,
					popupWarning: initialValues.popup_warning
				},
				adjust: formFields,
				warning: initialValues.popup_warning
			}
		];
		const sections = [
			{
				title: STRINGS["USER_SETTINGS.CREATE_ORDER_WARING"],
				content: (
					<div>
						<p>{STRINGS["USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT"]}</p>
						{!IS_XHT
							? <p>
								{STRINGS.formatString(
									STRINGS["USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT_1"],
									fullname,
									totalAssets
								).join("")}
							</p>
							: null
						}
						<Table
							rowClassName="pt-2 pb-2"
							headers={generateHeaders(onAdjustPortfolio)}
							data={assetData}
							count={1}
							displayPaginator={false}
						/>
					</div>
				),
				isOpen: true
			}
		];
		return (
			<div>
				<form onSubmit={handleSubmit}>
					<Accordion sections={sections} />
					<Button
						className="mt-4"
						label={STRINGS["SETTING_BUTTON"]}
						disabled={pristine || submitting || !valid}
					/>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: "WarningForm",
	enableReinitialize: true
})(RiskForm);
