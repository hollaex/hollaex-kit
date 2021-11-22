import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle, ProgressBar } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import AmountPreview from './AmountPreview';

const ReviewEarlyUnstake = ({
	stakeData,
	onCancel,
	onProceed,
	icons: ICONS,
}) => {
	const { partial, total, progressStatusText, reward, symbol } = stakeData;

	const background = {
		'background-image': `url(${ICONS['STAKING_MODAL_BACKGROUND']})`,
		height: '24.3rem',
		width: '40rem',
	};

	return (
		<Fragment>
			<div className="dialog-content background" style={background}>
				<IconTitle
					iconId="STAKING_UNLOCK"
					iconPath={ICONS['STAKING_UNLOCK']}
					stringId="UNSTAKE.EARLY_TITLE"
					text={STRINGS['UNSTAKE.EARLY_TITLE']}
					textType="stake_popup__title m-0 pl-3"
					underline={false}
					className="w-100 py-4 flex-direction-row justify-content-start"
					imageWrapperClassName="stake-unlock-title"
				/>

				<div className="py-4">
					<div className="pb-1 bold">
						<EditWrapper stringId="UNSTAKE.DURATION">
							{STRINGS['UNSTAKE.DURATION']}
						</EditWrapper>
					</div>
					<div className="d-flex">
						<ProgressBar partial={partial} total={total} />
						<div className="px-2 align-center secondary-text">
							{progressStatusText}
						</div>
					</div>
				</div>

				<div className="pt-4">
					<div className="pb-1 bold">
						<EditWrapper stringId="UNSTAKE.EARNINGS_FORFEITED">
							{STRINGS['UNSTAKE.EARNINGS_FORFEITED']}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="UNSTAKE.PRICE_FORMAT">
							{STRINGS.formatString(
								STRINGS['UNSTAKE.PRICE_FORMAT'],
								reward,
								symbol.toUpperCase()
							)}
						</EditWrapper>
					</div>
					<div className="secondary-text">
						<EditWrapper stringId="UNSTAKE.EST_PENDING">
							{STRINGS.formatString(
								STRINGS['UNSTAKE.EST_PENDING'],
								STRINGS.formatString(
									STRINGS['UNSTAKE.PRICE_FORMAT'],
									'?',
									symbol.toUpperCase()
								)
							)}
						</EditWrapper>
					</div>
				</div>
			</div>

			<div className="dialog-content bottom w-100">
				<div className="pt-4">
					<div className="bold pb-1">
						<EditWrapper stringId="UNSTAKE.AMOUNT_SLASHED">
							{STRINGS['UNSTAKE.AMOUNT_SLASHED']}
						</EditWrapper>
					</div>
					<div>
						{STRINGS.formatString(
							STRINGS['UNSTAKE.PRICE_FORMAT'],
							'?',
							symbol.toUpperCase()
						)}
					</div>
				</div>
				<AmountPreview
					amount={0}
					symbol={symbol}
					labelId="UNSTAKE.AMOUNT_TO_RECEIVE"
				/>
				<div className="kit-divider" />
				<div className="pt-3 secondary-text">
					<EditWrapper stringId="UNSTAKE.SLASH_FOOTNOTE">
						{STRINGS['UNSTAKE.SLASH_FOOTNOTE']}
					</EditWrapper>
				</div>
				<div className="d-flex mt-4 pt-3">
					<div className="w-50">
						<EditWrapper stringId="UNSTAKE.CANCEL" />
						<Button label={STRINGS['UNSTAKE.CANCEL']} onClick={onCancel} />
					</div>
					<div className="separator" />
					<div className="w-50">
						<EditWrapper stringId="UNSTAKE.PROCEED" />
						<Button label={STRINGS['UNSTAKE.PROCEED']} onClick={onProceed} />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(ReviewEarlyUnstake);
