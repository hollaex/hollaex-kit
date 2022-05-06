import React, { Fragment } from 'react';
import { Radio } from 'antd';
import mathjs from 'mathjs';
import { EditWrapper, Button, IconTitle, ActionNotification } from 'components';
import Ionicon from 'react-ionicons';
import STRINGS from 'config/localizedStrings';
import { getEstimatedRemainingTime, roundDuration } from 'utils/eth';
import withConfig from 'components/ConfigProvider/withConfig';
import Variable from './Variable';

const PeriodContent = ({
	tokenData,
	onClose,
	onBack,
	onReview,
	periods,
	setPeriod,
	period,
	icons: ICONS,
	currentBlock,
	openReadMore,
}) => {
	const { symbol, display_name } = tokenData;

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
			<ActionNotification
				text={
					<Ionicon
						icon="md-close"
						fontSize="24px"
						className="action_notification-image"
					/>
				}
				onClick={onClose}
				className="close-button p-2"
			/>
			<div className="dialog-content">
				<IconTitle
					stringId="STAKE.MODAL_TITLE"
					text={STRINGS.formatString(
						STRINGS['STAKE.MODAL_TITLE'],
						display_name
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
						{filteredPeriods.map((period, index) => {
							const [duration, unit] = roundDuration(
								getEstimatedRemainingTime(period)
							);
							const unitAbbrv = unit ? unit.charAt(0).toUpperCase() : '';
							return (
								<Radio.Button
									style={background}
									className="stake-period-button"
									value={period}
								>
									<div className="stake-period-text">
										{STRINGS[`STAKE.REWARDS.${index}.CARD`]}
									</div>
									<div className="period-x">{`${duration}${unitAbbrv}`}</div>
								</Radio.Button>
							);
						})}
					</Radio.Group>
				</div>
				<div className="text-align-center pt-4">
					{selectedPeriodIndex !== -1 &&
						STRINGS.formatString(
							STRINGS['STAKE.STAKE_AND_EARN_DETAILS'],
							roundDuration(getEstimatedRemainingTime(period)).join(' '),
							STRINGS[`STAKE.REWARDS.${selectedPeriodIndex}.TEXT`]
						)}
				</div>
				<div className="text-align-center secondary-text font-small py-3">
					{period && (
						<Fragment>
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
						</Fragment>
					)}
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
							<span
								className="blue-link pointer underline-text px-2"
								onClick={openReadMore}
							>
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
