import React, { Fragment } from 'react';
import {
	EditWrapper,
	Button,
	IconTitle,
	Image,
	ActionNotification,
} from 'components';
import Ionicon from 'react-ionicons';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ClearPendingEarningsContent = ({
	onProceed,
	onClose,
	onBack,
	icons: ICONS,
	stakeData,
}) => {
	const { symbol } = stakeData;
	const iconId = `${symbol.toUpperCase()}_ICON`;

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
			<div className="dialog-content bottom">
				<IconTitle
					iconId="STAKING_PENDING"
					iconPath={ICONS['STAKING_PENDING']}
					stringId="UNSTAKE.CLEAR_PENDING_EARNING"
					text={STRINGS['UNSTAKE.CLEAR_PENDING_EARNING']}
					textType="stake_popup__title m-0"
					underline={false}
					className="w-100 py-4 align-start"
				/>

				<div className="secondary-text">
					{STRINGS['UNSTAKE.CLEAR_PENDING_EARNING_SUB']}
				</div>

				<div className="py-4 my-4 d-flex align-center">
					<div>
						<Image
							iconId={iconId}
							icon={ICONS[iconId]}
							wrapperClassName="stake-currency-ball-small"
						/>
					</div>
					<div className="bold pb-1">
						<EditWrapper stringId="UNSTAKE.PENDING_AMOUNT" />
						{STRINGS.formatString(
							STRINGS['UNSTAKE.PENDING_AMOUNT'],
							STRINGS.formatString(
								STRINGS['UNSTAKE.PRICE_FORMAT'],
								'?',
								symbol.toUpperCase()
							)
						)}
					</div>
				</div>

				<div className="d-flex mt-4 pt-3">
					<div className="w-50">
						<EditWrapper stringId="STAKE.BACK" />
						<Button label={STRINGS['STAKE.BACK']} onClick={onBack} />
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

export default withConfig(ClearPendingEarningsContent);
