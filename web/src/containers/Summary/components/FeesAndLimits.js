import React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

import LimitsBlock from "./LimitsBlock";
import FeesBlock from "./FeesBlock";
import { IconTitle, Button } from "../../../components";
import { ICONS, FEES_LIMIT_SITE_URL } from "../../../config/constants";
import STRINGS from "../../../config/localizedStrings";

const FeesAndLimits = ({ data, onClose, coins, pairs }) => {
	const { verification_level } = data;
	const LEVEL_OF_ACCOUNT = STRINGS.formatString(STRINGS.SUMMARY.LEVEL_OF_ACCOUNT, verification_level);
	console.log('coins', coins, pairs);
	return (
		<div className="fee-limits-wrapper">
			<IconTitle
				text={
					STRINGS.formatString(
						STRINGS.SUMMARY.FEES_AND_LIMIT,
						LEVEL_OF_ACCOUNT
					)}
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
					<LimitsBlock coins={coins} level={verification_level} />
				</div>
				<div>
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
