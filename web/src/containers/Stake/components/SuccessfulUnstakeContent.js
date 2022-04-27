import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { dotifyString } from 'utils/eth';
import AmountPreview from './AmountPreview';

const SuccessfulUnstakeContent = ({
	stakeData,
	amountToReceive,
	originalAmount,
	onOkay,
	icons: ICONS,
	account,
}) => {
	const { symbol, reward, display_name } = stakeData;

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
					stringId="STAKE.SUCCESSFUL_UNSTAKE_TITLE"
					text={STRINGS.formatString(
						STRINGS['STAKE.SUCCESSFUL_UNSTAKE_TITLE'],
						display_name
					)}
					textType="stake_popup__title m-0 text-align-left"
					underline={false}
					className="w-100 pt-4 align-start"
					imageWrapperClassName="stake-unlock-title"
				/>

				<AmountPreview
					amount={amountToReceive}
					symbol={symbol}
					labelId="STAKE.SUCCESSFUL_UNSTAKE_AMOUNT"
				/>

				<div className="d-flex">
					<div className="bold">
						<EditWrapper stringId="STAKE.EARNINGS">
							{STRINGS['STAKE.EARNINGS']}:
						</EditWrapper>
					</div>
					<div>
						<div className="secondary-text px-2">
							{`${reward} ${display_name}`}
						</div>
					</div>
				</div>

				<div className="d-flex">
					<div className="bold">
						<EditWrapper stringId="STAKE.ORIGINAL_AMOUNT">
							{STRINGS['STAKE.ORIGINAL_AMOUNT']}:
						</EditWrapper>
					</div>
					<div>
						<div className="secondary-text px-2">
							{`${originalAmount} ${display_name}`}
						</div>
					</div>
				</div>

				<div className="d-flex">
					<div className="bold">
						<EditWrapper stringId="STAKE.SUCCESSFUL_STAKE_DESTINATION">
							{STRINGS['STAKE.SUCCESSFUL_UNSTAKE_ADDRESS']}:
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

export default withConfig(SuccessfulUnstakeContent);
