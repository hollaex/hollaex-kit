import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ClearPendingEarningsContent = ({
	onProceed,
	onBack,
	icons: ICONS,
	stakeData,
}) => {
	const { symbol } = stakeData;
	const iconId = `${symbol.toUpperCase()}_ICON`;

	return (
		<Fragment>
			<div className="dialog-content bottom">
				<IconTitle
					stringId="UNSTAKE.CLEAR_PENDING_EARNING"
					text={STRINGS['UNSTAKE.CLEAR_PENDING_EARNING']}
					textType="stake_popup__title"
					underline={false}
					className="w-100 pt-4"
				/>

				<div className="secondary-text">
					{STRINGS['UNSTAKE.CLEAR_PENDING_EARNING_SUB']}
				</div>

				<div className="py-4 my-4 d-flex">
					<div>
						<Image
							iconId={iconId}
							icon={ICONS[iconId]}
							wrapperClassName="currency-ball"
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
