import React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

import LimitsBlock from "./LimitsBlock";
import FeesBlock from "./FeesBlock";
import { IconTitle, Button } from "../../../components";
import { ICONS, FEES_LIMIT_SITE_URL } from "../../../config/constants";
import STRINGS from "../../../config/localizedStrings";

const FeesAndLimits = ({ data, onClose, coins, pairs }) => {
	const { tradingAccount, verification_level } = data;
	return (
		<div className="fee-limits-wrapper">
			<IconTitle
				text={`${STRINGS.SUMMARY.FEES_AND_LIMIT} ${tradingAccount.fullName}`}
				iconPath={ICONS[tradingAccount.symbol.toUpperCase()]}
				textType="title"
				useSvg={true}
				underline={true}
			/>
			<div className="content-txt">
				<div className="my-3">
					<div>{STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_1}</div>
					<div className="mt-3">
						{STRINGS.formatString(
							STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_2,
							<Link
								href={FEES_LIMIT_SITE_URL}
								target="blank"
								className="fee-limits-link"
							>
								{`${STRINGS.APP_TITLE} ${STRINGS.SUMMARY.WEBSITE}`}
							</Link>
						)}
					</div>
				</div>
				<div>
					<div className="content-title">
						{STRINGS.SUMMARY.DEPOSIT_WITHDRAWAL_ALLOWENCE}
					</div>
					<LimitsBlock coins={coins} level={verification_level} />
				</div>
				<div>
					<div className="content-title">
						{STRINGS.SUMMARY.TRADING_FEE_STRUCTURE}
					</div>
					<FeesBlock
						coins={coins}
						level={verification_level}
						pairs={pairs}
					/>
				</div>
			</div>
			<Button className="mt-4" label={STRINGS.BACK_TEXT} onClick={onClose} />
		</div>
	);
};

const mapStateToProps = state => ({
	activeTheme: state.app.theme,
	pairs: state.app.pairs,
	coins: state.app.coins
});

export default connect(mapStateToProps)(FeesAndLimits);
