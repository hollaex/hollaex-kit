import React, { Fragment } from 'react';
import { Button as AntBtn } from 'antd';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import AmountPreview from './AmountPreview';

const ReviewEarlyUnstake = ({
	stakeData,
	onCancel,
	onProceed,
	onClear,
	icons: ICONS,
}) => {
	const { symbol } = stakeData;

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
					stringId="UNSTAKE.TITLE"
					text={STRINGS['UNSTAKE.TITLE']}
					textType="stake_popup__title m-0 pl-3"
					underline={false}
					className="w-100 py-4 flex-direction-row justify-content-start"
					imageWrapperClassName="stake-unlock-title"
				/>
				<div className="pt-4">
					<AmountPreview
						amount={0}
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
							'?',
							symbol.toUpperCase()
						)}
					</div>
				</div>
				<div className="pt-4">
					<div className="bold pb-1">
						<EditWrapper stringId="UNSTAKE.PENDING_EARNINGS">
							{STRINGS['UNSTAKE.PENDING_EARNINGS']}
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

				<div className="py-3">
					<AntBtn
						type="primary"
						className="stake-btn caps"
						ghost={true}
						danger={true}
						onClick={onClear}
					>
						{STRINGS['UNSTAKE.CLEAR_PENDING_EARNING']}
					</AntBtn>
				</div>
				<div className="kit-divider" />

				<div className="pt-3 secondary-text">
					<EditWrapper stringId="UNSTAKE.PENDING_EARNINGS_FOOTNOTE" />
					{STRINGS.formatString(
						STRINGS['UNSTAKE.PENDING_EARNINGS_FOOTNOTE'],
						<span
							className="blue-link pointer underline-text"
							onClick={onClear}
						>
							{STRINGS['UNSTAKE.CLEAR']}
						</span>
					)}
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
