import React, { Fragment } from 'react';
import mathjs from 'mathjs';
import { EditWrapper, Button, IconTitle } from 'components';
import { getEstimatedRemainingTime } from 'utils/eth';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { dotifyString } from 'utils/eth';
import AmountPreview from './AmountPreview';

const SuccessfulContent = ({
	tokenData,
	amount,
	onOkay,
	period,
	icons: ICONS,
	currentBlock,
	account,
}) => {
	const { symbol, display_name } = tokenData;

	const background = {
		'background-image': `url(${ICONS['STAKING_SUCCESSFUL_MESSAGE']})`,
		height: '100%',
		width: '100%',
	};

	return (
		<Fragment>
			<div
				className="dialog-content background bottom background-color-layer"
				style={background}
			>
				<IconTitle
					stringId="STAKE.SUCCESSFUL_STAKE_TITLE"
					text={STRINGS.formatString(
						STRINGS['STAKE.SUCCESSFUL_STAKE_TITLE'],
						display_name
					)}
					textType="stake_popup__title m-0 text-align-left"
					underline={false}
					className="w-100 pt-4 align-start"
					imageWrapperClassName="stake-unlock-title"
				/>

				<AmountPreview
					amount={amount}
					symbol={symbol}
					labelId="STAKE.SUCCESSFUL_STAKE_AMOUNT"
				/>

				<div className="d-flex">
					<div className="bold">
						<EditWrapper stringId="STAKE.SUCCESSFUL_STAKE_DURATION_KEY">
							{STRINGS['STAKE.SUCCESSFUL_STAKE_DURATION_KEY']}:
						</EditWrapper>
					</div>
					<div>
						<div className="secondary-text px-2">
							<EditWrapper stringId="STAKE.SUCCESSFUL_STAKE_DURATION_DEF">
								{STRINGS.formatString(
									STRINGS['STAKE.SUCCESSFUL_STAKE_DURATION_DEF'],
									mathjs.sum(currentBlock, period),
									getEstimatedRemainingTime(period).join(' ')
								)}
							</EditWrapper>
						</div>
					</div>
				</div>

				<div className="d-flex">
					<div className="bold">
						<EditWrapper stringId="STAKE.SUCCESSFUL_STAKE_DESTINATION">
							{STRINGS['STAKE.SUCCESSFUL_STAKE_DESTINATION']}:
						</EditWrapper>
					</div>
					<div>
						<div className="secondary-text px-2">{dotifyString(account)}</div>
					</div>
				</div>

				<div className="mt-4 pt-3">
					<EditWrapper stringId="STAKE.OKAY" />
					<Button label={STRINGS['STAKE.OKAY']} onClick={onOkay} />
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(SuccessfulContent);
