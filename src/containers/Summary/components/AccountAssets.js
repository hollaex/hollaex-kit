import React from "react";
import ReactSVG from "react-svg";
import classnames from "classnames";

import { DonutChart } from "../../../components";
import STRINGS from "../../../config/localizedStrings";
import {
	BASE_CURRENCY,
	ICONS,
	FLEX_CENTER_CLASSES
} from "../../../config/constants";
import { formatAverage, formatToCurrency } from "../../../utils/currency";

const AccountAssets = ({ chartData = [], totalAssets, balance, coins }) => {
	const baseValue = coins[BASE_CURRENCY] || { symbol: "eur" };
	return (
		<div className="summary-section_2">
			<div className="summary-content-txt assets-description">
				<div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_1}</div>
				<div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_2}</div>
			</div>
			<div className="w-100 donut-container">
				{BASE_CURRENCY && <DonutChart chartData={chartData} />}
			</div>
			<div className="d-flex justify-content-between">
				{chartData.map((value, index) => {
					const { min, fullname } =
						coins[value.symbol || BASE_CURRENCY] || {};
					let currencyBalance = formatToCurrency(
						balance[`${value.symbol}_balance`],
						min
					);
					return (
						<div key={index} className="price-content text-center">
							<div
								className={classnames(
									"coin-price-container",
									FLEX_CENTER_CLASSES
								)}
							>
								<ReactSVG
									path={ICONS[`${value.symbol.toUpperCase()}_ICON`]}
									wrapperClassName="coin-price"
								/>
							</div>
							<div className="price-text">{fullname}:</div>
							<div className="price-text">
								{`${
									STRINGS[
										`${value.symbol.toUpperCase()}_CURRENCY_SYMBOL`
									]
								} ${formatAverage(currencyBalance)}`}
							</div>
							{value.symbol !== BASE_CURRENCY && (
								<div>{`~${formatAverage(value.balanceFormat)}`}</div>
							)}
						</div>
					);
				})}
			</div>
			<div className="text-center my-3 title-font">
				<span className="total-assets">
					{STRINGS.formatString(
						STRINGS.TOTAL_ASSETS_VALUE,
						baseValue.fullname,
						totalAssets
					)}
				</span>
			</div>
		</div>
	);
};

export default AccountAssets;
