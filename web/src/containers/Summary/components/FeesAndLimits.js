import React from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import LimitsBlock from './LimitsBlock';
import FeesBlock from './FeesBlock';
import { IconTitle, Button } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';

const FeesAndLimits = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	tiers = {},
}) => {
	const { verification_level, discount = 0 } = data;
	const LEVEL_OF_ACCOUNT = STRINGS.formatString(
		STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
		verification_level
	);

	const { name } = tiers[verification_level] || {};

	const TITLE_OF_ACCOUNT = STRINGS.formatString(
		STRINGS['SUMMARY.TITLE_OF_ACCOUNT'],
		name
	);

	const title = TITLE_OF_ACCOUNT || LEVEL_OF_ACCOUNT;

	const Discount_percentage =
		discount > 0
			? STRINGS.formatString(STRINGS['SUMMARY.DISCOUNT'], discount)
			: null;
	return (
		<div className="fee-limits-wrapper">
			<IconTitle
				stringId="SUMMARY.TITLE_OF_ACCOUNT,SUMMARY.FEES_AND_LIMIT"
				text={
					<label>
						{STRINGS.formatString(STRINGS['SUMMARY.FEES_AND_LIMIT'], title)}{' '}
						{Discount_percentage}
					</label>
				}
				iconId={
					ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
						? `LEVEL_ACCOUNT_ICON_${verification_level}`
						: 'LEVEL_ACCOUNT_ICON_4'
				}
				iconPath={
					ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
						? ICONS[`LEVEL_ACCOUNT_ICON_${verification_level}`]
						: ICONS['LEVEL_ACCOUNT_ICON_4']
				}
				textType="title"
				underline={true}
			/>
			<div className="content-txt">
				<div className="my-3">
					<div>
						<EditWrapper stringId="SUMMARY.FEES_AND_LIMIT_TXT_1">
							{STRINGS['SUMMARY.FEES_AND_LIMIT_TXT_1']}
						</EditWrapper>
					</div>
					<div className="mt-3">
						<EditWrapper stringId="SUMMARY.FEES_AND_LIMIT_TXT_2">
							{STRINGS['SUMMARY.FEES_AND_LIMIT_TXT_2']}
						</EditWrapper>
					</div>
					{discount
						?
						<div className="my-4">
							<div className="fee-reduction-container d-flex p-2 my-2 align-items-center">
								<div>
									<ReactSVG src={ICONS['GREEN_CHECK']} className="currency_ball-wrapper m" />
								</div>
								<div className="mx-1" />
								<div className="font-weight-bold">
									{STRINGS['FEE_REDUCTION']}: {discount}
								</div>
							</div>
							<div className="fee-reduction-description px-1">
								{STRINGS['FEE_REDUCTION_DESCRIPTION']}
							</div>
						</div>
						: null
					}
				</div>
				<div>
					<LimitsBlock
						coins={coins}
						level={verification_level}
						title={title}
						tiers={tiers}
					/>
				</div>
				<div>
					<FeesBlock
						coins={coins}
						level={verification_level}
						pairs={pairs}
						discount={discount}
						tiers={tiers}
					/>
				</div>
			</div>
			<Button className="mt-4" label={STRINGS['BACK_TEXT']} onClick={onClose} />
		</div>
	);
};

const mapStateToProps = (state) => ({
	activeTheme: state.app.theme,
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
});

export default connect(mapStateToProps)(withConfig(FeesAndLimits));
