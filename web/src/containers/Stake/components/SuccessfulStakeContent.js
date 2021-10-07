import React, { Fragment } from 'react';
import mathjs from 'mathjs';
import { EditWrapper, Button, IconTitle, Image } from 'components';
import { getEstimatedRemainingTime } from 'utils/eth';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { dotifyAccount } from 'utils/eth';

const SuccessfulContent = ({
	tokenData,
	amount,
	onOkay,
	period,
	icons: ICONS,
	currentBlock,
	account,
}) => {
	const { symbol, fullname, available } = tokenData;
	const iconId = `${symbol.toUpperCase()}_ICON`;

	const background = {
		'background-image': `url(${ICONS['STAKING_SUCCESSFUL_MESSAGE']})`,
		height: '100%',
	};

	const headerContent = {
		width: '100%',
		height: '100%',
		display: 'flex',
		'flex-direction': 'column',
		'justify-content': 'space-between',
	};

	return (
		<Fragment>
			<div className="dialog-content background bottom" style={background}>
				<div style={headerContent}>
					<IconTitle
						stringId="STAKE.SUCCESSFUL_STAKE_TITLE"
						text={STRINGS.formatString(
							STRINGS['STAKE.SUCCESSFUL_STAKE_TITLE'],
							symbol.toUpperCase()
						)}
						textType="title"
						underline={false}
						className="w-100"
					/>

					<div>
						<div className="bold">
							<EditWrapper stringId="STAKE.SUCCESSFUL_STAKE_AMOUNT">
								{STRINGS['STAKE.SUCCESSFUL_STAKE_AMOUNT']}
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
							<div className="secondary-text px-2">
								{dotifyAccount(account)}
							</div>
						</div>
					</div>

					<div>
						<EditWrapper stringId="STAKE.OKAY" />
						<Button label={STRINGS['STAKE.OKAY']} onClick={onOkay} />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(SuccessfulContent);
