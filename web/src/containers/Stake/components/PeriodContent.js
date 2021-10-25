import React, { Fragment } from 'react';
import { Radio } from 'antd';
import mathjs from 'mathjs';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import { getEstimatedRemainingTime } from 'utils/eth';
import withConfig from 'components/ConfigProvider/withConfig';
import Variable from './Variable';

const PeriodContent = ({
	tokenData,
	onBack,
	onReview,
	periods,
	setPeriod,
	period,
	icons: ICONS,
	currentBlock,
}) => {
	const { symbol } = tokenData;

	const background = {
		'background-image': `url(${ICONS['STAKING_PERIOD_ITEM']})`,
	};

	const filteredPeriods = periods[symbol]
		? periods[symbol].filter((period) => !!period)
		: [];
	const selectedPeriodIndex = filteredPeriods.findIndex(
		(periodItem) => periodItem === period
	);

	return (
		<Fragment>
			<div className="dialog-content">
				<IconTitle
					stringId="STAKE.MODAL_TITLE"
					text={STRINGS.formatString(
						STRINGS['STAKE.MODAL_TITLE'],
						symbol.toUpperCase()
					)}
					textType="stake_popup__title m-0"
					underline={false}
					className="w-100 pt-4 align-start"
					subtitle={STRINGS['STAKE.PERIOD_SUBTITLE']}
					subtitleClass="secondary-text"
				/>
				<div>
					<Radio.Group
						className="stake-period-group"
						size="large"
						onChange={setPeriod}
						value={period}
					>
						{filteredPeriods.map((period, index) => (
							<Radio.Button
								style={background}
								className="stake-period-button"
								value={period}
							>
								<div>
									{STRINGS.formatString(
										STRINGS['STAKE.PERIOD_OPTION_TEXT'],
										getEstimatedRemainingTime(period).join(' ')
									)}
								</div>
								<div className="period-x">{`${index + 1}x`}</div>
							</Radio.Button>
						))}
					</Radio.Group>
				</div>
				<div className="text-align-center pt-4">
					{selectedPeriodIndex !== -1 &&
						STRINGS.formatString(
							STRINGS['STAKE.STAKE_AND_EARN_DETAILS'],
							getEstimatedRemainingTime(period).join(' '),
							selectedPeriodIndex + 1
						)}
				</div>
				<div className="text-align-center secondary-text font-small py-3">
					<div>
						<EditWrapper stringId="STAKE.CURRENT_BLOCK">
							{STRINGS.formatString(
								STRINGS['STAKE.CURRENT_BLOCK'],
								currentBlock
							)}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="STAKE.END_BLOCK">
							{STRINGS.formatString(
								STRINGS['STAKE.END_BLOCK'],
								mathjs.sum(currentBlock, period)
							)}
						</EditWrapper>
					</div>
				</div>
				<div className="kit-divider" />
				<div>
					<EditWrapper stringId="STAKE.PREDICTED_EARNINGS">
						{STRINGS['STAKE.PREDICTED_EARNINGS']}
					</EditWrapper>
				</div>
				<div className="d-flex">
					<Variable />*
				</div>
				<div>
					<EditWrapper stringId="STAKE.VARIABLE_TEXT,STAKE.READ_MORE">
						{STRINGS.formatString(
							STRINGS['STAKE.VARIABLE_TEXT'],
							<span className="blue-link pointer underline-text px-2">
								{STRINGS['STAKE.READ_MORE']}
							</span>
						)}
					</EditWrapper>
				</div>
			</div>
			<div className="dialog-content bottom d-flex mt-4 pt-3">
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
		</Fragment>
	);
};

export default withConfig(PeriodContent);
