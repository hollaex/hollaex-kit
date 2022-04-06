import React, { Fragment } from 'react';
import mathjs from 'mathjs';
import { EditWrapper, Button, IconTitle, ActionNotification } from 'components';
import Ionicon from 'react-ionicons';
import STRINGS from 'config/localizedStrings';
import { getEstimatedRemainingTime } from 'utils/eth';
import withConfig from 'components/ConfigProvider/withConfig';
import Variable from './Variable';
import AmountPreview from './AmountPreview';

const ReviewContent = ({
	tokenData,
	onClose,
	onCancel,
	onProceed,
	currentBlock,
	period,
	amount,
	icons: ICONS,
	penalty,
}) => {
	const { symbol } = tokenData;

	const background = {
		'background-image': `url(${ICONS['STAKING_MODAL_BACKGROUND']})`,
		height: '31.3rem',
		width: '40rem',
	};

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
			<div className="dialog-content background" style={background}>
				<IconTitle
					stringId="STAKE.REVIEW_MODAL_TITLE"
					text={STRINGS['STAKE.REVIEW_MODAL_TITLE']}
					textType="stake_popup__title m-0"
					underline={false}
					className="w-100 pt-4 align-start"
					subtitle={STRINGS.formatString(
						STRINGS['STAKE.CURRENT_ETH_BLOCK'],
						currentBlock
					)}
					subtitleClass="secondary-text pb-3"
				/>
				<div className="pt-4">
					<div className="bold pb-1">
						<EditWrapper stringId="STAKE.DURATION">
							{STRINGS['STAKE.DURATION']}
						</EditWrapper>
					</div>
					<div className="secondary-text">
						<EditWrapper stringId="STAKE.END_ON_BLOCK">
							{STRINGS.formatString(
								STRINGS['STAKE.END_ON_BLOCK'],
								mathjs.sum(currentBlock, period)
							)}
						</EditWrapper>
					</div>
					<div className="secondary-text">
						({getEstimatedRemainingTime(period).join(' ')})
					</div>
				</div>
				<div className="pt-4">
					<div className="pb-1">
						<EditWrapper stringId="STAKE.PREDICTED_EARNINGS">
							{STRINGS['STAKE.PREDICTED_EARNINGS']}
						</EditWrapper>
					</div>
					<div className="secondary-text">
						<Variable />
					</div>
				</div>
				<div className="pt-4">
					<div className="pb-1">
						<EditWrapper stringId="STAKE.SLASHING_TITLE">
							{STRINGS['STAKE.SLASHING_TITLE']}
						</EditWrapper>
					</div>
					<div className="secondary-text">
						<EditWrapper stringId="STAKE.SLASHING_TEXT_1">
							{STRINGS.formatString(STRINGS['STAKE.SLASHING_TEXT_1'], penalty)}
						</EditWrapper>
					</div>
					<div className="secondary-text">
						<EditWrapper stringId="STAKE.SLASHING_TEXT_2">
							{STRINGS['STAKE.SLASHING_TEXT_2']}
						</EditWrapper>
					</div>
				</div>
			</div>

			<div className="dialog-content bottom w-100">
				<AmountPreview
					amount={amount}
					symbol={symbol}
					labelId="STAKE.AMOUNT_LABEL"
				/>
				<div className="kit-divider" />
				<div className="secondary-text">
					<EditWrapper stringId="STAKE.REVIEW_NOTE">
						{STRINGS['STAKE.REVIEW_NOTE']}
					</EditWrapper>
				</div>
				<div className="d-flex mt-4 pt-3">
					<div className="w-50">
						<EditWrapper stringId="STAKE.CANCEL" />
						<Button label={STRINGS['STAKE.CANCEL']} onClick={onCancel} />
					</div>
					<div className="separator" />
					<div className="w-50">
						<EditWrapper stringId="STAKE.PROCEED" />
						<Button label={STRINGS['STAKE.PROCEED']} onClick={onProceed} />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(ReviewContent);
