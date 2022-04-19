import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle, ActionNotification } from 'components';
import Ionicon from 'react-ionicons';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import AmountPreview from './AmountPreview';
import mathjs from 'mathjs';

const ReviewUnstake = ({
	stakeData,
	onClose,
	onCancel,
	onProceed,
	icons: ICONS,
}) => {
	const { symbol, amount, reward, display_name } = stakeData;

	const background = {
		'background-image': `url(${ICONS['STAKING_MODAL_BACKGROUND']})`,
		height: '24.3rem',
		width: '40rem',
	};

	const totalEarnt = mathjs.add(amount, reward);

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
					iconId="STAKING_UNLOCK"
					iconPath={ICONS['STAKING_UNLOCK']}
					stringId="UNSTAKE.TITLE"
					text={STRINGS['UNSTAKE.TITLE']}
					textType="stake_popup__title m-0 pl-3"
					underline={false}
					className="w-100 py-4 flex-direction-row justify-content-start"
					imageWrapperClassName="stake-unlock-title"
				/>
				<div className="pt-4">
					<AmountPreview
						amount={amount}
						symbol={symbol}
						labelId="UNSTAKE.AMOUNT_TO_RECEIVE"
					/>
					<div className="secondary-text pt-1">
						<EditWrapper stringId="UNSTAKE.AMOUNT_NOTE">
							{STRINGS['UNSTAKE.AMOUNT_NOTE']}
						</EditWrapper>
					</div>
				</div>
			</div>

			<div className="dialog-content bottom w-100">
				<div className="pt-4">
					<div className="bold pb-1">
						<EditWrapper stringId="UNSTAKE.TOTAL_EARNT">
							{STRINGS['UNSTAKE.TOTAL_EARNT']}
						</EditWrapper>
					</div>
					<div>
						{STRINGS.formatString(
							STRINGS['UNSTAKE.PRICE_FORMAT'],
							totalEarnt,
							display_name
						)}
					</div>
				</div>
				<div className="py-4">
					<div className="bold pb-1">
						<EditWrapper stringId="UNSTAKE.PENDING_EARNINGS">
							{STRINGS['UNSTAKE.PENDING_EARNINGS']}
						</EditWrapper>
					</div>
					<div>
						{STRINGS.formatString(
							STRINGS['UNSTAKE.PRICE_FORMAT'],
							reward,
							display_name
						)}
					</div>
				</div>

				<div className="kit-divider" />

				<div className="pt-3 secondary-text">
					<EditWrapper stringId="UNSTAKE.PENDING_EARNINGS_FOOTNOTE" />
					{STRINGS['UNSTAKE.PENDING_EARNINGS_FOOTNOTE']}
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

export default withConfig(ReviewUnstake);
