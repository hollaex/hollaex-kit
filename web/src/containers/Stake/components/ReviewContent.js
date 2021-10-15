import React, { Fragment } from 'react';
import mathjs from 'mathjs';
import { EditWrapper, Button, IconTitle, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import { getEstimatedRemainingTime } from 'utils/eth';
import withConfig from 'components/ConfigProvider/withConfig';

const ReviewContent = ({
	tokenData,
	onCancel,
	onProceed,
	currentBlock,
	period,
	amount,
	icons: ICONS,
}) => {
	const { symbol } = tokenData;
	const iconId = `${symbol.toUpperCase()}_ICON`;

	const background = {
		'background-image': `url(${ICONS['STAKING_MODAL_BACKGROUND']})`,
		height: '376px',
		width: '506px',
	};

	return (
		<Fragment>
			<div className="dialog-content background" style={background}>
				<IconTitle
					stringId="STAKE.REVIEW_MODAL_TITLE"
					text={STRINGS['STAKE.REVIEW_MODAL_TITLE']}
					textType="stake_popup__title"
					underline={false}
					className="w-100"
				/>
				<div className="secondary-text pb-3">
					{STRINGS.formatString(
						STRINGS['STAKE.CURRENT_ETH_BLOCK'],
						currentBlock
					)}
				</div>
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
						<EditWrapper stringId="STAKE.VARIABLE_TITLE">
							{STRINGS['STAKE.VARIABLE_TITLE']}
						</EditWrapper>
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
							{STRINGS['STAKE.SLASHING_TEXT_1']}
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
				<div>
					<div>
						<EditWrapper stringId="STAKE.REVIEW_NOTE">
							{STRINGS['STAKE.AMOUNT_LABEL']}
						</EditWrapper>
					</div>
					<div className="d-flex">
						<div>
							<Image
								iconId={iconId}
								icon={ICONS[iconId]}
								wrapperClassName="currency-ball"
							/>
						</div>
						<div className="bold">{`${amount} ${symbol.toUpperCase()}`}</div>
					</div>
				</div>
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
