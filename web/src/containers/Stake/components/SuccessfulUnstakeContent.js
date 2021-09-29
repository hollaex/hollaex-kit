import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { dotifyAccount } from 'utils/eth';

const SuccessfulContent = ({
	stakeData,
	amount,
	onOkay,
	icons: ICONS,
	account,
}) => {
	const { symbol, earning } = stakeData;
	const iconId = `${symbol.toUpperCase()}_ICON`;

	const background = {
		'background-image': `url(${ICONS['STAKING_SUCCESSFUL_MESSAGE']})`,
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
			<div className="dialog-content top bottom" style={background}>
				<div style={headerContent}>
					<IconTitle
						stringId="STAKE.SUCCESSFUL_UNSTAKE_TITLE"
						text={STRINGS.formatString(
							STRINGS['STAKE.SUCCESSFUL_UNSTAKE_TITLE'],
							symbol.toUpperCase()
						)}
						textType="title"
						underline={false}
						className="w-100"
					/>

					<div>
						<div className="bold">
							<EditWrapper stringId="STAKE.SUCCESSFUL_UNSTAKE_AMOUNT">
								{STRINGS['STAKE.SUCCESSFUL_UNSTAKE_AMOUNT']}
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
							<EditWrapper stringId="STAKE.EARNINGS">
								{STRINGS['STAKE.EARNINGS']}:
							</EditWrapper>
						</div>
						<div>
							<div className="secondary-text px-2">
								{`${earning} ${symbol.toUpperCase()}`}
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
								{`${amount} ${symbol.toUpperCase()}`}
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
