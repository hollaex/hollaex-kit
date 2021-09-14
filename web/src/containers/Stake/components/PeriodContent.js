import React from 'react';
import { Radio } from 'antd';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import { getEstimatedRemainingTime } from 'utils/eth';

const PeriodContent = ({
	tokenData,
	onBack,
	onReview,
	periods,
	setPeriod,
	period,
}) => {
	const { symbol } = tokenData;
	return (
		<div>
			<IconTitle
				stringId="STAKE.MODAL_TITLE"
				text={STRINGS.formatString(
					STRINGS['STAKE.MODAL_TITLE'],
					symbol.toUpperCase()
				)}
				textType="title"
				underline={false}
				className="w-100"
			/>
			<div>
				{STRINGS['STAKE.PERIODS']}:
				{periods[symbol] && (
					<Radio.Group size="large" onChange={setPeriod} value={period}>
						{periods[symbol].map((period) => (
							<Radio.Button className="stake-period-button" value={period}>
								{getEstimatedRemainingTime(period).join(' ')}
							</Radio.Button>
						))}
					</Radio.Group>
				)}
			</div>
			<div className="d-flex">
				<div className="w-50">
					<EditWrapper stringId="STAKE.BACK" />
					<Button label={STRINGS['STAKE.BACK']} onClick={onBack} />
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId="STAKE.REVIEW" />
					<Button
						label={STRINGS['STAKE.REVIEW']}
						onClick={onReview}
						disabled={!period}
					/>
				</div>
			</div>
		</div>
	);
};

export default PeriodContent;
