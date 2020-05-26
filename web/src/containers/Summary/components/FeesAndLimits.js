import React from "react";
import { connect } from "react-redux";

import LimitsBlock from "./LimitsBlock";
import FeesBlock from "./FeesBlock";
import { IconTitle, Button } from "../../../components";
import { ICONS } from "../../../config/constants";
import STRINGS from "../../../config/localizedStrings";

const FeesAndLimits = ({ data, onClose, coins, pairs, constants = {} }) => {
	const { verification_level, discount = 0 } = data;
	const LEVEL_OF_ACCOUNT = STRINGS.formatString(STRINGS.SUMMARY.LEVEL_OF_ACCOUNT, verification_level);
	const Discount_percentage = discount > 0 ? STRINGS.formatString(STRINGS.SUMMARY.DISCOUNT, discount) : null
	return (
		<div className="fee-limits-wrapper">
			<IconTitle
				text={
					<label>{STRINGS.formatString(
						STRINGS.SUMMARY.FEES_AND_LIMIT,
						LEVEL_OF_ACCOUNT
					)} {Discount_percentage}
					</label>
				}
				iconPath={ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
					? ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
					: ICONS.LEVEL_ACCOUNT_ICON_4}
				textType="title"
				useSvg={true}
				underline={true}
			/>
			<div className="content-txt">
				<div className="my-3">
					<div>{STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_1}</div>
					<div className="mt-3">
						{STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_2}				
					</div>
				</div>
				<div>
					<LimitsBlock coins={coins} level={verification_level} />
				</div>
				<div>
					<FeesBlock
						coins={coins}
						level={verification_level}
						pairs={pairs}
						discount={discount}
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
	coins: state.app.coins,
	constants: state.app.constants
});

export default connect(mapStateToProps)(FeesAndLimits);
